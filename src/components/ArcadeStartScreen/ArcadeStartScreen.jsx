/* eslint-disable react/prop-types */
import { motion } from 'framer-motion'
import { useGame } from '../../context/GameContext'
import { useStrings } from '../../i18n'
import { ARCADE_INITIAL_ACTIONS, ARCADE_INITIAL_COINS } from '../../data/arcadeConfig'
import styles from './ArcadeStartScreen.module.css'

export default function ArcadeStartScreen({ onStart, onBack, onViewLeaderboard }) {
  const { startArcade } = useGame()
  const s = useStrings()

  const handleStart = () => {
    startArcade()
    onStart()
  }

  return (
    <motion.div
      className={styles.wrapper}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className={styles.glow} aria-hidden="true" />

      <motion.div
        className={styles.icon}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.1 }}
      >
        ⚡
      </motion.div>

      <motion.h1
        className={styles.title}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {s.arcade.startTitle}
      </motion.h1>

      <motion.p
        className={styles.desc}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {s.arcade.startDesc}
      </motion.p>

      <motion.div
        className={styles.statsRow}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <div className={styles.stat}>
          <span className={styles.statValue}>{ARCADE_INITIAL_COINS.toLocaleString('pt-BR')}</span>
          <span className={styles.statLabel}>🪙 moedas</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{ARCADE_INITIAL_ACTIONS}</span>
          <span className={styles.statLabel}>⚡ ações</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>∞</span>
          <span className={styles.statLabel}>🏆 ranking</span>
        </div>
      </motion.div>

      <motion.div
        className={styles.actions}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        <button type="button" className={styles.btnStart} onClick={handleStart}>
          {s.arcade.startCta}
        </button>
        <button type="button" className={styles.btnLeaderboard} onClick={() => onViewLeaderboard?.()}>
          {s.arcade.lbCta}
        </button>
        <button type="button" className={styles.btnBack} onClick={onBack}>
          ← {s.arcade.homeBack}
        </button>
      </motion.div>
    </motion.div>
  )
}
