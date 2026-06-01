import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaArrowLeft, FaSkullCrossbones } from 'react-icons/fa'
import AnimatedBackground from './AnimatedBackground.jsx'
import QuestionCard from './QuestionCard.jsx'
import ProgressBar from './ProgressBar.jsx'
import Confetti from './Confetti.jsx'
import { PHASES } from '../data/questions.js'
import { getBossQuestions, BOSS_MASCOTS, BOSS_PASS_RATIO } from '../data/bossQuiz.js'
import { sound } from '../utils/sound.js'
import { useGame } from '../context/GameContext.jsx'
import { useStrings, useLanguage, pick } from '../i18n/index.js'
import './BossQuiz.css'

export default function BossQuiz({ phaseIndex, onExit }) {
  const { state, completeBoss } = useGame()
  const s = useStrings()
  const lang = useLanguage()
  const phase = PHASES[phaseIndex]
  const sessionSeed = useMemo(() => Math.floor(Math.random() * 1e9), [phaseIndex, lang])
  const questions = useMemo(
    () => getBossQuestions(phaseIndex, lang, sessionSeed),
    [phaseIndex, lang, sessionSeed]
  )

  const [currentIndex, setCurrentIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [finished, setFinished] = useState(false)
  const [confirmQuit, setConfirmQuit] = useState(false)

  const total = questions.length
  const question = questions[currentIndex]
  const mascot = BOSS_MASCOTS[phaseIndex]
  const alreadyWon = !!state.bossClears[phaseIndex]

  const handleAnswer = (correct) => {
    const newCorrect = correctCount + (correct ? 1 : 0)
    if (correct) setCorrectCount(newCorrect)

    if (currentIndex + 1 >= total) {
      const accuracy = total > 0 ? newCorrect / total : 0
      const won = accuracy >= BOSS_PASS_RATIO
      if (won) {
        sound.play('victory_grand')
        completeBoss({ phase: phaseIndex, mascot, accuracy })
      } else {
        sound.play('wrong')
      }
      setFinished({ won, accuracy, correct: newCorrect })
    } else {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handleRetry = () => {
    sound.play('click')
    setCurrentIndex(0)
    setCorrectCount(0)
    setFinished(false)
  }

  const handleExit = () => {
    sound.play('click')
    onExit()
  }

  return (
    <>
      <AnimatedBackground gradient="linear-gradient(135deg, #1f2937 0%, #7c2d12 50%, #b91c1c 100%)" density={6} />

      <div className="boss-quiz-content">
        <div className="boss-topbar">
          <motion.button
            className="boss-quit-btn"
            onClick={() => { sound.play('click'); setConfirmQuit(true) }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={s.common.back}
          >
            <FaArrowLeft />
          </motion.button>

          <div className="boss-phase-info">
            <FaSkullCrossbones className="boss-skull" />
            <div>
              <div className="boss-label">{s.boss.title}</div>
              <div className="boss-name">{pick(phase.name, lang)}</div>
            </div>
          </div>

          <div className="boss-mascot-target" aria-label="Mascote-prêmio">
            <span>{mascot}</span>
          </div>
        </div>

        {!finished && (
          <>
            <div className="boss-progress-row">
              <ProgressBar
                value={currentIndex + 1}
                max={total}
                label={s.boss.progress(currentIndex + 1, total)}
                color="#fbbf24"
              />
            </div>

            <AnimatePresence mode="wait">
              <QuestionCard
                key={question.id}
                question={question}
                questionNumber={currentIndex + 1}
                totalQuestions={total}
                onAnswer={handleAnswer}
              />
            </AnimatePresence>
          </>
        )}

        {finished && (
          <motion.div
            className="boss-result"
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', damping: 16 }}
          >
            {finished.won && <Confetti count={120} />}
            <div className="boss-result-emoji" aria-hidden="true">
              {finished.won ? mascot : '😅'}
            </div>
            <h2>{finished.won ? s.boss.wonTitle : s.boss.lostTitle}</h2>
            <p>{finished.won ? s.boss.wonMsg : s.boss.lostMsg}</p>
            <div className="boss-result-stats">
              {finished.correct} / {total} ·{' '}
              {Math.round(finished.accuracy * 100)}%
            </div>
            <div className="boss-result-actions">
              <button
                className="boss-btn secondary"
                onClick={handleRetry}
              >
                {s.boss.retry}
              </button>
              <button
                className="boss-btn primary"
                onClick={handleExit}
              >
                {s.boss.done}
              </button>
            </div>
            {alreadyWon && !finished.won && (
              <div className="boss-already-note">{s.boss.alreadyWon} ✅</div>
            )}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {confirmQuit && (
          <motion.div
            className="boss-confirm-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setConfirmQuit(false)}
          >
            <motion.div
              className="boss-confirm-box"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>{s.quiz.quitTitle}</h3>
              <p>{s.quiz.quitMessage}</p>
              <div className="boss-confirm-actions">
                <button
                  className="boss-btn secondary"
                  onClick={() => { sound.play('click'); setConfirmQuit(false) }}
                >
                  {s.quiz.quitKeep}
                </button>
                <button className="boss-btn danger" onClick={handleExit}>
                  {s.quiz.quitConfirm}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
