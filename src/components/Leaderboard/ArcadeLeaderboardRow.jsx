/* eslint-disable react/prop-types */
import { motion } from 'framer-motion'
import { useStrings } from '../../i18n'
import styles from './ArcadeLeaderboardRow.module.css'

const ROW_VARIANTS = {
    hidden: { opacity: 0, y: 10 },
    visible: (index) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: 0.04 * index,
            duration: 0.2,
        },
    }),
}

function getTierIcon(tier) {
    if (tier === 'advanced') return '🥇'
    if (tier === 'medium') return '🥈'
    return '🥉'
}

export default function ArcadeLeaderboardRow({ rank, nickname, finalCoins, tier, isCurrentUser }) {
    const s = useStrings()

    return (
        <motion.div
            className={[styles.row, isCurrentUser ? styles.rowCurrent : ''].filter(Boolean).join(' ')}
            variants={ROW_VARIANTS}
            initial="hidden"
            animate="visible"
            custom={rank}
        >
            <div className={styles.rank}>#{rank}</div>
            <div className={styles.tierIcon} aria-label={tier}>{getTierIcon(tier)}</div>
            <div className={styles.nicknameWrap}>
                <span className={styles.nickname}>{nickname || '---'}</span>
                {isCurrentUser && <span className={styles.youLabel}>{s.arcade.lbYou}</span>}
            </div>
            <div className={styles.coins}>{Number(finalCoins ?? 0)} 🪙</div>
        </motion.div>
    )
}
