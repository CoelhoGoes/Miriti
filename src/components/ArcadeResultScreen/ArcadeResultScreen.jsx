/* eslint-disable react/prop-types */
import { motion } from 'framer-motion'
import { useGame } from '../../context/GameContext'
import { useScreen } from '../../context/ScreenContext'
import { useStrings } from '../../i18n'
import { ARCADE_INITIAL_COINS, ARCADE_INITIAL_ACTIONS } from '../../data/arcadeConfig'
import styles from './ArcadeResultScreen.module.css'

export default function ArcadeResultScreen({ onMenu }) {
  const { state, exitArcade, startArcade } = useGame()
  const { setScreen } = useScreen()
  const s = useStrings()
  const score = state.arcade?.finalScore

  const finalCoins   = score?.coins ?? state.arcade?.coins ?? 0
  const actionsUsed  = score?.actionsUsed ?? (ARCADE_INITIAL_ACTIONS - (state.arcade?.actionsLeft ?? 0))
  const diff         = finalCoins - ARCADE_INITIAL_COINS
  const isProfit     = diff > 0

  const handlePlayAgain = () => {
    startArcade()
    setScreen('farm')
  }

  const handleMenu = () => {
    exitArcade()
    onMenu()
  }

  return (
    <motion.div
      className={styles.wrapper}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className={styles.glow} aria-hidden="true" />

      <motion.h1
        className={styles.title}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {s.arcade.resultTitle}
      </motion.h1>

      <motion.p
        className={styles.subtitle}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {s.arcade.resultSubtitle}
      </motion.p>

      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <div className={styles.row}>
          <span className={styles.rowLabel}>🪙 {s.arcade.resultStart}</span>
          <span className={styles.rowValue}>{ARCADE_INITIAL_COINS}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>🪙 {s.arcade.resultCoins}</span>
          <span className={styles.rowValue}>{finalCoins}</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.row}>
          <span className={styles.rowLabel}>
            {isProfit ? `📈 ${s.arcade.resultProfit}` : `📉 ${s.arcade.resultLoss}`}
          </span>
          <span className={`${styles.rowValue} ${isProfit ? styles.profit : styles.loss}`}>
            {isProfit ? '+' : ''}{diff}
          </span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>⚡ {s.arcade.resultActions}</span>
          <span className={styles.rowValue}>{actionsUsed} / {ARCADE_INITIAL_ACTIONS}</span>
        </div>
      </motion.div>

      <motion.div
        className={styles.actions}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <button type="button" className={styles.btnPlayAgain} onClick={handlePlayAgain}>
          {s.arcade.resultPlayAgain}
        </button>
        <button type="button" className={styles.btnMenu} onClick={handleMenu}>
          {s.arcade.resultMenu}
        </button>
      </motion.div>
    </motion.div>
  )
}
