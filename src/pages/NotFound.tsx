import { Link } from 'react-router-dom';
import { usePageTitle } from '../lib/usePageTitle';

export default function NotFound({ what = 'این صفحه' }: { what?: string }) {
  usePageTitle('یافت نشد');
  return (
    <div className="container page not-found">
      <h1>{what} پیدا نشد</h1>
      <p>ممکن است نشانی اشتباه باشد یا مطلب حذف شده باشد.</p>
      <Link className="btn btn-primary" to="/">بازگشت به صفحه اصلی</Link>
    </div>
  );
}
