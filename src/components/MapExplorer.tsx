import { Link } from 'react-router-dom';
import { countries, findCountry, findRegion, outline, regions } from '../lib/content';
import { site } from '../config/site';
import MapView from './MapView';
import { RegionList, RegionPanel } from './RegionPanel';
import { CountryList, CountryPanel } from './CountryPanel';

interface Props {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  selectedCountryId: string | null;
  onSelectCountry: (id: string | null) => void;
  variant: 'hero' | 'page';
  initialFit?: 'own' | 'world';
}

/** The map plus its side panel (details of the selected region/country, or the legend/lists). */
export default function MapExplorer({ selectedId, onSelect, selectedCountryId, onSelectCountry, variant, initialFit = 'own' }: Props) {
  const region = findRegion(selectedId);
  const country = findCountry(selectedCountryId);
  return (
    <div className={`explorer explorer-${variant}`}>
      <div className="explorer-map">
        <MapView
          regions={regions}
          outline={outline}
          countries={countries}
          selectedId={region ? region.id : null}
          onSelect={onSelect}
          selectedCountryId={country ? country.id : null}
          onSelectCountry={onSelectCountry}
          initialFit={initialFit}
          wheelZoom={variant === 'hero' ? 'ctrl' : 'always'}
          zoomOnSelect={variant === 'page'}
        />
        <p className="map-disclaimer">مرزهای داخلی و کشورهای همسایه خیالی‌اند و با تقسیمات یا کشورهای واقعی ارتباطی ندارند.</p>
      </div>
      <aside className="explorer-side" aria-label="جزئیات و فهرست نواحی و کشورها" aria-live="polite">
        {region ? (
          <>
            {variant === 'hero' && <h1 className="sr-only">{site.nameFa} — {site.nameEn}</h1>}
            <RegionPanel region={region} onClose={() => onSelect(null)} showMapLink={variant === 'hero'} />
          </>
        ) : country ? (
          <>
            {variant === 'hero' && <h1 className="sr-only">{site.nameFa} — {site.nameEn}</h1>}
            <CountryPanel country={country} onClose={() => onSelectCountry(null)} />
          </>
        ) : (
          <>
            {variant === 'hero' && (
              <div className="hero-intro">
                <h1>
                  <span className="hero-line" style={{ ['--i' as string]: 0 }}>{site.nameFa}</span>
                  <span className="en hero-line" lang="en" dir="ltr" style={{ ['--i' as string]: 1 }}>{site.nameEn}</span>
                </h1>
                <p className="hero-line" style={{ ['--i' as string]: 2 }}>{site.tagline}</p>
                <div className="hero-actions hero-line" style={{ ['--i' as string]: 3 }}>
                  <Link className="btn btn-primary" to="/map">نقشه تمام‌صفحه</Link>
                  <Link className="btn" to="/countries">کشورهای جهان</Link>
                </div>
              </div>
            )}
            <h2 className="side-title">نواحی جمهوری</h2>
            <RegionList regions={regions} selectedId={null} onSelect={onSelect} />
            <h2 className="side-title side-title-2">کشورهای همسایه</h2>
            <p className="side-hint">کشورها و نواحی را روی نقشه یا از فهرست انتخاب کنید.</p>
            <CountryList countries={countries} selectedId={null} onSelect={onSelectCountry} />
          </>
        )}
      </aside>
    </div>
  );
}
