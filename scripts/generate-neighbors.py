"""
Generates SAMPLE fictional neighbouring countries around the Republic of Ayandeh.

The land surrounding the Republic (Natural Earth 50m, public domain) is used only as an unnamed
landmass and is carved into invented countries by a noise-warped nearest-seed partition.
The resulting countries are NOT real countries and their names/borders are fictional.

Input : scripts/land-source.geojson, src/data/outline.json
Output: src/data/countries.geometry.json  (id -> GeoJSON geometry)
Run   : pip install shapely numpy scipy && python scripts/generate-neighbors.py
"""
import json
import numpy as np
import shapely
from shapely.geometry import shape, mapping, box, MultiPolygon, Polygon
from shapely.ops import unary_union

PAD_LON, PAD_LAT = 8.5, 6.0
iran = shape(json.load(open('src/data/outline.json')))
minx, miny, maxx, maxy = iran.bounds
view = box(minx - PAD_LON, miny - PAD_LAT, maxx + PAD_LON, maxy + PAD_LAT)

src = json.load(open('scripts/land-source.geojson'))
parts = []
for f in src['features']:
    p = f['properties']
    if p.get('ADM0_A3') == 'IRN':
        continue
    g = shape(f['geometry'])
    if g.intersects(view):
        parts.append(g.intersection(view))
land = unary_union(parts).buffer(0).difference(iran.buffer(0.004))

SEEDS = {
    'C-01': (40.0, 39.5, 1.0),   # north-west
    'C-02': (49.0, 44.0, 1.0),   # north
    'C-03': (62.0, 42.0, 1.0),   # north-east
    'C-04': (66.5, 34.5, 1.0),   # east
    'C-05': (67.5, 27.5, 1.0),   # south-east
    'C-06': (42.0, 33.0, 0.9),   # west
    'C-07': (46.0, 24.0, 1.4),   # south-west peninsula
}
ids = list(SEEDS)
S = np.array([[SEEDS[i][0], SEEDS[i][1]] for i in ids])
Wt = np.array([SEEDS[i][2] for i in ids])

step = 0.06
bx0, by0, bx1, by1 = view.bounds
xs = np.arange(bx0, bx1 + step, step)
ys = np.arange(by0, by1 + step, step)
X, Y = np.meshgrid(xs, ys)

def noise(x, y):
    return (0.9 * np.sin(1.5 * y + 0.8 * np.sin(0.8 * x)) +
            0.8 * np.sin(1.2 * x - 0.6 * np.cos(1.0 * y)) +
            0.4 * np.sin(2.9 * x + 2.1 * y))

Xw = X + noise(X, Y) * 0.6
Yw = Y + noise(Y + 2.3, X - 1.1) * 0.5
d = np.stack([np.hypot(Xw - sx, (Yw - sy) * 1.1) / w for (sx, sy), w in zip(S, Wt)])
label = d.argmin(axis=0)

# Smooth the partition (no gaps between countries): majority vote over a moving window, a few passes.
from scipy.ndimage import uniform_filter
for _ in range(3):
    votes = np.stack([uniform_filter((label == k).astype(float), size=15, mode='nearest') for k in range(len(ids))])
    label = votes.argmax(axis=0)

out = {}
for k, cid in enumerate(ids):
    ii, jj = np.where(label == k)
    cells = [box(xs[j], ys[i], xs[j] + step, ys[i] + step) for i, j in zip(ii, jj)]
    shp = unary_union(cells).buffer(0.03).buffer(-0.03).intersection(land)
    shp = shp.simplify(0.04, preserve_topology=True)
    polys = [shp] if isinstance(shp, Polygon) else list(getattr(shp, 'geoms', []))
    polys = [p for p in polys if isinstance(p, Polygon) and p.area > 0.4]
    if not polys:
        print(cid, 'EMPTY'); continue
    out[cid] = MultiPolygon(polys) if len(polys) > 1 else polys[0]

def rnd(g):
    m = mapping(g)
    def r(c):
        return [round(v, 2) for v in c] if isinstance(c[0], (int, float)) else [r(x) for x in c]
    return {'type': m['type'], 'coordinates': r(m['coordinates'])}

json.dump({k: rnd(v) for k, v in out.items()}, open('src/data/countries.geometry.json', 'w'))
for k, v in out.items():
    p = max(v.geoms, key=lambda g: g.area) if v.geom_type == 'MultiPolygon' else v
    rp = p.representative_point()
    print(k, v.geom_type, 'area', round(v.area, 1), 'rep', round(rp.x, 2), round(rp.y, 2), 'bounds', [round(b, 1) for b in v.bounds])
print('view', [round(b, 1) for b in view.bounds])
