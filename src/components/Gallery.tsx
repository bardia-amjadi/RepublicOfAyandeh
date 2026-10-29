import { useEffect, useMemo, useRef, useState } from 'react';
import type { MediaItem } from '../types';
import SafeImage from './SafeImage';
import { asset } from '../lib/asset';

interface Props { items: MediaItem[]; filters?: boolean }

export default function Gallery({ items, filters = true }: Props) {
  const categories = useMemo(() => [...new Set(items.map((m) => m.category).filter(Boolean))] as string[], [items]);
  const [cat, setCat] = useState<string>('all');
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const [lightboxFailed, setLightboxFailed] = useState(false);

  const visible = cat === 'all' ? items : items.filter((m) => m.category === cat);
  const current = openIndex !== null ? visible[openIndex] : undefined;

  useEffect(() => { setLightboxFailed(false); }, [openIndex, cat]);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (current && !d.open) d.showModal();
    if (!current && d.open) d.close();
  }, [current]);

  const close = () => {
    setOpenIndex(null);
    lastFocus.current?.focus();
  };
  const step = (dir: 1 | -1) => setOpenIndex((i) => (i === null ? i : (i + dir + visible.length) % visible.length));

  if (!items.length) return <p className="empty">هنوز تصویری اضافه نشده است.</p>;

  return (
    <div>
      {filters && categories.length > 1 && (
        <div className="filters" role="group" aria-label="فیلتر دسته‌بندی">
          <button type="button" aria-pressed={cat === 'all'} onClick={() => setCat('all')}>همه</button>
          {categories.map((c) => (
            <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>
          ))}
        </div>
      )}
      <ul className="gallery-grid">
        {visible.map((m, i) => (
          <li key={m.id}>
            <button
              type="button"
              className="gallery-item"
              onClick={(e) => { lastFocus.current = e.currentTarget; setOpenIndex(i); }}
              aria-label={`بزرگ‌نمایی: ${m.title ?? m.alt}`}
            >
              <SafeImage src={m.src} alt={m.alt} />
              {(m.title || m.category) && (
                <span className="gallery-cap">
                  {m.title && <strong>{m.title}</strong>}
                  {m.category && <em>{m.category}</em>}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        className="lightbox"
        aria-label={current?.title ?? current?.alt ?? 'پیش‌نمایش تصویر'}
        onClose={() => openIndex !== null && close()}
        onClick={(e) => e.target === dialogRef.current && close()}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') step(1);
          if (e.key === 'ArrowRight') step(-1);
        }}
      >
        {current && (
          <figure>
            {lightboxFailed ? (
              <div className="img-missing"><span>تصویر در دسترس نیست</span></div>
            ) : (
              <img src={asset(current.src)} alt={current.alt} onError={() => setLightboxFailed(true)} />
            )}
            {(current.title || current.caption) && (
              <figcaption>
                {current.title && <strong>{current.title}</strong>}
                {current.caption && <span>{current.caption}</span>}
              </figcaption>
            )}
          </figure>
        )}
        <div className="lightbox-bar">
          <button type="button" className="icon-btn" onClick={() => step(-1)} aria-label="تصویر قبلی" disabled={visible.length < 2}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
          </button>
          <span className="lightbox-count">{openIndex !== null ? `${openIndex + 1} / ${visible.length}` : ''}</span>
          <button type="button" className="icon-btn" onClick={() => step(1)} aria-label="تصویر بعدی" disabled={visible.length < 2}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
          </button>
          <button type="button" className="icon-btn close" onClick={close} aria-label="بستن پیش‌نمایش">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
      </dialog>
    </div>
  );
}
