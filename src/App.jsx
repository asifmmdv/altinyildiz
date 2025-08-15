import { useState } from 'react'
import './App.css'
import Main from './components/main/index'
import Header from './components/header/index'
import Footer from './components/footer'

function App() {
  const [showSidebar, setShowSidebar] = useState(false)
  return (
    <>
      <Header onHamburgerClick={() => setShowSidebar(true)} />
      <Main isOpen={showSidebar} onClose={() => setShowSidebar(false)} />
      <Footer/>
    </>
  )
}

export default App
