/* eslint-disable react/prop-types */
import { AnimatePresence, motion } from 'framer-motion'
import { useGame } from '../../context/GameContext'
import { useScreenContext } from '../../hooks/useScreenContext'
import { useTutorial } from '../../hooks/useTutorial'
import { useStrings, useLanguage } from '../../i18n'
import { ANIMALS } from '../../data/animals'
import styles from './ActiveBuffsBar.module.css'

const SCREENS_WITH_BUFFS = new Set(['farm', 'fair', 'cooperativa', 'quiz'])

function pickLang(field, lang) {
  if (!field) return ''
  if (typeof field === 'string') return field
  return field[lang] ?? field.pt ?? ''
}

/**
 * Barra horizontal de Parceiros activos.
 *
 * - Modo padrão (sem props): top-fixed, validação por SCREENS_WITH_BUFFS
 * - Modo inline (<ActiveBuffsBar inline />): sem position fixed,
 *   pai controla onde aparecer — usado pelo header da Feirinha
 *
 * @param {boolean} [inline=false]
 */
export default function ActiveBuffsBar({ inline = false }) {
  const { state } = useGame()
  const screen = useScreenContext()
  const { isActive: isTutorialActive } = useTutorial()
  const s = useStrings()
  const lang = useLanguage()

  if (isTutorialActive) return null
  if (!inline && !SCREENS_WITH_BUFFS.has(screen)) return null

  const activePartners = state.cooperativa?.activePartners ?? []
  if (activePartners.length === 0) return null

  return (
    <div
      className={inline ? styles.barInline : styles.bar}
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
    </div>
  )
}
