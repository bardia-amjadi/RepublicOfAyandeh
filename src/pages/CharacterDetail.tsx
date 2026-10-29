import { Link, useParams } from 'react-router-dom';
import { findCharacter } from '../lib/content';
import { usePageTitle } from '../lib/usePageTitle';
import SafeImage from '../components/SafeImage';
import NotFound from './NotFound';

export default function CharacterDetail() {
  const { id } = useParams();
  const c = findCharacter(id);
  usePageTitle(c?.nameFa);
  if (!c || !c.profile) return <NotFound what="این پروفایل" />;
  return (
    <div className="container page">
      <nav aria-label="مسیر صفحه" className="crumbs">
        <Link to="/">خانه</Link><span aria-hidden="true">/</span><Link to="/characters">شخصیت‌ها</Link>
      </nav>
      <div className="profile">
        <SafeImage src={c.portrait} alt={`پرتره ${c.nameFa}`} className="portrait portrait-lg" width={600} height={750} loading="eager" />
        <div className="prose">
          <h1>{c.nameFa}</h1>
          {c.nameEn && <p className="en subtitle" lang="en" dir="ltr">{c.nameEn}</p>}
          <p className="character-role">{c.role}</p>
          {c.affiliation && <p className="character-aff">{c.affiliation}</p>}
          <p className="lead">{c.bio}</p>
          {c.profile.map((p, i) => <p key={i}>{p}</p>)}
          {c.sample && <p className="notice">اطلاعات این شخصیت نمونه است و بخشی از داستان رسمی نیست.</p>}
        </div>
      </div>
    </div>
  );
}
