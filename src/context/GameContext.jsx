/*
Requested mapping:
- energy: initialState, loadInitialState, applyRegen, ENERGY_TICK, SPEND_ENERGY, BUY_ITEM energy branch, reset, persistence effect, spendEnergy callback/value.
- energia: comment text only.
- maxEnergy: exported constant only.
- currentEnergy: none.
- recharge: ENERGY_REGEN_MS, applyRegen, timer effect.
- energyTimer: timer effect only.
- energyCost: none.
- spendEnergy: callback/value only.
- tickEnergyRecharge: none.
- refillEnergy: none.
- lastEnergyRecharge: none.
- energyRechargeRate: none.
- hasEnergy: none.
*/
import { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { storage } from '../utils/storage.js'
import { PHASES } from '../data/questions.js'
import { STOCKS, STOCK_META } from '../data/stocks.js'
import { PRODUCTS } from '../data/products'
import { MARKET_EVENTS } from '../data/marketEvents'

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

function buildInitialMarket() {
  const prices = {}
  const priceHistory = {}
  PRODUCTS.forEach(p => {
    prices[p.id] = p.basePrice
    priceHistory[p.id] = [p.basePrice]
  })
  return { prices, priceHistory }
}

const initialState = {
  currentPhase: 0,
  unlockedPhases: 1,
  totalScore: 0,
  coins: 120,
  stars: {},
  phaseResults: {},
  achievements: [],
  inventory: { hint: 1 },
  ownedMascots: [DEFAULT_MASCOT],
  selectedMascot: DEFAULT_MASCOT,
  stocks: initialStocks(),
  portfolio: initialPortfolio(),
  market: {
    ...buildInitialMarket(),
    round: 1,
    lastEventId: null,
    visitCount: 0,
  },
  basket: [],
  settings: {
    musicVolume: 0.4,
    sfxVolume: 0.6,
    animationsEnabled: true,
    language: 'pt'
  }
}

function loadInitialState() {
  let rawSave = {}
  try {
    rawSave = JSON.parse(localStorage.getItem('miriti_game_state') || '{}') || {}
  } catch {
    rawSave = {}
  }
  const {
    energy,
    maxEnergy,
    lastEnergyRecharge,
    energyRechargeRate,
    lastEnergyTs,
    ...safeState
  } = rawSave

  const saved = storage.get('game_state') || safeState
  return {
    ...initialState,
    ...saved,
    stars: { ...(saved.stars || {}) },
    phaseResults: { ...(saved.phaseResults || {}) },
    achievements: Array.isArray(saved.achievements) ? saved.achievements : [],
    inventory: { ...initialState.inventory, ...(saved.inventory || {}) },
    stocks: { ...initialStocks(), ...(saved.stocks || {}) },
    portfolio: { ...initialPortfolio(), ...(saved.portfolio || {}) },
    market: {
      ...initialState.market,
      ...(saved.market || {}),
      prices: { ...buildInitialMarket().prices, ...((saved.market && saved.market.prices) || {}) },
      priceHistory: { ...buildInitialMarket().priceHistory, ...((saved.market && saved.market.priceHistory) || {}) },
      round: (saved.market && typeof saved.market.round === 'number') ? saved.market.round : initialState.market.round,
      lastEventId: (saved.market && Object.prototype.hasOwnProperty.call(saved.market, 'lastEventId'))
        ? saved.market.lastEventId
        : initialState.market.lastEventId,
      visitCount: (saved.market && typeof saved.market.visitCount === 'number')
        ? saved.market.visitCount
        : initialState.market.visitCount,
    },
    basket: Array.isArray(saved.basket) ? saved.basket : initialState.basket,
    ownedMascots: (saved.ownedMascots && saved.ownedMascots.length) ? saved.ownedMascots : [DEFAULT_MASCOT],
    selectedMascot: saved.selectedMascot || DEFAULT_MASCOT,
    settings: { ...initialState.settings, ...(saved.settings || {}) }
  }
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
      const { kind, price, payload } = action.item
      if (state.coins < price) return state
      let next = { ...state, coins: state.coins - price }
      if (kind === 'hint') {
        next = { ...next, inventory: { ...next.inventory, hint: (next.inventory.hint || 0) + payload } }
      } else if (kind === 'mascot') {
        if (state.ownedMascots.includes(payload)) return state
        next = {
          ...next,
          ownedMascots: [...next.ownedMascots, payload],
          selectedMascot: payload
        }
      }
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

    case 'BUY_PRODUCT': {
      // action.payload: { productId, quantity }
      const product = PRODUCTS.find(p => p.id === action.payload.productId)
      const currentPrice = state.market.prices[action.payload.productId]
      const totalCost = currentPrice * action.payload.quantity
      if (!product || !currentPrice || state.coins < totalCost) return state

      const existingSlot = state.basket.find(
        b => b.productId === action.payload.productId
      )
      const currentBasketCount = state.basket.reduce(
        (sum, b) => sum + b.quantity, 0
      )
      if (currentBasketCount + action.payload.quantity > 8) return state

      const newBasket = existingSlot
        ? state.basket.map(b =>
          b.productId === action.payload.productId
            ? { ...b, quantity: b.quantity + action.payload.quantity }
            : b
        )
        : [
          ...state.basket,
          {
            productId: action.payload.productId,
            quantity: action.payload.quantity,
            boughtAt: currentPrice,
            roundBought: state.market.round,
          },
        ]

      return {
        ...state,
        coins: state.coins - totalCost,
        basket: newBasket,
      }
    }

    case 'SELL_PRODUCT': {
      // action.payload: { productId, quantity }
      const product = PRODUCTS.find(p => p.id === action.payload.productId)
      const slot = state.basket.find(
        b => b.productId === action.payload.productId
      )
      if (!product || !slot || slot.quantity < action.payload.quantity) return state

      // Verificar cooldown do Dende
      if (product.hasCooldown) {
        const roundsHeld = state.market.round - slot.roundBought
        if (roundsHeld < product.cooldownRounds) return state
      }

      const currentPrice = state.market.prices[action.payload.productId]
      const earnings = currentPrice * action.payload.quantity
      const newBasket = slot.quantity === action.payload.quantity
        ? state.basket.filter(b => b.productId !== action.payload.productId)
        : state.basket.map(b =>
          b.productId === action.payload.productId
            ? { ...b, quantity: b.quantity - action.payload.quantity }
            : b
        )

      return {
        ...state,
        coins: state.coins + earnings,
        basket: newBasket,
      }
    }

    case 'APPLY_MARKET_EVENT': {
      // action.payload: { event } — objeto completo do MARKET_EVENTS
      const event = action.payload?.event
      if (!event || !MARKET_EVENTS.some(ev => ev.id === event.id)) return state
      const newPrices = { ...state.market.prices }
      const newHistory = { ...state.market.priceHistory }

      event.effects.forEach(({ productId, delta }) => {
        const product = PRODUCTS.find(p => p.id === productId)
        if (!product) return
        const updated = Math.min(
          product.maxPrice,
          Math.max(product.minPrice, newPrices[productId] + delta)
        )
        newHistory[productId] = [
          ...(newHistory[productId] || []),
          updated,
        ].slice(-10) // guarda apenas os ultimos 10 precos
        newPrices[productId] = updated
      })

      return {
        ...state,
        market: {
          ...state.market,
          prices: newPrices,
          priceHistory: newHistory,
          lastEventId: event.id,
        },
      }
    }

    case 'ADVANCE_ROUND': {
      const newPrices = { ...state.market.prices }
      const newHistory = { ...state.market.priceHistory }

      PRODUCTS.forEach(product => {
        const variance = {
          low: 1,
          medium: 2,
          high: 4,
        }[product.volatility]
        const delta = Math.floor(Math.random() * (variance * 2 + 1)) - variance
        const updated = Math.min(
          product.maxPrice,
          Math.max(product.minPrice, newPrices[product.id] + delta)
        )
        newHistory[product.id] = [
          ...(newHistory[product.id] || []),
          updated,
        ].slice(-10)
        newPrices[product.id] = updated
      })

      return {
        ...state,
        market: {
          ...state.market,
          prices: newPrices,
          priceHistory: newHistory,
          round: state.market.round + 1,
          visitCount: state.market.visitCount + 1,
        },
      }
    }

    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } }

    case 'RESET':
      return { ...initialState, stocks: initialStocks(), portfolio: initialPortfolio() }

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

  const setPhase = useCallback((phase) => dispatch({ type: 'SET_PHASE', phase }), [])
  const spendEnergy = useCallback(() => { }, [])
  const completePhase = useCallback((payload) => dispatch({ type: 'COMPLETE_PHASE', payload }), [])
  const buyItem = useCallback((item) => dispatch({ type: 'BUY_ITEM', item }), [])
  const selectMascot = useCallback((mascot) => dispatch({ type: 'SELECT_MASCOT', mascot }), [])
  const useHint = useCallback(() => dispatch({ type: 'USE_HINT' }), [])
  const tickStocks = useCallback(() => dispatch({ type: 'STOCK_TICK' }), [])
  const buyStock = useCallback((id) => dispatch({ type: 'BUY_STOCK', id }), [])
  const sellStock = useCallback((id) => dispatch({ type: 'SELL_STOCK', id }), [])
  const buyProduct = useCallback((payload) => dispatch({ type: 'BUY_PRODUCT', payload }), [])
  const sellProduct = useCallback((payload) => dispatch({ type: 'SELL_PRODUCT', payload }), [])
  const applyMarketEvent = useCallback((event) => dispatch({ type: 'APPLY_MARKET_EVENT', payload: { event } }), [])
  const advanceRound = useCallback(() => dispatch({ type: 'ADVANCE_ROUND' }), [])
  const updateSettings = useCallback((payload) => dispatch({ type: 'UPDATE_SETTINGS', payload }), [])
  const resetProgress = useCallback(() => dispatch({ type: 'RESET' }), [])

  const value = {
    state,
    dispatch,
    setPhase, spendEnergy, completePhase,
    buyItem, selectMascot, useHint,
    tickStocks, buyStock, sellStock,
    buyProduct, sellProduct, applyMarketEvent, advanceRound,
    updateSettings, resetProgress
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame deve ser usado dentro de GameProvider')
  return ctx
}
