import PropTypes from 'prop-types'
import { motion } from 'framer-motion'
import { useGame } from '../../context/GameContext.jsx'
import { useStrings, useLanguage } from '../../i18n/index.js'
import { ANIMALS } from '../../data/animals.js'
import styles from './ActiveAllyBadge.module.css'

export default function ActiveAllyBadge({ onSwapClick, variant = 'full' }) {
  const { state } = useGame()
  const s = useStrings()
  const lang = useLanguage()
  const t = (obj) => obj?.[lang] ?? obj?.pt ?? obj

  const { activeAlly, alliesOwned } = state.cooperativa ?? {}
  const ally = ANIMALS.find(a => a.id === activeAlly)

  if (!ally) return null

  const canSwap = (alliesOwned?.length ?? 0) > 1

  return (
    <motion.div
      layout
      className={`${styles.pill} ${variant === 'compact' ? styles.pillCompact : ''}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
    >
      <span className={styles.icon}>{ally.icon}</span>
      <div className={styles.texts}>
        <span className={styles.label}>{s.cooperativa.activeAlly.title}</span>
        <span className={styles.name}>{t(ally.name)}</span>
      </div>
      {canSwap && (
        <motion.button
          type="button"
          className={styles.swapBtn}
          onClick={onSwapClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.94 }}
        >
          {s.cooperativa.activeAlly.swap}
        </motion.button>
      )}
    </motion.div>
  )
}

ActiveAllyBadge.propTypes = {
  onSwapClick: PropTypes.func,
  variant:     PropTypes.oneOf(['full', 'compact']),
}
