import { useState, useCallback, useEffect, useRef } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import HomeScreen from './components/HomeScreen.jsx'
import FarmMap from './components/FarmMap.jsx'
import EscolinhaScreen from './components/EscolinhaScreen.jsx'
import QuizScreen from './components/QuizScreen.jsx'
import ResultScreen from './components/ResultScreen.jsx'
import CooperativaScreen from './components/Cooperativa/index.jsx'
import NicknameScreen from './components/Onboarding/NicknameScreen.jsx'
import RecoveryCelebration from './components/Onboarding/RecoveryCelebration.jsx'
import AchievementsScreen from './components/AchievementsScreen.jsx'
import FeirinhaScreen from './components/Feirinha/index.jsx'
import OptionsModal from './components/OptionsModal.jsx'
import CreditsScreen from './components/CreditsScreen.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import MascotChat from './components/MascotChat.jsx'
import Tutorial from './components/Tutorial.jsx'
import ParentsPanel from './components/ParentsPanel.jsx'
import BossQuiz from './components/BossQuiz.jsx'
import { useGame } from './context/GameContext.jsx'
import { useStrings } from './i18n/index.js'
import { sound } from './utils/sound.js'

const SCREENS = {
  HOME:        'home',
  FARM:        'farm',
  ESCOLINHA:   'escolinha',
  QUIZ:        'quiz',
  RESULT:      'result',
  SHOP:        'shop',
  COOPERATIVA: 'cooperativa',
  ACHIEVEMENTS:'achievements',
  STOCKS:      'stocks',
  CREDITS:     'credits',
  PARENTS:     'parents',
  BOSS:        'boss',
}

const screenVariants = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
}

export default function App() {
  const [screen, setScreen]               = useState(SCREENS.HOME)
  const [optionsOpen, setOptionsOpen]     = useState(false)
  const [mascotChatOpen, setMascotChatOpen] = useState(false)
  const [tutorialOpen, setTutorialOpen]   = useState(false)
  const [bossPhase, setBossPhase]         = useState(0)
  const [lastResult, setLastResult]       = useState(null)
  const [pendingPlayerData, setPendingPlayerData] = useState(null)
  const { state, updateSettings, addPlayTime } = useGame()
  const s = useStrings()

  useEffect(() => {
    const init = () => {
      sound.init()
      sound.setMusicVolume(state.settings.musicVolume)
      sound.setSfxVolume(state.settings.sfxVolume)
      if (state.settings.musicVolume > 0) sound.startMusic()
      globalThis.removeEventListener('pointerdown', init)
      globalThis.removeEventListener('keydown', init)
    }
    globalThis.addEventListener('pointerdown', init)
    globalThis.addEventListener('keydown', init)
    return () => {
      globalThis.removeEventListener('pointerdown', init)
      globalThis.removeEventListener('keydown', init)
    }
  }, [state.settings.musicVolume, state.settings.sfxVolume])

  const playTickRef = useRef(null)
  useEffect(() => {
    const start = () => {
      if (playTickRef.current) return
      playTickRef.current = setInterval(() => {
        if (document.visibilityState === 'visible') addPlayTime(5)
      }, 5000)
    }
    const stop = () => {
      if (playTickRef.current) { clearInterval(playTickRef.current); playTickRef.current = null }
    }
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') stop(); else start()
    }
    start()
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => { document.removeEventListener('visibilitychange', onVisibilityChange); stop() }
  }, [addPlayTime])

  useEffect(() => {
    if (screen === SCREENS.FARM && !state.settings.tutorialDone) setTutorialOpen(true)
  }, [screen, state.settings.tutorialDone])

  const fontScale = state.settings.fontScale || 1
  useEffect(() => {
    const SCALE_MAP = { 1: '16px', 2: '17.92px', 3: '20px', 4: '22.4px' }
    document.documentElement.style.fontSize = SCALE_MAP[fontScale] ?? '16px'
    return () => { document.documentElement.style.fontSize = '' }
  }, [fontScale])

  const goTo = useCallback((target) => { sound.play('transition'); setScreen(target) }, [])
  const handleQuizComplete = useCallback((result) => { setLastResult(result); setScreen(SCREENS.RESULT) }, [])
  const startBoss = useCallback((phaseIndex) => { setBossPhase(phaseIndex); goTo(SCREENS.BOSS) }, [goTo])
  const finishTutorial = useCallback(() => { updateSettings({ tutorialDone: true }); setTutorialOpen(false) }, [updateSettings])

  // ── Onboarding gate (after all hooks) ──────────────────────────────────────
  if (!state.player?.id) {
    return <NicknameScreen onComplete={(data) => setPendingPlayerData(data)} />
  }
  if (!state.player?.hasOnboarded && pendingPlayerData) {
    return (
      <RecoveryCelebration
        playerData={pendingPlayerData}
        onComplete={() => setPendingPlayerData(null)}
      />
    )
  }

  const animationsEnabled = state.settings.animationsEnabled !== false

  const renderScreen = () => {
    switch (screen) {
      case SCREENS.FARM:
        return (
          <FarmMap
            onEscolinha={() => goTo(SCREENS.ESCOLINHA)}
            onShop={() => goTo(SCREENS.COOPERATIVA)}
            onCooperativa={() => goTo(SCREENS.COOPERATIVA)}
            onStocks={() => goTo(SCREENS.STOCKS)}
            onAchievements={() => goTo(SCREENS.ACHIEVEMENTS)}
            onSettings={() => setOptionsOpen(true)}
            onCredits={() => goTo(SCREENS.CREDITS)}
            onMascotClick={() => setMascotChatOpen(true)}
            onParents={() => goTo(SCREENS.PARENTS)}
          />
        )
      case SCREENS.ESCOLINHA:
        return (
          <EscolinhaScreen
            onPlayLesson={() => goTo(SCREENS.QUIZ)}
            onBack={() => goTo(SCREENS.FARM)}
            onPlayBoss={startBoss}
          />
        )
      case SCREENS.QUIZ:
        return <QuizScreen onComplete={handleQuizComplete} onQuit={() => goTo(SCREENS.ESCOLINHA)} />
      case SCREENS.RESULT:
        return (
          <ResultScreen
            result={lastResult}
            onContinue={() => goTo(SCREENS.ESCOLINHA)}
            onPlayAgain={() => goTo(SCREENS.QUIZ)}
          />
        )
      case SCREENS.COOPERATIVA:
      case SCREENS.SHOP:
        return <CooperativaScreen onBack={() => goTo(SCREENS.FARM)} />
      case SCREENS.ACHIEVEMENTS:
        return <AchievementsScreen onBack={() => goTo(SCREENS.FARM)} />
      case SCREENS.STOCKS:
        return <FeirinhaScreen onBack={() => goTo(SCREENS.FARM)} />
      case SCREENS.CREDITS:
        return <CreditsScreen onBack={() => goTo(SCREENS.FARM)} />
      case SCREENS.PARENTS:
        return <ParentsPanel onBack={() => goTo(SCREENS.FARM)} />
      case SCREENS.BOSS:
        return <BossQuiz phaseIndex={bossPhase} onExit={() => goTo(SCREENS.ESCOLINHA)} />
      case SCREENS.HOME:
      default:
        return <HomeScreen onStart={() => goTo(SCREENS.FARM)} />
    }
  }

  return (
    <MotionConfig reducedMotion={animationsEnabled ? 'never' : 'always'}>
      <div
        className={[
          'app-root',
          animationsEnabled ? '' : 'animations-off',
          `font-scale-${fontScale}`
        ].filter(Boolean).join(' ')}
      >
        <div className="app-content">
          <ErrorBoundary key={screen} strings={s.error} onReset={() => setScreen(SCREENS.HOME)}>
            <motion.div
              key={screen}
              className="screen"
              variants={screenVariants}
              initial="initial"
              animate="animate"
            >
              {renderScreen()}
            </motion.div>
          </ErrorBoundary>
        </div>

        <AnimatePresence>
          {optionsOpen && <OptionsModal onClose={() => setOptionsOpen(false)} />}
          {mascotChatOpen && <MascotChat onClose={() => setMascotChatOpen(false)} />}
          {tutorialOpen && <Tutorial onFinish={finishTutorial} />}
        </AnimatePresence>
      </div>
    </MotionConfig>
  )
}
