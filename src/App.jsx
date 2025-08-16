import { Routes, Route } from 'react-router-dom';
import './App.css';
import Main from './components/main';
import Header from './components/header';
import Footer from './components/footer';
import ProductPage from './pages/ProductPage';
import ProductDetail from './pages/ProductDetail';

function App() {
  return (
    <>
      <Header />
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