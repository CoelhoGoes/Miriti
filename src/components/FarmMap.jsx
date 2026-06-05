/* eslint-disable react/prop-types */
import { useState } from 'react'
import { motion } from 'framer-motion'
import { sound } from '../utils/sound.js'
import { useGame } from '../context/GameContext.jsx'
import { useStrings } from '../i18n/index.js'
import ActiveAllyBadge from './Cooperativa/ActiveAllyBadge.jsx'
import EquipAllyModal from './Cooperativa/EquipAllyModal.jsx'
import SyncIndicator from './SyncIndicator/SyncIndicator.jsx'
import { useSecondaryTutorial } from '../hooks/useSecondaryTutorial'
import { FaTrophy } from 'react-icons/fa'
import './FarmMap.css'
import styles from './FarmMap/FarmMap.module.css'

/* Locais clicáveis da fazenda — cada um abre uma funcionalidade.
   leftPct  — % horizontal do viewBox 1200×680.
   pathYPct — % vertical onde o caminho SVG passa naquela X.
   O top CSS usa calc(pathYPct% - var(--ms-node-size)) para que a borda
   inferior do círculo toque sempre o caminho, em qualquer resolução. */
const MAP_NODES = [
  {
    id: 'escolinha',
    emoji: '🏫',
    screen: 'escolinha',
    borderColor: 'var(--color-primary-dark)',
    shadowColor: '#2E6DA4',
    position: { leftPct: 11.67, pathYPct: 71.2 },
  },
  {
    id: 'feirinha',
    emoji: '🧺',
    screen: 'stocks',
    borderColor: 'var(--color-secondary)',
    shadowColor: '#B35A0A',
    position: { leftPct: 31.25, pathYPct: 67.1 },
  },
  {
    id: 'cooperativa',
    emoji: '🐾',
    screen: 'cooperativa',
    borderColor: 'var(--color-warning)',
    shadowColor: 'var(--color-warning)',
    position: { leftPct: 57, pathYPct: 65.7 },
  },
  {
    id: 'conquistas',
    emoji: '🏆',
    screen: 'achievements',
    borderColor: 'var(--color-warning)',
    shadowColor: '#C47A00',
    position: { leftPct: 77.08, pathYPct: 68.2 },
  },
]

const DECOS = [
  { id: 'deco-tree-1', emoji: '🌳', left: '8%', top: '50%', size: 3.2 },
  { id: 'deco-tree-2', emoji: '🌲', left: '42%', top: '34%', size: 2.4 },
  { id: 'deco-sunflower-1', emoji: '🌻', left: '24%', top: '86%', size: 1.9 },
  { id: 'deco-sunflower-2', emoji: '🌻', left: '70%', top: '84%', size: 1.9 },
  { id: 'deco-chicken', emoji: '🐷', left: '38%', top: '85%', size: 1.9 },
  { id: 'deco-cow', emoji: '🐄', left: '60%', top: '55%', size: 2.3 },
  { id: 'deco-butterfly', emoji: '🦋', left: '56%', top: '30%', size: 1.5 },
  { id: 'deco-grain-1', emoji: '🌾', left: '6%', top: '86%', size: 2 },
  { id: 'deco-grain-2', emoji: '🌾', left: '94%', top: '84%', size: 2 }
]

const CLOUDS = [
  { id: 'cloud-1', left: '14%', top: '11%', size: 3.2, dur: 26 },
  { id: 'cloud-2', left: '58%', top: '8%', size: 4, dur: 34 },
  { id: 'cloud-3', left: '80%', top: '14%', size: 2.8, dur: 30 }
]

export default function FarmMap({ onEscolinha, onShop, onCooperativa, onStocks, onAchievements, onSettings, onCredits, onMascotClick, onParents, onLeaderboard }) {
  const { state } = useGame()
  const s = useStrings()
  useSecondaryTutorial('INITIAL', true)
  const [showAllyModal, setShowAllyModal] = useState(false)
  const isArcade = state.gameMode === 'arcade'
  const displayCoins = isArcade ? (state.arcade?.coins ?? 0) : state.coins
  const actionsLeft = state.arcade?.actionsLeft ?? 0
  let arcadeHint = null
  if (isArcade) {
    arcadeHint = actionsLeft <= 1
      ? s?.arcade?.farmHintSingular
      : s?.arcade?.farmHint?.replace('{n}', actionsLeft)
  }
  const openSettings = () => { if (onSettings) onSettings() }
  const openCredits = () => { onCredits?.() }

  const handleMascot = () => {
    sound.play('pop')
    if (onMascotClick) onMascotClick()
  }

  const openParents = () => {
    sound.play('click')
    if (onParents) onParents()
  }

  return (
    <div className={`${styles.farmContainer} farm-map`}>
      <motion.header
        className={styles.gameHeader}
        initial={{ y: -66, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 180, delay: 0.1 }}
      >
        <div className={styles.headerUtils}>
          <motion.button
            type="button"
            onClick={openSettings}
            title={s.farmMap.settings}
            aria-label={s.farmMap.settings}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
          >
            ⚙️
          </motion.button>
          {!isArcade && (
            <motion.button
              type="button"
              onClick={openCredits}
              title={s.farmMap.credits}
              aria-label={s.farmMap.credits}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
            >
              📋
            </motion.button>
          )}
          <motion.button
            type="button"
            onClick={openParents}
            title={s.farmMap.parents}
            aria-label={s.farmMap.parents}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
          >
            👨‍👩‍👧
          </motion.button>
        </div>

        <div className={styles.headerTitle}>
          <motion.button
            type="button"
            onClick={handleMascot}
            title={s.farmMap.mascotTip}
            aria-label={s.farmMap.mascotLabel}
            className={styles.mascotButton}
            whileHover={{ scale: 1.12, rotate: -6 }}
            whileTap={{ scale: 0.92 }}
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span aria-hidden="true">{state.selectedMascot}</span>
          </motion.button>
          <h1>{s.farmMap.title}</h1>
        </div>

        <div className={styles.headerRight}>
          <SyncIndicator />
          {!isArcade && (
            <motion.button
              type="button"
              className={styles.headerTrophyButton}
              onClick={() => onLeaderboard?.()}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              aria-label={s.leaderboard?.title}
              title={s.leaderboard?.title}
            >
              <FaTrophy />
            </motion.button>
          )}
          <div className={styles.coinsBadge}>
            <span aria-hidden="true">🪙</span>
            <span>{displayCoins}</span>
          </div>
        </div>
      </motion.header>

      <div className={styles.hintBar}>
        {isArcade ? arcadeHint : s.farmMap.hint}
      </div>

      <div className="farm-sky" />
      <motion.div
        className="farm-sun"
        animate={{ rotate: 360 }}
        transition={{ duration: 140, repeat: Infinity, ease: 'linear' }}
      >
        ☀️
      </motion.div>

      {CLOUDS.map((c) => (
        <motion.div
          key={c.id}
          className="farm-cloud"
          style={{ left: c.left, top: c.top, fontSize: `${c.size}rem` }}
          animate={{ x: [0, 36, 0] }}
          transition={{ duration: c.dur, repeat: Infinity, ease: 'easeInOut' }}
        >
          ☁️
        </motion.div>
      ))}

      <div className="farm-hill farm-hill-back" />
      <div className="farm-hill farm-hill-mid" />
      <div className="farm-hill farm-hill-front" />

      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 15,
          pointerEvents: 'none',
        }}
        viewBox="0 0 1200 680"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M 30 505 C 200 468 400 448 600 446 S 1000 468 1170 505"
          stroke="rgba(0,0,0,0.12)"
          strokeWidth="80"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 30 505 C 200 468 400 448 600 446 S 1000 468 1170 505"
          stroke="#D4A96A"
          strokeWidth="72"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 30 505 C 200 468 400 448 600 446 S 1000 468 1170 505"
          stroke="#ECC882"
          strokeWidth="64"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 30 505 C 200 468 400 448 600 446 S 1000 468 1170 505"
          stroke="rgba(255,255,255,0.55)"
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="28 22"
        />
      </svg>

      {DECOS.map((d) => (
        <span
          key={d.id}
          className="farm-deco"
          style={{ left: d.left, top: d.top, fontSize: `${d.size}rem` }}
        >
          {d.emoji}
        </span>
      ))}

      {MAP_NODES.map((node, index) => {
        if (isArcade && node.id === 'conquistas') return null

        const openNode = () => {
          sound.play('click')
          if (node.id === 'escolinha') onEscolinha()
          if (node.id === 'feirinha') onStocks?.()
          if (node.id === 'cooperativa') onCooperativa?.()
          if (node.id === 'conquistas') onAchievements?.()
        }

        return (
          <motion.div
            key={node.id}
            className={styles.mapNode}
            data-tutorial={`node-${node.id}`}
            style={{
              left: `${node.position.leftPct}%`,
              top: `calc(${node.position.pathYPct}% - var(--ms-node-size))`,
            }}
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2 + index * 0.1, type: 'spring', stiffness: 200, damping: 18 }}
            whileHover={{ scale: 1.07, y: -4 }}
            whileTap={{ scale: 0.96 }}
            onClick={openNode}
          >
            <div
              className={styles.nodeCircle}
              style={{
                borderColor: node.borderColor,
                '--node-shadow-color': node.shadowColor,
              }}
            >
              {node.emoji}
              {node.id === 'loja' && (state.newShopItems || 0) > 0 && (
                <div className={styles.nodeBadge}>{state.newShopItems || 0}</div>
              )}
            </div>
            <div className={styles.nodeLabel}>{s.farmMap.nodes[node.id]}</div>
          </motion.div>
        )
      })}

      {!isArcade && (
        <motion.div
          className={styles.allyBadgeOverlay}
          data-tutorial="active-ally-overlay"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <ActiveAllyBadge onSwapClick={() => { sound.play('click'); setShowAllyModal(true) }} />
        </motion.div>
      )}

      {!isArcade && showAllyModal && (
        <EquipAllyModal
          onClose={() => setShowAllyModal(false)}
          onGoToCooperativa={() => { setShowAllyModal(false); onCooperativa?.() }}
        />
      )}

    </div>
  )
}
