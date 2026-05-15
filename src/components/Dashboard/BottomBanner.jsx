import { useGame } from '../../context/GameContext'
import './dashboard.css'

export default function BottomBanner() {
  const { gameState } = useGame()

  return (
    <footer className="dashboard-bottom-banner">
      <strong>Dia {gameState.economia.diaAtual}</strong>
      <span>
        Prepare a fazenda, acompanhe o fluxo de Tindins e avance no progresso pedagógico.
      </span>
    </footer>
  )
}