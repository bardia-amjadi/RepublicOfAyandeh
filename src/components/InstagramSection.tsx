import { instagramPosts } from '../lib/content';
import { site } from '../config/site';
import SafeImage from './SafeImage';
import SectionHeading from './SectionHeading';

export default function InstagramSection() {
  return (
    <section className="section" aria-labelledby="ig-title">
      <div className="container">
        <SectionHeading id="ig-title" title="در اینستاگرام" titleEn="On Instagram" intro="این جهان داستانی در اینستاگرام زنده است. پست‌های برگزیده زیر به‌صورت دستی در این وب‌سایت نگهداری می‌شوند." />
        {instagramPosts.length > 0 && (
          <ul className="ig-grid">
            {instagramPosts.map((p) => {
              const body = (
                <>
                  <SafeImage src={p.image} alt={p.alt} />
                  {p.caption && <span className="ig-caption">{p.caption}</span>}
                </>
              );
              return (
                <li key={p.id}>
                  {p.url ? <a href={p.url} target="_blank" rel="noopener noreferrer" className="ig-post">{body}</a> : <div className="ig-post">{body}</div>}
                </li>
              );
            })}
          </ul>
        )}
        <div className="ig-cta">
          <a className="btn btn-primary" href={site.instagram.url} target="_blank" rel="noopener noreferrer">
            رفتن به اینستاگرام
            <span className="sr-only"> (در پنجره جدید)</span>
          </a>
          {site.instagram.handle && <span className="en" dir="ltr">{site.instagram.handle}</span>}
        </div>
      </div>
    </section>
  );
}
