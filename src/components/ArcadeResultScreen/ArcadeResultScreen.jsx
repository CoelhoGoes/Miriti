/* eslint-disable react/prop-types */
import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '../../context/GameContext'
import { useScreen } from '../../context/ScreenContext'
import { useStrings } from '../../i18n'
import { useOnlineStatus } from '../../hooks/useOnlineStatus'
import { saveArcadeSession } from '../../lib/api/arcade'
import { ARCADE_INITIAL_COINS, ARCADE_INITIAL_ACTIONS, calculateArcadeTier } from '../../data/arcadeConfig'
import styles from './ArcadeResultScreen.module.css'

const ARCADE_NICKNAME_STORAGE_KEY = 'miriti_arcade_nickname'
const ARCADE_NICKNAME_REGEX = /^[A-Za-zÀ-ÿ0-9 ._-]+$/

function validateArcadeNickname(value) {
  const trimmed = value.trim()
  if (trimmed.length < 1 || trimmed.length > 20) return false
  return ARCADE_NICKNAME_REGEX.test(trimmed)
}

function getTierLabel(strings, tier) {
  if (tier === 'advanced') return strings.arcade.tierAdvanced
  if (tier === 'medium') return strings.arcade.tierMedium
  return strings.arcade.tierBasic
}

export default function ArcadeResultScreen({ onMenu }) {
  const { state, exitArcade, startArcade } = useGame()
  const { setScreen } = useScreen()
  const s = useStrings()
  const isOnline = useOnlineStatus()
  const score = state.arcade?.finalScore
  const submitLockRef = useRef(false)

  const finalCoins = score?.coins ?? state.arcade?.coins ?? 0
  const actionsUsed = score?.actionsUsed ?? (ARCADE_INITIAL_ACTIONS - (state.arcade?.actionsLeft ?? 0))
  const sessionStartedAt = state.arcade?.startedAt ?? null
  const sessionFinishedAt = state.arcade?.finishedAt ?? null
  const questionsCount = state.arcade?.usedQuestionIds?.length ?? 0
  const tier = calculateArcadeTier(finalCoins)
  const diff = finalCoins - ARCADE_INITIAL_COINS
  const isProfit = diff > 0
  const sessionKey = `${sessionStartedAt ?? 'na'}-${sessionFinishedAt ?? 'na'}`

  const [nickname, setNickname] = useState('')
  const [submitStatus, setSubmitStatus] = useState('idle')

  useEffect(() => {
    try {
      const saved = localStorage.getItem(ARCADE_NICKNAME_STORAGE_KEY)
      if (saved) setNickname(saved)
    } catch {
      // localStorage unavailable
    }
  }, [])

  useEffect(() => {
    submitLockRef.current = false
    setSubmitStatus(isOnline ? 'idle' : 'offline')
  }, [sessionKey, isOnline])

  const isValidNickname = useMemo(() => validateArcadeNickname(nickname), [nickname])

  const handleSubmitRanking = async () => {
    if (!isOnline) {
      setSubmitStatus('offline')
      return
    }
    if (!isValidNickname || submitStatus === 'submitted' || submitStatus === 'submitting') return
    if (submitLockRef.current) return

    if (!sessionStartedAt || !sessionFinishedAt || !score) {
      setSubmitStatus('error')
      return
    }

    submitLockRef.current = true
    setSubmitStatus('submitting')

    const payload = {
      nickname: nickname.trim(),
      startedAt: new Date(sessionStartedAt).toISOString(),
      endedAt: new Date(sessionFinishedAt).toISOString(),
      initialCoins: ARCADE_INITIAL_COINS,
      finalCoins: score.coins,
      actionsUsed: score.actionsUsed,
      tier,
      durationSec: Math.max(0, Math.floor((sessionFinishedAt - sessionStartedAt) / 1000)),
      questionsCount,
    }

    const result = await saveArcadeSession(payload)
    if (result.ok) {
      try {
        localStorage.setItem(ARCADE_NICKNAME_STORAGE_KEY, payload.nickname)
      } catch {
        // localStorage unavailable
      }
      setSubmitStatus('submitted')
      return
    }

    submitLockRef.current = false
    setSubmitStatus('error')
  }

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
        <div className={styles.row}>
          <span className={styles.rowLabel}>🏅 {s.arcade.resultTier}</span>
          <span className={styles.rowValue}>{getTierLabel(s, tier)}</span>
        </div>
      </motion.div>

      <motion.div
        className={styles.rankCard}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <p className={styles.rankPrompt}>{s.arcade.rankPrompt}</p>
        <div className={styles.rankInputRow}>
          <input
            type="text"
            value={nickname}
            onChange={(e) => {
              setNickname(e.target.value)
              if (!isOnline) {
                setSubmitStatus('offline')
              } else if (submitStatus !== 'submitted') {
                setSubmitStatus('idle')
              }
            }}
            maxLength={20}
            placeholder={s.arcade.rankPlaceholder}
            className={styles.rankInput}
            disabled={submitStatus === 'submitting' || submitStatus === 'submitted'}
          />
          <button
            type="button"
            className={styles.rankSubmitBtn}
            onClick={handleSubmitRanking}
            disabled={!isOnline || !isValidNickname || submitStatus === 'submitting' || submitStatus === 'submitted'}
          >
            {submitStatus === 'submitting' ? s.arcade.rankSubmitting : s.arcade.rankSubmit}
          </button>
        </div>

        {!isValidNickname && (
          <p className={styles.rankMessage}>{s.arcade.rankInvalidName}</p>
        )}
        {!isOnline && (
          <p className={styles.rankMessage}>{s.arcade.rankOffline}</p>
        )}
        {submitStatus === 'submitted' && (
          <p className={styles.rankMessage}>{s.arcade.rankSubmitted}</p>
        )}
        {submitStatus === 'error' && (
          <p className={styles.rankMessage}>{s.arcade.rankError}</p>
        )}
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
