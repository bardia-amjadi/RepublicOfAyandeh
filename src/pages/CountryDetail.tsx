import { Link, useParams } from 'react-router-dom';
import { countries, findCountry, profile, regions, totals } from '../lib/content';
import { faNumber } from '../lib/format';
import { asset } from '../lib/asset';
import { site } from '../config/site';
import { usePageTitle } from '../lib/usePageTitle';
import Flag from '../components/Flag';
import Reveal from '../components/Reveal';
import Timeline from '../components/Timeline';
import NotFound from './NotFound';

export default function CountryDetail() {
  const { id } = useParams();
  const own = id === 'ayandeh';
  const c = findCountry(id);
  usePageTitle(own ? profile.nameFa : c?.nameFa);
  if (!own && !c) return <NotFound what="این کشور" />;

  const capitalRegion = regions.find((r) => r.id === profile.capitalRegionId);
  const facts: { label: string; value: string }[] = own
    ? [
        { label: 'نوع حکومت', value: profile.government },
        { label: 'سمت رأس حکومت', value: profile.head },
        { label: 'پایتخت', value: capitalRegion ? capitalRegion.capital.nameFa : '—' },
        { label: 'زبان رسمی', value: profile.language },
        { label: 'واحد پول', value: profile.currency },
        { label: 'پایه‌گذاری', value: profile.founded },
        { label: 'جمعیت', value: `${faNumber(totals.populationTotal)} نفر` },
        { label: 'مساحت', value: `${faNumber(profile.areaKm2)} کیلومتر مربع` },
      ]
    : [
        { label: 'نوع حکومت', value: c!.government },
        { label: 'پایتخت', value: c!.capital.nameFa },
        { label: 'زبان', value: c!.language },
        { label: 'واحد پول', value: c!.currency },
        { label: 'جمعیت', value: `${faNumber(c!.population)} نفر` },
        { label: 'مساحت', value: `${faNumber(c!.areaKm2)} کیلومتر مربع` },
      ];
  const nameFa = own ? profile.nameFa : c!.nameFa;
  const nameEn = own ? profile.nameEn : c!.nameEn;
  const timeline = own ? profile.timeline : c!.timeline;
  const overview = own ? profile.overview : [c!.description, `نسبت با جمهوری آینده: ${c!.relation}.`];
  const sample = own ? profile.sample : c!.sample;

  return (
    <div className="container page">
      <nav aria-label="مسیر صفحه" className="crumbs">
        <Link to="/">خانه</Link><span aria-hidden="true">/</span><Link to="/countries">کشورها</Link>
      </nav>
      <header className="country-head" style={{ ['--tint' as string]: own ? '#1f9d55' : c!.color }}>
        {own ? <img src={asset(site.flag)} alt={`پرچم ${nameFa}`} className="flag flag-lg" width={180} height={120} /> : <Flag spec={c!.flag} className="flag-lg" label={`پرچم ${nameFa} (نمونه)`} />}
        <div>
          <h1>{nameFa}<span className="en" lang="en" dir="ltr">{nameEn}</span></h1>
          {own && <p className="motto">«{profile.motto}»</p>}
          <Link className="btn" to={own ? '/map' : `/countries?country=${c!.id}`}>نمایش روی نقشه</Link>
        </div>
      </header>

      <Reveal>
        <dl className="fact-cards">
          {facts.map((f) => (
            <div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>
          ))}
        </dl>
      </Reveal>

      <div className="detail-cols">
        <Reveal className="prose">
          <h2>معرفی</h2>
          {overview.map((p, i) => <p key={i} className={i === 0 ? 'lead' : undefined}>{p}</p>)}
          {own && (
            <>
              <h2>نواحی</h2>
              <ul className="inline-links">
                {regions.map((r) => (
                  <li key={r.id}><Link to={`/map?region=${r.id}`}><span className="swatch" style={{ background: r.color }} aria-hidden="true" />{r.nameFa}</Link></li>
                ))}
              </ul>
            </>
          )}
          {sample && <p className="notice">اطلاعات این صفحه نمونه است و بخشی از داستان رسمی پروژه نیست.</p>}
        </Reveal>
        <div>
          <h2 className="h2-plain">گاه‌شمار</h2>
          <Timeline entries={timeline} />
        </div>
      </div>

      <h2 className="h2-plain">کشورهای دیگر</h2>
      <ul className="inline-links big">
        {own ? null : <li><Link to="/countries/ayandeh">{profile.nameFa}</Link></li>}
        {countries.filter((x) => x.id !== id).map((x) => (
          <li key={x.id}><Link to={`/countries/${x.id}`}><Flag spec={x.flag} className="flag-xs" />{x.nameFa}</Link></li>
        ))}
      </ul>
    </div>
  );
}
