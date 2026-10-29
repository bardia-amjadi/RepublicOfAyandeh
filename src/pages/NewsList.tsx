import { useMemo, useState } from 'react';
import NewsCard from '../components/NewsCard';
import { news } from '../lib/content';
import { usePageTitle } from '../lib/usePageTitle';

export default function NewsList() {
  usePageTitle('اخبار');
  const cats = useMemo(() => [...new Set(news.map((n) => n.category))], []);
  const [cat, setCat] = useState('all');
  const list = cat === 'all' ? news : news.filter((n) => n.category === cat);
  return (
    <div className="container page">
      <div className="page-head-inner">
        <h1>اخبار و اطلاعیه‌ها <span className="en" lang="en" dir="ltr">News</span></h1>
        <p>همه مطالب این بخش داستانی‌اند و به رویدادهای واقعی ارتباطی ندارند.</p>
      </div>
      {cats.length > 1 && (
        <div className="filters" role="group" aria-label="فیلتر دسته‌بندی">
          <button type="button" aria-pressed={cat === 'all'} onClick={() => setCat('all')}>همه</button>
          {cats.map((c) => <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>)}
        </div>
      )}
      {list.length ? <div className="news-grid">{list.map((a) => <NewsCard key={a.id} article={a} />)}</div> : <p className="empty">خبری در این دسته وجود ندارد.</p>}
    </div>
  );
}
