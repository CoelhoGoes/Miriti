import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaArrowLeft, FaCoins, FaLightbulb } from 'react-icons/fa'
import AnimatedBackground from './AnimatedBackground.jsx'
import QuestionCard from './QuestionCard.jsx'
import ProgressBar from './ProgressBar.jsx'
import { PHASES, getQuestions } from '../data/questions.js'
import { sound } from '../utils/sound.js'
import { useGame } from '../context/GameContext.jsx'
import { useStrings, useLanguage, pick } from '../i18n/index.js'
import './QuizScreen.css'

export default function QuizScreen({ onComplete, onQuit }) {
  const { state, completePhase, useHint } = useGame()
  const s = useStrings()
  const lang = useLanguage()
  const phase = PHASES[state.currentPhase]
  const questions = getQuestions(state.currentPhase, lang)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [earnedCoins, setEarnedCoins] = useState(0)
  const [confirmQuit, setConfirmQuit] = useState(false)
  const [eliminated, setEliminated] = useState([])
  const [answered, setAnswered] = useState(false)

  const total = questions.length
  const question = questions[currentIndex]
  const hints = state.inventory.hint || 0

  const handleAnswer = (correct) => {
    let newCorrect = correctCount
    let newCoins = earnedCoins
    if (correct) {
      newCorrect++
      newCoins += 5
      setCorrectCount(newCorrect)
      setEarnedCoins(newCoins)
    }

    if (currentIndex + 1 >= total) {
      sound.play('victory')
      const result = {
        phase: state.currentPhase,
        correctAnswers: newCorrect,
        totalQuestions: total,
        earnedCoins: newCoins
      }
      completePhase(result)
      onComplete(result)
    } else {
      setCurrentIndex(currentIndex + 1)
      setEliminated([])
      setAnswered(false)
    }
  }

  const handleHint = () => {
    if (answered || eliminated.length > 0 || hints <= 0) return
    sound.play('pop')
    useHint()
    const wrong = question.options.map((_, i) => i).filter(i => i !== question.correct)
    for (let i = wrong.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[wrong[i], wrong[j]] = [wrong[j], wrong[i]]
    }
    setEliminated(wrong.slice(0, 2))
  }

  const handleQuit = () => {
    sound.play('click')
    onQuit()
  }

  const hintDisabled = answered || eliminated.length > 0 || hints <= 0

  return (
    <>
      <AnimatedBackground gradient={phase.gradient} density={6} />

      <div className="quiz-content">
        <div className="quiz-topbar">
          <motion.button
            className="quiz-quit-btn"
            onClick={() => { sound.play('click'); setConfirmQuit(true) }}
            onMouseEnter={() => sound.play('hover')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaArrowLeft />
          </motion.button>

          <div className="quiz-phase-info">
            <div className="quiz-phase-icon">{phase.icon}</div>
            <div className="quiz-phase-text">
              <div className="quiz-phase-label">{s.quiz.phaseLabel(state.currentPhase + 1)}</div>
              <div className="quiz-phase-name">{pick(phase.name, lang)}</div>
            </div>
          </div>

          <div className="quiz-coins">
            <FaCoins />
            <span>+{earnedCoins}</span>
          </div>
        </div>

        <div className="quiz-progress-row">
          <div className="quiz-progress">
            <ProgressBar value={currentIndex + 1} max={total} label={s.quiz.progress} color="#fbbf24" />
          </div>
          <motion.button
            className={`quiz-hint-btn ${hintDisabled ? 'disabled' : ''}`}
            onClick={handleHint}
            onMouseEnter={() => !hintDisabled && sound.play('hover')}
            disabled={hintDisabled}
            whileHover={!hintDisabled ? { scale: 1.05 } : {}}
            whileTap={!hintDisabled ? { scale: 0.95 } : {}}
          >
            <FaLightbulb />
            <span>{hints > 0 ? `${s.quiz.hint} (${hints})` : s.quiz.noHints}</span>
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          <QuestionCard
            key={question.id}
            question={question}
            questionNumber={currentIndex + 1}
            totalQuestions={total}
            onAnswer={handleAnswer}
            onSelect={() => setAnswered(true)}
            eliminated={eliminated}
          />
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {confirmQuit && (
          <motion.div
            className="quiz-confirm-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setConfirmQuit(false)}
          >
            <motion.div
              className="quiz-confirm-box"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <h3>{s.quiz.quitTitle}</h3>
              <p>{s.quiz.quitMessage}</p>
              <div className="confirm-actions">
                <button
                  className="confirm-btn confirm-cancel"
                  onClick={() => { sound.play('click'); setConfirmQuit(false) }}
                >
                  {s.quiz.quitKeep}
                </button>
                <button className="confirm-btn confirm-ok" onClick={handleQuit}>
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
