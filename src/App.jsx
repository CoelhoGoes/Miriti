import { useState } from 'react'
import { GameProvider } from './context/GameContext'
import HomeMenu from './HomeMenu'
import QuizGame from './pages/QuizGame'

function App() {
  const [pagina, setPagina] = useState('home')

  function handleNavegar(label) {
    if (label === 'Missões') setPagina('quiz')
    else setPagina('home')
  }

  return (
    <GameProvider>
      {pagina === 'home' && <HomeMenu onNavigate={handleNavegar} />}
      {pagina === 'quiz' && <QuizGame />}
    </GameProvider>
  )
}

export default App