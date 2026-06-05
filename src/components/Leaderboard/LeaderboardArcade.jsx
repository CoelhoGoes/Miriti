/* eslint-disable react/prop-types */
import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FaArrowLeft } from 'react-icons/fa'
import { getArcadeLeaderboard } from '../../lib/api/arcade'
import { isSupabaseConfigured } from '../../lib/supabaseClient'
import { useOnlineStatus } from '../../hooks/useOnlineStatus'
import { useStrings } from '../../i18n'
import ArcadeLeaderboardRow from './ArcadeLeaderboardRow'
import styles from './LeaderboardArcade.module.css'

const ARCADE_NICKNAME_STORAGE_KEY = 'miriti_arcade_nickname'

export default function LeaderboardArcade({ onBack }) {
    const s = useStrings()
    const isOnline = useOnlineStatus()

    const [status, setStatus] = useState('loading')
    const [rows, setRows] = useState([])
    const [arcadeNickname, setArcadeNickname] = useState('')

    const isMountedRef = useRef(false)
    const requestIdRef = useRef(0)

    const loadLeaderboard = useCallback(async () => {
        if (!isOnline || !isSupabaseConfigured()) {
            if (!isMountedRef.current) return
            setRows([])
            setStatus('offline')
            return
        }

        const requestId = ++requestIdRef.current
        setStatus('loading')

        const result = await getArcadeLeaderboard(10)

        if (!isMountedRef.current || requestId !== requestIdRef.current) return

        if (!result.ok) {
            setRows([])
            setStatus('error')
            return
        }

        const data = Array.isArray(result.data) ? result.data : []
        setRows(data)
        setStatus(data.length > 0 ? 'ready' : 'empty')
    }, [isOnline])

    useEffect(() => {
        isMountedRef.current = true

        try {
            const stored = localStorage.getItem(ARCADE_NICKNAME_STORAGE_KEY) || ''
            setArcadeNickname(stored)
        } catch {
            setArcadeNickname('')
        }

        loadLeaderboard()

        return () => {
            isMountedRef.current = false
            requestIdRef.current += 1
        }
    }, [loadLeaderboard])

    return (
        <motion.div
            className={styles.wrapper}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className={styles.header}>
                <button type="button" className={styles.backButton} onClick={onBack}>
                    <FaArrowLeft /> {s.arcade.lbBack}
                </button>

                <div className={styles.headerCenter}>
                    <h1 className={styles.title}>🏆 {s.arcade.lbTitle}</h1>
                    <p className={styles.subtitle}>Top 10</p>
                </div>

                <div style={{ width: 44 }} aria-hidden="true" />
            </div>

            <div className={styles.list}>
                {status === 'loading' && (
                    <>
                        <div className={styles.stateBox}>{s.arcade.lbLoading}</div>
                        {['one', 'two', 'three', 'four'].map((id) => (
                            <div key={id} className={styles.skeleton} />
                        ))}
                    </>
                )}

                {status === 'offline' && (
                    <div className={styles.stateBox}>{s.arcade.lbOffline}</div>
                )}

                {status === 'empty' && (
                    <div className={styles.stateBox}>{s.arcade.lbEmpty}</div>
                )}

                {status === 'error' && (
                    <div className={[styles.stateBox, styles.stateError].join(' ')}>
                        <div>
                            <div>{s.arcade.lbError}</div>
                            <button type="button" className={styles.retryButton} onClick={loadLeaderboard}>
                                {s.arcade.lbRetry}
                            </button>
                        </div>
                    </div>
                )}

                {status === 'ready' && rows.map((item, index) => (
                    <ArcadeLeaderboardRow
                        key={`${item.nickname}-${item.ended_at ?? index}`}
                        rank={index + 1}
                        nickname={item.nickname}
                        finalCoins={item.final_coins}
                        tier={item.tier}
                        isCurrentUser={Boolean(arcadeNickname) && item.nickname === arcadeNickname}
                    />
                ))}
            </div>
        </motion.div>
    )
}
