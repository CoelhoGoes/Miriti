import { motion } from 'framer-motion'
import styles from './Leaderboard.module.css'

const MEDALS = { 1: '🥇', 2: '🥈', 3: '🥉' }

const ROW_VARIANTS = {
  hidden:  { opacity: 0, x: -30 },
  visible: (index) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.06 * index,
      type: 'spring',
      damping: 18,
      stiffness: 200,
    },
  }),
}

export default function LeaderboardRow({ row, index, isYou, strings }) {
  const medal = MEDALS[row.rank]

  const rowClass = [
    styles.row,
    isYou        && styles.rowYou,
    row.rank === 1 && styles.rowGold,
    row.rank === 2 && styles.rowSilver,
    row.rank === 3 && styles.rowBronze,
  ].filter(Boolean).join(' ')

  const coinsClass = [
    styles.coins,
    row.rank <= 3 && styles.coinsDark,
  ].filter(Boolean).join(' ')

  return (
    <motion.div
      className={rowClass}
      variants={ROW_VARIANTS}
      custom={index}
      initial="hidden"
      animate="visible"
    >
      <div className={medal ? styles.rankMedal : styles.rank}>
        {medal ?? `#${row.rank}`}
      </div>

      <div className={styles.nickname}>
        {row.nickname}
        {isYou && <span className={styles.youBadge}>{strings.you}</span>}
      </div>

      <div className={coinsClass}>
        {row.total_coins} 🪙
      </div>
    </motion.div>
  )
}
