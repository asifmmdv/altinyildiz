// src/App.jsx
import { Routes, Route } from "react-router-dom";
import "./App.css";

import Main from "./components/main";
import Header from "./components/header";
import Footer from "./components/footer";
import ProductPage from "./pages/ProductPage";
import ProductDetail from "./pages/ProductDetail";
import ScrollToTop from "./components/utilities/ScrollToTop";
import WishlistPage from "./pages/WishlistPage";

import { WishlistProvider } from "./context/WishlistContext";
import { BasketProvider } from "./context/BasketContext";
import BasketPage from "./pages/BasketPage";

function App() {
  return (
    <BasketProvider>
      <WishlistProvider>
        <Header />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/products/:slug" element={<ProductPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/basket" element={<BasketPage />} />
        </Routes>
        <Footer />
      </WishlistProvider>
    </BasketProvider>
  );
}

export default App;