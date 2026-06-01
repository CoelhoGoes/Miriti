import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  FaArrowLeft,
  FaClock,
  FaBookOpen,
  FaSkullCrossbones,
  FaLightbulb,
  FaStar,
  FaTrophy,
  FaCoins,
  FaBrain,
  FaPrint,
} from 'react-icons/fa'
import AnimatedBackground from './AnimatedBackground.jsx'
import { PHASES } from '../data/questions.js'
import { ACHIEVEMENTS } from '../data/achievements.js'
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

function accuracyColor(acc) {
  if (acc >= 0.9) return 'var(--color-success)'
  if (acc >= 0.7) return 'var(--color-secondary)'
  if (acc >= 0.5) return 'var(--color-warning)'
  return 'var(--color-danger)'
}

function recommendationFor(phase, accuracy, stars) {
  if (stars === 0) {
    return {
      pt: `Pratique a lição "${phase.name.pt}" para consolidar o conceito antes de avançar.`,
      en: `Practice the "${phase.name.en}" lesson before moving on.`
    }
  }
  if (accuracy < 0.7) {
    return {
      pt: `Revise os exemplos de "${phase.name.pt}" e tente o quiz novamente — está a 70% de virar boa fluência.`,
      en: `Revisit examples of "${phase.name.en}" and retry the quiz.`
    }
  }
  if (stars < 3) {
    return {
      pt: `Tente o chefão de "${phase.name.pt}" para ganhar o mascote exclusivo!`,
      en: `Try the "${phase.name.en}" boss for the exclusive mascot!`
    }
  }
  return null
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

    const totalStars = Object.values(state.stars || {}).reduce((a, b) => a + b, 0)
    const maxStars = PHASES.length * 3
    const overallAccuracy = entries.length
      ? entries.reduce((sum, e) => sum + (e.accuracy || 0), 0) / entries.length
      : 0

    const perPhase = PHASES.map((phase, i) => ({
      idx: i,
      phase,
      stars: state.stars?.[i] || 0,
      accuracy: results[i]?.accuracy ?? null,
      correctAnswers: results[i]?.correctAnswers ?? null,
      totalQuestions: results[i]?.totalQuestions ?? null,
      bossBeaten: !!state.bossClears?.[i],
      unlocked: i < (state.unlockedPhases || 1),
    }))

    const weakest = perPhase
      .filter(p => p.accuracy !== null)
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 3)

    const recommendations = perPhase
      .filter(p => p.unlocked)
      .map(p => ({ ...p, rec: recommendationFor(p.phase, p.accuracy ?? 0, p.stars) }))
      .filter(p => p.rec)
      .slice(0, 4)

    const unlockedAch = (state.achievements || []).filter(id =>
      ACHIEVEMENTS.some(a => a.id === id)
    )

    return {
      lessonsCompleted,
      bossesBeaten,
      totalStars,
      maxStars,
      overallAccuracy,
      perPhase,
      weakest,
      recommendations,
      achievementCount: unlockedAch.length,
      achievementTotal: ACHIEVEMENTS.length,
    }
  }, [state])

  const handleBack = () => { sound.play('click'); onBack() }
  const handlePrint = () => { sound.play('click'); window.print() }

  const playerName = state.player?.nickname || ''

  return (
    <>
      <AnimatedBackground gradient="linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #1d4ed8 100%)" density={6} />

      <div className="parents-content">
        <div className="parents-top-row">
          <motion.button
            className="parents-back-btn"
            onClick={handleBack}
            whileHover={{ scale: 1.05, x: -4 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <FaArrowLeft /> {s.parents.back}
          </motion.button>

          <motion.button
            className="parents-print-btn"
            onClick={handlePrint}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <FaPrint /> {s.parents.print}
          </motion.button>
        </div>

        <motion.div
          className="parents-header"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="parents-title">👨‍👩‍👧 {s.parents.title}</h1>
          {playerName && (
            <div className="parents-subtitle">
              {s.parents.childOf} <strong>{playerName}</strong>
            </div>
          )}
        </motion.div>

        <motion.div
          className="parents-dashboard"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* ─── Cartões resumo ─── */}
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
              <div className="parents-card-icon"><FaStar /></div>
              <div className="parents-card-label">{s.parents.starsLabel}</div>
              <div className="parents-card-value">{stats.totalStars} / {stats.maxStars}</div>
            </div>
            <div className="parents-card">
              <div className="parents-card-icon"><FaSkullCrossbones /></div>
              <div className="parents-card-label">{s.parents.bossesBeaten}</div>
              <div className="parents-card-value">{stats.bossesBeaten} / {PHASES.length}</div>
            </div>
            <div className="parents-card">
              <div className="parents-card-icon"><FaBrain /></div>
              <div className="parents-card-label">{s.parents.overallAccuracy}</div>
              <div
                className="parents-card-value"
                style={{ color: accuracyColor(stats.overallAccuracy) }}
              >
                {Math.round(stats.overallAccuracy * 100)}%
              </div>
            </div>
            <div className="parents-card">
              <div className="parents-card-icon"><FaTrophy /></div>
              <div className="parents-card-label">{s.parents.achievementsLabel}</div>
              <div className="parents-card-value">{stats.achievementCount} / {stats.achievementTotal}</div>
            </div>
            <div className="parents-card">
              <div className="parents-card-icon"><FaCoins /></div>
              <div className="parents-card-label">{s.parents.coinsLabel}</div>
              <div className="parents-card-value">{state.coins}</div>
            </div>
          </div>

          {stats.lessonsCompleted === 0 ? (
            <div className="parents-empty">{s.parents.nothing}</div>
          ) : (
            <>
              {/* ─── Detalhe por matéria ─── */}
              <section className="parents-section">
                <h3>📚 {s.parents.bySubject}</h3>
                <ul className="parents-list">
                  {stats.perPhase.map(p => (
                    <li key={p.idx} className="parents-list-item">
                      <span className="parents-list-icon">{p.phase.icon}</span>
                      <div className="parents-list-body">
                        <div className="parents-list-name">{pick(p.phase.name, lang)}</div>
                        <div className="parents-list-meta">
                          {p.accuracy !== null
                            ? `${p.correctAnswers}/${p.totalQuestions} ${s.parents.correct} · `
                            : `${s.parents.notStarted} · `}
                          {p.unlocked ? s.parents.unlocked : s.parents.locked}
                          {p.bossBeaten && ` · 👹 ✓`}
                        </div>
                      </div>
                      <div className="parents-list-right">
                        <span
                          className="parents-list-acc"
                          style={{
                            color: p.accuracy !== null
                              ? accuracyColor(p.accuracy)
                              : 'var(--color-text-secondary)'
                          }}
                        >
                          {p.accuracy !== null
                            ? `${Math.round(p.accuracy * 100)}%`
                            : '—'}
                        </span>
                        <span className="parents-list-stars">
                          {'★'.repeat(p.stars)}{'☆'.repeat(3 - p.stars)}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              {/* ─── Mais fracas ─── */}
              {stats.weakest.length > 0 && (
                <section className="parents-section">
                  <h3>📉 {s.parents.weakSubjects}</h3>
                  <ul className="parents-list">
                    {stats.weakest.map(w => (
                      <li key={w.phase.id} className="parents-list-item">
                        <span className="parents-list-icon">{w.phase.icon}</span>
                        <span className="parents-list-name">{pick(w.phase.name, lang)}</span>
                        <span
                          className="parents-list-value"
                          style={{ color: accuracyColor(w.accuracy) }}
                        >
                          {Math.round(w.accuracy * 100)}%
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* ─── Sugestões personalizadas ─── */}
              {stats.recommendations.length > 0 && (
                <section className="parents-section">
                  <h3><FaLightbulb /> {s.parents.suggestions}</h3>
                  <ul className="parents-list parents-list-recos">
                    {stats.recommendations.map(r => (
                      <li key={r.idx} className="parents-list-item">
                        <span className="parents-list-icon">{r.phase.icon}</span>
                        <span className="parents-list-name">
                          {pick(r.rec, lang)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* ─── Nota pedagógica ─── */}
              <section className="parents-section parents-note">
                <h3>🧭 {s.parents.guideTitle}</h3>
                <p>{s.parents.guideBody}</p>
              </section>
            </>
          )}
        </motion.div>
      </div>
    </>
  )
}
