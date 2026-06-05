import { AnimatePresence, motion } from 'framer-motion'
import { useGame } from '../../context/GameContext'
import { useStrings } from '../../i18n'
import styles from './ArcadeActionsHUD.module.css'

export default function ArcadeActionsHUD() {
  const { state } = useGame()
  const s = useStrings()

  const isArcade = state.gameMode === 'arcade'
  const actionsLeft = state.arcade?.actionsLeft ?? 0
  const isFinished = state.arcade?.finishedAt != null

  return (
    <AnimatePresence>
      {isArcade && !isFinished && (
        <motion.div
          className={styles.hud}
          role="status"
          aria-label={s.arcade.actionsHudAria}
          initial={{ opacity: 0, y: -24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.9 }}
          transition={{ type: 'spring', damping: 20, stiffness: 240 }}
        >
          <span className={styles.icon} aria-hidden="true">⚡</span>
          <span className={styles.label}>{s.arcade.modeLabel}</span>
          <span className={actionsLeft <= 5 ? `${styles.count} ${styles.countLow}` : styles.count}>
            {actionsLeft === 1
              ? s.arcade.actionsSingular
              : s.arcade.actionsLeft.replace('{n}', actionsLeft)}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
