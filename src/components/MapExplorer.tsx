import { outline, regions, findRegion } from '../lib/content';
import { site } from '../config/site';
import MapView from './MapView';
import { RegionList, RegionPanel } from './RegionPanel';

interface Props {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  variant: 'hero' | 'page';
}

/** The map plus its side panel (details of the selected region, or the legend/list of all regions). */
export default function MapExplorer({ selectedId, onSelect, variant }: Props) {
  const selected = findRegion(selectedId);
  return (
    <div className={`explorer explorer-${variant}`}>
      <div className="explorer-map">
        <MapView
          regions={regions}
          outline={outline}
          selectedId={selected ? selected.id : null}
          onSelect={onSelect}
          wheelZoom={variant === 'hero' ? 'ctrl' : 'always'}
          zoomOnSelect={variant === 'page'}
        />
        <p className="map-disclaimer">مرزهای داخلی نقشه خیالی‌اند و با تقسیمات واقعی ایران ارتباطی ندارند.</p>
      </div>
      <aside className="explorer-side" aria-label="جزئیات و فهرست نواحی" aria-live="polite">
        {selected ? (
          <>
            {variant === 'hero' && <h1 className="sr-only">{site.nameFa} — {site.nameEn}</h1>}
            <RegionPanel region={selected} onClose={() => onSelect(null)} showMapLink={variant === 'hero'} />
          </>
        ) : (
          <>
            {variant === 'hero' && (
              <div className="hero-intro">
                <h1>
                  {site.nameFa}
                  <span className="en" lang="en" dir="ltr">{site.nameEn}</span>
                </h1>
                <p>{site.tagline}</p>
              </div>
            )}
            <h2 className="side-title">نواحی جمهوری</h2>
            <p className="side-hint">ناحیه‌ای را روی نقشه یا از فهرست زیر انتخاب کنید.</p>
            <RegionList regions={regions} selectedId={null} onSelect={onSelect} />
          </>
        )}
      </aside>
    </div>
  );
}
