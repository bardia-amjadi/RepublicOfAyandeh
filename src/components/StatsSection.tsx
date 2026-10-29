import { useEffect, useRef, useState } from 'react';
import { stats, statValue } from '../lib/content';
import { faNumber } from '../lib/format';
import SectionHeading from './SectionHeading';

function useCountUp(target: number, start: boolean) {
  const [v, setV] = useState(target);
  useEffect(() => {
    if (!start) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { setV(target); return; }
    let raf = 0;
    const t0 = performance.now();
    const dur = 1100;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      setV(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    setV(0);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, start]);
  return v;
}

function Stat({ item, start }: { item: (typeof stats)[number]; start: boolean }) {
  const target = statValue(item);
  const v = useCountUp(target, start);
  return (
    <div className="stat">
      <dt className="stat-label">
        {item.label}
        {item.labelEn && <span className="en" lang="en" dir="ltr">{item.labelEn}</span>}
      </dt>
      <dd className="stat-value" aria-label={`${faNumber(target)}${item.suffix ?? ''}`}>
        <span aria-hidden="true">{faNumber(v)}{item.suffix}</span>
      </dd>
      {item.note && <dd className="stat-note">{item.note}</dd>}
    </div>
  );
}

export default function StatsSection() {
  const ref = useRef<HTMLDListElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') { setSeen(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <section className="section" aria-labelledby="stats-title">
      <div className="container">
        <SectionHeading id="stats-title" title="آمار ملی" titleEn="National statistics" intro="همه ارقام این بخش خیالی‌اند و بخشی از جهان داستانی جمهوری آینده هستند." />
        <dl className="stats-grid" ref={ref}>
          {stats.map((s) => <Stat key={s.id} item={s} start={seen} />)}
        </dl>
      </div>
    </section>
  );
}
