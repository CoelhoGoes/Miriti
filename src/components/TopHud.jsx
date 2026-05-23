import { useState, useEffect } from 'react'
import { FaBolt, FaCoins } from 'react-icons/fa'
import { useGame, MAX_ENERGY, ENERGY_REGEN_MS } from '../context/GameContext.jsx'
import { useStrings } from '../i18n/index.js'
import './TopHud.css'

function formatTime(ms) {
  const total = Math.max(0, Math.ceil(ms / 1000))
  const m = Math.floor(total / 60)
  const sec = String(total % 60).padStart(2, '0')
  return `${m}:${sec}`
}

/** Barra de energia + moedas, exibida no topo das telas. */
export default function TopHud() {
  const { state } = useGame()
  const s = useStrings()
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const iv = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(iv)
  }, [])

  const elapsed = now - state.lastEnergyTs
  const regenerated = Math.min(
    MAX_ENERGY,
    state.energy + Math.max(0, Math.floor(elapsed / ENERGY_REGEN_MS))
  )
  const full = regenerated >= MAX_ENERGY
  const nextMs = full ? 0 : ENERGY_REGEN_MS - (elapsed % ENERGY_REGEN_MS)

  return (
    <div className="top-hud">
      <div className="hud-pill hud-energy">
        <FaBolt className="hud-bolt" />
        <span className="hud-energy-val">{regenerated}/{MAX_ENERGY}</span>
        <span className="hud-energy-timer">
          {full ? s.hud.energyFull : s.hud.nextIn(formatTime(nextMs))}
        </span>
      </div>
      <div className="hud-pill hud-coins">
        <FaCoins className="hud-coin" />
        <span>{state.coins}</span>
      </div>
    </div>
  )
}
