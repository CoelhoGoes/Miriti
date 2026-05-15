import { useGame } from '../../context/GameContext'
import './dashboard.css'

export default function TopBar() {
  const { gameState } = useGame()
  const moedas = gameState.economia.moedas
  const energia = gameState.economia.energia

  return (
    <header className="dashboard-topbar">
      <div className="dashboard-topbar__resources">
        <div className="dashboard-chip dashboard-chip--gold">
          <span className="dashboard-chip__label">Tindins</span>
          <strong>{moedas}</strong>
        </div>

        <div className="dashboard-chip dashboard-chip--green">
          <span className="dashboard-chip__label">Energia</span>
          <strong>{energia}%</strong>
        </div>
      </div>

      <div className="dashboard-topbar__actions">
        <button type="button" className="dashboard-icon-button" aria-label="Abrir calendário">
          📅
        </button>
        <button type="button" className="dashboard-icon-button" aria-label="Ver notificações">
          🔔
        </button>
      </div>
    </header>
  )
}