/* eslint-disable react/prop-types */
import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useStrings, useLanguage } from '../../i18n/index.js'
import styles from './CofrinhoTipCard.module.css'

function pickLang(field, lang) {
  if (!field) return ''
  if (typeof field === 'string') return field
  return field[lang] ?? field.pt ?? ''
}

function getTipKind(round) {
  return ['A', 'B', 'C'][round % 3]
}

export default function CofrinhoTipCard({ products, marketPrices, basket, round }) {
  const s    = useStrings()
  const lang = useLanguage()

  const tip = useMemo(() => {
    const kind = getTipKind(round)

    if (kind === 'A') {
      const withLevels = products.map(p => {
        const price    = marketPrices[p.id] ?? p.basePrice
        const range    = (p.maxPrice - p.minPrice) || 1
        const position = (price - p.minPrice) / range
        return { product: p, position }
      })

      const cheapest = withLevels.reduce((a, b) => (a.position < b.position ? a : b))
      if (cheapest.position <= 0.4) {
        return s.feirinha.cofrinhoTip.tipCheapest
          .replace('{emoji}', cheapest.product.emoji)
          .replace('{product}', pickLang(cheapest.product.name, lang))
      }

      const expensive = withLevels.reduce((a, b) => (a.position > b.position ? a : b))
      if (expensive.position >= 0.7) {
        return s.feirinha.cofrinhoTip.tipExpensive
          .replace('{emoji}', expensive.product.emoji)
          .replace('{product}', pickLang(expensive.product.name, lang))
      }

      return s.feirinha.cofrinhoTip.tipNormal
    }

    if (kind === 'B') {
      const educational = [
        s.feirinha.cofrinhoTip.tipBlueZone,
        s.feirinha.cofrinhoTip.tipRedZone,
        s.feirinha.cofrinhoTip.tipBalance,
        s.feirinha.cofrinhoTip.tipRotateA,
        s.feirinha.cofrinhoTip.tipRotateB,
        s.feirinha.cofrinhoTip.tipRotateC,
        s.feirinha.cofrinhoTip.tipPriceReference,
      ]
      return educational[round % educational.length]
    }

    const totalItems = basket.reduce((sum, b) => sum + b.quantity, 0)
    if (totalItems === 0) return s.feirinha.cofrinhoTip.tipBasketLow
    if (totalItems >= 6)  return s.feirinha.cofrinhoTip.tipBasketFull
    return s.feirinha.cofrinhoTip.tipBalance
  }, [round, products, marketPrices, basket, s, lang])

  return (
    <motion.div
      className={styles.tipCard}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className={styles.cofrinhoEmoji}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        🐷
      </motion.div>
      <p className={styles.tipTitle}>{s.feirinha.cofrinhoTip.title}</p>
      <p className={styles.tipText}>{tip}</p>
    </motion.div>
  )
}
