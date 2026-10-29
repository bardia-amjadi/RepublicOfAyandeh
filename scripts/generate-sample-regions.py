"""
Generates SAMPLE fictional regions inside Iran's real outline.

Input : scripts/iran-outline-source.json  (Natural Earth 50m, public domain)
Output: src/data/outline.json            (real geographic outline, main landmass)
        src/data/regions.geometry.json   (fictional borders, id -> GeoJSON geometry)

The borders come from a noise-warped nearest-seed partition, so they look organic
and are obviously NOT real provinces. Replace the geometry of any region with
your own GeoJSON whenever you like (see README).

Run (optional, only to regenerate the samples):
    pip install shapely numpy
    python scripts/generate-sample-regions.py
"""
import json
import numpy as np
from shapely.geometry import mapping, Polygon, MultiPolygon, box
from shapely.ops import unary_union

geom = json.load(open('scripts/iran-outline-source.json'))
polys = [Polygon(p[0]) for p in geom['coordinates']]
polys.sort(key=lambda p: p.area, reverse=True)
outline = polys[0].simplify(0.01, preserve_topology=True)

SEEDS = {  # id: (lon, lat, weight)
    'AY-01': (46.6, 37.4, 1.00),
    'AY-02': (51.3, 36.6, 0.95),
    'AY-03': (57.6, 36.6, 1.05),
    'AY-04': (47.4, 33.6, 1.00),
    'AY-05': (52.4, 33.2, 1.10),
    'AY-06': (58.6, 32.6, 1.10),
    'AY-07': (50.4, 29.6, 1.00),
    'AY-08': (57.4, 27.6, 1.15),
}
ids = list(SEEDS)
S = np.array([[SEEDS[i][0], SEEDS[i][1]] for i in ids])
W = np.array([SEEDS[i][2] for i in ids])

minx, miny, maxx, maxy = outline.bounds
step = 0.04
xs = np.arange(minx, maxx + step, step)
ys = np.arange(miny, maxy + step, step)
X, Y = np.meshgrid(xs, ys)


def noise(x, y):
    return (0.9 * np.sin(1.7 * y + 0.8 * np.sin(0.9 * x)) +
            0.8 * np.sin(1.3 * x - 0.6 * np.cos(1.1 * y)) +
            0.4 * np.sin(3.1 * x + 2.3 * y))


Xw = X + noise(X, Y) * 0.55
Yw = Y + noise(Y + 3.1, X - 1.7) * 0.45
d = np.stack([np.hypot(Xw - sx, (Yw - sy) * 1.1) / w for (sx, sy), w in zip(S, W)])
label = d.argmin(axis=0)

prep = outline.buffer(0)
result = {}
for k, rid in enumerate(ids):
    ii, jj = np.where(label == k)
    cells = [box(xs[j], ys[i], xs[j] + step, ys[i] + step) for i, j in zip(ii, jj)]
    shp = unary_union(cells).buffer(0.05).buffer(-0.05).intersection(prep)
    shp = shp.simplify(0.03, preserve_topology=True)
    if isinstance(shp, MultiPolygon):
        shp = max(shp.geoms, key=lambda g: g.area)  # keep the main body only
    result[rid] = shp


def rnd(g):
    m = mapping(g)

    def r(c):
        return [round(v, 3) for v in c] if isinstance(c[0], (int, float)) else [r(x) for x in c]

    return {'type': m['type'], 'coordinates': r(m['coordinates'])}


json.dump(rnd(outline), open('src/data/outline.json', 'w'))
json.dump({k: rnd(v) for k, v in result.items()}, open('src/data/regions.geometry.json', 'w'))
for k, v in result.items():
    c = v.representative_point()
    print(k, round(v.area, 2), 'area; interior point', round(c.x, 2), round(c.y, 2), v.geom_type)
