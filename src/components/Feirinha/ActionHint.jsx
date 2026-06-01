/* eslint-disable react/prop-types */
import { motion } from 'framer-motion'
import { useStrings } from '../../i18n/index.js'
import styles from './ActionHint.module.css'

/**
 * Mapeia o nível do barómetro (0-4) para o tipo de hint.
 * Leva em conta se o jogador já possui o produto.
 */
function getHintConfig(barometerLevel, hasOwned) {
  if (barometerLevel <= 0) return { type: 'buy',  key: 'buyNow' }
  if (barometerLevel === 1) return { type: 'buy',  key: 'buyGood' }
  if (barometerLevel === 2) return { type: 'wait', key: 'wait' }
  if (barometerLevel === 3) return { type: 'sell', key: hasOwned ? 'sellGood' : 'wait' }
  return                           { type: 'sell', key: hasOwned ? 'sellNow'  : 'wait' }
}

export default function ActionHint({ barometerLevel, hasOwned }) {
  const s      = useStrings()
  const config = getHintConfig(barometerLevel, hasOwned)
  const hint   = s.feirinha.actionHints[config.key]

  return (
    <motion.div
      className={`${styles.hint} ${styles[config.type]}`}
      key={config.key}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <span className={styles.icon}>{hint.icon}</span>
      <span>{hint.text}</span>
    </motion.div>
  )
}
