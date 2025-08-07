import { useState } from 'react'
import './App.css'
import Main from './components/main/Main'
import Header from './components/header/Header'

function App() {
  const [showSidebar, setShowSidebar] = useState(false)
  return (
    <>
      <Header onHamburgerClick={() => setShowSidebar(true)} />
      <Main isOpen={showSidebar} onClose={() => setShowSidebar(false)} />
    </>
  )
}

export default App
