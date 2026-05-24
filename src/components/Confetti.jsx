import { useMemo } from 'react'
import { motion } from 'framer-motion'
import './Confetti.css'

const PALETTES = {
  default: ['#fbbf24', '#f43f5e', '#a855f7', '#06b6d4', '#10b981', '#f97316', '#ec4899'],
  warm:    ['#fbbf24', '#f97316', '#ef4444', '#ec4899', '#d946ef'],
  cool:    ['#06b6d4', '#0ea5e9', '#3b82f6', '#10b981', '#a855f7'],
  amazon:  ['#16a34a', '#22c55e', '#eab308', '#65a30d', '#0d9488'],
  gold:    ['#fde047', '#facc15', '#f59e0b', '#fbbf24', '#fef9c3']
}

const ALL_SHAPES = ['square', 'circle', 'triangle', 'star', 'heart']

function randomPalette() {
  const keys = Object.keys(PALETTES)
  return PALETTES[keys[Math.floor(Math.random() * keys.length)]]
}

export default function Confetti({ count = 60, active = true, palette, shapes }) {
  const pieces = useMemo(() => {
    const colors = palette
      ? (PALETTES[palette] || PALETTES.default)
      : randomPalette()
    const shapeSet = shapes && shapes.length > 0 ? shapes : ALL_SHAPES
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapeSet[Math.floor(Math.random() * shapeSet.length)],
      left: Math.random() * 100,
      delay: Math.random() * 0.6,
      duration: 2 + Math.random() * 1.5,
      drift: -100 + Math.random() * 200,
      rotation: Math.random() * 720,
      size: 8 + Math.random() * 10
    }))
  }, [count, palette, shapes])

  if (!active) return null

  return (
    <div className="confetti-container" aria-hidden="true">
      {pieces.map(p => {
        const isPath = p.shape === 'star' || p.shape === 'heart'
        return (
          <motion.div
            key={p.id}
            className={`confetti-piece confetti-${p.shape}`}
            style={{
              left: `${p.left}%`,
              background: (p.shape === 'triangle' || isPath) ? 'transparent' : p.color,
              borderBottomColor: p.shape === 'triangle' ? p.color : undefined,
              width: p.size,
              height: p.size,
              color: p.color,
              fontSize: isPath ? `${p.size + 6}px` : undefined
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
          >
            {p.shape === 'star' && '★'}
            {p.shape === 'heart' && '♥'}
          </motion.div>
        )
      })}
    </div>
  )
}
