import { motion } from 'framer-motion'
import { FaArrowLeft, FaReact, FaHeart, FaCode, FaCss3, FaPalette } from 'react-icons/fa'
import AnimatedBackground from './AnimatedBackground.jsx'
import { sound } from '../utils/sound.js'
import { useStrings, useLanguage, pick } from '../i18n/index.js'
import './CreditsScreen.css'

const team = [
  'Equipe Miriti',
  'Cauê Jadão, Bernardo Lins e Gabriel Góes'
]

const techs = [
  { icon: FaReact, label: { pt: 'React', en: 'React' }, color: 'var(--color-primary)' },
  { icon: FaCode, label: { pt: 'Framer Motion', en: 'Framer Motion' }, color: 'var(--color-danger)' },
  { icon: FaCss3, label: { pt: 'CSS Moderno', en: 'Modern CSS' }, color: 'var(--color-secondary)' },
  { icon: FaPalette, label: { pt: 'Design Lúdico', en: 'Playful Design' }, color: 'var(--color-warning)' }
]

export default function CreditsScreen({ onBack }) {
  const s = useStrings()
  const lang = useLanguage()

  return (
    <>
      <AnimatedBackground density={12} />

      <div className="credits-content">
        <motion.button
          className="credits-back"
          onClick={() => { sound.play('click'); onBack() }}
          onMouseEnter={() => sound.play('hover')}
          whileHover={{ scale: 1.05, x: -4 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <FaArrowLeft /> {s.common.back}
        </motion.button>

        <motion.h1
          className="credits-title"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 14 }}
        >
          🐔 Miriti
        </motion.h1>

        <motion.p
          className="credits-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {s.credits.subtitle}
        </motion.p>

        {/* Tecnologias */}
        <motion.div
          className="credits-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="credits-section-title">{s.credits.techTitle}</h3>
          <div className="tech-grid">
            {techs.map((t, i) => {
              const Icon = t.icon
              return (
                <motion.div
                  key={i}
                  className="tech-card"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.08 }}
                >
                  <Icon style={{ color: t.color }} />
                  <span>{pick(t.label, lang)}</span>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Equipe */}
        <motion.div
          className="credits-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h3 className="credits-section-title">{s.credits.teamTitle}</h3>
          <div className="credits-list">
            {team.map((name, i) => (
              <motion.div
                key={i}
                className="credit-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + i * 0.08 }}
              >
                <div className="credit-role">{s.credits.roles[i]}</div>
                <div className="credit-name">{name}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Agradecimentos */}
        <motion.div
          className="credits-thanks"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          <FaHeart className="thanks-heart" />
          <p>{s.credits.thanks}</p>
          <p className="thanks-version">{s.credits.version}</p>
        </motion.div>
      </div>
    </>
  )
}
