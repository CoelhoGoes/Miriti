import { useMemo } from 'react'
import { motion } from 'framer-motion'
import './Confetti.css'

const COLORS = ['#fbbf24', '#f43f5e', '#a855f7', '#06b6d4', '#10b981', '#f97316', '#ec4899']
const SHAPES = ['square', 'circle', 'triangle']

export default function Confetti({ count = 60, active = true }) {
  const pieces = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      left: Math.random() * 100,
      delay: Math.random() * 0.6,
      duration: 2 + Math.random() * 1.5,
      drift: -100 + Math.random() * 200,
      rotation: Math.random() * 720,
      size: 8 + Math.random() * 8
    }))
  }, [count])

  if (!active) return null

  return (
    <div className="confetti-container" aria-hidden="true">
      {pieces.map(p => (
        <motion.div
          key={p.id}
          className={`confetti-piece confetti-${p.shape}`}
          style={{
            left: `${p.left}%`,
            background: p.shape === 'triangle' ? 'transparent' : p.color,
            borderBottomColor: p.shape === 'triangle' ? p.color : undefined,
            width: p.size,
            height: p.size
          }}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{
            y: window.innerHeight + 100,
            x: p.drift,
            rotate: p.rotation,
            opacity: [1, 1, 0]
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: 'easeIn'
          }}
        />
      ))}
    </div>
  )
}
