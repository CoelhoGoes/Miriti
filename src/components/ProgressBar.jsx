import { motion } from 'framer-motion'
import './ProgressBar.css'

export default function ProgressBar({ value, max, label, color = '#10b981' }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  return (
    <div className="progress-bar-wrap">
      {label && (
        <div className="progress-label">
          <span>{label}</span>
          <span>{value} / {max}</span>
        </div>
      )}
      <div className="progress-track">
        <motion.div
          className="progress-fill"
          style={{ background: `linear-gradient(90deg, ${color}, ${color}cc)` }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="progress-shine" />
        </motion.div>
      </div>
    </div>
  )
}
