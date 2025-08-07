import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import Main from './components/main'

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
