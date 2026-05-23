import { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { storage } from '../utils/storage.js'
import { PHASES } from '../data/questions.js'
import { STOCKS, STOCK_META } from '../data/stocks.js'

const GameContext = createContext(null)

/* ---- Constantes de jogo ---- */
export const MAX_ENERGY = 5
export const ENERGY_REGEN_MS = 2 * 60 * 1000 // 1 energia a cada 2 minutos
export const DEFAULT_MASCOT = '🦜'

function initialStocks() {
  const s = {}
  STOCKS.forEach(st => { s[st.id] = { price: st.basePrice, history: [st.basePrice] } })
  return s
}
function initialPortfolio() {
  const p = {}
  STOCKS.forEach(st => { p[st.id] = 0 })
  return p
}

const initialState = {
  currentPhase: 0,
  unlockedPhases: 1,
  totalScore: 0,
  coins: 120,
  stars: {},
  phaseResults: {},
  achievements: [],
  energy: MAX_ENERGY,
  lastEnergyTs: Date.now(),
  inventory: { hint: 1 },
  ownedMascots: [DEFAULT_MASCOT],
  selectedMascot: DEFAULT_MASCOT,
  stocks: initialStocks(),
  portfolio: initialPortfolio(),
  settings: {
    musicVolume: 0.4,
    sfxVolume: 0.6,
    animationsEnabled: true,
    language: 'pt'
  }
}

function loadInitialState() {
  const saved = storage.get('game_state')
  if (!saved) return initialState
  return {
    ...initialState,
    ...saved,
    stars: { ...(saved.stars || {}) },
    phaseResults: { ...(saved.phaseResults || {}) },
    achievements: Array.isArray(saved.achievements) ? saved.achievements : [],
    inventory: { ...initialState.inventory, ...(saved.inventory || {}) },
    stocks: { ...initialStocks(), ...(saved.stocks || {}) },
    portfolio: { ...initialPortfolio(), ...(saved.portfolio || {}) },
    ownedMascots: (saved.ownedMascots && saved.ownedMascots.length) ? saved.ownedMascots : [DEFAULT_MASCOT],
    selectedMascot: saved.selectedMascot || DEFAULT_MASCOT,
    energy: typeof saved.energy === 'number' ? saved.energy : MAX_ENERGY,
    lastEnergyTs: saved.lastEnergyTs || Date.now(),
    settings: { ...initialState.settings, ...(saved.settings || {}) }
  }
}

/* Recalcula a energia regenerada com base no tempo decorrido. */
function applyRegen(state, now) {
  if (state.energy >= MAX_ENERGY) return state
  const gained = Math.floor((now - state.lastEnergyTs) / ENERGY_REGEN_MS)
  if (gained <= 0) return state
  const energy = Math.min(MAX_ENERGY, state.energy + gained)
  return { ...state, energy, lastEnergyTs: state.lastEnergyTs + gained * ENERGY_REGEN_MS }
}

/* Concede conquistas com base no estado atual + ids extras de eventos. */
function grantAchievements(state, extra = []) {
  const have = new Set(state.achievements)
  extra.forEach(id => have.add(id))
  const starsTotal = Object.values(state.stars).reduce((a, b) => a + b, 0)
  const lessonsDone = Object.keys(state.phaseResults).length
  if (lessonsDone >= 1) have.add('first_lesson')
  if (lessonsDone >= PHASES.length) have.add('all_lessons')
  if (Object.values(state.stars).some(s => s >= 3)) have.add('perfect')
  if (starsTotal >= 9) have.add('star_collector')
  if (state.coins >= 300) have.add('rich')
  if (state.ownedMascots.length >= 3) have.add('collector')
  return [...have]
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_PHASE':
      return { ...state, currentPhase: action.phase }

    case 'ENERGY_TICK':
      return applyRegen(state, Date.now())

    case 'SPEND_ENERGY': {
      const now = Date.now()
      const s = applyRegen(state, now)
      if (s.energy <= 0) return s
      const wasFull = s.energy >= MAX_ENERGY
      return { ...s, energy: s.energy - 1, lastEnergyTs: wasFull ? now : s.lastEnergyTs }
    }

    case 'COMPLETE_PHASE': {
      const { phase, correctAnswers, totalQuestions, earnedCoins } = action.payload
      const accuracy = totalQuestions > 0 ? correctAnswers / totalQuestions : 0

      let stars = 0
      if (accuracy >= 0.9) stars = 3
      else if (accuracy >= 0.7) stars = 2
      else if (accuracy >= 0.5) stars = 1

      const prevStars = state.stars[phase] || 0
      const newStars = { ...state.stars, [phase]: Math.max(prevStars, stars) }

      const unlocked = Math.max(
        state.unlockedPhases,
        accuracy >= 0.5 ? Math.min(PHASES.length, phase + 2) : state.unlockedPhases
      )

      const phaseResults = {
        ...state.phaseResults,
        [phase]: { correctAnswers, totalQuestions, stars, accuracy }
      }

      const next = {
        ...state,
        unlockedPhases: unlocked,
        stars: newStars,
        totalScore: state.totalScore + correctAnswers * 10,
        coins: state.coins + earnedCoins,
        phaseResults
      }
      return { ...next, achievements: grantAchievements(next) }
    }

    case 'BUY_ITEM': {
      const { id, kind, price, payload } = action.item
      if (state.coins < price) return state
      let next = { ...state, coins: state.coins - price }
      if (kind === 'energy') {
        next = { ...next, energy: MAX_ENERGY }
      } else if (kind === 'hint') {
        next = { ...next, inventory: { ...next.inventory, hint: (next.inventory.hint || 0) + payload } }
      } else if (kind === 'mascot') {
        if (state.ownedMascots.includes(payload)) return state
        next = {
          ...next,
          ownedMascots: [...next.ownedMascots, payload],
          selectedMascot: payload
        }
      }
      void id
      return { ...next, achievements: grantAchievements(next, ['shopper']) }
    }

    case 'SELECT_MASCOT':
      if (!state.ownedMascots.includes(action.mascot)) return state
      return { ...state, selectedMascot: action.mascot }

    case 'USE_HINT':
      return {
        ...state,
        inventory: { ...state.inventory, hint: Math.max(0, (state.inventory.hint || 0) - 1) }
      }

    case 'STOCK_TICK': {
      const stocks = {}
      for (const id in state.stocks) {
        const cur = state.stocks[id]
        const meta = STOCK_META[id]
        if (!meta) { stocks[id] = cur; continue }
        const change = 1 + (Math.random() * 0.26 - 0.13) // entre -13% e +13%
        const min = Math.max(3, Math.round(meta.basePrice * 0.4))
        const max = Math.round(meta.basePrice * 2.5)
        const price = Math.min(max, Math.max(min, Math.round(cur.price * change)))
        stocks[id] = { price, history: [...cur.history, price].slice(-24) }
      }
      return { ...state, stocks }
    }

    case 'BUY_STOCK': {
      const stock = state.stocks[action.id]
      if (!stock || state.coins < stock.price) return state
      const next = {
        ...state,
        coins: state.coins - stock.price,
        portfolio: { ...state.portfolio, [action.id]: (state.portfolio[action.id] || 0) + 1 }
      }
      return { ...next, achievements: grantAchievements(next, ['investor']) }
    }

    case 'SELL_STOCK': {
      const stock = state.stocks[action.id]
      const owned = state.portfolio[action.id] || 0
      if (!stock || owned <= 0) return state
      const meta = STOCK_META[action.id]
      const profit = meta && stock.price > meta.basePrice
      const next = {
        ...state,
        coins: state.coins + stock.price,
        portfolio: { ...state.portfolio, [action.id]: owned - 1 }
      }
      return { ...next, achievements: grantAchievements(next, profit ? ['trader'] : []) }
    }

    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } }

    case 'RESET':
      return { ...initialState, lastEnergyTs: Date.now(), stocks: initialStocks(), portfolio: initialPortfolio() }

    default:
      return state
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitialState)

  // Persistência automática
  useEffect(() => {
    storage.set('game_state', state)
  }, [state])

  // Regeneração de energia ao longo do tempo
  useEffect(() => {
    const iv = setInterval(() => dispatch({ type: 'ENERGY_TICK' }), 8000)
    return () => clearInterval(iv)
  }, [])

  const setPhase = useCallback((phase) => dispatch({ type: 'SET_PHASE', phase }), [])
  const spendEnergy = useCallback(() => dispatch({ type: 'SPEND_ENERGY' }), [])
  const completePhase = useCallback((payload) => dispatch({ type: 'COMPLETE_PHASE', payload }), [])
  const buyItem = useCallback((item) => dispatch({ type: 'BUY_ITEM', item }), [])
  const selectMascot = useCallback((mascot) => dispatch({ type: 'SELECT_MASCOT', mascot }), [])
  const useHint = useCallback(() => dispatch({ type: 'USE_HINT' }), [])
  const tickStocks = useCallback(() => dispatch({ type: 'STOCK_TICK' }), [])
  const buyStock = useCallback((id) => dispatch({ type: 'BUY_STOCK', id }), [])
  const sellStock = useCallback((id) => dispatch({ type: 'SELL_STOCK', id }), [])
  const updateSettings = useCallback((payload) => dispatch({ type: 'UPDATE_SETTINGS', payload }), [])
  const resetProgress = useCallback(() => dispatch({ type: 'RESET' }), [])

  const value = {
    state,
    setPhase, spendEnergy, completePhase,
    buyItem, selectMascot, useHint,
    tickStocks, buyStock, sellStock,
    updateSettings, resetProgress
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame deve ser usado dentro de GameProvider')
  return ctx
}
