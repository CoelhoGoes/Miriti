/*
Requested mapping:
- energy: none.
- energia: none.
- maxEnergy: none.
- currentEnergy: none.
- recharge: none.
- energyTimer: none.
- energyCost: none.
- spendEnergy: none.
- tickEnergyRecharge: none.
- refillEnergy: none.
- lastEnergyRecharge: none.
- energyRechargeRate: none.
- hasEnergy: none.
*/
import { useState, useCallback, useEffect, useRef } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import HomeScreen from './components/HomeScreen.jsx'
import FarmMap from './components/FarmMap.jsx'
import EscolinhaScreen from './components/EscolinhaScreen.jsx'
import QuizScreen from './components/QuizScreen.jsx'
import ResultScreen from './components/ResultScreen.jsx'
import ShopScreen from './components/ShopScreen.jsx'
import AchievementsScreen from './components/AchievementsScreen.jsx'
// import StockMarketScreen from './components/StockMarketScreen.jsx'
import FeirinhaScreen from './components/Feirinha/index.jsx'
import OptionsModal from './components/OptionsModal.jsx'
import CreditsScreen from './components/CreditsScreen.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import MascotChat from './components/MascotChat.jsx'
import Tutorial from './components/Tutorial.jsx'
import ParentsPanel from './components/ParentsPanel.jsx'
import BossQuiz from './components/BossQuiz.jsx'
import ColorblindFilters from './components/ColorblindFilters.jsx'
import { useGame } from './context/GameContext.jsx'
import { useStrings } from './i18n/index.js'
import { sound } from './utils/sound.js'

const SCREENS = {
  HOME: 'home',
  FARM: 'farm',
  ESCOLINHA: 'escolinha',
  QUIZ: 'quiz',
  RESULT: 'result',
  SHOP: 'shop',
  ACHIEVEMENTS: 'achievements',
  STOCKS: 'stocks',
  CREDITS: 'credits',
  PARENTS: 'parents',
  BOSS: 'boss'
}

const screenVariants = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
}

export default function App() {
  const [screen, setScreen] = useState(SCREENS.HOME)
  const [optionsOpen, setOptionsOpen] = useState(false)
  const [mascotChatOpen, setMascotChatOpen] = useState(false)
  const [tutorialOpen, setTutorialOpen] = useState(false)
  const [bossPhase, setBossPhase] = useState(0)
  const [lastResult, setLastResult] = useState(null)
  const { state, updateSettings, addPlayTime } = useGame()
  const s = useStrings()

  useEffect(() => {
    const init = () => {
      sound.init()
      sound.setMusicVolume(state.settings.musicVolume)
      sound.setSfxVolume(state.settings.sfxVolume)
      if (state.settings.musicVolume > 0) sound.startMusic()
      window.removeEventListener('pointerdown', init)
      window.removeEventListener('keydown', init)
    }
    window.addEventListener('pointerdown', init)
    window.addEventListener('keydown', init)
    return () => {
      window.removeEventListener('pointerdown', init)
      window.removeEventListener('keydown', init)
    }
  }, [state.settings.musicVolume, state.settings.sfxVolume])

  // Tracker simples de tempo de jogo (acumula segundos enquanto a aba está visível)
  const playTickRef = useRef(null)
  useEffect(() => {
    const start = () => {
      if (playTickRef.current) return
      playTickRef.current = setInterval(() => {
        if (document.visibilityState === 'visible') {
          addPlayTime(5)
        }
      }, 5000)
    }
    const stop = () => {
      if (playTickRef.current) {
        clearInterval(playTickRef.current)
        playTickRef.current = null
      }
    }
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') stop()
      else start()
    }
    start()
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
      stop()
    }
  }, [addPlayTime])

  const goTo = useCallback((target) => {
    sound.play('transition')
    setScreen(target)
  }, [])

  const handleQuizComplete = useCallback((result) => {
    setLastResult(result)
    setScreen(SCREENS.RESULT)
  }, [])

  const startBoss = useCallback((phaseIndex) => {
    setBossPhase(phaseIndex)
    goTo(SCREENS.BOSS)
  }, [goTo])

  // Dispara o tutorial ao chegar na fazendinha pela primeira vez
  useEffect(() => {
    if (screen === SCREENS.FARM && !state.settings.tutorialDone) {
      setTutorialOpen(true)
    }
  }, [screen, state.settings.tutorialDone])

  const finishTutorial = useCallback(() => {
    updateSettings({ tutorialDone: true })
    setTutorialOpen(false)
  }, [updateSettings])

  const renderScreen = () => {
    switch (screen) {
      case SCREENS.FARM:
        return (
          <FarmMap
            onEscolinha={() => goTo(SCREENS.ESCOLINHA)}
            onShop={() => goTo(SCREENS.SHOP)}
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
        return (
          <QuizScreen
            onComplete={handleQuizComplete}
            onQuit={() => goTo(SCREENS.ESCOLINHA)}
          />
        )
      case SCREENS.RESULT:
        return (
          <ResultScreen
            result={lastResult}
            onContinue={() => goTo(SCREENS.ESCOLINHA)}
            onPlayAgain={() => goTo(SCREENS.QUIZ)}
          />
        )
      case SCREENS.SHOP:
        return <ShopScreen onBack={() => goTo(SCREENS.FARM)} />
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

  const animationsEnabled = state.settings.animationsEnabled !== false
  const fontScale = state.settings.fontScale || 1
  const cbMode = state.settings.colorblindMode || 'none'
  const cbClass = cbMode === 'none' ? '' : `cb-${cbMode}`

  return (
    <MotionConfig reducedMotion={animationsEnabled ? 'never' : 'always'}>
      <ColorblindFilters />
      <div
        className={[
          'app-root',
          animationsEnabled ? '' : 'animations-off',
          `font-scale-${fontScale}`,
          cbClass
        ].filter(Boolean).join(' ')}
      >
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

        <AnimatePresence>
          {optionsOpen && (
            <OptionsModal onClose={() => setOptionsOpen(false)} />
          )}
          {mascotChatOpen && (
            <MascotChat onClose={() => setMascotChatOpen(false)} />
          )}
          {tutorialOpen && (
            <Tutorial onFinish={finishTutorial} />
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  )
}
