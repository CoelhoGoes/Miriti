import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react'
import { useGame } from './GameContext'
import SpotlightOverlay from '../components/Tutorial/SpotlightOverlay'
import CofrinhoBubble from '../components/Tutorial/CofrinhoBubble'
import { useStrings } from '../i18n'
import { getBadgeByTutorialId } from '../data/badges'

const TutorialContext = createContext(null)

export function TutorialProvider({ children }) {
  const { state, completeTutorial, unlockBadge } = useGame()
  const s = useStrings()

  const [activeRun, setActiveRun] = useState(null)
  const completedSetRef = useRef(new Set(state.tutorialState?.completed ?? []))

  useEffect(() => {
    completedSetRef.current = new Set(state.tutorialState?.completed ?? [])
  }, [state.tutorialState?.completed])

  const start = useCallback((id, steps, reward = null, options = {}) => {
    if (!steps || steps.length === 0) {
      console.warn('[TutorialContext] start chamado sem steps:', id)
      return false
    }
    if (!options.force && completedSetRef.current.has(id)) return false
    if (activeRun) return false

    setActiveRun({
      id,
      steps,
      currentStepIndex: 0,
      reward,
      onComplete: options.onComplete ?? null,
    })
    return true
  }, [activeRun])

  const next = useCallback(() => {
    setActiveRun(prev => {
      if (!prev) return null
      const isLast = prev.currentStepIndex >= prev.steps.length - 1
      if (isLast) {
        completeTutorial(prev.id, prev.reward)
        const badge = getBadgeByTutorialId(prev.id)
        if (badge) unlockBadge(badge.id)
        if (typeof prev.onComplete === 'function') prev.onComplete()
        return null
      }
      return { ...prev, currentStepIndex: prev.currentStepIndex + 1 }
    })
  }, [completeTutorial, unlockBadge])

  const prev = useCallback(() => {
    setActiveRun(prevRun => {
      if (!prevRun) return null
      return { ...prevRun, currentStepIndex: Math.max(0, prevRun.currentStepIndex - 1) }
    })
  }, [])

  const skip = useCallback(() => {
    setActiveRun(prev => {
      if (!prev) return null
      completeTutorial(prev.id, null)
      if (typeof prev.onComplete === 'function') prev.onComplete()
      return null
    })
  }, [completeTutorial])

  const hasCompleted = useCallback((id) => completedSetRef.current.has(id), [])

  const value = {
    isActive:    Boolean(activeRun),
    activeId:    activeRun?.id ?? null,
    currentStep: activeRun?.currentStepIndex ?? 0,
    totalSteps:  activeRun?.steps?.length ?? 0,
    start,
    next,
    prev,
    skip,
    hasCompleted,
  }

  const currentStepData = activeRun ? activeRun.steps[activeRun.currentStepIndex] : null
  const isFinalStep = activeRun
    ? activeRun.currentStepIndex >= activeRun.steps.length - 1
    : false

  return (
    <TutorialContext.Provider value={value}>
      {children}

      {currentStepData && (
        <>
          <SpotlightOverlay
            isOpen={true}
            targetSelector={currentStepData.target ?? null}
            onBlockerClick={() => {}}
          />
          <CofrinhoBubble
            isOpen={true}
            targetSelector={currentStepData.target ?? null}
            preferredSide={currentStepData.side ?? 'bottom'}
            cofrinhoState={currentStepData.cofrinhoState ?? 'idle'}
            title={currentStepData.title}
            text={currentStepData.text}
            currentStep={activeRun.currentStepIndex}
            totalSteps={activeRun.steps.length}
            isFinalStep={isFinalStep}
            canSkip={true}
            canGoBack={true}
            onSkip={skip}
            onPrev={prev}
            onNext={next}
            labels={{
              skip:   s.tutorial.controls.skip,
              prev:   s.tutorial.controls.prev,
              next:   s.tutorial.controls.next,
              finish: s.tutorial.controls.finish,
            }}
          />
        </>
      )}
    </TutorialContext.Provider>
  )
}

export function useTutorialContext() {
  const ctx = useContext(TutorialContext)
  if (!ctx) throw new Error('useTutorialContext deve ser usado dentro de <TutorialProvider>')
  return ctx
}
