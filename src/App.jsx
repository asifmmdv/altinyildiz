import { Routes, Route } from 'react-router-dom';
import './App.css';
import Main from './components/main';
import Header from './components/header';
import Footer from './components/footer';
import ProductPage from './pages/ProductPage';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/products/:slug" element={<ProductPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;