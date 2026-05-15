import { useGame } from '../../context/GameContext'
import XPBar from './XPBar'
import './dashboard.css'

const NAV_ITEMS = [
  { icon: '🏠', label: 'Início' },
  { icon: '✅', label: 'Missões' },
  { icon: '🛍️', label: 'Loja' },
  { icon: '👤', label: 'Perfil' },
  { icon: '🏆', label: 'Conquistas' },
  { icon: '❓', label: 'Ajuda' },
]

export default function Sidebar() {
  const { gameState } = useGame()
  const { nome, nivel, xp } = gameState.perfil

  return (
    <aside className="dashboard-sidebar">
      <section className="dashboard-profile">
        <span className="dashboard-kicker">Perfil</span>
        <strong className="dashboard-profile__name">{nome}</strong>
        <p className="dashboard-profile__level">Nível {nivel}</p>
        <XPBar current={xp % 500} max={500} />
      </section>

      <nav className="dashboard-nav" aria-label="Navegação principal">
        {NAV_ITEMS.map((item) => (
          <button key={item.label} type="button" className="dashboard-nav__item">
            <span className="dashboard-nav__icon" aria-hidden="true">
              {item.icon}
            </span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  )
}