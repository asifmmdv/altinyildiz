import { Routes, Route } from 'react-router-dom';
import './App.css';
import Main from './components/main';
import Header from './components/header';
import Footer from './components/footer';
import ProductPage from './pages/ProductPage';
import ProductDetail from './pages/ProductDetail';
import ScrollToTop from './components/utilities/ScrollToTop';


function App() {
  return (
    <>
      <Header />
      <ScrollToTop /> {/* ⬅️ add this line */}
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/products/:slug" element={<ProductPage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;