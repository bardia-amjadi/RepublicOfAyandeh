export type Position = [number, number];
export type Geometry =
  | { type: 'Polygon'; coordinates: Position[][] }
  | { type: 'MultiPolygon'; coordinates: Position[][][] };

export function polygonsOf(g: Geometry): Position[][][] {
  return g.type === 'Polygon' ? [g.coordinates] : g.coordinates;
}

export interface Bounds { minLon: number; minLat: number; maxLon: number; maxLat: number }

export function boundsOf(geoms: Geometry[]): Bounds {
  let minLon = Infinity, minLat = Infinity, maxLon = -Infinity, maxLat = -Infinity;
  for (const g of geoms)
    for (const poly of polygonsOf(g))
      for (const ring of poly)
        for (const [lon, lat] of ring) {
          if (lon < minLon) minLon = lon;
          if (lon > maxLon) maxLon = lon;
          if (lat < minLat) minLat = lat;
          if (lat > maxLat) maxLat = lat;
        }
  return { minLon, minLat, maxLon, maxLat };
}

/** Simple equirectangular projection scaled by cos(mid-latitude) so shapes keep their proportions. */
export function makeProjection(b: Bounds, widthPx: number, padPx: number) {
  const midLat = (b.minLat + b.maxLat) / 2;
  const kx = Math.cos((midLat * Math.PI) / 180);
  const spanX = (b.maxLon - b.minLon) * kx;
  const spanY = b.maxLat - b.minLat;
  const scale = (widthPx - padPx * 2) / spanX;
  const width = widthPx;
  const height = spanY * scale + padPx * 2;
  const project = (lon: number, lat: number): [number, number] => [
    padPx + (lon - b.minLon) * kx * scale,
    padPx + (b.maxLat - lat) * scale,
  ];
  return { project, width, height };
}

export function geometryToPath(g: Geometry, project: (lon: number, lat: number) => [number, number]): string {
  const parts: string[] = [];
  for (const poly of polygonsOf(g))
    for (const ring of poly) {
      ring.forEach(([lon, lat], i) => {
        const [x, y] = project(lon, lat);
        parts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`);
      });
      parts.push('Z');
    }
  return parts.join('');
}
