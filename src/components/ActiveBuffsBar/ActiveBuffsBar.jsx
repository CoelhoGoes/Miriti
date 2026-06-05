import { AnimatePresence, motion } from 'framer-motion'
import { useGame } from '../../context/GameContext'
import { useScreenContext } from '../../hooks/useScreenContext'
import { useTutorial } from '../../hooks/useTutorial'
import { useStrings, useLanguage } from '../../i18n'
import { ANIMALS } from '../../data/animals'
import styles from './ActiveBuffsBar.module.css'

const SCREENS_WITH_BUFFS = ['farm', 'fair', 'cooperativa', 'quiz']

function pickLang(field, lang) {
  if (!field) return ''
  if (typeof field === 'string') return field
  return field[lang] ?? field.pt ?? ''
}

/**
 * Barra horizontal compacta que mostra Parceiros activos.
 *
 * - Aparece em telas listadas em SCREENS_WITH_BUFFS
 * - Esconde-se durante tutoriais activos
 * - Esconde-se se não há parceiros activos
 * - Chip amarelo com pulse quando roundsLeft === 1
 */
export default function ActiveBuffsBar() {
  const { state } = useGame()
  const screen = useScreenContext()
  const { isActive: isTutorialActive } = useTutorial()
  const s = useStrings()
  const lang = useLanguage()

  if (isTutorialActive) return null
  if (!SCREENS_WITH_BUFFS.includes(screen)) return null

  const activePartners = state.cooperativa?.activePartners ?? []
  if (activePartners.length === 0) return null

  return (
    <motion.div
      className={styles.bar}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      role="status"
      aria-live="polite"
    >
      <span className={styles.label}>
        ⏱️ {s.activeBuffs.label}
      </span>

      <div className={styles.chipsList}>
        <AnimatePresence>
          {activePartners.map(partner => {
            const animal = ANIMALS.find(a => a.id === partner.id)
            if (!animal) return null

            const name = pickLang(animal.name, lang)
            const description = pickLang(animal.description, lang)
            const tooltipText = s.activeBuffs.tooltipFormat
              .replace('{name}', name)
              .replace('{description}', description)

            const roundsTemplate = partner.roundsLeft === 1
              ? s.activeBuffs.roundsSingular
              : s.activeBuffs.roundsLabel
            const roundsText = roundsTemplate.replace('{n}', partner.roundsLeft)

            const chipClass = [
              styles.chip,
              partner.roundsLeft === 1 && styles.chipExpiring,
            ].filter(Boolean).join(' ')

            return (
              <motion.div
                key={partner.id}
                className={chipClass}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6, transition: { duration: 0.25 } }}
                transition={{ type: 'spring', damping: 18, stiffness: 240 }}
                title={tooltipText}
              >
                <span className={styles.chipIcon} aria-hidden="true">
                  {animal.icon}
                </span>
                <span className={styles.chipName}>{name}</span>
                <span className={styles.chipTime}>({roundsText})</span>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
