/* eslint-disable react/prop-types */
import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FaArrowLeft } from 'react-icons/fa'
import { PRODUCTS } from '../../data/products'
import { MARKET_EVENTS } from '../../data/marketEvents'
import { useGame } from '../../context/GameContext.jsx'
import { useStrings } from '../../i18n/index.js'
import EventCard from './EventCard'
import ProductCard from './ProductCard'
import CestaDaFamilia from './CestaDaFamilia'
import CofrinhoTipCard from './CofrinhoTipCard'
import PriceHistoryModal from './PriceHistoryModal'
import ProductFilterTabs, { FILTER_TYPES } from './ProductFilterTabs'
import { getBarometerLevel } from './Barometer'
import styles from './FeirinhaScreen.module.css'
import { useSecondaryTutorial } from '../../hooks/useSecondaryTutorial'
import TutorialHelpButton from '../Tutorial/TutorialHelpButton'
import AllySwitcher from '../AllySwitcher/AllySwitcher'
import ActiveBuffsBar from '../ActiveBuffsBar/ActiveBuffsBar'

function pickEvent(lastEventId) {
  const pool = MARKET_EVENTS.filter(event => event.id !== lastEventId)
  if (!pool.length) return MARKET_EVENTS[0] || null
  return pool[Math.floor(Math.random() * pool.length)] || null
}

export default function FeirinhaScreen({ onBack }) {
  useSecondaryTutorial('FEIRA', true)
  const { state, dispatch } = useGame()
  const s = useStrings()
  const [activeEvent, setActiveEvent]   = useState(null)
  const [historyModal, setHistoryModal] = useState(null)
  const [activeFilter, setActiveFilter] = useState(FILTER_TYPES.ALL)
  const didInitRef = useRef(false)

  useEffect(() => {
    if (didInitRef.current) return
    didInitRef.current = true
    dispatch({ type: 'TICK_PARTNERS' })
    dispatch({ type: 'ADVANCE_ROUND' })
    const nextVisitCount = (state.market?.visitCount || 0) + 1
    if (nextVisitCount % 2 === 0) {
      const event = pickEvent(state.market?.lastEventId)
      setActiveEvent(event)
    }
  }, [dispatch, state.market?.lastEventId, state.market?.visitCount])

  const handleCloseEvent = () => {
    if (activeEvent) dispatch({ type: 'APPLY_MARKET_EVENT', payload: { event: activeEvent } })
    setActiveEvent(null)
  }

  const handleBuy         = (productId) => dispatch({ type: 'BUY_PRODUCT',  payload: { productId, quantity: 1 } })
  const handleSell        = (productId, quantity) => dispatch({ type: 'SELL_PRODUCT', payload: { productId, quantity } })
  const handleShowHistory = (product, history) => setHistoryModal({ product, history })

  const productCards = useMemo(() => PRODUCTS.map(product => {
    const history       = state.market?.priceHistory?.[product.id] || [product.basePrice]
    const currentPrice  = state.market?.prices?.[product.id] ?? product.basePrice
    const previousPrice = history.length > 1 ? history[history.length - 2] : history[history.length - 1]
    return {
      product,
      currentPrice,
      previousPrice,
      history,
      basketSlot: state.basket.find(slot => slot.productId === product.id) || null,
    }
  }), [state.basket, state.market?.priceHistory, state.market?.prices])

  const filteredCards = useMemo(() =>
    productCards.filter(({ product, currentPrice, basketSlot }) => {
      const level    = getBarometerLevel(currentPrice, product.minPrice, product.maxPrice)
      const inBasket = Boolean(basketSlot)
      if (activeFilter === FILTER_TYPES.CHEAP)     return level <= 1
      if (activeFilter === FILTER_TYPES.EXPENSIVE) return level >= 3
      if (activeFilter === FILTER_TYPES.IN_BASKET) return inBasket
      return true
    })
  , [productCards, activeFilter])

  const filterCounts = useMemo(() => ({
    [FILTER_TYPES.ALL]:       productCards.length,
    [FILTER_TYPES.CHEAP]:     productCards.filter(({ product, currentPrice }) =>
      getBarometerLevel(currentPrice, product.minPrice, product.maxPrice) <= 1).length,
    [FILTER_TYPES.EXPENSIVE]: productCards.filter(({ product, currentPrice }) =>
      getBarometerLevel(currentPrice, product.minPrice, product.maxPrice) >= 3).length,
    [FILTER_TYPES.IN_BASKET]: productCards.filter(({ basketSlot }) => Boolean(basketSlot)).length,
  }), [productCards])

  return (
    <motion.div
      className={styles.wrapper}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* ── Secção fixa (nunca scrolla) ────────────────────── */}
      <div className={styles.topSection}>
        <div className={styles.header}>
          <button
            type="button"
            className={styles.backButton}
            onClick={onBack}
            aria-label={s.feirinha.header.back}
          >
            <FaArrowLeft />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <h1 className={styles.title}>🛖 {s.feirinha.title}</h1>
            <TutorialHelpButton tutorialKey="FEIRA" />
          </div>
          <div className={styles.headerHud}>
            <AllySwitcher />
            <ActiveBuffsBar inline />
          </div>
          <div className={styles.headerBadges}>
            <span className={styles.badge}>
              <span data-tutorial="round-counter">{s.feirinha.header.round.replace('{n}', state.market.round)}</span>
            </span>
            <span className={`${styles.badge} ${styles.badgeCoins}`}>
              🪙 {state.coins} {s.feirinha.header.coinsAvailable}
            </span>
          </div>
        </div>

        <div className={styles.tipBar}>
          <span className={styles.tipBarMascot}>🐷</span>
          <p className={styles.tipBarText}>{s.feirinha.legend.title}</p>
          <div className={styles.tipBarLegend}>
            <span className={styles.legendItem}>❄️ {s.feirinha.legend.cheap}</span>
            <span>→</span>
            <span className={styles.legendItem}>😐 {s.feirinha.legend.normal}</span>
            <span>→</span>
            <span className={styles.legendItem}>🔥 {s.feirinha.legend.expensive}</span>
          </div>
        </div>

        <div data-tutorial="fair-tabs">
          <ProductFilterTabs
            active={activeFilter}
            counts={filterCounts}
            onChange={setActiveFilter}
          />
        </div>
      </div>

      {/* ── Secção scrollável (produtos + cesta) ───────────── */}
      <div className={styles.scrollSection}>
        <div className={styles.productsGrid}>
          {filteredCards.map(({ product, currentPrice, previousPrice, history, basketSlot }, idx) => (
            <div key={product.id} {...(idx === 0 ? { 'data-tutorial': 'product-card' } : {})} style={{ display: 'contents' }}>
              <ProductCard
                product={product}
                currentPrice={currentPrice}
                previousPrice={previousPrice}
                basketSlot={basketSlot}
                round={state.market.round}
                priceHistory={history}
                onBuy={handleBuy}
                onSell={handleSell}
                onShowHistory={handleShowHistory}
              />
            </div>
          ))}
          {filteredCards.length === 0 && (
            <div style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '40px',
              color: 'var(--color-text-inverse)',
              fontWeight: 700,
              fontSize: 'var(--ms-text-base)',
            }}>
              {s.feirinha.filterTabs.empty}
            </div>
          )}
          <CofrinhoTipCard
            products={PRODUCTS}
            marketPrices={state.market.prices}
            basket={state.basket}
            round={state.market.round}
          />
        </div>

        <div data-tutorial="basket-section">
          <CestaDaFamilia
            basket={state.basket}
            marketPrices={state.market.prices}
            round={state.market.round}
            onSell={handleSell}
          />
        </div>
      </div>

      <AnimatePresence>
        {activeEvent && (
          <EventCard event={activeEvent} onClose={handleCloseEvent} />
        )}
      </AnimatePresence>

      <PriceHistoryModal
        product={historyModal?.product}
        history={historyModal?.history}
        onClose={() => setHistoryModal(null)}
      />
    </motion.div>
  )
}
