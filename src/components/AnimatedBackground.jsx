import { useMemo } from 'react'
import './AnimatedBackground.css'

const EMOJIS = ['🌻', '🐔', '🦋', '🐝', '🍃', '🐄', '🌾', '🐸', '🌳', '🦜', '🐞', '🌷']

/**
 * Fundo decorativo. As animações são feitas só com CSS (sem framer-motion),
 * o que mantém o jogo leve e fluido.
 */
export default function AnimatedBackground({
  gradient = 'linear-gradient(135deg, #15803d 0%, #0d9488 50%, #0e7490 100%)',
  density = 10
}) {
  const items = useMemo(() => {
    return Array.from({ length: density }, (_, i) => ({
      id: i,
      emoji: EMOJIS[i % EMOJIS.length],
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 22 + Math.random() * 30,
      duration: 9 + Math.random() * 9,
      delay: -Math.random() * 12
    }))
  }, [density])

  return (
    <div className="animated-bg" style={{ background: gradient }} aria-hidden="true">
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      {items.map(item => (
        <div
          key={item.id}
          className="bg-item"
          style={{
            left: `${item.left}%`,
            top: `${item.top}%`,
            fontSize: `${item.size}px`,
            animationDuration: `${item.duration}s`,
            animationDelay: `${item.delay}s`
          }}
        >
          {item.emoji}
        </div>
      ))}
    </div>
  )
}
