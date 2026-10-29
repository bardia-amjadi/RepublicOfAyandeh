import MapExplorer from '../components/MapExplorer';
import { regions } from '../lib/content';
import { usePageTitle } from '../lib/usePageTitle';
import { faNumber } from '../lib/format';
import { useMapSelection } from '../lib/useMapSelection';

export default function MapPage() {
  usePageTitle('نقشه سیاسی');
  const sel = useMapSelection();

  return (
    <>
      <div className="container page-head">
        <h1>نقشه سیاسی <span className="en" lang="en" dir="ltr">Political Map</span></h1>
        <p>نقشه تعاملی نواحی جمهوری آینده و کشورهای همسایه. با کشیدن جابه‌جا کنید، با چرخ ماوس یا دکمه‌ها بزرگ‌نمایی کنید و برای دیدن جزئیات روی یک ناحیه یا کشور بزنید.</p>
      </div>
      <section className="map-page" aria-label="نقشه">
        <MapExplorer selectedId={sel.region} onSelect={sel.selectRegion} selectedCountryId={sel.country} onSelectCountry={sel.selectCountry} variant="page" />
      </section>
      <section className="section" aria-labelledby="table-title">
        <div className="container">
          <h2 id="table-title" className="h2-plain">جدول نواحی</h2>
          <div className="table-wrap" tabIndex={0} role="region" aria-label="جدول نواحی (قابل پیمایش)">
            <table className="data-table">
              <thead>
                <tr><th scope="col">شناسه</th><th scope="col">ناحیه</th><th scope="col">مرکز اداری</th><th scope="col">جمعیت</th><th scope="col">شهرها</th></tr>
              </thead>
              <tbody>
                {regions.map((r) => (
                  <tr key={r.id} data-active={r.id === sel.region || undefined}>
                    <td dir="ltr">{r.id}</td>
                    <th scope="row">
                      <button type="button" className="link-btn" onClick={() => sel.selectRegion(r.id)}>
                        <span className="swatch" style={{ background: r.color }} aria-hidden="true" />
                        {r.nameFa} <span className="en" lang="en" dir="ltr">{r.nameEn}</span>
                      </button>
                    </th>
                    <td>{r.capital.nameFa}</td>
                    <td>{faNumber(r.population)}</td>
                    <td>{r.cities !== undefined ? faNumber(r.cities) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
