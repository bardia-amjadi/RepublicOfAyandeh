import { Link } from 'react-router-dom';
import { navigation, site } from '../config/site';
import { asset } from '../lib/asset';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="tricolor" aria-hidden="true"><i /><i /><i /></div>
      <div className="container footer-grid">
        <div>
          <div className="brand">
            <img src={asset(site.flag)} alt="" width={56} height={37} className="footer-flag" />
            <span className="brand-text">
              <strong>{site.nameFa}</strong>
              <span lang="en" dir="ltr">{site.nameEn}</span>
            </span>
          </div>
          <p className="footer-note">یک پروژه جهان‌سازی داستانی. همه نام‌ها، نقشه‌ها، رویدادها و آمار این وب‌سایت خیالی‌اند و به هیچ دولت یا سازمان واقعی ارتباط ندارند.</p>
        </div>
        <nav aria-label="پیوندهای پایین صفحه">
          <h2 className="footer-title">دسترسی سریع</h2>
          <ul className="footer-links">
            {navigation.map((n) => (
              <li key={n.to}><Link to={n.to}>{n.label}</Link></li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="footer-title">منابع و اعتبارات</h2>
          <ul className="footer-links">
            {site.credits.map((c) => <li key={c}>{c}</li>)}
            <li><a href={site.instagram.url} target="_blank" rel="noopener noreferrer">اینستاگرام پروژه</a></li>
          </ul>
        </div>
      </div>
      <div className="container footer-base">
        <span>© {site.nameFa} — <span lang="en" dir="ltr">{site.nameEn}</span></span>
      </div>
    </footer>
  );
}
