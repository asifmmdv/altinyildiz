import { Routes, Route } from 'react-router-dom';
import './App.css';
import Main from './components/main';
import Header from './components/header';
import Footer from './components/footer';
import ProductPage from './pages/ProductPage';
import ProductDetail from './pages/ProductDetail';
import ScrollToTop from './components/utilities/ScrollToTop';
import { WishlistProvider } from './components/context/WishListContext';       // ⬅️ add
import WishlistPage from './pages/Wishlistpage';
               // ⬅️ add

function App() {
  return (
    <WishlistProvider>  {/* ⬅️ wrap everything so Header/Product pages can use it */}
      <Header />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/products/:slug" element={<ProductPage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/wishlist" element={<WishlistPage />} />         {/* ⬅️ new */}
      </Routes>
      <Footer />
    </WishlistProvider>
  );
}

export default App;