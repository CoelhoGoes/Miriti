/* eslint-disable react/prop-types */
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useStrings, useLanguage } from '../../i18n/index.js'
import { PRODUCTS } from '../../data/products'
import styles from './SellSlotModal.module.css'

function pickLang(field, lang) {
  if (!field) return ''
  if (typeof field === 'string') return field
  return field[lang] ?? field.pt ?? ''
}

function getProfitRowClass(profitPerUnit) {
  if (profitPerUnit > 0) return styles.profitRow
  if (profitPerUnit < 0) return styles.lossRow
  return styles.breakEvenRow
}

function getProfitLabel(profitPerUnit, s) {
  if (profitPerUnit > 0) return s.feirinha.sellModal.profitPerUnit
  if (profitPerUnit < 0) return s.feirinha.sellModal.lossPerUnit
  return s.feirinha.sellModal.breakEven
}

export default function SellSlotModal({ slot, currentPrice, round, onClose, onSell }) {
  const s    = useStrings()
  const lang = useLanguage()

  const modalRoot = document.getElementById('modal-root')
  if (!modalRoot) return null

  const isOpen  = Boolean(slot)
  const product = slot ? PRODUCTS.find(p => p.id === slot.productId) : null

  const isCooldown = product?.hasCooldown
    && slot && (round - slot.roundBought) < (product.cooldownRounds ?? 0)
  const roundsLeft = isCooldown
    ? (product.cooldownRounds ?? 0) - (round - slot.roundBought)
    : 0

  const boughtAt       = slot?.boughtAt ?? 0
  const profitPerUnit  = currentPrice - boughtAt
  const totalIfSellAll = currentPrice * (slot?.quantity ?? 0)

  const handleSellOne = () => {
    if (isCooldown) return
    onSell(slot.productId, 1)
    onClose()
  }

  const handleSellAll = () => {
    if (isCooldown) return
    onSell(slot.productId, slot.quantity)
    onClose()
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && product && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={styles.modal}
            initial={{ scale: 0.85, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.85, y: 20, opacity: 0 }}
            transition={{ type: 'spring', damping: 18, stiffness: 220 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className={styles.title}>{s.feirinha.sellModal.title}</h2>

            <div className={styles.productHeader}>
              <span className={styles.productEmoji}>{product.emoji}</span>
              <div>
                <p className={styles.productName}>{pickLang(product.name, lang)}</p>
                <p className={styles.youHave}>
                  {s.feirinha.sellModal.youHave.replace('{n}', slot.quantity)}
                </p>
              </div>
            </div>

            {isCooldown && (
              <div className={styles.cooldownWarn}>
                {s.feirinha.sellModal.cooldownActive.replace('{n}', roundsLeft)}
              </div>
            )}

            <div className={styles.priceTable}>
              <div className={styles.priceRow}>
                <span className={styles.priceLabel}>{s.feirinha.sellModal.boughtAt}</span>
                <span className={styles.priceValue}>{boughtAt} 🪙</span>
              </div>
              <div className={styles.priceRow}>
                <span className={styles.priceLabel}>{s.feirinha.sellModal.currentPrice}</span>
                <span className={styles.priceValue}>{currentPrice} 🪙</span>
              </div>
              <div className={`${styles.priceRow} ${getProfitRowClass(profitPerUnit)}`}>
                <span className={styles.priceLabel}>
                  {getProfitLabel(profitPerUnit, s)}
                </span>
                <span className={styles.priceValue}>
                  {profitPerUnit > 0 ? '+' : ''}{profitPerUnit} 🪙
                </span>
              </div>
            </div>

            <p className={styles.totalGain}>
              {s.feirinha.sellModal.totalGain.replace('{n}', totalIfSellAll)}
            </p>

            <div className={styles.actions}>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnSell}`}
                disabled={isCooldown}
                onClick={handleSellOne}
              >
                💰 {s.feirinha.sellModal.sellOne}
              </button>
              {slot.quantity > 1 && (
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnSellAll}`}
                  disabled={isCooldown}
                  onClick={handleSellAll}
                >
                  💰 {s.feirinha.sellModal.sellAll.replace('{n}', slot.quantity)}
                </button>
              )}
            </div>

            <button type="button" className={styles.btnClose} onClick={onClose}>
              {s.feirinha.sellModal.close}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    modalRoot
  )
}
