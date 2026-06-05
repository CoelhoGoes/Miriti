import { useState } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '../../context/GameContext'
import { useTutorial } from '../../hooks/useTutorial'
import { useStrings, useLanguage } from '../../i18n'
import { ANIMALS } from '../../data/animals'
import EquipAllyModal from '../Cooperativa/EquipAllyModal'
import styles from './AllySwitcher.module.css'

function pickLang(field, lang) {
  if (!field) return ''
  if (typeof field === 'string') return field
  return field[lang] ?? field.pt ?? ''
}

/**
 * Pílula compacta que mostra o Aliado em Campo e abre o EquipAllyModal.
 *
 * Componente INLINE: renderizado pelas telas que precisam dele
 * (actualmente apenas Feirinha header). Sem position: fixed nem SCREENS_WITH_*.
 *
 * - Esconde durante tutoriais activos
 * - Esconde se não há aliado equipado
 */
export default function AllySwitcher() {
  const { state } = useGame()
  const { isActive: isTutorialActive } = useTutorial()
  const s = useStrings()
  const lang = useLanguage()

  const [showModal, setShowModal] = useState(false)

  if (isTutorialActive) return null

  const activeAllyId = state.cooperativa?.activeAlly
  const allyData = ANIMALS.find(a => a.id === activeAllyId)
  if (!allyData) return null

  const alliesOwned = state.cooperativa?.alliesOwned ?? []
  const canSwap = alliesOwned.length > 1
  const tooltip = canSwap
    ? s.allySwitcher.tooltipDefault
    : s.allySwitcher.tooltipOnlyOne

  const allyName = pickLang(allyData.name, lang)

  return (
    <>
      <motion.button
        type="button"
        className={styles.switcher}
        onClick={() => canSwap && setShowModal(true)}
        disabled={!canSwap}
        title={tooltip}
        aria-label={s.allySwitcher.buttonAria}
        whileHover={canSwap ? { scale: 1.04 } : undefined}
        whileTap={canSwap ? { scale: 0.96 } : undefined}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
      >
        <span className={styles.label}>
          🐾 {s.allySwitcher.label}
        </span>
        <span className={styles.icon} aria-hidden="true">
          {allyData.icon}
        </span>
        <span className={styles.name}>{allyName}</span>
      </motion.button>

      {showModal && (
        <EquipAllyModal onClose={() => setShowModal(false)} />
      )}
    </>
  )
}
