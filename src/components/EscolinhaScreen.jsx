import { motion } from 'framer-motion'
import { FaArrowLeft, FaLock, FaStar, FaSkullCrossbones } from 'react-icons/fa'
import AnimatedBackground from './AnimatedBackground.jsx'
import TopHud from './TopHud.jsx'
import { PHASES } from '../data/questions.js'
import { BOSS_MASCOTS } from '../data/bossQuiz.js'
import { sound } from '../utils/sound.js'
import { useGame } from '../context/GameContext.jsx'
import { useStrings, useLanguage, pick } from '../i18n/index.js'
import './EscolinhaScreen.css'

export default function EscolinhaScreen({ onPlayLesson, onBack, onPlayBoss }) {
  const { state, setPhase } = useGame()
  const s = useStrings()
  const lang = useLanguage()

  const handleLesson = (i, unlocked) => {
    if (!unlocked) { sound.play('wrong'); return }
    sound.play('click')
    setPhase(i)
    onPlayLesson()
  }

  const handleBoss = (i, unlocked, hasStars) => {
    if (!unlocked || !hasStars) { sound.play('wrong'); return }
    sound.play('click')
    if (onPlayBoss) onPlayBoss(i)
  }

  return (
    <>
      <AnimatedBackground gradient="linear-gradient(135deg, #38bdf8 0%, #22c55e 60%, #15803d 100%)" density={7} />
      <TopHud />

      <div className="escolinha-content">
        <motion.button
          className="esc-back-btn"
          onClick={() => { sound.play('click'); onBack() }}
          onMouseEnter={() => sound.play('hover')}
          whileHover={{ scale: 1.05, x: -4 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <FaArrowLeft /> {s.common.back}
        </motion.button>

        <motion.h1
          className="esc-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          🏫 {s.escolinha.title}
        </motion.h1>
        <motion.p
          className="esc-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          {s.escolinha.subtitle}
        </motion.p>

        <div className="esc-trail">
          {PHASES.map((phase, i) => {
            const unlocked = i < state.unlockedPhases
            const stars = state.stars[i] || 0
            const bossUnlocked = unlocked && stars > 0
            const bossBeaten = !!state.bossClears[i]
            const bossMascot = BOSS_MASCOTS[i]
            return (
              <div key={phase.id} className={`lesson-row ${i % 2 === 0 ? 'side-left' : 'side-right'}`}>
                <motion.button
                  className={`lesson-node ${unlocked ? 'unlocked' : 'locked'}`}
                  onClick={() => handleLesson(i, unlocked)}
                  onMouseEnter={() => unlocked && sound.play('hover')}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.1, type: 'spring', damping: 15 }}
                  whileHover={unlocked ? { scale: 1.05 } : {}}
                  whileTap={unlocked ? { scale: 0.96 } : {}}
                >
                  <div className="lesson-bubble" style={{ background: phase.gradient }}>
                    <span className="lesson-emoji">{phase.icon}</span>
                    {!unlocked && <span className="lesson-lock"><FaLock /></span>}
                  </div>
                  <div className="lesson-info">
                    <div className="lesson-num">{s.escolinha.lessonLabel(i + 1)}</div>
                    <div className="lesson-name">{pick(phase.name, lang)}</div>
                    {unlocked ? (
                      <div className="lesson-stars">
                        {[0, 1, 2].map(st => (
                          <FaStar key={st} className={`lesson-star ${st < stars ? 'earned' : ''}`} />
                        ))}
                      </div>
                    ) : (
                      <div className="lesson-locked-text">{s.escolinha.locked}</div>
                    )}
                  </div>
                </motion.button>

                <motion.button
                  type="button"
                  className={`boss-node ${bossUnlocked ? 'unlocked' : 'locked'} ${bossBeaten ? 'beaten' : ''}`}
                  onClick={() => handleBoss(i, unlocked, stars > 0)}
                  onMouseEnter={() => bossUnlocked && sound.play('hover')}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1, type: 'spring', damping: 16 }}
                  whileHover={bossUnlocked ? { scale: 1.06, rotate: -3 } : {}}
                  whileTap={bossUnlocked ? { scale: 0.95 } : {}}
                  title={bossUnlocked ? s.boss.title : s.boss.locked}
                  aria-label={bossUnlocked ? `${s.boss.title}: ${pick(phase.name, lang)}` : s.boss.locked}
                >
                  <span className="boss-node-icon" aria-hidden="true">
                    {bossBeaten ? bossMascot : '👹'}
                  </span>
                  <span className="boss-node-label">{s.boss.title}</span>
                  {!bossUnlocked && <span className="boss-node-lock"><FaLock /></span>}
                  {bossUnlocked && !bossBeaten && (
                    <FaSkullCrossbones className="boss-node-skull" />
                  )}
                </motion.button>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
