/* eslint-disable react/prop-types */
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaArrowLeft } from 'react-icons/fa'
import { useGame } from '../../context/GameContext'
import { useStrings, useLanguage } from '../../i18n'
import { getArcadeQuestion } from '../../data/arcadeQuestions'
import { getArcadeReward } from '../../data/arcadeConfig'
import { sound } from '../../utils/sound'
import styles from './ArcadeQuizScreen.module.css'

const QUESTIONS_PER_VISIT = 3

function pickQuestions(usedIds) {
  const picked = []
  const usedInSession = [...usedIds]
  for (let i = 0; i < QUESTIONS_PER_VISIT; i++) {
    const q = getArcadeQuestion(usedInSession)
    picked.push(q)
    usedInSession.push(q.id)
  }
  return picked
}

function pickLang(field, lang) {
  if (!field) return ''
  if (typeof field === 'string') return field
  return field[lang] ?? field.pt ?? ''
}

export default function ArcadeQuizScreen({ onFinish }) {
  const { state, earnArcadeCoins, useArcadeQuestion: markArcadeQuestionUsed } = useGame()
  const s = useStrings()
  const lang = useLanguage()

  const usedIds = state.arcade?.usedQuestionIds ?? []
  const arcadeCoins = state.arcade?.coins ?? 0

  // Escolhe as 3 perguntas no início desta visita
  const questions = useMemo(() => pickQuestions(usedIds), []) // eslint-disable-line react-hooks/exhaustive-deps

  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null) // id da opção selecionada
  const [answered, setAnswered] = useState(false)

  const question = questions[index]
  const questionReward = getArcadeReward(question)
  const isLast = index === questions.length - 1
  const progressPct = ((index + (answered ? 1 : 0)) / questions.length) * 100

  const handleSelect = (opt) => {
    if (answered) return
    setSelected(opt.id)
    setAnswered(true)

    if (opt.correct) {
      sound.play('correct')
      earnArcadeCoins(questionReward)
    } else {
      sound.play('wrong')
    }

    markArcadeQuestionUsed(question.id)
  }

  const handleNext = () => {
    if (isLast) {
      onFinish()
      return
    }
    setIndex(i => i + 1)
    setSelected(null)
    setAnswered(false)
  }

  const optionClass = (opt) => {
    if (!answered) return styles.option
    if (opt.correct) return `${styles.option} ${styles.optionCorrect}`
    if (opt.id === selected) return `${styles.option} ${styles.optionWrong}`
    return `${styles.option} ${styles.optionDisabled}`
  }

  const isCorrect = answered && question.options.find(o => o.id === selected)?.correct

  return (
    <motion.div
      className={styles.wrapper}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className={styles.header}>
        <button
          type="button"
          className={styles.backBtn}
          onClick={onFinish}
          aria-label={s.common.back}
        >
          <FaArrowLeft />
        </button>
        <span className={styles.headerTitle}>{s.arcade.quizTitle}</span>
        <div className={styles.coinsBadge}>
          <span aria-hidden="true">🪙</span>
          <span>{arcadeCoins}</span>
        </div>
      </div>

      {/* Progress */}
      <div className={styles.progress}>
        <span className={styles.progressText}>
          {s.arcade.quizProgress.replace('{n}', index + 1).replace('{total}', questions.length)}
        </span>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      {/* Body */}
      <div className={styles.body}>
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            className={styles.questionCard}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <p className={styles.questionText}>{pickLang(question.question, lang)}</p>
          </motion.div>
        </AnimatePresence>

        <div className={styles.options}>
          {question.options.map(opt => (
            <button
              key={opt.id}
              type="button"
              className={optionClass(opt)}
              onClick={() => handleSelect(opt)}
              disabled={answered}
            >
              {pickLang(opt.text, lang)}
            </button>
          ))}
        </div>

        <AnimatePresence>
          {answered && (
            <motion.div
              className={`${styles.feedback} ${isCorrect ? styles.feedbackCorrect : styles.feedbackWrong}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div>
                {isCorrect
                  ? s.arcade.quizCorrect.replace('{coins}', questionReward)
                  : s.arcade.quizWrong}
              </div>
              <div className={styles.explanation}>
                {pickLang(question.explanation, lang)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {answered && (
          <motion.button
            type="button"
            className={styles.nextBtn}
            onClick={handleNext}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {isLast ? s.arcade.quizFinish : s.arcade.quizNext}
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}
