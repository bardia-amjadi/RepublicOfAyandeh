// Validates the editable content in src/data before building. Run: npm run validate
import { readFileSync, existsSync } from 'node:fs';

const read = (p) => JSON.parse(readFileSync(new URL(`../${p}`, import.meta.url), 'utf8'));
const errors = [];
const err = (m) => errors.push(m);
const need = (obj, keys, where) => keys.forEach((k) => (obj[k] === undefined || obj[k] === '') && err(`${where}: missing "${k}"`));
const uniq = (arr, where) => {
  const seen = new Set();
  arr.forEach((x) => (seen.has(x.id) ? err(`${where}: duplicate id "${x.id}"`) : seen.add(x.id)));
};
const asset = (p, where) => {
  if (!p) return;
  if (/^https?:/.test(p)) return;
  if (!existsSync(new URL(`../public/${p}`, import.meta.url))) err(`${where}: file public/${p} does not exist`);
};

function inRing(pt, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if (yi > pt[1] !== yj > pt[1] && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
function inGeometry(pt, g) {
  const polys = g.type === 'Polygon' ? [g.coordinates] : g.coordinates;
  return polys.some((poly) => inRing(pt, poly[0]) && !poly.slice(1).some((h) => inRing(pt, h)));
}

const regions = read('src/data/regions.json');
const geometry = read('src/data/regions.geometry.json');
uniq(regions, 'regions');
regions.forEach((r) => {
  const w = `regions[${r.id}]`;
  need(r, ['id', 'nameFa', 'nameEn', 'color', 'population', 'description', 'capital'], w);
  if (r.color && !/^#[0-9a-fA-F]{6}$/.test(r.color)) err(`${w}: color must be a #rrggbb hex value`);
  if (!['light', 'dark'].includes(r.textTone)) err(`${w}: textTone must be "light" or "dark"`);
  if (typeof r.population !== 'number' || r.population < 0) err(`${w}: population must be a non-negative number`);
  const g = geometry[r.id];
  if (!g) return err(`${w}: no geometry in regions.geometry.json`);
  if (!['Polygon', 'MultiPolygon'].includes(g.type)) err(`${w}: geometry must be Polygon or MultiPolygon`);
  else if (r.capital && !inGeometry([r.capital.lon, r.capital.lat], g)) err(`${w}: capital coordinates fall outside the region`);
});
Object.keys(geometry).forEach((id) => !regions.some((r) => r.id === id) && err(`regions.geometry.json: "${id}" has no entry in regions.json`));

const news = read('src/data/news.json');
uniq(news, 'news');
news.forEach((a) => {
  const w = `news[${a.id}]`;
  need(a, ['id', 'titleFa', 'cover', 'coverAlt', 'date', 'category', 'summary', 'body'], w);
  if (a.id && !/^[a-z0-9-]+$/.test(a.id)) err(`${w}: id must be lowercase letters, digits and dashes (used in the URL)`);
  if (Number.isNaN(Date.parse(a.date))) err(`${w}: date must be ISO like 2026-10-20`);
  if (!Array.isArray(a.body) || !a.body.length) err(`${w}: body must be a non-empty array of paragraphs`);
  asset(a.cover, w);
});

const characters = read('src/data/characters.json');
uniq(characters, 'characters');
characters.forEach((c) => {
  const w = `characters[${c.id}]`;
  need(c, ['id', 'nameFa', 'role', 'portrait', 'bio'], w);
  if (c.id && !/^[a-z0-9-]+$/.test(c.id)) err(`${w}: id must be lowercase letters, digits and dashes`);
  asset(c.portrait, w);
});

const media = read('src/data/media.json');
uniq(media, 'media');
media.forEach((m) => { need(m, ['id', 'src', 'alt'], `media[${m.id}]`); asset(m.src, `media[${m.id}]`); });

const ig = read('src/data/instagram.json');
uniq(ig, 'instagram');
ig.forEach((p) => { need(p, ['id', 'image', 'alt'], `instagram[${p.id}]`); asset(p.image, `instagram[${p.id}]`); });

const stats = read('src/data/statistics.json');
uniq(stats, 'statistics');
stats.forEach((s) => {
  need(s, ['id', 'label'], `statistics[${s.id}]`);
  if (s.value === undefined && !s.computed) err(`statistics[${s.id}]: needs "value" or "computed"`);
  if (s.computed && !['regionCount', 'populationTotal', 'citiesTotal'].includes(s.computed)) err(`statistics[${s.id}]: unknown computed "${s.computed}"`);
});

for (const f of ['assets/brand/logo.svg', 'assets/brand/flag.svg']) asset(f, 'brand');

if (errors.length) {
  console.error(`\nContent validation failed (${errors.length}):\n` + errors.map((e) => ` - ${e}`).join('\n') + '\n');
  process.exit(1);
}
console.log(`Content OK: ${regions.length} regions, ${news.length} articles, ${characters.length} characters, ${media.length} media, ${stats.length} statistics.`);
