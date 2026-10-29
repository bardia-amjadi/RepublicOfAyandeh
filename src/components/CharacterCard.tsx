import { Link } from 'react-router-dom';
import type { Character } from '../types';
import SafeImage from './SafeImage';

export default function CharacterCard({ character: c }: { character: Character }) {
  const inner = (
    <>
      <SafeImage src={c.portrait} alt={`پرتره ${c.nameFa}`} width={600} height={750} className="portrait" />
      <div className="character-body">
        <h3>{c.nameFa}</h3>
        {c.nameEn && <p className="en" lang="en" dir="ltr">{c.nameEn}</p>}
        <p className="character-role">{c.role}</p>
        <p className="character-bio">{c.bio}</p>
        {c.affiliation && <p className="character-aff">{c.affiliation}</p>}
        {c.profile && <span className="more">مشاهده پروفایل</span>}
      </div>
    </>
  );
  return (
    <article className="character-card">
      {c.profile ? <Link to={`/characters/${c.id}`} className="character-link">{inner}</Link> : <div className="character-link">{inner}</div>}
    </article>
  );
}
