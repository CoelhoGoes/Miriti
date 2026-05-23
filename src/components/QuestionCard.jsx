import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCheck, FaTimes, FaArrowRight, FaLightbulb } from 'react-icons/fa'
import { sound } from '../utils/sound.js'
import { useStrings } from '../i18n/index.js'
import './QuestionCard.css'

const LETTERS = ['A', 'B', 'C', 'D']

export default function QuestionCard({ question, questionNumber, totalQuestions, onAnswer, eliminated = [], onSelect }) {
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  const s = useStrings()

  // Reset quando muda a pergunta
  useEffect(() => {
    setSelected(null)
    setAnswered(false)
  }, [question.id])

  const handleSelect = (index) => {
    if (answered || eliminated.includes(index)) return
    setSelected(index)
    setAnswered(true)
    if (onSelect) onSelect()
    const correct = index === question.correct
    if (correct) {
      sound.play('correct')
      sound.play('coin')
    } else {
      sound.play('wrong')
    }
  }

  const handleNext = () => {
    sound.play('click')
    const correct = selected === question.correct
    onAnswer(correct)
  }

  const isCorrect = selected === question.correct

  return (
    <motion.div
      className="question-card"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -30, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      key={question.id}
    >
      <div className="question-number-badge">
        {s.question.counter(questionNumber, totalQuestions)}
      </div>

      <h2 className="question-text">{question.question}</h2>

      <div className="options-grid">
        {question.options.map((option, i) => {
          const isSelected = selected === i
          const isEliminated = eliminated.includes(i)
          const isAnsweredCorrect = answered && i === question.correct
          const isAnsweredWrong = answered && isSelected && i !== question.correct
          const showAsDisabled = answered && !isSelected && i !== question.correct

          let stateClass = ''
          if (isEliminated && !answered) stateClass = 'option-eliminated'
          else if (isAnsweredCorrect) stateClass = 'option-correct'
          else if (isAnsweredWrong) stateClass = 'option-wrong'
          else if (showAsDisabled) stateClass = 'option-dimmed'

          const locked = answered || isEliminated

          return (
            <motion.button
              key={i}
              className={`option-btn ${stateClass}`}
              onClick={() => handleSelect(i)}
              onMouseEnter={() => !locked && sound.play('hover')}
              disabled={locked}
              whileHover={!locked ? { scale: 1.03, y: -2 } : {}}
              whileTap={!locked ? { scale: 0.97 } : {}}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
            >
              <div className="option-letter">{LETTERS[i]}</div>
              <div className="option-text">{option}</div>
              <div className="option-icon">
                {isAnsweredCorrect && <FaCheck />}
                {isAnsweredWrong && <FaTimes />}
              </div>
            </motion.button>
          )
        })}
      </div>

      <AnimatePresence>
        {answered && (
          <motion.div
            className={`explanation-box ${isCorrect ? 'explanation-correct' : 'explanation-wrong'}`}
            initial={{ opacity: 0, height: 0, y: 20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="explanation-header">
              <FaLightbulb className="explanation-icon" />
              <span>{isCorrect ? s.question.correct : s.question.wrong}</span>
            </div>
            <p className="explanation-text">{question.explanation}</p>
            <motion.button
              className="next-btn"
              onClick={handleNext}
              onMouseEnter={() => sound.play('hover')}
              whileHover={{ scale: 1.05, x: 4 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {questionNumber === totalQuestions ? s.question.seeResult : s.question.next}
              <FaArrowRight />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
