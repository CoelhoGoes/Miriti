import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FaStar, FaCoins, FaRedo, FaForward, FaTrophy } from 'react-icons/fa'
import AnimatedBackground from './AnimatedBackground.jsx'
import Confetti from './Confetti.jsx'
import { sound } from '../utils/sound.js'
import { PHASES } from '../data/questions.js'
import { useStrings, useLanguage, pick } from '../i18n/index.js'
import './ResultScreen.css'

const COLORS = ['#ec4899', '#f59e0b', '#3b82f6', '#10b981']

function getStars(correct, total) {
  const pct = total > 0 ? correct / total : 0
  if (pct >= 0.9) return 3
  if (pct >= 0.7) return 2
  if (pct >= 0.5) return 1
  return 0
}

/** Conta de 0 até target com requestAnimationFrame. */
function useCountUp(target, duration = 1200, delay = 0) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    const safeTarget = Number.isFinite(target) ? target : 0
    if (safeTarget <= 0) {
      setValue(safeTarget)
      return
    }
    let raf = null
    let startTime = null

    const step = (now) => {
      if (startTime === null) startTime = now
      const progress = Math.min((now - startTime) / duration, 1)
      setValue(Math.floor(progress * safeTarget))
      if (progress < 1) {
        raf = requestAnimationFrame(step)
      } else {
        setValue(safeTarget)
      }
    }

    const timer = setTimeout(() => {
      raf = requestAnimationFrame(step)
    }, delay)

    return () => {
      clearTimeout(timer)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [target, duration, delay])

  return value
}

export default function ResultScreen({ result, onContinue, onPlayAgain }) {
  const s = useStrings()
  const lang = useLanguage()

  const handlePlayAgain = () => {
    sound.play('click')
    onPlayAgain()
  }

  const correctAnswers = result?.correctAnswers ?? 0
  const totalQuestions = result?.totalQuestions ?? 0
  const earnedCoins = result?.earnedCoins ?? 0
  const phaseData = PHASES[result?.phase]
  const phaseName = phaseData ? pick(phaseData.name, lang) : 'Miriti'
  const phaseIcon = phaseData ? phaseData.icon : '🌳'

  const stars = getStars(correctAnswers, totalQuestions)
  const color = COLORS[stars]
  const title = s.result.titles[stars]
  const message = s.result.messages[stars]
  const percentage = totalQuestions > 0
    ? Math.round((correctAnswers / totalQuestions) * 100)
    : 0

  const [showConfetti, setShowConfetti] = useState(false)
  const [shownStars, setShownStars] = useState(0)

  const pctValue = useCountUp(percentage, 1400, 600)
  const coinValue = useCountUp(earnedCoins, 1100, 1000)

  useEffect(() => {
    if (stars > 0) setShowConfetti(true)

    const timers = []
    for (let i = 0; i < stars; i++) {
      timers.push(setTimeout(() => {
        sound.play('star')
        setShownStars(v => v + 1)
      }, 800 + i * 400))
    }
    return () => timers.forEach(clearTimeout)
  }, [stars])

  return (
    <>
      <AnimatedBackground gradient="linear-gradient(135deg, #fde047 0%, #4ade80 50%, #16a34a 100%)" density={12} />
      {showConfetti && <Confetti count={stars === 3 ? 100 : 50} />}

      <div className="result-content">
        <motion.div
          className="result-complete-badge"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          {s.result.completed}
        </motion.div>

        <motion.div
          className="result-title"
          initial={{ opacity: 0, scale: 0.3, y: -50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.1 }}
        >
          {title}
        </motion.div>

        <motion.div
          className="result-phase-badge"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span>{phaseIcon}</span>
          {phaseName}
        </motion.div>

        {/* Estrelas */}
        <div className="result-stars">
          {[0, 1, 2].map(i => {
            const earned = i < shownStars
            return (
              <motion.div
                key={i}
                className={`result-star ${earned ? 'earned' : ''}`}
                initial={{ opacity: 0.3, scale: 0.7 }}
                animate={earned
                  ? { opacity: 1, scale: [0.5, 1.4, 1], rotate: [0, 360] }
                  : { opacity: 0.3, scale: 0.7 }}
                transition={{ duration: 0.6, type: 'spring' }}
              >
                <FaStar />
              </motion.div>
            )
          })}
        </div>

        {/* Card de stats */}
        <motion.div
          className="result-card"
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', damping: 16 }}
        >
          <div className="result-stat-row">
            <div className="result-stat">
              <div className="stat-label">{s.result.statHits}</div>
              <div className="stat-value">{correctAnswers}/{totalQuestions}</div>
            </div>
            <div className="result-stat">
              <div className="stat-label">{s.result.statAccuracy}</div>
              <div className="stat-value" style={{ color }}>
                {pctValue}%
              </div>
            </div>
            <div className="result-stat">
              <div className="stat-label">{s.result.statCoins}</div>
              <div className="stat-value coin-stat">
                <FaCoins />
                +{coinValue}
              </div>
            </div>
          </div>

          <motion.div
            className="result-message"
            style={{
              background: `linear-gradient(135deg, ${color}22, ${color}11)`,
              borderColor: color
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            {message}
          </motion.div>

          {/* Troféu desbloqueado se 3 estrelas */}
          {stars === 3 && (
            <motion.div
              className="trophy-unlock"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.6, type: 'spring', stiffness: 150 }}
            >
              <FaTrophy className="trophy-icon" />
              <div>
                <div className="trophy-label">{s.result.trophyLabel}</div>
                <div className="trophy-name">{s.result.trophyName(phaseName)}</div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Botões */}
        <motion.div
          className="result-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
        >
          <motion.button
            className="result-btn result-btn-secondary"
            onClick={handlePlayAgain}
            onMouseEnter={() => sound.play('hover')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaRedo /> {s.result.tryAgain}
          </motion.button>
          <motion.button
            className="result-btn result-btn-primary"
            onClick={() => { sound.play('click'); onContinue() }}
            onMouseEnter={() => sound.play('hover')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {s.result.backToMap}
            <FaForward />
          </motion.button>
        </motion.div>
      </div>
    </>
  )
}
