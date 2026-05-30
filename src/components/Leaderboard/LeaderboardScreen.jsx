import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaSyncAlt } from 'react-icons/fa'
import { useStrings } from '../../i18n'
import { useGame } from '../../context/GameContext'
import { getTopPlayers, getPlayerRank } from '../../lib/api/leaderboard'
import LeaderboardRow from './LeaderboardRow'
import styles from './Leaderboard.module.css'

const TOP_LIMIT = 10

export default function LeaderboardScreen({ onBack }) {
  const s = useStrings()
  const { state } = useGame()
  const playerId = state.player?.id

  const [topPlayers, setTopPlayers] = useState([])
  const [yourRank, setYourRank]     = useState(null)
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    const [topResult, rankResult] = await Promise.all([
      getTopPlayers(TOP_LIMIT),
      playerId ? getPlayerRank(playerId) : Promise.resolve({ ok: false }),
    ])

    if (!topResult.ok) {
      setError(s.leaderboard.errorLoad)
      setLoading(false)
      return
    }

    setTopPlayers(topResult.data)
    if (rankResult.ok) setYourRank(rankResult.data)
    setLoading(false)
  }, [playerId, s])

  useEffect(() => { fetchData() }, [fetchData])

  const isInTop = yourRank && yourRank.rank <= TOP_LIMIT

  return (
    <motion.div
      className={styles.wrapper}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className={styles.header}>
        <button
          type="button"
          className={styles.iconButton}
          onClick={onBack}
          aria-label={s.leaderboard.back}
        >
          <FaArrowLeft />
        </button>

        <div className={styles.headerCenter}>
          <h1 className={styles.title}>🏆 {s.leaderboard.title}</h1>
          <p className={styles.subtitle}>{s.leaderboard.subtitle}</p>
        </div>

        <button
          type="button"
          className={styles.iconButton}
          onClick={fetchData}
          aria-label={s.leaderboard.refresh}
          disabled={loading}
        >
          <FaSyncAlt />
        </button>
      </div>

      <div className={styles.list}>
        {loading && Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={styles.skeleton} />
        ))}

        {!loading && error && (
          <div className={styles.errorMsg}>{error}</div>
        )}

        {!loading && !error && topPlayers.length === 0 && (
          <div className={styles.empty}>{s.leaderboard.empty}</div>
        )}

        {!loading && !error && topPlayers.map((row, index) => (
          <LeaderboardRow
            key={`${row.nickname}-${row.rank}`}
            row={row}
            index={index}
            isYou={row.nickname === state.player?.nickname}
            strings={s.leaderboard}
          />
        ))}

        {!loading && !error && yourRank && !isInTop && (
          <div className={styles.outOfTopFooter}>
            {s.leaderboard.outOfTop.replace('{rank}', yourRank.rank)}
          </div>
        )}
      </div>
    </motion.div>
  )
}
