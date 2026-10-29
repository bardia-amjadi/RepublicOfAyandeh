import Gallery from '../components/Gallery';
import { media } from '../lib/content';
import { usePageTitle } from '../lib/usePageTitle';

export default function GalleryPage() {
  usePageTitle('رسانه');
  return (
    <div className="container page">
      <div className="page-head-inner">
        <h1>میم‌ها و رسانه <span className="en" lang="en" dir="ltr">Media Gallery</span></h1>
        <p>میم‌ها، پوسترها و تصاویر طنز جمهوری آینده. روی هر تصویر بزنید تا بزرگ شود.</p>
      </div>
      <Gallery items={media} />
    </div>
  );
}
