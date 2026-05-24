import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { sound } from '../utils/sound.js'
import { useStrings } from '../i18n/index.js'
import './Tutorial.css'

export default function Tutorial({ onFinish }) {
  const s = useStrings()
  const steps = s.tutorial.steps
  const [index, setIndex] = useState(0)
  const step = steps[index]
  const isLast = index === steps.length - 1

  const handleNext = useCallback(() => {
    sound.play('click')
    if (isLast) {
      onFinish()
    } else {
      setIndex(i => i + 1)
    }
  }, [isLast, onFinish])

  const handleBack = useCallback(() => {
    sound.play('click')
    setIndex(i => Math.max(0, i - 1))
  }, [])

  const handleSkip = useCallback(() => {
    sound.play('click')
    onFinish()
  }, [onFinish])

  return (
    <motion.div
      className="tutorial-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label={step.title}
    >
      <motion.div
        className="tutorial-card"
        initial={{ scale: 0.85, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 24 }}
        transition={{ type: 'spring', damping: 20, stiffness: 220 }}
      >
        <button
          className="tutorial-skip"
          type="button"
          onClick={handleSkip}
        >
          {s.tutorial.skip} ✕
        </button>

        <div className="tutorial-mascot" aria-hidden="true">
          <motion.span
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            🦜
          </motion.span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            className="tutorial-body"
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            transition={{ duration: 0.25 }}
          >
            <h2 className="tutorial-title">{step.title}</h2>
            <p className="tutorial-text">{step.text}</p>
          </motion.div>
        </AnimatePresence>

        <div className="tutorial-dots">
          {steps.map((_, i) => (
            <span
              key={i}
              className={`tutorial-dot ${i === index ? 'active' : ''}`}
              aria-hidden="true"
            />
          ))}
        </div>

        <div className="tutorial-actions">
          <button
            type="button"
            className="tutorial-btn secondary"
            onClick={handleBack}
            disabled={index === 0}
          >
            {s.tutorial.back}
          </button>
          <button
            type="button"
            className="tutorial-btn primary"
            onClick={handleNext}
          >
            {isLast ? s.tutorial.finish : s.tutorial.next}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
