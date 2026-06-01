import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useStrings, useLanguage } from '../../i18n'
import styles from './RewardModal.module.css'

function pickLang(field, lang) {
  if (!field) return ''
  if (typeof field === 'string') return field
  return field[lang] ?? field.pt ?? ''
}

const ACCENT_TOKEN_MAP = {
  primary:   'var(--color-primary)',
  success:   'var(--color-success)',
  warning:   'var(--color-warning)',
  danger:    'var(--color-danger)',
  secondary: 'var(--color-secondary)',
}

export default function RewardModal({ badge, coinsEarned, onClose }) {
  const s    = useStrings()
  const lang = useLanguage()

  const isOpen      = Boolean(badge)
  const accentColor = badge
    ? (ACCENT_TOKEN_MAP[badge.accentToken] ?? ACCENT_TOKEN_MAP.primary)
    : ACCENT_TOKEN_MAP.primary

  useEffect(() => {
    if (!isOpen) return
    const timer = setTimeout(onClose, 8000)
    return () => clearTimeout(timer)
  }, [isOpen, onClose])

  const modalRoot = document.getElementById('modal-root')
  if (!modalRoot) return null

  return createPortal(
    <AnimatePresence>
      {isOpen && badge && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={styles.modal}
            style={{ '--accent-color': accentColor }}
            initial={{ scale: 0.5, y: 60, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.7, y: 30, opacity: 0 }}
            transition={{ type: 'spring', damping: 14, stiffness: 200, mass: 0.8 }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              className={styles.confetti}
              initial={{ y: -40, opacity: 0 }}
              animate={{ y: 0, opacity: 0.3 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              aria-hidden="true"
            >
              🎊
            </motion.div>

            <h2 className={styles.title}>🎉 {s.rewardModal.title}</h2>
            <p className={styles.subtitle}>{s.rewardModal.subtitle}</p>

            <div className={styles.badgeContainer}>
              <motion.span
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.4, type: 'spring', damping: 12, stiffness: 180 }}
                aria-hidden="true"
              >
                {badge.icon}
              </motion.span>
              <motion.div
                className={styles.badgeHalo}
                animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                aria-hidden="true"
              />
            </div>

            <h3 className={styles.badgeName}>{pickLang(badge.name, lang)}</h3>
            <p className={styles.badgeDesc}>{pickLang(badge.desc, lang)}</p>

            {coinsEarned > 0 && (
              <motion.div
                className={styles.rewardBlock}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.4 }}
              >
                <span className={styles.coinIcon}>🪙</span>
                <span className={styles.coinText}>
                  {s.rewardModal.coinsEarned.replace('{n}', coinsEarned)}
                </span>
              </motion.div>
            )}

            <div className={styles.actions}>
              <button type="button" className={styles.btnPrimary} onClick={onClose}>
                {s.rewardModal.keepGoing} 🎮
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    modalRoot
  )
}
