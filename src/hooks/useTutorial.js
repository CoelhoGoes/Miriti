import { useCallback } from 'react'
import { useTutorialContext } from '../context/TutorialContext'
import { useGame } from '../context/GameContext'

/**
 * API pública para qualquer componente interagir com tutoriais.
 *
 * Exemplo:
 *   const { start, hasCompleted, isActive } = useTutorial()
 *   start('tutorial.area.feira', stepsArray, { coins: 10 })
 */
export function useTutorial() {
  const ctx = useTutorialContext()
  const { state, resetTutorial } = useGame()

  const reset = useCallback((tutorialId) => {
    resetTutorial(tutorialId)
  }, [resetTutorial])

  return {
    isActive:    ctx.isActive,
    activeId:    ctx.activeId,
    currentStep: ctx.currentStep,
    totalSteps:  ctx.totalSteps,

    start:        ctx.start,
    next:         ctx.next,
    prev:         ctx.prev,
    skip:         ctx.skip,
    hasCompleted: ctx.hasCompleted,
    reset,

    completedTutorials: state.tutorialState?.completed ?? [],
    visitedAreas:       state.tutorialState?.visitedAreas ?? [],
  }
}
