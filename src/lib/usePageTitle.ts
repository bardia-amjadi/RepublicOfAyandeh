import { useEffect } from 'react';
import { site } from '../config/site';

export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${site.nameFa} — ${site.nameEn}` : `${site.nameFa} | ${site.nameEn}`;
  }, [title]);
}
