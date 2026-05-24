import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaClock, FaBookOpen, FaSkullCrossbones, FaLightbulb } from 'react-icons/fa'
import AnimatedBackground from './AnimatedBackground.jsx'
import { PHASES } from '../data/questions.js'
import { sound } from '../utils/sound.js'
import { useGame } from '../context/GameContext.jsx'
import { useStrings, useLanguage, pick } from '../i18n/index.js'
import './ParentsPanel.css'

function formatDuration(totalSeconds) {
  const sec = Math.max(0, Math.floor(totalSeconds || 0))
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

export default function ParentsPanel({ onBack }) {
  const { state } = useGame()
  const s = useStrings()
  const lang = useLanguage()

  const stats = useMemo(() => {
    const results = state.phaseResults || {}
    const entries = Object.entries(results).map(([phase, r]) => ({
      phase: Number(phase),
      ...r
    }))
    const lessonsCompleted = entries.length
    const bossesBeaten = Object.keys(state.bossClears || {}).length

    const weakest = entries
      .filter(e => typeof e.accuracy === 'number')
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 3)

    const suggestions = []
    PHASES.forEach((p, i) => {
      if (i >= state.unlockedPhases) return
      const stars = state.stars[i] || 0
      if (stars < 3) suggestions.push({ idx: i, phase: p, stars })
    })

    return { lessonsCompleted, bossesBeaten, weakest, suggestions: suggestions.slice(0, 3) }
  }, [state])

  return (
    <>
      <AnimatedBackground gradient="linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #1d4ed8 100%)" density={6} />

      <div className="parents-content">
        <motion.button
          className="parents-back-btn"
          onClick={() => { sound.play('click'); onBack() }}
          whileHover={{ scale: 1.05, x: -4 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <FaArrowLeft /> {s.parents.back}
        </motion.button>

        <motion.h1
          className="parents-title"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          👨‍👩‍👧 {s.parents.title}
        </motion.h1>

        <motion.div
          className="parents-dashboard"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="parents-cards">
            <div className="parents-card">
              <div className="parents-card-icon"><FaClock /></div>
              <div className="parents-card-label">{s.parents.timePlayed}</div>
              <div className="parents-card-value">{formatDuration(state.playTimeSec)}</div>
            </div>
            <div className="parents-card">
              <div className="parents-card-icon"><FaBookOpen /></div>
              <div className="parents-card-label">{s.parents.lessonsCompleted}</div>
              <div className="parents-card-value">{stats.lessonsCompleted} / {PHASES.length}</div>
            </div>
            <div className="parents-card">
              <div className="parents-card-icon"><FaSkullCrossbones /></div>
              <div className="parents-card-label">{s.parents.bossesBeaten}</div>
              <div className="parents-card-value">{stats.bossesBeaten} / {PHASES.length}</div>
            </div>
          </div>

          {stats.lessonsCompleted === 0 ? (
            <div className="parents-empty">{s.parents.nothing}</div>
          ) : (
            <>
              <section className="parents-section">
                <h3>📉 {s.parents.weakSubjects}</h3>
                {stats.weakest.length === 0 && (
                  <p className="parents-section-empty">—</p>
                )}
                <ul className="parents-list">
                  {stats.weakest.map(w => {
                    const phase = PHASES[w.phase]
                    if (!phase) return null
                    return (
                      <li key={w.phase} className="parents-list-item">
                        <span className="parents-list-icon">{phase.icon}</span>
                        <span className="parents-list-name">{pick(phase.name, lang)}</span>
                        <span className="parents-list-value">
                          {Math.round((w.accuracy || 0) * 100)}%
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </section>

              <section className="parents-section">
                <h3><FaLightbulb /> {s.parents.suggestions}</h3>
                {stats.suggestions.length === 0 && (
                  <p className="parents-section-empty">—</p>
                )}
                <ul className="parents-list">
                  {stats.suggestions.map(sug => (
                    <li key={sug.idx} className="parents-list-item">
                      <span className="parents-list-icon">{sug.phase.icon}</span>
                      <span className="parents-list-name">
                        {pick(sug.phase.name, lang)}
                      </span>
                      <span className="parents-list-value">
                        {'★'.repeat(sug.stars)}{'☆'.repeat(3 - sug.stars)}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            </>
          )}
        </motion.div>
      </div>
    </>
  )
}
