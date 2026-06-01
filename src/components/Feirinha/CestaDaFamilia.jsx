/* eslint-disable react/prop-types */
import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { PRODUCTS } from '../../data/products'
import { useStrings, useLanguage } from '../../i18n/index.js'
import SellSlotModal from './SellSlotModal'
import styles from './CestaDaFamilia.module.css'

const BASKET_SIZE = 8

function getVariationClass(variation) {
  if (variation > 0) return styles.varPositive
  if (variation < 0) return styles.varNegative
  return ''
}

function pickLang(field, lang) {
  if (!field) return ''
  if (typeof field === 'string') return field
  return field[lang] ?? field.pt ?? ''
}

export default function CestaDaFamilia({ basket, marketPrices, round, onSell }) {
  const s    = useStrings()
  const lang = useLanguage()
  const [openSlot, setOpenSlot] = useState(null)

  const productsById = useMemo(() => {
    const map = {}
    PRODUCTS.forEach(p => { map[p.id] = p })
    return map
  }, [])

  const normalizedBasket = Array.isArray(basket) ? basket : []
  const occupied = normalizedBasket.length

  const invested  = normalizedBasket.reduce((sum, b) => sum + (b.boughtAt * b.quantity), 0)
  const current   = normalizedBasket.reduce((sum, b) => sum + ((marketPrices[b.productId] ?? 0) * b.quantity), 0)
  const variation = current - invested

  const slots = Array.from({ length: BASKET_SIZE }).map((_, i) => normalizedBasket[i] ?? null)

  return (
    <div className={styles.basketWrapper}>
      <div className={styles.basketHeader}>
        <h2 className={styles.basketTitle}>🧺 {s.feirinha.basket.title}</h2>
        <span className={styles.basketCount}>
          {s.feirinha.basket.countLabel
            .replace('{occupied}', occupied)
            .replace('{total}', BASKET_SIZE)}
        </span>
      </div>

      <div className={styles.basketSummary}>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>{s.feirinha.basket.invested}</span>
          <span className={styles.summaryValue}>🪙 {invested}</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>{s.feirinha.basket.currentValue}</span>
          <span className={styles.summaryValue}>🪙 {current}</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>{s.feirinha.basket.variation}</span>
          <span className={`${styles.summaryValue} ${getVariationClass(variation)}`}>
            {variation > 0 ? '+' : ''}{variation}🪙
          </span>
        </div>
      </div>

      <div className={styles.slotsGrid}>
        {slots.map((slot, i) => {
          if (!slot) {
            return (
              <div
                key={`empty-${i}`} // eslint-disable-line react/no-array-index-key
                className={`${styles.slot} ${styles.slotEmpty}`}
                aria-hidden="true"
              >
                +
              </div>
            )
          }
          const product = productsById[slot.productId]
          return (
            <motion.button
              key={slot.productId}
              type="button"
              className={`${styles.slot} ${styles.slotOccupied}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setOpenSlot(slot)}
              title={pickLang(product?.name, lang)}
            >
              <span className={styles.slotEmoji}>{product?.emoji ?? '🧺'}</span>
              <span className={styles.slotQty}>x{slot.quantity}</span>
              <span className={styles.slotPrice}>
                {s.feirinha.basket.itemBoughtAt.replace('{price}', slot.boughtAt)}
              </span>
            </motion.button>
          )
        })}
      </div>

      <SellSlotModal
        slot={openSlot}
        currentPrice={openSlot ? (marketPrices[openSlot.productId] ?? 0) : 0}
        round={round}
        onClose={() => setOpenSlot(null)}
        onSell={onSell}
      />
    </div>
  )
}
