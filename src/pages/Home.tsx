import { useState } from 'react';
import MapExplorer from '../components/MapExplorer';
import NewsCard from '../components/NewsCard';
import CharacterCard from '../components/CharacterCard';
import StatsSection from '../components/StatsSection';
import Gallery from '../components/Gallery';
import InstagramSection from '../components/InstagramSection';
import SectionHeading from '../components/SectionHeading';
import { characters, media, news } from '../lib/content';
import { usePageTitle } from '../lib/usePageTitle';

export default function Home() {
  usePageTitle();
  const [selected, setSelected] = useState<string | null>(null);
  const featured = news.find((n) => n.featured) ?? news[0];
  const others = news.filter((n) => n.id !== featured?.id).slice(0, 2);

  return (
    <>
      <section className="hero" aria-label="نقشه سیاسی تعاملی">
        <MapExplorer selectedId={selected} onSelect={setSelected} variant="hero" />
      </section>

      <section className="section" aria-labelledby="news-title">
        <div className="container">
          <SectionHeading id="news-title" title="اخبار و اطلاعیه‌ها" titleEn="News & announcements" link={{ to: '/news', label: 'همه اخبار' }} />
          {featured ? (
            <div className="news-layout">
              <NewsCard article={featured} large />
              <div className="news-side">{others.map((a) => <NewsCard key={a.id} article={a} />)}</div>
            </div>
          ) : (
            <p className="empty">هنوز خبری منتشر نشده است.</p>
          )}
        </div>
      </section>

      <section className="section" aria-labelledby="chars-title">
        <div className="container">
          <SectionHeading id="chars-title" title="شخصیت‌ها و مقامات" titleEn="Characters & officials" link={{ to: '/characters', label: 'همه شخصیت‌ها' }} />
          {characters.length ? (
            <div className="character-grid">{characters.slice(0, 4).map((c) => <CharacterCard key={c.id} character={c} />)}</div>
          ) : (
            <p className="empty">هنوز شخصیتی ثبت نشده است.</p>
          )}
        </div>
      </section>

      <StatsSection />

      <section className="section" aria-labelledby="media-title">
        <div className="container">
          <SectionHeading id="media-title" title="میم‌ها و رسانه" titleEn="Memes & media" link={{ to: '/gallery', label: 'گالری کامل' }} />
          <Gallery items={media.slice(0, 6)} filters={false} />
        </div>
      </section>

      <InstagramSection />
    </>
  );
}
