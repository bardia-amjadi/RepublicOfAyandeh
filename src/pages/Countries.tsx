import MapExplorer from '../components/MapExplorer';
import CountryCards from '../components/CountryCards';
import { usePageTitle } from '../lib/usePageTitle';
import { useMapSelection } from '../lib/useMapSelection';

export default function Countries() {
  usePageTitle('کشورها');
  const sel = useMapSelection();
  return (
    <>
      <div className="container page-head">
        <h1>کشورهای جهان <span className="en" lang="en" dir="ltr">Countries of the world</span></h1>
        <p>جمهوری آینده و هفت کشور خیالی همسایه. همه کشورها، نام‌ها و مرزها داستانی‌اند و جایگزین‌پذیر.</p>
      </div>
      <section className="map-page" aria-label="نقشه جهان">
        <MapExplorer selectedId={sel.region} onSelect={sel.selectRegion} selectedCountryId={sel.country} onSelectCountry={sel.selectCountry} variant="page" initialFit="world" />
      </section>
      <section className="section" aria-labelledby="cards-title">
        <div className="container">
          <h2 id="cards-title" className="h2-plain">همه کشورها</h2>
          <CountryCards />
        </div>
      </section>
    </>
  );
}
