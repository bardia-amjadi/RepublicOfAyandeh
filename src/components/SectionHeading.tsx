import { Link } from 'react-router-dom';

interface Props {
  id: string;
  title: string;
  titleEn?: string;
  intro?: string;
  link?: { to: string; label: string };
}

export default function SectionHeading({ id, title, titleEn, intro, link }: Props) {
  return (
    <div className="section-head">
      <div>
        <h2 id={id}>
          {title}
          {titleEn && <span className="en" lang="en" dir="ltr">{titleEn}</span>}
        </h2>
        {intro && <p className="section-intro">{intro}</p>}
      </div>
      {link && <Link className="btn btn-ghost" to={link.to}>{link.label}</Link>}
    </div>
  );
}
