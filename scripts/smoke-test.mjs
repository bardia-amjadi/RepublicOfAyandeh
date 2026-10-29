// Server-render every route and check: renders, no dead internal links, referenced local assets exist.
// Run: npm run smoke   (this is a render check, not a substitute for testing in a real browser)
import { createServer } from 'vite';
import { existsSync } from 'node:fs';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
const App = (await vite.ssrLoadModule('/src/App.tsx')).default;
const content = await vite.ssrLoadModule('/src/lib/content.ts');

const routes = ['/', '/map', '/map?region=AY-03', '/news', '/characters', '/gallery', '/about', '/does-not-exist'];
content.news.forEach((n) => routes.push(`/news/${n.id}`));
content.characters.filter((c) => c.profile).forEach((c) => routes.push(`/characters/${c.id}`));
routes.push('/news/nope', '/characters/sample-b');

const known = new Set(['/', '/map', '/news', '/characters', '/gallery', '/about']);
content.news.forEach((n) => known.add(`/news/${n.id}`));
content.characters.filter((c) => c.profile).forEach((c) => known.add(`/characters/${c.id}`));

let failures = 0;
const fail = (m) => { failures++; console.error('FAIL', m); };

for (const r of routes) {
  let html = '';
  try {
    html = renderToString(React.createElement(MemoryRouter, { initialEntries: [r] }, React.createElement(App)));
  } catch (e) { fail(`${r}: render threw ${e.message}`); continue; }
  const bad = r.includes('does-not-exist') || r.endsWith('nope') || r === '/characters/sample-b';
  if (bad && !html.includes('پیدا نشد')) fail(`${r}: expected not-found page`);
  if (!bad && html.includes('پیدا نشد')) fail(`${r}: unexpectedly rendered not-found`);
  if (html.length < 2000) fail(`${r}: suspiciously small output`);
  for (const [, href] of html.matchAll(/<a [^>]*href="([^"]+)"/g)) {
    if (/^(https?:|#)/.test(href)) continue;
    const path = href.split('?')[0];
    if (!known.has(path)) fail(`${r}: dead internal link ${href}`);
  }
  for (const [, src] of html.matchAll(/<img [^>]*src="([^"]+)"/g)) {
    if (/^(https?:|data:)/.test(src)) continue;
    const rel = src.replace(/^\.\//, '').replace(/^\//, '');
    if (!existsSync(new URL(`../public/${rel}`, import.meta.url))) fail(`${r}: missing image ${src}`);
  }
  console.log(`ok  ${r}  (${(html.length / 1024).toFixed(0)} KB)`);
}
// region selection renders the panel
const sel = renderToString(React.createElement(MemoryRouter, { initialEntries: ['/map?region=AY-03'] }, React.createElement(App)));
if (!sel.includes('region-panel')) fail('/map?region=AY-03 did not render the detail panel');
await vite.close();
if (failures) { console.error(`\n${failures} failure(s)`); process.exit(1); }
console.log('\nAll route checks passed.');
