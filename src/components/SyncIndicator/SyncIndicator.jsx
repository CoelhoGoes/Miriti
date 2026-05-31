import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FaCloud, FaCloudUploadAlt, FaExclamationTriangle, FaSyncAlt, FaCheckCircle } from 'react-icons/fa'
import { useStrings } from '../../i18n'
import { useGame } from '../../context/GameContext'
import { SYNC_STATUS } from '../../hooks/useCloudSync'
import styles from './SyncIndicator.module.css'

function formatRelativeTime(date, strings) {
  if (!date) return null
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (seconds < 5)  return strings.justNow
  if (seconds < 60) return strings.secondsAgo.replace('{n}', seconds)
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return strings.minutesAgo.replace('{n}', minutes)
  return strings.hoursAgo.replace('{n}', Math.floor(minutes / 60))
}

const STATUS_CONFIG = {
  [SYNC_STATUS.IDLE]:    { Icon: FaCloud,               spin: false, key: 'idle' },
  [SYNC_STATUS.PENDING]: { Icon: FaCloudUploadAlt,       spin: false, key: 'pending' },
  [SYNC_STATUS.SYNCING]: { Icon: FaSyncAlt,             spin: true,  key: 'syncing' },
  [SYNC_STATUS.SUCCESS]: { Icon: FaCheckCircle,         spin: false, key: 'success' },
  [SYNC_STATUS.ERROR]:   { Icon: FaExclamationTriangle, spin: false, key: 'error' },
  [SYNC_STATUS.OFFLINE]: { Icon: FaCloud,               spin: false, key: 'offline' },
}

export default function SyncIndicator() {
  const s = useStrings()
  const { syncMeta, state } = useGame()
  const [showTooltip, setShowTooltip] = useState(false)

  if (!state.player?.id) return null

  const config = STATUS_CONFIG[syncMeta.status] ?? STATUS_CONFIG[SYNC_STATUS.IDLE]
  const { Icon } = config

  const handleClick = async () => {
    if (syncMeta.status === SYNC_STATUS.OFFLINE) return
    await syncMeta.forceSync()
  }

  const lastSyncLabel = syncMeta.lastSyncAt
    ? s.sync.lastSync.replace('{time}', formatRelativeTime(syncMeta.lastSyncAt, s.sync))
    : null

  return (
    <button
      type="button"
      className={`${styles.indicator} ${styles[config.key]}`}
      onClick={handleClick}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      aria-label={s.sync[config.key]}
      title={s.sync[config.key]}
    >
      <Icon className={config.spin ? styles.spinning : ''} />

      <AnimatePresence>
        {showTooltip && (
          <motion.div
            className={styles.tooltip}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
          >
            <div className={styles.tooltipMain}>{s.sync[config.key]}</div>
            {lastSyncLabel && <div className={styles.tooltipSub}>{lastSyncLabel}</div>}
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  )
}
