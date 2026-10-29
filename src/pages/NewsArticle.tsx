import { Link, useParams } from 'react-router-dom';
import { findArticle, news } from '../lib/content';
import { faDate } from '../lib/format';
import { usePageTitle } from '../lib/usePageTitle';
import SafeImage from '../components/SafeImage';
import NotFound from './NotFound';

export default function NewsArticlePage() {
  const { id } = useParams();
  const article = findArticle(id);
  usePageTitle(article?.titleFa);
  if (!article) return <NotFound what="این مقاله" />;
  const idx = news.findIndex((n) => n.id === article.id);
  const newer = news[idx - 1];
  const older = news[idx + 1];

  return (
    <article className="container article">
      <nav aria-label="مسیر صفحه" className="crumbs">
        <Link to="/">خانه</Link><span aria-hidden="true">/</span><Link to="/news">اخبار</Link>
      </nav>
      <header className="article-head">
        <span className="chip chip-static">{article.category}</span>
        <h1>{article.titleFa}</h1>
        {article.subtitleEn && <p className="en subtitle" lang="en" dir="ltr">{article.subtitleEn}</p>}
        <p className="meta">
          <time dateTime={article.date}>{faDate(article.date)}</time>
          {article.author && <span>{article.author}</span>}
        </p>
      </header>
      <SafeImage src={article.cover} alt={article.coverAlt} className="article-cover" width={1200} height={675} loading="eager" />
      <div className="prose">
        <p className="lead">{article.summary}</p>
        {article.body.map((line, i) =>
          line.startsWith('## ') ? <h2 key={i}>{line.slice(3)}</h2> : <p key={i}>{line}</p>
        )}
      </div>
      <p className="notice">این مطلب بخشی از یک پروژه داستانی است و گزارش رویدادهای واقعی نیست.</p>
      <nav className="article-nav" aria-label="مقاله‌های دیگر">
        {newer ? <Link to={`/news/${newer.id}`} rel="prev"><small>مقاله جدیدتر</small>{newer.titleFa}</Link> : <span />}
        {older ? <Link to={`/news/${older.id}`} rel="next"><small>مقاله قدیمی‌تر</small>{older.titleFa}</Link> : <span />}
      </nav>
    </article>
  );
}
