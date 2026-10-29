import type { Geometry } from './lib/geo';

export interface Capital {
  nameFa: string;
  nameEn: string;
  lon: number;
  lat: number;
}

/** One fictional administrative region (src/data/regions.json + regions.geometry.json). */
export interface Region {
  id: string;
  nameFa: string;
  nameEn: string;
  color: string;
  /** Label colour on top of `color`. */
  textTone: 'light' | 'dark';
  population: number;
  cities?: number;
  capital: Capital;
  description: string;
  /** True for the bundled demo data; shows a "sample" notice in the UI. */
  sample?: boolean;
  geometry: Geometry;
}

export interface NewsArticle {
  id: string;
  titleFa: string;
  subtitleEn?: string;
  cover: string;
  coverAlt: string;
  date: string;
  category: string;
  summary: string;
  /** Paragraphs. A line starting with "## " becomes a sub-heading. */
  body: string[];
  author?: string;
  featured?: boolean;
}

export interface Character {
  id: string;
  nameFa: string;
  nameEn?: string;
  role: string;
  portrait: string;
  bio: string;
  affiliation?: string;
  /** If present, the character gets its own detail page. */
  profile?: string[];
  sample?: boolean;
}

export interface StatItem {
  id: string;
  label: string;
  labelEn?: string;
  /** Fixed value… */
  value?: number;
  /** …or computed from regions.json. */
  computed?: 'regionCount' | 'populationTotal' | 'citiesTotal';
  suffix?: string;
  note?: string;
}

export interface MediaItem {
  id: string;
  src: string;
  alt: string;
  title?: string;
  caption?: string;
  category?: string;
}

export interface InstagramPost {
  id: string;
  image: string;
  alt: string;
  caption?: string;
  url?: string;
}

export interface TimelineEntry { year: string; title: string; text: string }

export interface FlagSpec {
  pattern: 'stripes' | 'cross' | 'circle';
  colors: string[];
}

/** A fictional neighbouring country (src/data/countries.json + countries.geometry.json). */
export interface Country {
  id: string;
  /** Key into countries.geometry.json */
  geometryId: string;
  nameFa: string;
  nameEn: string;
  color: string;
  flag: FlagSpec;
  capital: Capital;
  population: number;
  areaKm2: number;
  government: string;
  language: string;
  currency: string;
  relation: string;
  description: string;
  timeline: TimelineEntry[];
  sample?: boolean;
  geometry: Geometry;
}

/** Profile of the Republic of Ayandeh itself (src/data/country.json). */
export interface CountryProfile {
  nameFa: string;
  nameEn: string;
  motto: string;
  mottoEn?: string;
  government: string;
  head: string;
  capitalRegionId: string;
  language: string;
  currency: string;
  founded: string;
  areaKm2: number;
  overview: string[];
  facts: { label: string; value: string }[];
  timeline: TimelineEntry[];
  sample?: boolean;
}
