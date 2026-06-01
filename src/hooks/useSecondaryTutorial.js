import { useEffect, useRef } from 'react'
import { useGame } from '../context/GameContext'
import { useTutorial } from './useTutorial'
import { useSecondaryTutorialData } from '../data/secondaryTutorials'

/**
 * Dispara automaticamente um tutorial secundário na 1ª visita a uma área.
 *
 * StrictMode-safe: usa timerRef (cancelado no cleanup) e hasFiredRef
 * (permanente por mount). Em StrictMode o cleanup→effect duplo cancela
 * o 1º timer; o 2º sobrevive e dispara normalmente.
 */
export function useSecondaryTutorial(key, ready = true) {
  const { visitArea } = useGame()
  const { start, hasCompleted, isActive } = useTutorial()
  const tutorialData = useSecondaryTutorialData(key)

  const timerRef   = useRef(null)
  const hasFiredRef = useRef(false)

  useEffect(() => {
    if (hasFiredRef.current) return
    if (!tutorialData || !ready) return

    if (tutorialData.triggerArea) {
      visitArea(tutorialData.triggerArea)
    }

    if (hasCompleted(tutorialData.id)) return
    if (isActive) return

    timerRef.current = setTimeout(() => {
      const ok = start(tutorialData.id, tutorialData.steps, tutorialData.reward)
      if (ok) hasFiredRef.current = true
      timerRef.current = null
    }, 700)

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tutorialData?.id, ready, isActive])
}
