import { useState } from 'react'
import './App.css'
import Main from './components/main/index'
import Header from './components/header/index'

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
