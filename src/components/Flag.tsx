import type { FlagSpec } from '../types';

/** Draws a simple SVG flag from data (stripes / cross / circle) so neighbour countries need no image files. */
export default function Flag({ spec, className = '', label }: { spec: FlagSpec; className?: string; label?: string }) {
  const [a, b = '#ffffff', c = a] = spec.colors;
  return (
    <svg className={`flag ${className}`} viewBox="0 0 90 60" role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      {spec.pattern === 'stripes' && (
        <>
          <rect width="90" height="20" fill={a} />
          <rect y="20" width="90" height="20" fill={b} />
          <rect y="40" width="90" height="20" fill={c} />
        </>
      )}
      {spec.pattern === 'cross' && (
        <>
          <rect width="90" height="60" fill={a} />
          <rect x="24" width="14" height="60" fill={b} />
          <rect y="23" width="90" height="14" fill={b} />
        </>
      )}
      {spec.pattern === 'circle' && (
        <>
          <rect width="90" height="60" fill={b} />
          <circle cx="45" cy="30" r="17" fill={a} />
        </>
      )}
    </svg>
  );
}
