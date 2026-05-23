import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaArrowLeft, FaLock, FaStar, FaBolt } from 'react-icons/fa'
import AnimatedBackground from './AnimatedBackground.jsx'
import TopHud from './TopHud.jsx'
import { PHASES } from '../data/questions.js'
import { sound } from '../utils/sound.js'
import { useGame, MAX_ENERGY, ENERGY_REGEN_MS } from '../context/GameContext.jsx'
import { useStrings, useLanguage, pick } from '../i18n/index.js'
import './EscolinhaScreen.css'

export default function EscolinhaScreen({ onPlayLesson, onBack }) {
  const { state, setPhase, spendEnergy } = useGame()
  const s = useStrings()
  const lang = useLanguage()
  const [noEnergy, setNoEnergy] = useState(false)

  const energy = Math.min(
    MAX_ENERGY,
    state.energy + Math.max(0, Math.floor((Date.now() - state.lastEnergyTs) / ENERGY_REGEN_MS))
  )

  const handleLesson = (i, unlocked) => {
    if (!unlocked) { sound.play('wrong'); return }
    if (energy < 1) { sound.play('wrong'); setNoEnergy(true); return }
    sound.play('click')
    spendEnergy()
    setPhase(i)
    onPlayLesson()
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
            return (
              <motion.button
                key={phase.id}
                className={`lesson-node ${i % 2 === 0 ? 'side-left' : 'side-right'} ${unlocked ? 'unlocked' : 'locked'}`}
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
                {unlocked && (
                  <div className="lesson-cost"><FaBolt /> 1</div>
                )}
              </motion.button>
            )
          })}
        </div>
      </div>

      <AnimatePresence>
        {noEnergy && (
          <motion.div
            className="esc-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setNoEnergy(false)}
          >
            <motion.div
              className="esc-modal"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="esc-modal-icon">⚡</div>
              <h3>{s.escolinha.noEnergyTitle}</h3>
              <p>{s.escolinha.noEnergyMsg}</p>
              <button
                className="esc-modal-btn"
                onClick={() => { sound.play('click'); setNoEnergy(false) }}
              >
                {s.escolinha.noEnergyOk}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
