import { useEffect, useRef, useState } from 'react';
import type { ElementType, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** stagger delay in ms */
  delay?: number;
}

/** Fades/slides its children in once when they scroll into view. Honors prefers-reduced-motion via CSS. */
export default function Reveal({ children, as: Tag = 'div', className = '', delay = 0 }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') { setShown(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`reveal ${shown ? 'is-in' : ''} ${className}`} style={{ ['--d' as string]: `${delay}ms` }}>
      {children}
    </Tag>
  );
}
