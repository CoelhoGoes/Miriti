import { motion } from 'framer-motion'
import { FaArrowLeft, FaLock } from 'react-icons/fa'
import AnimatedBackground from './AnimatedBackground.jsx'
import TopHud from './TopHud.jsx'
import { ACHIEVEMENTS } from '../data/achievements.js'
import { sound } from '../utils/sound.js'
import { useGame } from '../context/GameContext.jsx'
import { useStrings, useLanguage, pick } from '../i18n/index.js'
import './AchievementsScreen.css'

export default function AchievementsScreen({ onBack }) {
  const { state } = useGame()
  const s = useStrings()
  const lang = useLanguage()

  const unlockedCount = ACHIEVEMENTS.filter(a => state.achievements.includes(a.id)).length

  return (
    <>
      <AnimatedBackground gradient="linear-gradient(135deg, #fde047 0%, #f59e0b 55%, #b45309 100%)" density={7} />
      <TopHud />

      <div className="ach-content">
        <motion.button
          className="ach-back-btn"
          onClick={() => { sound.play('click'); onBack() }}
          onMouseEnter={() => sound.play('hover')}
          whileHover={{ scale: 1.05, x: -4 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <FaArrowLeft /> {s.common.back}
        </motion.button>

        <motion.h1 className="ach-title" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          {s.achievements.title}
        </motion.h1>
        <p className="ach-subtitle">{s.achievements.subtitle}</p>
        <div className="ach-progress-badge">
          {s.achievements.progress(unlockedCount, ACHIEVEMENTS.length)}
        </div>

        <div className="ach-grid">
          {ACHIEVEMENTS.map((a, i) => {
            const unlocked = state.achievements.includes(a.id)
            return (
              <motion.div
                key={a.id}
                className={`ach-card ${unlocked ? 'unlocked' : 'locked'}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.05 }}
              >
                <div className="ach-card-icon">
                  {unlocked ? a.icon : <FaLock />}
                </div>
                <div className="ach-card-name">{pick(a.name, lang)}</div>
                <div className="ach-card-desc">
                  {unlocked ? pick(a.desc, lang) : s.achievements.locked}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </>
  )
}
