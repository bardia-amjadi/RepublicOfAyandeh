/** Resolve a path stored in JSON (e.g. "assets/news/news-1.svg") to a URL that works under any GitHub Pages base path. */
export function asset(path: string): string {
  if (/^(https?:|data:|blob:)/.test(path)) return path;
  const base = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
  return `${base}${path.replace(/^\/+/, '')}`;
}
