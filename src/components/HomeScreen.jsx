import { useEffect, useState } from 'react'
import { useSpring, animated } from '@react-spring/web'
import { motion } from 'framer-motion'
import AnimatedBackground from './AnimatedBackground.jsx'
import { sound } from '../utils/sound.js'
import { useStrings } from '../i18n/index.js'
import './HomeScreen.css'

export default function HomeScreen({ onStart }) {
  const [pressed, setPressed] = useState(false)
  const s = useStrings()

  // Animação do logo com React Spring
  const logoSpring = useSpring({
    from: { opacity: 0, scale: 0.4, rotate: -8 },
    to: { opacity: 1, scale: 1, rotate: 0 },
    config: { tension: 180, friction: 14 },
    delay: 200
  })

  const pulseSpring = useSpring({
    from: { scale: 1 },
    to: async (next) => {
      while (true) {
        await next({ scale: 1.05 })
        await next({ scale: 1 })
      }
    },
    config: { duration: 1500 }
  })

  useEffect(() => {
    if (pressed) return
    const handler = () => {
      if (pressed) return
      setPressed(true)
      sound.play('whoosh')
      sound.play('star')
      setTimeout(onStart, 350)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [pressed, onStart])

  const handleClick = () => {
    if (pressed) return
    setPressed(true)
    sound.play('whoosh')
    sound.play('star')
    setTimeout(onStart, 350)
  }

  return (
    <>
      <AnimatedBackground density={18} />

      <div className="home-content" onClick={handleClick} role="button" tabIndex={0}>
        <animated.div style={logoSpring} className="home-logo-wrap">
          <animated.div style={pulseSpring} className="home-logo">
            <span className="logo-letter" style={{ '--i': 0 }}>M</span>
            <span className="logo-letter" style={{ '--i': 1 }}>i</span>
            <span className="logo-letter" style={{ '--i': 2 }}>r</span>
            <span className="logo-letter" style={{ '--i': 3 }}>i</span>
            <span className="logo-letter" style={{ '--i': 4 }}>t</span>
            <span className="logo-letter" style={{ '--i': 5 }}>i</span>
          </animated.div>
          <motion.div
            className="home-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            {s.home.subtitle}
          </motion.div>
        </animated.div>

        <motion.div
          className="home-mascot"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 12 }}
        >
          <motion.div
            animate={{ y: [0, -12, 0], rotate: [-2, 2, -2] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            🦜
          </motion.div>
        </motion.div>

        <motion.div
          className="home-cta"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <motion.div
            className="cta-pulse"
            animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            {s.home.cta}
          </motion.div>
        </motion.div>
      </div>
    </>
  )
}
