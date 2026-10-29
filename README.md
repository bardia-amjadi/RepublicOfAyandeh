# جمهوری آینده — Republic of Ayandeh

An interactive political atlas and portal for a **fictional** world (a worldbuilding project tied to an Instagram channel).
Persian, right-to-left, static, no backend. Not a game.

**Stack:** React 18, TypeScript, Vite, HashRouter, hand-written SVG map (no map library). Font: Vazirmatn (bundled locally).

## Run locally

```bash
npm ci            # or: npm install
npm run dev       # http://localhost:5173
npm run build     # validates content, type-checks, builds to dist/
npm run preview   # serve the production build
npm run smoke     # server-renders every route and checks links/assets (not a browser test)
```
Node 20+ (22 recommended).

## Deploy to GitHub Pages

1. Push this project to a GitHub repository (default branch `main`).
2. In the repo: **Settings → Pages → Build and deployment → Source: _GitHub Actions_**.
3. Push to `main` (or run the workflow manually from the Actions tab). `.github/workflows/deploy.yml` installs with `npm ci`, builds, and deploys `dist/`.

The site is served at `https://<user>.github.io/<repo>/`. The build uses `base: './'` and `HashRouter`
(`/#/news/...`), so it works under any repository name and survives refreshes and direct links without extra setup.
To force an absolute base path instead: `VITE_BASE=/your-repo/ npm run build`.

## Editing content (no component changes needed)

All content lives in `src/data/*.json`; images live in `public/assets/`. Paths inside JSON are relative to `public/`
(e.g. `"assets/news/my-cover.jpg"`). `npm run validate` (also run by `npm run build`) checks required fields, unique ids,
region geometry and that every referenced file exists.

| To… | Edit |
|---|---|
| Change site name, tagline, nav, **Instagram URL**, logo/flag paths | `src/config/site.ts` |
| Replace logo / flag | overwrite `public/assets/brand/logo.svg` and `flag.svg` (or use PNGs and update the paths in `site.ts`) |
| Add / edit a region (name, colour, population, capital, description) | `src/data/regions.json` |
| Change a region's **borders** | `src/data/regions.geometry.json` — GeoJSON `Polygon`/`MultiPolygon` (lon, lat) keyed by region id |
| Change the outer country outline | `src/data/outline.json` (GeoJSON geometry) |
| Publish a news article | add an object to `src/data/news.json` + cover image in `public/assets/news/`. In `body`, a line starting with `## ` is a sub-heading |
| Add a character | `src/data/characters.json` + portrait in `public/assets/characters/`. Add a `profile` array to give them a detail page |
| Update statistics | `src/data/statistics.json` — fixed `value`, or `computed`: `regionCount`, `populationTotal`, `citiesTotal` (derived from regions) |
| Add a gallery image | `src/data/media.json` + file in `public/assets/media/` (categories/filters appear automatically) |
| Featured Instagram posts | `src/data/instagram.json` (manually maintained; no scraping or API) |

**Adding a region:** add an entry to `regions.json` with a new `id` (e.g. `AY-09`) and the same `id` in `regions.geometry.json`.
The capital's `lon`/`lat` must lie inside the region (the validator checks this).

## Sample data

Everything bundled is clearly-labelled **sample** data: the 8 regions, news, characters, statistics and all images
(generated SVG placeholders). Replace freely. `scripts/generate-sample-regions.py` and `scripts/generate-placeholders.py`
(optional, Python) regenerate the samples; you do not need them to build the site.

## Map notes

- Outer outline: Natural Earth 50m (public domain), simplified. **Internal borders are fictional** and unrelated to real provinces.
- Drag to pan, wheel / buttons / pinch to zoom, "show whole map" button resets. On the home page the wheel zooms only with Ctrl/Cmd held so the page can still scroll.
- Keyboard: Tab to regions, Enter/Space selects, arrow keys pan, `+`/`-` zoom, `0` resets, Esc clears. The region list beside the map and the table on the map page are non-pointer alternatives.
- The map page supports deep links: `/#/map?region=AY-03`.

## Project structure

```
src/config/site.ts        site name, nav, Instagram, credits
src/data/*.json           all editable content
src/components/MapView    interactive SVG map
src/pages/                routes (Home, Map, News, Article, Characters, Detail, Gallery, About)
scripts/                  validate-content, smoke-test, sample generators
.github/workflows/        GitHub Pages deployment
```
