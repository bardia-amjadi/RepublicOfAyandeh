import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { findCountry, findRegion } from './content';

/** Selection of a region or a country, stored in the URL (?region=AY-03 or ?country=kavaran) so it can be linked. */
export function useMapSelection() {
  const [params, setParams] = useSearchParams();
  const region = findRegion(params.get('region'))?.id ?? null;
  const country = findCountry(params.get('country'))?.id ?? null;
  const update = useCallback((key: 'region' | 'country', id: string | null) => {
    const next = new URLSearchParams(params);
    next.delete('region');
    next.delete('country');
    if (id) next.set(key, id);
    setParams(next, { replace: true });
  }, [params, setParams]);
  return {
    region,
    country: region ? null : country,
    selectRegion: (id: string | null) => update('region', id),
    selectCountry: (id: string | null) => update('country', id),
  };
}
