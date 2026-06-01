import { useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useStrings } from '../../i18n'
import { useGame } from '../../context/GameContext'
import { deleteAccount } from '../../lib/api/players'
import styles from './Account.module.css'

export default function DeleteAccountModal({ isOpen, onClose }) {
  const s = useStrings()
  const { state, logout } = useGame()

  const [confirmed, setConfirmed]     = useState(false)
  const [typed, setTyped]             = useState('')
  const [processing, setProcessing]   = useState(false)
  const [errorMsg, setErrorMsg]       = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const playerId        = state.player?.id
  const keyword         = s.deleteAccount.typeKeyword
  const isKeywordCorrect = typed.trim().toUpperCase() === keyword

  const modalRoot = document.getElementById('modal-root')
  if (!modalRoot) return null

  const handleConfirm = async () => {
    if (!confirmed || !isKeywordCorrect || processing) return
    setProcessing(true)
    setErrorMsg(null)

    const result = await deleteAccount(playerId)

    if (!result.ok) {
      setErrorMsg(result.error ?? s.deleteAccount.errorGeneric)
      setProcessing(false)
      return
    }

    setShowSuccess(true)
    setTimeout(() => { logout(); onClose() }, 1800)
  }

  const handleCancel = () => {
    if (processing) return
    setConfirmed(false)
    setTyped('')
    setErrorMsg(null)
    onClose()
  }

  const rawLabel = s.deleteAccount.typeToConfirm
  const [labelBefore, labelAfter] = rawLabel
    .replace('{keyword}', '__KW__')
    .split('__KW__')

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
            className={`${styles.modal} ${styles.modalDelete}`}
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
                  animate={{ rotate: [0, -15, 15, -10, 0], scale: [1, 0.9, 1, 0.95, 1] }}
                  transition={{ duration: 1.5 }}
                >💔</motion.div>
                <p className={styles.successMsg}>{s.deleteAccount.success}</p>
              </>
            ) : (
              <>
                <motion.div
                  className={styles.cofrinho}
                  animate={{ rotate: [-3, 3, -3] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                >😱</motion.div>

                <h2 className={`${styles.title} ${styles.titleDelete}`}>
                  {s.deleteAccount.modalTitle}
                </h2>
                <p className={styles.subtitle}>{s.deleteAccount.cofrinhoSays}</p>

                <p className={styles.bulletTitle}>{s.deleteAccount.whatHappens}</p>
                <ul className={styles.bulletList}>
                  <li>{s.deleteAccount.bullet1}</li>
                  <li>{s.deleteAccount.bullet2}</li>
                  <li>{s.deleteAccount.bullet3}</li>
                </ul>

                <div className={styles.typeConfirm}>
                  <label className={styles.typeLabel}>
                    {labelBefore}
                    <span className={styles.typeKeyword}>{keyword}</span>
                    {labelAfter}
                  </label>
                  <input
                    type="text"
                    className={`${styles.typeInput} ${isKeywordCorrect ? styles.typeInputValid : ''}`}
                    placeholder={s.deleteAccount.placeholderType}
                    value={typed}
                    onChange={(e) => setTyped(e.target.value.toUpperCase())}
                    disabled={processing}
                    maxLength={20}
                  />
                </div>

                <label className={styles.checkboxRow}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                    disabled={processing}
                  />
                  <span className={styles.checkboxLabel}>{s.deleteAccount.confirmCheckbox}</span>
                </label>

                {errorMsg && <div className={styles.errorMsg}>{errorMsg}</div>}

                <div className={styles.actions}>
                  <button
                    type="button"
                    className={`${styles.actionButton} ${styles.cancelButton}`}
                    onClick={handleCancel}
                    disabled={processing}
                  >
                    {s.deleteAccount.cancel}
                  </button>
                  <button
                    type="button"
                    className={`${styles.actionButton} ${styles.confirmDelete}`}
                    onClick={handleConfirm}
                    disabled={!confirmed || !isKeywordCorrect || processing}
                  >
                    {processing ? s.deleteAccount.processing : s.deleteAccount.confirm}
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
