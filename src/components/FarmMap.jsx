import { motion } from 'framer-motion'
import AnimatedBackground from './AnimatedBackground.jsx'
import TopHud from './TopHud.jsx'
import { sound } from '../utils/sound.js'
import { useGame } from '../context/GameContext.jsx'
import { useStrings } from '../i18n/index.js'
import './FarmMap.css'

/* Locais clicáveis da fazenda — cada um abre uma funcionalidade. */
const SPOTS = [
  { id: 'escolinha', icon: '🏫', left: '30%', top: '44%', big: true },
  { id: 'shop', icon: '🏪', left: '64%', top: '39%' },
  { id: 'stocks', icon: '📈', left: '82%', top: '61%' },
  { id: 'achievements', icon: '🏆', left: '50%', top: '72%' },
  { id: 'settings', icon: '🛖', left: '16%', top: '75%' },
  { id: 'credits', icon: '🪧', left: '86%', top: '27%' }
]

const DECOS = [
  { emoji: '🌳', left: '8%', top: '50%', size: 3.2 },
  { emoji: '🌲', left: '42%', top: '34%', size: 2.4 },
  { emoji: '🌻', left: '24%', top: '86%', size: 1.9 },
  { emoji: '🌻', left: '70%', top: '84%', size: 1.9 },
  { emoji: '🐔', left: '38%', top: '85%', size: 1.9 },
  { emoji: '🐄', left: '60%', top: '55%', size: 2.3 },
  { emoji: '🦋', left: '56%', top: '30%', size: 1.5 },
  { emoji: '🌾', left: '6%', top: '86%', size: 2 },
  { emoji: '🌾', left: '94%', top: '84%', size: 2 }
]

const CLOUDS = [
  { left: '14%', top: '11%', size: 3.2, dur: 26 },
  { left: '58%', top: '8%', size: 4, dur: 34 },
  { left: '80%', top: '14%', size: 2.8, dur: 30 }
]

export default function FarmMap({ onEscolinha, onShop, onStocks, onAchievements, onSettings, onCredits }) {
  const { state } = useGame()
  const s = useStrings()

  const handlers = {
    escolinha: onEscolinha,
    shop: onShop,
    stocks: onStocks,
    achievements: onAchievements,
    settings: onSettings,
    credits: onCredits
  }

  return (
    <div className="farm-map">
      <div className="farm-sky" />
      <motion.div
        className="farm-sun"
        animate={{ rotate: 360 }}
        transition={{ duration: 140, repeat: Infinity, ease: 'linear' }}
      >
        ☀️
      </motion.div>

      {CLOUDS.map((c, i) => (
        <motion.div
          key={`cloud-${i}`}
          className="farm-cloud"
          style={{ left: c.left, top: c.top, fontSize: `${c.size}rem` }}
          animate={{ x: [0, 36, 0] }}
          transition={{ duration: c.dur, repeat: Infinity, ease: 'easeInOut' }}
        >
          ☁️
        </motion.div>
      ))}

      <div className="farm-hill farm-hill-back" />
      <div className="farm-hill farm-hill-mid" />
      <div className="farm-hill farm-hill-front" />

      <svg className="farm-path" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path d="M 14 80 Q 34 64 50 58 Q 70 50 88 38" className="farm-path-line" />
        <path d="M 14 80 Q 34 64 50 58 Q 70 50 88 38" className="farm-path-dash" />
      </svg>

      {DECOS.map((d, i) => (
        <span
          key={`deco-${i}`}
          className="farm-deco"
          style={{ left: d.left, top: d.top, fontSize: `${d.size}rem` }}
        >
          {d.emoji}
        </span>
      ))}

      <TopHud />

      <motion.div
        className="farm-header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="farm-title">
          <span className="farm-title-mascot">{state.selectedMascot}</span>
          {s.farm.title}
        </h1>
        <p className="farm-subtitle">{s.farm.subtitle}</p>
      </motion.div>

      {SPOTS.map((spot, i) => (
        <motion.button
          key={spot.id}
          className={`farm-spot ${spot.big ? 'farm-spot-big' : ''}`}
          style={{ left: spot.left, top: spot.top }}
          onClick={() => { sound.play('click'); handlers[spot.id]() }}
          onMouseEnter={() => sound.play('hover')}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 + i * 0.1, type: 'spring', damping: 14 }}
          whileHover={{ scale: 1.09, y: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className={`farm-spot-bubble spot-${spot.id}`}>
            <motion.span
              className="farm-spot-emoji"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: i * 0.35 }}
            >
              {spot.icon}
            </motion.span>
          </div>
          <div className="farm-spot-plaque">
            <span className="farm-spot-name">{s.farm[spot.id]}</span>
          </div>
        </motion.button>
      ))}
    </div>
  )
}
