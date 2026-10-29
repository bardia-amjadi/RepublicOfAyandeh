import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <>
      <a className="skip-link" href="#content" onClick={(e) => { e.preventDefault(); document.getElementById('content')?.focus(); }}>پرش به محتوای اصلی</a>
      <Header />
      <main id="content" tabIndex={-1} key={pathname} className="page-enter">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
