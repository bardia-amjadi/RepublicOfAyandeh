import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import MapPage from './pages/MapPage';
import Countries from './pages/Countries';
import CountryDetail from './pages/CountryDetail';
import NewsList from './pages/NewsList';
import NewsArticlePage from './pages/NewsArticle';
import Characters from './pages/Characters';
import CharacterDetail from './pages/CharacterDetail';
import GalleryPage from './pages/GalleryPage';
import About from './pages/About';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="map" element={<MapPage />} />
        <Route path="countries" element={<Countries />} />
        <Route path="countries/:id" element={<CountryDetail />} />
        <Route path="news" element={<NewsList />} />
        <Route path="news/:id" element={<NewsArticlePage />} />
        <Route path="characters" element={<Characters />} />
        <Route path="characters/:id" element={<CharacterDetail />} />
        <Route path="gallery" element={<GalleryPage />} />
        <Route path="about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
