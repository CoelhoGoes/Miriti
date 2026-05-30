import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PRODUCTS } from '../../data/products'
import { MARKET_EVENTS } from '../../data/marketEvents'
import { ANIMALS } from '../../data/animals'
import { useGame } from '../../context/GameContext.jsx'
import { useStrings, useLanguage } from '../../i18n/index.js'
import EventCard from './EventCard'
import ProductCard from './ProductCard'
import CestaDaFamilia from './CestaDaFamilia'
import styles from './FeirinhaScreen.module.css'

function pickEvent(lastEventId) {
    const pool = MARKET_EVENTS.filter(event => event.id !== lastEventId)
    if (!pool.length) return MARKET_EVENTS[0] || null
    return pool[Math.floor(Math.random() * pool.length)] || null
}

export default function FeirinhaScreen({ onBack }) {
    const { state, dispatch } = useGame()
    const s = useStrings()
    const lang = useLanguage()
    const t = (obj) => obj?.[lang] ?? obj?.pt ?? obj
    const [activeEvent, setActiveEvent] = useState(null)
    const [showTip, setShowTip] = useState(false)
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

    useEffect(() => {
        if (!showTip) return undefined
        const timeout = setTimeout(() => setShowTip(false), 4000)
        return () => clearTimeout(timeout)
    }, [showTip])

    const handleCloseEvent = () => {
        if (activeEvent) {
            dispatch({ type: 'APPLY_MARKET_EVENT', payload: { event: activeEvent } })
            setShowTip(true)
        }
        setActiveEvent(null)
    }

    const handleBuy = (productId) => {
        dispatch({ type: 'BUY_PRODUCT', payload: { productId, quantity: 1 } })
    }

    const handleSell = (productId, quantity) => {
        dispatch({ type: 'SELL_PRODUCT', payload: { productId, quantity } })
    }

    const productCards = useMemo(() => PRODUCTS.map((product) => {
        const history = state.market?.priceHistory?.[product.id] || [product.basePrice]
        const currentPrice = state.market?.prices?.[product.id] ?? product.basePrice
        const previousPrice = history.length > 1
            ? history[history.length - 2]
            : history[history.length - 1]

        return {
            product,
            currentPrice,
            previousPrice,
            basketSlot: state.basket.find(slot => slot.productId === product.id) || null,
        }
    }), [state.basket, state.market?.priceHistory, state.market?.prices])

    return (
        <motion.div
            className={`${styles.wrapper} ${showTip ? styles.tipOn : ''}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div className={styles.inner}>
                <header className={styles.header}>
                    <h1 className={styles.title}>🛖 {s.feirinha.title}</h1>
                    <motion.button
                        type="button"
                        className={styles.backButton}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onBack}
                    >
                        ← {s.common.back}
                    </motion.button>
                </header>

                {(state.cooperativa?.activePartners?.length ?? 0) > 0 && (
                    <motion.div
                        className={styles.activeBuffs}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        {state.cooperativa.activePartners.map(p => {
                            const animal = ANIMALS.find(a => a.id === p.id)
                            if (!animal) return null
                            return (
                                <div
                                    key={p.id}
                                    className={styles.buffBadge}
                                    title={t(animal.description)}
                                >
                                    <span>{animal.icon}</span>
                                    <span>{p.roundsLeft}r</span>
                                </div>
                            )
                        })}
                    </motion.div>
                )}

                <div className={styles.meta}>
                    <span>🎯 {s.feirinha.round} {state.market.round}</span>
                    <strong>🪙 {state.coins} {s.feirinha.coinsAvailable}</strong>
                </div>

                <section className={styles.grid}>
                    {productCards.map(({ product, currentPrice, previousPrice, basketSlot }) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            currentPrice={currentPrice}
                            previousPrice={previousPrice}
                            basketSlot={basketSlot}
                            round={state.market.round}
                            onBuy={handleBuy}
                            onSell={handleSell}
                        />
                    ))}
                </section>

                <CestaDaFamilia
                    basket={state.basket}
                    marketPrices={state.market.prices}
                    round={state.market.round}
                    onSell={handleSell}
                />
            </div>

            <AnimatePresence>
                {activeEvent && (
                    <EventCard
                        event={activeEvent}
                        onClose={handleCloseEvent}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    )
}
