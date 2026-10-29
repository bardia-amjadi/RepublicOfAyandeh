import { useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent as RPointerEvent } from 'react';
import type { Region } from '../types';
import { boundsOf, geometryToPath, makeProjection, polygonsOf } from '../lib/geo';
import type { Geometry } from '../lib/geo';
import { faNumber } from '../lib/format';

const W = 1000;
const MIN_K = 1;
const MAX_K = 14;

interface View { k: number; x: number; y: number }
const HOME: View = { k: 1, x: 0, y: 0 };

interface Props {
  regions: Region[];
  outline: Geometry;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  /** 'ctrl' = the mouse wheel only zooms while Ctrl/Cmd is held, so the page can still scroll. */
  wheelZoom?: 'always' | 'ctrl';
  /** Zoom to a region when it becomes selected, and back out when it is cleared. */
  zoomOnSelect?: boolean;
  className?: string;
}

export default function MapView({ regions, outline, selectedId, onSelect, wheelZoom = 'always', zoomOnSelect = false, className = '' }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // ---- geometry → SVG paths (computed once per data set) ----
  const geo = useMemo(() => {
    const b = boundsOf([outline, ...regions.map((r) => r.geometry)]);
    const { project, height } = makeProjection(b, W, 24);
    const paths: Record<string, string> = {};
    const boxes: Record<string, { cx: number; cy: number; w: number; h: number }> = {};
    const caps: Record<string, [number, number]> = {};
    for (const r of regions) {
      paths[r.id] = geometryToPath(r.geometry, project);
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      for (const poly of polygonsOf(r.geometry))
        for (const [lon, lat] of poly[0]) {
          const [x, y] = project(lon, lat);
          x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y);
        }
      boxes[r.id] = { cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, w: x1 - x0, h: y1 - y0 };
      caps[r.id] = project(r.capital.lon, r.capital.lat);
    }
    return { H: height, outlinePath: geometryToPath(outline, project), paths, boxes, caps };
  }, [regions, outline]);
  const H = geo.H;

  // ---- view state (zoom/pan) ----
  const [view, setViewState] = useState<View>(HOME);
  const viewRef = useRef<View>(HOME);
  const [animate, setAnimate] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [scale, setScale] = useState(0.8); // screen px per SVG unit
  const [hover, setHover] = useState<{ id: string; x: number; y: number } | null>(null);
  const [hint, setHint] = useState(false);

  const clampView = (v: View): View => {
    const k = Math.min(MAX_K, Math.max(MIN_K, v.k));
    const mx = W * 0.15, my = H * 0.15;
    return {
      k,
      x: Math.min(mx, Math.max(W - k * W - mx, v.x)),
      y: Math.min(my, Math.max(H - k * H - my, v.y)),
    };
  };
  const setView = (v: View, animated = false) => {
    const c = clampView(v);
    viewRef.current = c;
    setAnimate(animated);
    setViewState(c);
  };
  const zoomAt = (v: View, factor: number, cx: number, cy: number): View => {
    const k = Math.min(MAX_K, Math.max(MIN_K, v.k * factor));
    const f = k / v.k;
    return { k, x: cx - (cx - v.x) * f, y: cy - (cy - v.y) * f };
  };
  const zoomBy = (factor: number) => setView(zoomAt(viewRef.current, factor, W / 2, H / 2), true);
  const reset = () => setView(HOME, true);

  /** client px → SVG units (before the zoom transform) */
  const toUnits = (clientX: number, clientY: number) => {
    const rect = svgRef.current!.getBoundingClientRect();
    const s = Math.min(rect.width / W, rect.height / H);
    const ox = (rect.width - W * s) / 2;
    const oy = (rect.height - H * s) / 2;
    return { ux: (clientX - rect.left - ox) / s, uy: (clientY - rect.top - oy) / s, s };
  };

  // keep the px-per-unit scale up to date (labels need it to stay a constant screen size)
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const update = () => {
      const r = el.getBoundingClientRect();
      if (r.width && r.height) setScale(Math.min(r.width / W, r.height / H));
    };
    update();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [H]);

  // wheel zoom (needs a non-passive listener to be able to preventDefault)
  const hintTimer = useRef<number | undefined>(undefined);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (wheelZoom === 'ctrl' && !(e.ctrlKey || e.metaKey)) {
        setHint(true);
        window.clearTimeout(hintTimer.current);
        hintTimer.current = window.setTimeout(() => setHint(false), 1800);
        return;
      }
      e.preventDefault();
      const { ux, uy } = toUnits(e.clientX, e.clientY);
      setView(zoomAt(viewRef.current, Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0018)), ux, uy));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
      window.clearTimeout(hintTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wheelZoom, H]);

  // zoom to the selected region (map page)
  const prevSelected = useRef<string | null>(null);
  useEffect(() => {
    if (zoomOnSelect) {
      const box = selectedId ? geo.boxes[selectedId] : undefined;
      if (box) {
        const k = Math.min(6, Math.max(1.2, Math.min(W / (box.w * 1.5), H / (box.h * 1.5))));
        setView({ k, x: W / 2 - box.cx * k, y: H / 2 - box.cy * k }, true);
      } else if (prevSelected.current && !selectedId) {
        setView(HOME, true);
      }
    }
    prevSelected.current = selectedId;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, zoomOnSelect]);

  // ---- pointer gestures: drag to pan, pinch to zoom, click to select ----
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<{ sx: number; sy: number; view: View; dragging: boolean; pinchDist?: number; pinchView?: View } | null>(null);
  const moved = useRef(false);

  const onPointerDown = (e: RPointerEvent<SVGSVGElement>) => {
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1) {
      moved.current = false;
      gesture.current = { sx: e.clientX, sy: e.clientY, view: viewRef.current, dragging: false };
    } else if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      gesture.current = { sx: 0, sy: 0, view: viewRef.current, dragging: true, pinchDist: Math.hypot(a.x - b.x, a.y - b.y) || 1, pinchView: viewRef.current };
      moved.current = true;
      setHover(null);
    }
  };
  const onPointerMove = (e: RPointerEvent<SVGSVGElement>) => {
    const g = gesture.current;
    if (!pointers.current.has(e.pointerId) || !g) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size >= 2 && g.pinchDist && g.pinchView) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const { ux, uy } = toUnits((a.x + b.x) / 2, (a.y + b.y) / 2);
      setView(zoomAt(g.pinchView, dist / g.pinchDist, ux, uy));
      return;
    }
    const dx = e.clientX - g.sx;
    const dy = e.clientY - g.sy;
    if (!g.dragging) {
      if (Math.hypot(dx, dy) < 5) return;
      g.dragging = true;
      moved.current = true;
      setDragging(true);
      setHover(null);
      try { svgRef.current?.setPointerCapture(e.pointerId); } catch { /* ignore */ }
    }
    const { s } = toUnits(0, 0);
    setView({ k: g.view.k, x: g.view.x + dx / s, y: g.view.y + dy / s });
  };
  const endPointer = (e: RPointerEvent<SVGSVGElement>) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size === 0) {
      gesture.current = null;
      setDragging(false);
    } else if (pointers.current.size === 1) {
      const [p] = [...pointers.current.values()];
      gesture.current = { sx: p.x, sy: p.y, view: viewRef.current, dragging: true };
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = 70;
    const v = viewRef.current;
    let handled = true;
    switch (e.key) {
      case '+': case '=': zoomBy(1.4); break;
      case '-': case '_': zoomBy(1 / 1.4); break;
      case '0': reset(); break;
      case 'ArrowLeft': setView({ ...v, x: v.x + step }); break;
      case 'ArrowRight': setView({ ...v, x: v.x - step }); break;
      case 'ArrowUp': setView({ ...v, y: v.y + step }); break;
      case 'ArrowDown': setView({ ...v, y: v.y - step }); break;
      case 'Escape': if (selectedId) onSelect(null); else handled = false; break;
      default: handled = false;
    }
    if (handled) e.preventDefault();
  };

  // ---- hover / focus tooltip ----
  const showTip = (id: string, clientX: number, clientY: number) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    setHover({ id, x: clientX - rect.left, y: clientY - rect.top });
  };

  const { k } = view;
  const showEn = k >= 1.6 || scale >= 0.9;
  const showCapital = k >= 2.4;
  const hoverRegion = hover ? regions.find((r) => r.id === hover.id) : undefined;
  const selected = regions.find((r) => r.id === selectedId);

  return (
    <div
      ref={wrapRef}
      className={`map ${className}`}
      data-dragging={dragging || undefined}
      onKeyDown={onKeyDown}
    >
      <svg
        ref={svgRef}
        className="map-svg"
        viewBox={`0 0 ${W} ${H}`}
        role="group"
        aria-label="نقشه تعاملی جمهوری آینده"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
        onPointerLeave={() => setHover(null)}
      >
        <title>نقشه تعاملی نواحی خیالی جمهوری آینده</title>
        <desc>هر ناحیه را می‌توان با ماوس، لمس یا صفحه‌کلید انتخاب کرد. مرزهای داخلی خیالی‌اند.</desc>
        <g
          className="map-world"
          style={{
            transform: `translate(${view.x}px, ${view.y}px) scale(${view.k})`,
            transformOrigin: '0 0',
            transition: animate ? 'transform .5s cubic-bezier(.2,.7,.2,1)' : 'none',
          }}
        >
          <path d={geo.outlinePath} className="map-outline-fill" />
          <g className={selected ? 'map-regions has-selection' : 'map-regions'}>
            {regions.map((r) => (
              <path
                key={r.id}
                d={geo.paths[r.id]}
                className="map-region"
                fill={r.color}
                data-selected={r.id === selectedId || undefined}
                vectorEffect="non-scaling-stroke"
                tabIndex={0}
                role="button"
                aria-pressed={r.id === selectedId}
                aria-label={`${r.nameFa} (${r.nameEn})، شناسه ${r.id}، جمعیت ${faNumber(r.population)} نفر`}
                onClick={() => {
                  if (moved.current) return;
                  onSelect(r.id === selectedId ? null : r.id);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelect(r.id === selectedId ? null : r.id);
                  }
                }}
                onPointerEnter={(e) => e.pointerType !== 'touch' && !dragging && showTip(r.id, e.clientX, e.clientY)}
                onPointerMove={(e) => e.pointerType !== 'touch' && !gesture.current?.dragging && showTip(r.id, e.clientX, e.clientY)}
                onPointerLeave={() => setHover((h) => (h?.id === r.id ? null : h))}
                onFocus={(e) => {
                  const b = e.currentTarget.getBoundingClientRect();
                  showTip(r.id, b.left + b.width / 2, b.top + b.height / 2);
                }}
                onBlur={() => setHover((h) => (h?.id === r.id ? null : h))}
              />
            ))}
          </g>
          {selected && <path d={geo.paths[selected.id]} className="map-ring" vectorEffect="non-scaling-stroke" />}
          <path d={geo.outlinePath} className="map-outline" vectorEffect="non-scaling-stroke" />

          <g className="map-labels" aria-hidden="true">
            {regions.map((r) => {
              const [px, py] = geo.caps[r.id];
              return (
                <g key={r.id} transform={`translate(${px.toFixed(1)} ${py.toFixed(1)}) scale(${(1 / (k * scale)).toFixed(4)})`}>
                  <circle r="3.6" className={`cap-dot ${r.textTone}`} />
                  <text y="-10" className={`lbl lbl-fa ${r.textTone}`}>{r.nameFa}</text>
                  {showEn && <text y="21" className={`lbl lbl-en ${r.textTone}`}>{r.nameEn}</text>}
                  {showCapital && <text y="36" className={`lbl lbl-cap ${r.textTone}`}>{r.capital.nameFa}</text>}
                </g>
              );
            })}
          </g>
        </g>
      </svg>

      {hoverRegion && hover && !dragging && (
        <div className="map-tooltip" role="tooltip" style={{ left: hover.x, top: hover.y }}>
          <strong>{hoverRegion.nameFa}</strong>
          <span lang="en" dir="ltr">{hoverRegion.nameEn}</span>
          <small>جمعیت: {faNumber(hoverRegion.population)}</small>
        </div>
      )}

      <div className="map-controls" role="group" aria-label="کنترل‌های نقشه">
        <button type="button" onClick={() => zoomBy(1.5)} aria-label="بزرگ‌نمایی" title="بزرگ‌نمایی (+)" disabled={k >= MAX_K - 0.01}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
        </button>
        <button type="button" onClick={() => zoomBy(1 / 1.5)} aria-label="کوچک‌نمایی" title="کوچک‌نمایی (-)" disabled={k <= MIN_K + 0.01}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" /></svg>
        </button>
        <button type="button" onClick={reset} aria-label="نمایش کل نقشه" title="نمایش کل نقشه (0)">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>
        </button>
      </div>

      <p className="map-hint" data-visible={hint || undefined} aria-hidden={!hint}>برای بزرگ‌نمایی، کلید Ctrl را نگه دارید و چرخ ماوس را بچرخانید</p>
      <p className="sr-only">
        راهنمای صفحه‌کلید: با Tab بین نواحی حرکت کنید، با Enter یا فاصله ناحیه را انتخاب کنید، با کلیدهای جهت‌دار نقشه را جابه‌جا کنید، با + و - بزرگ‌نمایی و با ۰ بازنشانی کنید و با Escape انتخاب را بردارید.
      </p>
    </div>
  );
}
