import { FaCoins } from 'react-icons/fa'
import { useGame } from '../context/GameContext.jsx'
import './TopHud.css'

/** Barra de moedas exibida no topo das telas. */
export default function TopHud() {
  const { state } = useGame()

  return (
    <div className="top-hud">
      <div className="hud-pill hud-coins">
        <FaCoins className="hud-coin" />
        <span>{state.coins}</span>
      </div>
    </div>
  )
}
