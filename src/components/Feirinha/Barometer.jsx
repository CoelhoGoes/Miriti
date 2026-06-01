/* eslint-disable react/prop-types */
import { motion } from 'framer-motion'
import { useStrings } from '../../i18n/index.js'
import styles from './Barometer.module.css'

const LEVELS = [
  { emoji: '❄️', class: 'level1', labelClass: 'labelLevel1' },
  { emoji: '📉', class: 'level2', labelClass: 'labelLevel2' },
  { emoji: '😐', class: 'level3', labelClass: 'labelLevel3' },
  { emoji: '📈', class: 'level4', labelClass: 'labelLevel4' },
  { emoji: '🔥', class: 'level5', labelClass: 'labelLevel5' },
]

/**
 * Determina o nível (0-4) com base no preço dentro do range min-max.
 */
export function getBarometerLevel(currentPrice, minPrice, maxPrice) {
  if (maxPrice <= minPrice) return 2
  const range    = maxPrice - minPrice
  const position = (currentPrice - minPrice) / range
  return Math.min(4, Math.max(0, Math.floor(position * 5)))
}

export default function Barometer({ currentPrice, basePrice, minPrice, maxPrice }) {
  const s = useStrings()
  const activeIndex = getBarometerLevel(currentPrice, minPrice, maxPrice)
  const activeLevel = LEVELS[activeIndex]
  const label       = s.feirinha.barometer[`level${activeIndex + 1}`]

  return (
    <div className={styles.wrapper}>
      <div className={styles.segments}>
        {LEVELS.map((level, i) => {
          const isActive = i === activeIndex
          return (
            <motion.div
              key={level.class}
              className={`${styles.segment} ${styles[level.class]} ${isActive ? styles.active : ''}`}
              animate={isActive ? { scale: [1, 1.08, 1] } : { scale: 1 }}
              transition={{
                duration: 2,
                repeat: isActive ? Infinity : 0,
                ease: 'easeInOut',
              }}
              aria-hidden="true"
            >
              {level.emoji}
            </motion.div>
          )
        })}
      </div>

      <p className={`${styles.label} ${styles[activeLevel.labelClass]}`}>
        {label}
      </p>
    </div>
  )
}
