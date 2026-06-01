import { useState } from 'react'
import { motion } from 'framer-motion'
import { useStrings } from '../../i18n'
import { useTutorial } from '../../hooks/useTutorial'
import { useSecondaryTutorialData } from '../../data/secondaryTutorials'
import styles from './TutorialHelpButton.module.css'

/**
 * Botão "❓" no header de cada tela com tutorial secundário.
 * Dispara o tutorial com force=true — mesmo se já concluído.
 * Refazer não duplica recompensa nem badge (ambos são idempotentes).
 */
export default function TutorialHelpButton({ tutorialKey }) {
  const s = useStrings()
  const { start, isActive } = useTutorial()
  const tutorialData = useSecondaryTutorialData(tutorialKey)
  const [pressed, setPressed] = useState(false)

  if (!tutorialData) return null

  const handleClick = () => {
    if (isActive || pressed) return
    setPressed(true)
    setTimeout(() => {
      start(tutorialData.id, tutorialData.steps, tutorialData.reward, { force: true })
      setPressed(false)
    }, 150)
  }

  return (
    <motion.button
      type="button"
      className={styles.helpButton}
      onClick={handleClick}
      disabled={isActive}
      aria-label={s.tutorialHelp.buttonAria}
      title={s.tutorialHelp.buttonTitle}
      whileHover={!isActive ? { scale: 1.08 } : undefined}
      whileTap={!isActive ? { scale: 0.92 } : undefined}
    >
      {s.tutorialHelp.shortLabel}
    </motion.button>
  )
}
