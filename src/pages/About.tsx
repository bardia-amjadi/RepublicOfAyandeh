import { Link } from 'react-router-dom';
import { site } from '../config/site';
import { asset } from '../lib/asset';
import { usePageTitle } from '../lib/usePageTitle';

export default function About() {
  usePageTitle('درباره');
  return (
    <div className="container page">
      <div className="about">
        <div className="prose">
          <h1>درباره {site.nameFa} <span className="en" lang="en" dir="ltr">About the {site.nameEn}</span></h1>
          <p className="lead">{site.nameFa} ({site.nameEn}) یک پروژه جهان‌سازی داستانی است که همراه با یک کانال اینستاگرام ساخته می‌شود. این وب‌سایت پرتال و اطلس سیاسی آن جهان خیالی است.</p>
          <h2>این وب‌سایت چیست؟</h2>
          <p>همه کشورها، نواحی، مرزهای داخلی، شخصیت‌ها، اخبار، آمار و رویدادهای این سایت خیالی‌اند. هیچ‌یک به دولت، نهاد یا رویداد واقعی مربوط نیست و این سایت یک پرتال رسمی واقعی نیست. فقط حاشیه بیرونی نقشه از داده‌های جغرافیایی عمومی گرفته شده و مرزهای داخلی با تقسیمات واقعی هیچ ارتباطی ندارند.</p>
          <p>این پروژه یک بازی نیست: نبرد، دیپلماسی یا تصرف سرزمین در کار نیست. این مجموعه یک اطلس، یک رسانه و یک بایگانی برای جهان داستانی است.</p>
          <h2>بخش‌های سایت</h2>
          <ul>
            <li><Link to="/map">نقشه سیاسی</Link>: کاوش تعاملی در نواحی خیالی.</li>
            <li><Link to="/news">اخبار</Link>: اطلاعیه‌ها و مقاله‌های داستانی.</li>
            <li><Link to="/characters">شخصیت‌ها</Link>: مقامات و چهره‌های این جهان.</li>
            <li><Link to="/gallery">رسانه</Link>: میم‌ها و پوسترها.</li>
          </ul>
          <h2>ارتباط</h2>
          <p>برای دیدن تازه‌ترین مطالب پروژه به <a href={site.instagram.url} target="_blank" rel="noopener noreferrer">اینستاگرام</a> سر بزنید.</p>
          <h2>اعتبارات</h2>
          <ul>{site.credits.map((c) => <li key={c}>{c}</li>)}</ul>
        </div>
        <figure className="about-flag">
          <img src={asset(site.flag)} alt="پرچم جمهوری آینده" width={300} height={200} />
          <figcaption>پرچم (فایل نمونه؛ قابل جایگزینی)</figcaption>
        </figure>
      </div>
    </div>
  );
}
