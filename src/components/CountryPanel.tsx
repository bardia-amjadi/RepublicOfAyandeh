import { Link } from 'react-router-dom';
import type { Country } from '../types';
import { faNumber } from '../lib/format';
import Flag from './Flag';

export function CountryPanel({ country, onClose }: { country: Country; onClose: () => void }) {
  return (
    <article className="region-panel" aria-labelledby="country-title">
      <div className="region-panel-head" style={{ ['--region' as string]: country.color }}>
        <Flag spec={country.flag} className="flag-sm" label={`پرچم ${country.nameFa} (نمونه)`} />
        <div>
          <h3 id="country-title">{country.nameFa}</h3>
          <p className="en" lang="en" dir="ltr">{country.nameEn}</p>
        </div>
        <button type="button" className="icon-btn" onClick={onClose} aria-label="بستن جزئیات کشور">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
      </div>
      <dl className="facts">
        <div><dt>پایتخت</dt><dd>{country.capital.nameFa} <span className="en" lang="en" dir="ltr">{country.capital.nameEn}</span></dd></div>
        <div><dt>جمعیت</dt><dd>{faNumber(country.population)} نفر</dd></div>
        <div><dt>مساحت</dt><dd>{faNumber(country.areaKm2)} کیلومتر مربع</dd></div>
        <div><dt>حکومت</dt><dd>{country.government}</dd></div>
        <div><dt>زبان</dt><dd>{country.language}</dd></div>
        <div><dt>واحد پول</dt><dd>{country.currency}</dd></div>
      </dl>
      <p className="region-desc">{country.description}</p>
      <p className="relation"><strong>نسبت با جمهوری آینده:</strong> {country.relation}</p>
      {country.sample && <p className="notice">داده نمونه: این کشور و اطلاعات آن خیالی و قابل جایگزینی است.</p>}
      <Link className="btn btn-primary" to={`/countries/${country.id}`}>پروفایل کامل کشور</Link>
    </article>
  );
}

interface ListProps { countries: Country[]; selectedId: string | null; onSelect: (id: string) => void }

export function CountryList({ countries, selectedId, onSelect }: ListProps) {
  return (
    <ul className="region-list country-list" aria-label="فهرست کشورهای همسایه">
      {countries.map((c) => (
        <li key={c.id}>
          <button type="button" onClick={() => onSelect(c.id)} aria-pressed={c.id === selectedId} data-active={c.id === selectedId || undefined}>
            <Flag spec={c.flag} className="flag-xs" />
            <span className="rl-name">{c.nameFa}<span className="en" lang="en" dir="ltr">{c.nameEn}</span></span>
            <span className="rl-pop">{faNumber(c.population)}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
