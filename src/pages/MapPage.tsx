import { useSearchParams } from 'react-router-dom';
import MapExplorer from '../components/MapExplorer';
import { findRegion, regions } from '../lib/content';
import { usePageTitle } from '../lib/usePageTitle';
import { faNumber } from '../lib/format';

export default function MapPage() {
  usePageTitle('نقشه سیاسی');
  const [params, setParams] = useSearchParams();
  const selected = findRegion(params.get('region'))?.id ?? null;
  const onSelect = (id: string | null) => {
    const next = new URLSearchParams(params);
    if (id) next.set('region', id); else next.delete('region');
    setParams(next, { replace: true });
  };

  return (
    <>
      <div className="container page-head">
        <h1>نقشه سیاسی <span className="en" lang="en" dir="ltr">Political Map</span></h1>
        <p>نقشه تعاملی نواحی جمهوری آینده. با کشیدن جابه‌جا کنید، با چرخ ماوس یا دکمه‌ها بزرگ‌نمایی کنید و برای دیدن جزئیات روی یک ناحیه بزنید.</p>
      </div>
      <section className="map-page" aria-label="نقشه">
        <MapExplorer selectedId={selected} onSelect={onSelect} variant="page" />
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
                  <tr key={r.id} data-active={r.id === selected || undefined}>
                    <td dir="ltr">{r.id}</td>
                    <th scope="row">
                      <button type="button" className="link-btn" onClick={() => onSelect(r.id)}>
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
