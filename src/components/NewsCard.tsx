import { Link } from 'react-router-dom';
import type { NewsArticle } from '../types';
import { faDate } from '../lib/format';
import SafeImage from './SafeImage';

export default function NewsCard({ article, large = false }: { article: NewsArticle; large?: boolean }) {
  return (
    <article className={`news-card${large ? ' news-card-large' : ''}`}>
      <Link to={`/news/${article.id}`} className="news-card-link">
        <div className="news-card-media">
          <SafeImage src={article.cover} alt={article.coverAlt} width={1200} height={675} />
          <span className="chip">{article.category}</span>
        </div>
        <div className="news-card-body">
          <time dateTime={article.date}>{faDate(article.date)}</time>
          <h3>{article.titleFa}</h3>
          {article.subtitleEn && <p className="en" lang="en" dir="ltr">{article.subtitleEn}</p>}
          <p className="news-card-summary">{article.summary}</p>
        </div>
      </Link>
    </article>
  );
}
