import { useState, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { FaTimes } from 'react-icons/fa'
import { sound } from '../utils/sound.js'
import { useGame } from '../context/GameContext.jsx'
import { useStrings, useLanguage } from '../i18n/index.js'
import { MASCOT_STORIES } from '../data/mascotStories.js'
import './MascotChat.css'

function pickIndex(prevIndex) {
  if (MASCOT_STORIES.length <= 1) return 0
  let i = Math.floor(Math.random() * MASCOT_STORIES.length)
  if (i === prevIndex) i = (i + 1) % MASCOT_STORIES.length
  return i
}

export default function MascotChat({ onClose }) {
  const { state } = useGame()
  const s = useStrings()
  const lang = useLanguage()
  const initial = useMemo(() => Math.floor(Math.random() * MASCOT_STORIES.length), [])
  const [index, setIndex] = useState(initial)

  const story = MASCOT_STORIES[index]?.[lang] || MASCOT_STORIES[index]?.pt || ''

  const handleAnother = useCallback(() => {
    sound.play('pop')
    setIndex(prev => pickIndex(prev))
  }, [])

  const handleClose = useCallback(() => {
    sound.play('click')
    onClose()
  }, [onClose])

  return (
    <motion.div
      className="mascot-chat-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label={s.mascot.title}
    >
      <motion.div
        className="mascot-chat-box"
        initial={{ scale: 0.7, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.7, opacity: 0, y: 30 }}
        transition={{ type: 'spring', damping: 18, stiffness: 200 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="mascot-chat-close"
          onClick={handleClose}
          aria-label={s.common.close}
        >
          <FaTimes />
        </button>

        <div className="mascot-chat-mascot" aria-hidden="true">
          <motion.span
            animate={{ rotate: [-4, 4, -4] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            {state.selectedMascot}
          </motion.span>
        </div>

        <h2 className="mascot-chat-title">{s.mascot.title}</h2>
        <p className="mascot-chat-subtitle">{s.mascot.subtitle}</p>

        <div className="mascot-chat-bubble" aria-live="polite">
          {story}
        </div>

        <div className="mascot-chat-actions">
          <button
            type="button"
            className="mascot-chat-btn secondary"
            onClick={handleAnother}
          >
            🔄 {s.mascot.another}
          </button>
          <button
            type="button"
            className="mascot-chat-btn primary"
            onClick={handleClose}
          >
            {s.mascot.gotIt}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
