/* eslint-disable react/prop-types */
import { motion, AnimatePresence } from 'framer-motion'
import { useStrings, useLanguage } from '../../i18n/index.js'
import Barometer, { getBarometerLevel } from './Barometer'
import ActionHint from './ActionHint'
import styles from './ProductCard.module.css'

const cardVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
}

function pickLang(field, lang) {
  if (!field) return ''
  if (typeof field === 'string') return field
  return field[lang] ?? field.pt ?? ''
}

function getDiffInfo(currentPrice, basePrice, s) {
  const diff = currentPrice - basePrice
  if (diff === 0) return { className: styles.priceDiffEqual,         label: s.feirinha.card.diffEqual }
  if (diff <= -3)  return { className: styles.priceDiffMuchCheaper,   label: s.feirinha.card.diffMuchCheap.replace('{n}', diff) }
  if (diff < 0)   return { className: styles.priceDiffCheaper,       label: s.feirinha.card.diffCheaper.replace('{n}', diff) }
  if (diff <= 3)  return { className: styles.priceDiffExpensive,     label: s.feirinha.card.diffExpensive.replace('{n}', diff) }
  return               { className: styles.priceDiffMuchExpensive,  label: s.feirinha.card.diffMuchExp.replace('{n}', diff) }
}

export default function ProductCard({
  product,
  currentPrice,
  previousPrice: _previousPrice,
  basketSlot,
  round,
  priceHistory,
  onBuy,
  onSell,
  onShowHistory,
}) {
  const s    = useStrings()
  const lang = useLanguage()

  const ownedQuantity  = basketSlot?.quantity ?? 0
  const hasOwned       = ownedQuantity > 0
  const barometerLevel = getBarometerLevel(currentPrice, product.minPrice, product.maxPrice)
  const diffInfo       = getDiffInfo(currentPrice, product.basePrice, s)

  const isInCooldown = product.hasCooldown && hasOwned
    && (round - basketSlot.roundBought) < (product.cooldownRounds ?? 0)
  const roundsLeft   = isInCooldown
    ? (product.cooldownRounds ?? 0) - (round - basketSlot.roundBought)
    : 0

  const cardClass = [
    styles.card,
    barometerLevel <= 0 && styles.cardCheap,
    barometerLevel >= 4 && styles.cardHot,
  ].filter(Boolean).join(' ')

  const buyButtonClass = barometerLevel <= 0
    ? `${styles.btn} ${styles.btnBuyCheap}`
    : `${styles.btn} ${styles.btnBuyNormal}`

  const productName      = pickLang(product.name, lang)
  const historyAriaLabel = (s.feirinha.priceHistory?.openHistoryAria ?? 'View history of {product}')
    .replace('{product}', productName)

  const handleHeaderClick = () => {
    if (typeof onShowHistory === 'function') onShowHistory(product, priceHistory)
  }

  return (
    <motion.div
      className={cardClass}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      {hasOwned && (
        <div className={styles.ownedBadge}>
          🧺 {s.feirinha.card.youOwn.replace('{n}', ownedQuantity)}
        </div>
      )}

      {/* Header clicável — abre histórico de preços */}
      <button
        type="button"
        className={`${styles.header} ${styles.headerClickable}`}
        aria-label={historyAriaLabel}
        onClick={handleHeaderClick}
      >
        <div className={styles.iconBox} aria-hidden="true">
          {product.emoji}
        </div>
        <div className={styles.headerText}>
          <h3 className={styles.title}>{productName}</h3>
          <span className={styles.riskBadge}>
            {pickLang(product.riskProfile, lang)}
          </span>
        </div>
      </button>

      <Barometer
        currentPrice={currentPrice}
        basePrice={product.basePrice}
        minPrice={product.minPrice}
        maxPrice={product.maxPrice}
      />

      <ActionHint barometerLevel={barometerLevel} hasOwned={hasOwned} />

      {isInCooldown && (
        <div className={styles.cooldownLine}>
          ⏳ {s.feirinha.sellIn.replace('{n}', roundsLeft)}
        </div>
      )}
      {hasOwned && product.hasCooldown && !isInCooldown && (
        <div className={styles.readyBadge}>
          {s.feirinha.readyToSell}
        </div>
      )}

      {/* Bloco de Preço — Agora + Normal + Diff */}
      <div className={styles.priceBlock}>
        <div className={styles.priceNowGroup}>
          <span className={styles.priceLabel}>{s.feirinha.card.priceNow}</span>
          <div className={styles.priceNowAnimWrapper}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={currentPrice}
                className={styles.priceNowValue}
                initial={{ y: -16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 16, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                {currentPrice}<span className={styles.priceNowCoin}>🪙</span>
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        <div className={styles.priceNormalGroup}>
          <span className={styles.priceLabel}>{s.feirinha.card.priceNormal}</span>
          <span className={styles.priceNormalValue}>
            {product.basePrice}<span className={styles.priceNormalCoin}>🪙</span>
          </span>
        </div>

        <span className={`${styles.priceDiff} ${diffInfo.className}`}>
          {diffInfo.label}
        </span>
      </div>

      {/* Footer — botões centralizados */}
      <div className={styles.footer}>
        {hasOwned ? (
          <>
            <motion.button
              type="button"
              className={`${styles.btn} ${styles.btnSell}`}
              whileTap={{ scale: 0.95 }}
              disabled={isInCooldown}
              onClick={() => onSell(product.id, 1)}
            >
              {s.feirinha.card.sellButton}
            </motion.button>
            <motion.button
              type="button"
              className={`${styles.btn} ${styles.btnBuyMore}`}
              whileTap={{ scale: 0.95 }}
              onClick={() => onBuy(product.id)}
              aria-label={s.feirinha.card.buyButton}
            >
              +1
            </motion.button>
          </>
        ) : (
          <motion.button
            type="button"
            className={buyButtonClass}
            whileTap={{ scale: 0.95 }}
            onClick={() => onBuy(product.id)}
          >
            {s.feirinha.card.buyButton}
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}
