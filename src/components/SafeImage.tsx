import { useState } from 'react';
import { asset } from '../lib/asset';

interface Props {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
}

/** <img> that degrades to a labelled placeholder block when the file is missing. */
export default function SafeImage({ src, alt, className = '', width, height, loading = 'lazy' }: Props) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className={`img-missing ${className}`} role="img" aria-label={alt}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4M9 9.5h.01" /></svg>
        <span>تصویر در دسترس نیست</span>
      </div>
    );
  }
  return <img className={className} src={asset(src)} alt={alt} width={width} height={height} loading={loading} decoding="async" onError={() => setFailed(true)} />;
}
