import { useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useStrings } from '../i18n'
import { useGame } from '../context/GameContext'
import styles from './LogoutModal.module.css'

export default function LogoutModal({ isOpen, onClose }) {
  const s = useStrings()
  const { state, logout } = useGame()

  const [copied, setCopied]               = useState(false)
  const [confirmed, setConfirmed]         = useState(false)
  const [showingGoodbye, setShowingGoodbye] = useState(false)

  const recoveryCode = state.player?.recoveryCode
  const nickname     = state.player?.nickname

  const modalRoot = document.getElementById('modal-root')
  if (!modalRoot) return null

  const handleCopy = async () => {
    if (!recoveryCode) return
    try {
      await navigator.clipboard.writeText(recoveryCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('[LogoutModal] clipboard:', err)
    }
  }

  const handleConfirm = () => {
    if (!confirmed) return
    setShowingGoodbye(true)
    setTimeout(() => {
      logout()
      onClose()
    }, 1500)
  }

  const handleCancel = () => {
    setCopied(false)
    setConfirmed(false)
    setShowingGoodbye(false)
    onClose()
  }

  const goodbyeText = s.logout.goodbye.replace('{nickname}', nickname ?? '')

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleCancel}
        >
          <motion.div
            className={styles.modal}
            initial={{ scale: 0.7, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.7, y: 40, opacity: 0 }}
            transition={{ type: 'spring', damping: 18, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
          >
            {showingGoodbye ? (
              <>
                <motion.div
                  className={styles.cofrinho}
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 1.2 }}
                >
                  🐷
                </motion.div>
                <p className={styles.goodbye}>{goodbyeText}</p>
              </>
            ) : (
              <>
                <motion.div
                  className={styles.cofrinho}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  🐷
                </motion.div>

                <h2 className={styles.title}>{s.logout.modalTitle}</h2>
                <p className={styles.subtitle}>{s.logout.cofrinhoSays}</p>

                {recoveryCode && (
                  <div className={styles.codeBox}>
                    <p className={styles.codeLabel}>{s.logout.yourCode}</p>
                    <p className={styles.code}>{recoveryCode}</p>
                    <button
                      type="button"
                      className={styles.copyButton}
                      onClick={handleCopy}
                    >
                      {copied ? s.logout.copied : `📋 ${s.logout.copyCode}`}
                    </button>
                  </div>
                )}

                <p className={styles.warning}>⚠️ {s.logout.whyImportant}</p>

                <label className={styles.checkboxRow}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                  />
                  <span className={styles.checkboxLabel}>
                    {s.logout.confirmCheckbox}
                  </span>
                </label>

                <div className={styles.actions}>
                  <button
                    type="button"
                    className={`${styles.actionButton} ${styles.cancelButton}`}
                    onClick={handleCancel}
                  >
                    {s.logout.cancel}
                  </button>
                  <button
                    type="button"
                    className={`${styles.actionButton} ${styles.confirmButton}`}
                    onClick={handleConfirm}
                    disabled={!confirmed}
                  >
                    {s.logout.confirmLogout}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    modalRoot
  )
}
