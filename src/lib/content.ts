import regionsMeta from '../data/regions.json';
import regionGeometry from '../data/regions.geometry.json';
import outlineJson from '../data/outline.json';
import newsJson from '../data/news.json';
import charactersJson from '../data/characters.json';
import statsJson from '../data/statistics.json';
import mediaJson from '../data/media.json';
import instagramJson from '../data/instagram.json';
import type { Character, InstagramPost, MediaItem, NewsArticle, Region, StatItem } from '../types';
import type { Geometry } from './geo';

const geometries = regionGeometry as unknown as Record<string, Geometry>;

/** Region metadata (regions.json) merged with borders (regions.geometry.json). */
export const regions: Region[] = (regionsMeta as Omit<Region, 'geometry'>[])
  .filter((r) => {
    if (!geometries[r.id]) console.warn(`[content] region ${r.id} has no geometry and was skipped`);
    return !!geometries[r.id];
  })
  .map((r) => ({ ...r, geometry: geometries[r.id] }));

export const outline = outlineJson as unknown as Geometry;

export const news: NewsArticle[] = [...(newsJson as NewsArticle[])].sort((a, b) => b.date.localeCompare(a.date));
export const characters = charactersJson as Character[];
export const media = mediaJson as MediaItem[];
export const instagramPosts = instagramJson as InstagramPost[];
export const stats = statsJson as StatItem[];

export const totals = {
  regionCount: regions.length,
  populationTotal: regions.reduce((s, r) => s + r.population, 0),
  citiesTotal: regions.reduce((s, r) => s + (r.cities ?? 0), 0),
};

export const statValue = (s: StatItem): number => (s.computed ? totals[s.computed] : s.value ?? 0);
export const findRegion = (id: string | null | undefined) => regions.find((r) => r.id === id);
export const findArticle = (id: string | undefined) => news.find((a) => a.id === id);
export const findCharacter = (id: string | undefined) => characters.find((c) => c.id === id);
