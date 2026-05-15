import { GameProvider } from './context/GameContext'
import HomeMenu from './HomeMenu'

function App() {
  return (
    <GameProvider>
      <HomeMenu />
    </GameProvider>
  )
}

export default App