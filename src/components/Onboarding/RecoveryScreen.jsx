import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useStrings } from '../../i18n'
import { useGame } from '../../context/GameContext'
import { recoverByCode } from '../../lib/api/recovery'
import styles from './Onboarding.module.css'

const CODE_REGEX = /^[A-ZÀ-Ú]+-\d{4}-[A-ZÀ-Ú]+$/

export default function RecoveryScreen({ onBack, onRecovered }) {
  const s = useStrings()
  const { setPlayer, hydrateFromCloud, markOnboarded } = useGame()

  const [code, setCode]           = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg]   = useState(null)
  const [successMsg, setSuccessMsg] = useState(null)

  const isFormatValid = CODE_REGEX.test(code)

  const handleSubmit = useCallback(async () => {
    if (!isFormatValid || submitting) return

    setSubmitting(true)
    setErrorMsg(null)

    const result = await recoverByCode(code)

    if (!result.ok) {
      setErrorMsg(result.error)
      setSubmitting(false)
      return
    }

    const { player, save } = result.data

    setPlayer(player.id, player.nickname, player.recovery_code)
    markOnboarded()

    if (save?.game_state) {
      hydrateFromCloud(save.game_state)
    }

    setSuccessMsg(s.recoveryScreen.success.replace('{nickname}', player.nickname))
    setTimeout(() => onRecovered(), 1200)
  }, [code, isFormatValid, submitting, setPlayer, hydrateFromCloud, markOnboarded, onRecovered, s])

  return (
    <motion.div
      className={styles.wrapper}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className={styles.card}
        initial={{ scale: 0.85, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 18, stiffness: 200 }}
      >
        <h1 className={styles.title}>🔑 {s.recoveryScreen.title}</h1>
        <p className={styles.subtitle}>{s.recoveryScreen.subtitle}</p>

        <input
          type="text"
          className={styles.codeInput}
          placeholder={s.recoveryScreen.placeholder}
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          maxLength={50}
          autoFocus
          disabled={submitting || !!successMsg}
        />

        <p className={styles.hint}>{s.recoveryScreen.hint}</p>

        {code && !isFormatValid && (
          <div className={`${styles.feedback} ${styles.feedbackError}`}>
            {s.recoveryScreen.invalidFormat}
          </div>
        )}

        {errorMsg && (
          <div className={`${styles.feedback} ${styles.feedbackError}`}>
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className={`${styles.feedback} ${styles.feedbackOk}`}>
            {successMsg}
          </div>
        )}

        <button
          type="button"
          className={styles.button}
          disabled={!isFormatValid || submitting || !!successMsg}
          onClick={handleSubmit}
        >
          {submitting ? s.recoveryScreen.restoring : s.recoveryScreen.restore}
        </button>

        <button
          type="button"
          className={styles.linkButton}
          onClick={onBack}
          disabled={submitting}
        >
          {s.recoveryScreen.backToNew}
        </button>
      </motion.div>
    </motion.div>
  )
}
