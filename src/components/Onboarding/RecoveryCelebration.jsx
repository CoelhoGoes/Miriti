import { useState } from 'react'
import { motion } from 'framer-motion'
import { useStrings } from '../../i18n'
import { useGame } from '../../context/GameContext'
import styles from './Onboarding.module.css'

export default function RecoveryCelebration({ playerData, onComplete }) {
  const s = useStrings()
  const { markOnboarded } = useGame()
  const [copied, setCopied] = useState(false)

  const recoveryCode = playerData.recovery_code
  const titleText = s.recovery.celebrationTitle.replace('{nickname}', playerData.nickname)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(recoveryCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Clipboard error:', err)
    }
  }

  const handleStart = () => {
    markOnboarded()
    onComplete()
  }

  return (
    <motion.div
      className={styles.wrapper}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className={styles.card}
        initial={{ scale: 0.7, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 16, stiffness: 180 }}
      >
        <motion.div
          className={styles.cofrinho}
          animate={{ y: [0, -10, 0], rotate: [-3, 3, -3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          🐷
        </motion.div>

        <h1 className={styles.title}>{titleText}</h1>
        <p className={styles.subtitle}>{s.recovery.cofrinhoSays}</p>

        <div className={styles.codeBox}>
          <p className={styles.code}>{recoveryCode}</p>
          <button type="button" className={styles.copyButton} onClick={handleCopy}>
            {copied ? s.recovery.copied : `📋 ${s.recovery.copyCode}`}
          </button>
        </div>

        <p className={styles.subtitle}>{s.recovery.whatIsThis}</p>

        <button type="button" className={styles.button} onClick={handleStart}>
          {s.recovery.letsPlay} 🎮
        </button>

        <p className={styles.tipFooter}>{s.recovery.tipFooter}</p>
      </motion.div>
    </motion.div>
  )
}
