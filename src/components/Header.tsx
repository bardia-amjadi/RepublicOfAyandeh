import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { navigation, site } from '../config/site';
import { asset } from '../lib/asset';

export default function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="site-header">
      <div className="container header-row">
        <Link to="/" className="brand" aria-label={`${site.nameFa} — صفحه اصلی`}>
          <img src={asset(site.logo)} alt="" width={40} height={40} />
          <span className="brand-text">
            <strong>{site.nameFa}</strong>
            <span lang="en" dir="ltr">{site.nameEn}</span>
          </span>
        </Link>
        <button
          type="button"
          className="menu-btn"
          aria-expanded={open}
          aria-controls="main-nav"
          onClick={() => setOpen((o) => !o)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">{open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}</svg>
          <span className="sr-only">{open ? 'بستن منو' : 'باز کردن منو'}</span>
        </button>
        <nav id="main-nav" className="main-nav" data-open={open || undefined} aria-label="ناوبری اصلی">
          <ul>
            {navigation.map((n) => (
              <li key={n.to}>
                <NavLink to={n.to} end={n.end}>{n.label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="tricolor" aria-hidden="true"><i /><i /><i /></div>
    </header>
  );
}
