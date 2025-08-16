import { Routes, Route } from 'react-router-dom';
import './App.css';
import Main from './components/main/index';
import Header from './components/header/index';
import Footer from './components/footer';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Main />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;