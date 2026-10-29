import { Link } from 'react-router-dom';
import { countries, profile, totals } from '../lib/content';
import { faNumber } from '../lib/format';
import { asset } from '../lib/asset';
import { site } from '../config/site';
import Flag from './Flag';
import Reveal from './Reveal';

export default function CountryCards() {
  return (
    <div className="country-grid">
      <Reveal className="country-card country-card-own">
        <Link to="/countries/ayandeh">
          <img src={asset(site.flag)} alt="" className="flag" width={90} height={60} />
          <h3>{profile.nameFa}<span className="en" lang="en" dir="ltr">{profile.nameEn}</span></h3>
          <p className="country-meta">جمعیت {faNumber(totals.populationTotal)} · {faNumber(totals.regionCount)} ناحیه</p>
          <p className="country-rel">{profile.motto}</p>
        </Link>
      </Reveal>
      {countries.map((c, i) => (
        <Reveal key={c.id} delay={(i + 1) * 70} className="country-card">
          <Link to={`/countries/${c.id}`} style={{ ['--tint' as string]: c.color }}>
            <Flag spec={c.flag} />
            <h3>{c.nameFa}<span className="en" lang="en" dir="ltr">{c.nameEn}</span></h3>
            <p className="country-meta">پایتخت: {c.capital.nameFa} · جمعیت {faNumber(c.population)}</p>
            <p className="country-rel">{c.relation}</p>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
