import { Link } from 'react-router-dom';
import type { Region } from '../types';
import { faNumber } from '../lib/format';

interface PanelProps {
  region: Region;
  onClose: () => void;
  showMapLink?: boolean;
}

export function RegionPanel({ region, onClose, showMapLink }: PanelProps) {
  return (
    <article className="region-panel" aria-labelledby="region-title">
      <div className="region-panel-head" style={{ ['--region' as string]: region.color }}>
        <span className="region-swatch" aria-hidden="true" />
        <div>
          <h3 id="region-title">{region.nameFa}</h3>
          <p className="en" lang="en" dir="ltr">{region.nameEn}</p>
        </div>
        <button type="button" className="icon-btn" onClick={onClose} aria-label="بستن جزئیات ناحیه">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
      </div>
      <dl className="facts">
        <div><dt>شناسه</dt><dd dir="ltr">{region.id}</dd></div>
        <div><dt>جمعیت</dt><dd>{faNumber(region.population)} نفر</dd></div>
        <div>
          <dt>مرکز اداری</dt>
          <dd>{region.capital.nameFa} <span className="en" lang="en" dir="ltr">{region.capital.nameEn}</span></dd>
        </div>
        {region.cities !== undefined && <div><dt>شهرها</dt><dd>{faNumber(region.cities)}</dd></div>}
      </dl>
      <p className="region-desc">{region.description}</p>
      {region.sample && <p className="notice">داده نمونه: نام، مرز و ارقام این ناحیه خیالی و قابل جایگزینی است.</p>}
      {showMapLink && <Link className="btn btn-primary" to={`/map?region=${region.id}`}>نمایش در صفحه نقشه</Link>}
    </article>
  );
}

interface ListProps {
  regions: Region[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

/** Doubles as the map legend and as a keyboard/screen-reader friendly alternative to clicking the map. */
export function RegionList({ regions, selectedId, onSelect }: ListProps) {
  return (
    <ul className="region-list" aria-label="فهرست نواحی و راهنمای رنگ‌ها">
      {regions.map((r) => (
        <li key={r.id}>
          <button type="button" onClick={() => onSelect(r.id)} aria-pressed={r.id === selectedId} data-active={r.id === selectedId || undefined}>
            <span className="swatch" style={{ background: r.color }} aria-hidden="true" />
            <span className="rl-name">{r.nameFa}<span className="en" lang="en" dir="ltr">{r.nameEn}</span></span>
            <span className="rl-pop">{faNumber(r.population)}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
