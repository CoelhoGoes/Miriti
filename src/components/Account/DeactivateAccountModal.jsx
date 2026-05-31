import { useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useStrings } from '../../i18n'
import { useGame } from '../../context/GameContext'
import { deactivateAccount } from '../../lib/api/players'
import styles from './Account.module.css'

export default function DeactivateAccountModal({ isOpen, onClose }) {
  const s = useStrings()
  const { state, logout } = useGame()

  const [copied, setCopied]           = useState(false)
  const [confirmed, setConfirmed]     = useState(false)
  const [processing, setProcessing]   = useState(false)
  const [errorMsg, setErrorMsg]       = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const recoveryCode = state.player?.recoveryCode
  const playerId     = state.player?.id

  const modalRoot = document.getElementById('modal-root')
  if (!modalRoot) return null

  const handleCopy = async () => {
    if (!recoveryCode) return
    try {
      await navigator.clipboard.writeText(recoveryCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('[DeactivateModal] clipboard:', err)
    }
  }

  const handleConfirm = async () => {
    if (!confirmed || processing) return
    setProcessing(true)
    setErrorMsg(null)

    const result = await deactivateAccount(playerId)

    if (!result.ok) {
      setErrorMsg(result.error ?? s.deactivate.errorGeneric)
      setProcessing(false)
      return
    }

    setShowSuccess(true)
    setTimeout(() => { logout(); onClose() }, 1600)
  }

  const handleCancel = () => {
    if (processing) return
    setCopied(false)
    setConfirmed(false)
    setErrorMsg(null)
    onClose()
  }

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
            className={`${styles.modal} ${styles.modalDeactivate}`}
            initial={{ scale: 0.7, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.7, y: 40, opacity: 0 }}
            transition={{ type: 'spring', damping: 18, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
          >
            {showSuccess ? (
              <>
                <motion.div
                  className={styles.cofrinho}
                  animate={{ rotate: [0, -8, 8, -8, 0] }}
                  transition={{ duration: 1.2 }}
                >🐷</motion.div>
                <p className={styles.successMsg}>{s.deactivate.success}</p>
              </>
            ) : (
              <>
                <motion.div
                  className={styles.cofrinho}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >🙈</motion.div>

                <h2 className={`${styles.title} ${styles.titleDeactivate}`}>
                  {s.deactivate.modalTitle}
                </h2>
                <p className={styles.subtitle}>{s.deactivate.cofrinhoSays}</p>

                <p className={styles.bulletTitle}>{s.deactivate.whatHappens}</p>
                <ul className={styles.bulletList}>
                  <li>{s.deactivate.bullet1}</li>
                  <li>{s.deactivate.bullet2}</li>
                  <li>{s.deactivate.bullet3}</li>
                </ul>

                {recoveryCode && (
                  <div className={styles.codeBox}>
                    <p className={styles.code}>{recoveryCode}</p>
                    <button type="button" className={styles.copyButton} onClick={handleCopy}>
                      {copied ? s.deactivate.copied : `📋 ${s.deactivate.copyCode}`}
                    </button>
                  </div>
                )}

                <label className={styles.checkboxRow}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                    disabled={processing}
                  />
                  <span className={styles.checkboxLabel}>{s.deactivate.confirmCheckbox}</span>
                </label>

                {errorMsg && <div className={styles.errorMsg}>{errorMsg}</div>}

                <div className={styles.actions}>
                  <button
                    type="button"
                    className={`${styles.actionButton} ${styles.cancelButton}`}
                    onClick={handleCancel}
                    disabled={processing}
                  >
                    {s.deactivate.cancel}
                  </button>
                  <button
                    type="button"
                    className={`${styles.actionButton} ${styles.confirmDeactivate}`}
                    onClick={handleConfirm}
                    disabled={!confirmed || processing}
                  >
                    {processing ? s.deactivate.processing : s.deactivate.confirm}
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
