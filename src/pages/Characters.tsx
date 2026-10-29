import CharacterCard from '../components/CharacterCard';
import { characters } from '../lib/content';
import { usePageTitle } from '../lib/usePageTitle';

export default function Characters() {
  usePageTitle('شخصیت‌ها');
  return (
    <div className="container page">
      <div className="page-head-inner">
        <h1>شخصیت‌ها و مقامات <span className="en" lang="en" dir="ltr">Characters &amp; Officials</span></h1>
        <p>شخصیت‌های جهان خیالی جمهوری آینده. اطلاعات بسته با نسخه نمونه است و با فایل characters.json قابل جایگزینی است.</p>
      </div>
      {characters.length ? <div className="character-grid">{characters.map((c) => <CharacterCard key={c.id} character={c} />)}</div> : <p className="empty">هنوز شخصیتی ثبت نشده است.</p>}
    </div>
  );
}
