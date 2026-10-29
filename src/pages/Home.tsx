import { useState } from 'react';
import MapExplorer from '../components/MapExplorer';
import NewsCard from '../components/NewsCard';
import CharacterCard from '../components/CharacterCard';
import StatsSection from '../components/StatsSection';
import Gallery from '../components/Gallery';
import InstagramSection from '../components/InstagramSection';
import SectionHeading from '../components/SectionHeading';
import CountryCards from '../components/CountryCards';
import Timeline from '../components/Timeline';
import Reveal from '../components/Reveal';
import { characters, media, news, profile } from '../lib/content';
import { usePageTitle } from '../lib/usePageTitle';

export default function Home() {
  usePageTitle();
  const [region, setRegion] = useState<string | null>(null);
  const [country, setCountry] = useState<string | null>(null);
  const featured = news.find((n) => n.featured) ?? news[0];
  const others = news.filter((n) => n.id !== featured?.id).slice(0, 2);

  return (
    <>
      <section className="hero" aria-label="نقشه سیاسی تعاملی">
        <MapExplorer
          selectedId={region}
          onSelect={(id) => { setRegion(id); if (id) setCountry(null); }}
          selectedCountryId={country}
          onSelectCountry={(id) => { setCountry(id); if (id) setRegion(null); }}
          variant="hero"
        />
      </section>

      <section className="section" aria-labelledby="news-title">
        <div className="container">
          <Reveal><SectionHeading id="news-title" title="اخبار و اطلاعیه‌ها" titleEn="News & announcements" link={{ to: '/news', label: 'همه اخبار' }} /></Reveal>
          {featured ? (
            <div className="news-layout">
              <Reveal><NewsCard article={featured} large /></Reveal>
              <div className="news-side">{others.map((a, i) => <Reveal key={a.id} delay={(i + 1) * 110}><NewsCard article={a} /></Reveal>)}</div>
            </div>
          ) : (
            <p className="empty">هنوز خبری منتشر نشده است.</p>
          )}
        </div>
      </section>

      <section className="section" aria-labelledby="world-title">
        <div className="container">
          <Reveal><SectionHeading id="world-title" title="جمهوری و همسایگان" titleEn="The Republic & its neighbours" intro="جمهوری آینده در کنار هفت کشور خیالی دیگر قرار دارد. هر کشور پروفایل، گاه‌شمار و اطلاعات خودش را دارد." link={{ to: '/countries', label: 'همه کشورها' }} /></Reveal>
          <CountryCards />
        </div>
      </section>

      <section className="section" aria-labelledby="chars-title">
        <div className="container">
          <Reveal><SectionHeading id="chars-title" title="شخصیت‌ها و مقامات" titleEn="Characters & officials" link={{ to: '/characters', label: 'همه شخصیت‌ها' }} /></Reveal>
          {characters.length ? (
            <div className="character-grid">{characters.slice(0, 4).map((c, i) => <Reveal key={c.id} delay={i * 90}><CharacterCard character={c} /></Reveal>)}</div>
          ) : (
            <p className="empty">هنوز شخصیتی ثبت نشده است.</p>
          )}
        </div>
      </section>

      <StatsSection />

      <section className="section" aria-labelledby="history-title">
        <div className="container">
          <Reveal><SectionHeading id="history-title" title="گاه‌شمار جمهوری" titleEn="Timeline" intro={profile.overview[0]} link={{ to: '/countries/ayandeh', label: 'پروفایل کشور' }} /></Reveal>
          <Timeline entries={profile.timeline} />
        </div>
      </section>

      <section className="section" aria-labelledby="media-title">
        <div className="container">
          <Reveal><SectionHeading id="media-title" title="میم‌ها و رسانه" titleEn="Memes & media" link={{ to: '/gallery', label: 'گالری کامل' }} /></Reveal>
          <Reveal><Gallery items={media.slice(0, 6)} filters={false} /></Reveal>
        </div>
      </section>

      <InstagramSection />
    </>
  );
}
