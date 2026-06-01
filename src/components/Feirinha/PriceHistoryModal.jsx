/* eslint-disable react/prop-types */
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useStrings, useLanguage } from '../../i18n/index.js'
import styles from './PriceHistoryModal.module.css'

const CHART_PADDING = { top: 24, right: 16, bottom: 24, left: 36 }
const CHART_WIDTH   = 460
const CHART_HEIGHT  = 180

function pickLang(field, lang) {
  if (!field) return ''
  if (typeof field === 'string') return field
  return field[lang] ?? field.pt ?? ''
}

function getTrend(trendDelta) {
  if (trendDelta > 0) return 'up'
  if (trendDelta < 0) return 'down'
  return 'stable'
}

function getTrendKey(trend) {
  if (trend === 'up')   return 'trendUp'
  if (trend === 'down') return 'trendDown'
  return 'trendStable'
}

function getTrendClass(trend) {
  if (trend === 'up')   return styles.trendUp
  if (trend === 'down') return styles.trendDown
  return styles.trendStable
}

function calcStats(history) {
  if (!history || history.length === 0) return null
  const min      = Math.min(...history)
  const max      = Math.max(...history)
  const avg      = Math.round(history.reduce((a, b) => a + b, 0) / history.length)
  const current  = history[history.length - 1]
  const previous = history.length > 1 ? history[history.length - 2] : current
  const trendDelta = current - previous
  return { min, max, avg, current, trend: getTrend(trendDelta), trendDelta }
}

function buildChartPath(history) {
  if (!history || history.length < 2) return null

  const min = Math.min(...history)
  const max = Math.max(...history)
  const range = max - min || 1

  const innerWidth  = CHART_WIDTH  - CHART_PADDING.left - CHART_PADDING.right
  const innerHeight = CHART_HEIGHT - CHART_PADDING.top  - CHART_PADDING.bottom

  const points = history.map((price, i) => ({
    x: CHART_PADDING.left + (i / (history.length - 1)) * innerWidth,
    y: CHART_PADDING.top  + innerHeight - ((price - min) / range) * innerHeight,
    price,
  }))

  const line = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ')

  const lastX  = points[points.length - 1].x
  const firstX = points[0].x
  const baseY  = CHART_PADDING.top + innerHeight
  const area   = `${line} L ${lastX.toFixed(1)} ${baseY} L ${firstX.toFixed(1)} ${baseY} Z`

  return { line, area, points, innerHeight }
}

export default function PriceHistoryModal({ product, history, onClose }) {
  const s    = useStrings()
  const lang = useLanguage()

  const modalRoot = document.getElementById('modal-root')
  if (!modalRoot) return null

  const isOpen  = Boolean(product)
  const stats   = calcStats(history)
  const chart   = buildChartPath(history)
  const hasChart = Boolean(chart && stats)

  const trendKey   = stats ? getTrendKey(stats.trend) : 'trendStable'
  const trendClass = stats ? getTrendClass(stats.trend) : styles.trendStable

  const lastPoint = chart?.points?.at(-1)

  return createPortal(
    <AnimatePresence>
      {isOpen && (
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
            <div className={styles.header}>
              <span className={styles.headerEmoji}>{product.emoji}</span>
              <div className={styles.headerTexts}>
                <h2 className={styles.title}>
                  {s.feirinha.priceHistory.title}: {pickLang(product.name, lang)}
                </h2>
                <p className={styles.subtitle}>
                  {s.feirinha.priceHistory.lastRounds.replace('{n}', history?.length ?? 0)}
                </p>
              </div>
            </div>

            {!hasChart ? (
              <div className={styles.empty}>
                {s.feirinha.priceHistory.noHistory}
              </div>
            ) : (
              <>
                <div className={styles.chartWrapper}>
                  <svg
                    viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
                    className={styles.chartSvg}
                    preserveAspectRatio="xMidYMid meet"
                    aria-hidden="true"
                  >
                    {/* Grid horizontal (3 linhas) */}
                    {[0.25, 0.5, 0.75].map(ratio => (
                      <line
                        key={ratio}
                        x1={CHART_PADDING.left}
                        y1={CHART_PADDING.top + chart.innerHeight * ratio}
                        x2={CHART_WIDTH - CHART_PADDING.right}
                        y2={CHART_PADDING.top + chart.innerHeight * ratio}
                        className={styles.gridLine}
                      />
                    ))}

                    {/* Linha do mínimo */}
                    <line
                      x1={CHART_PADDING.left}
                      y1={CHART_PADDING.top + chart.innerHeight}
                      x2={CHART_WIDTH - CHART_PADDING.right}
                      y2={CHART_PADDING.top + chart.innerHeight}
                      className={`${styles.minMaxLine} ${styles.minLine}`}
                    />
                    <text x={4} y={CHART_PADDING.top + chart.innerHeight + 4}
                      className={`${styles.minMaxLabel} ${styles.minLabelText}`}>
                      {stats.min}
                    </text>

                    {/* Linha do máximo */}
                    <line
                      x1={CHART_PADDING.left}
                      y1={CHART_PADDING.top}
                      x2={CHART_WIDTH - CHART_PADDING.right}
                      y2={CHART_PADDING.top}
                      className={`${styles.minMaxLine} ${styles.maxLine}`}
                    />
                    <text x={4} y={CHART_PADDING.top + 4}
                      className={`${styles.minMaxLabel} ${styles.maxLabelText}`}>
                      {stats.max}
                    </text>

                    {/* Área animada */}
                    <motion.path
                      d={chart.area}
                      className={styles.areaFill}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.15 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                    />

                    {/* Linha principal animada */}
                    <motion.path
                      d={chart.line}
                      className={styles.line}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8, ease: 'easeInOut' }}
                    />

                    {/* Pontos */}
                    {chart.points.map((p, i) => {
                      const isLast = i === chart.points.length - 1
                      return (
                        <motion.circle
                          key={p.x.toFixed(2)}
                          cx={p.x}
                          cy={p.y}
                          r={isLast ? 5.5 : 3.5}
                          className={isLast ? styles.dotCurrent : styles.dot}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.3 + i * 0.06, type: 'spring', damping: 14 }}
                        />
                      )
                    })}

                    {/* Label do preço actual */}
                    {lastPoint && (
                      <motion.text
                        x={lastPoint.x}
                        y={lastPoint.y - 10}
                        textAnchor="middle"
                        className={styles.priceLabel}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 0.4 }}
                      >
                        {lastPoint.price}🪙
                      </motion.text>
                    )}
                  </svg>
                </div>

                {/* Trend badge */}
                <div className={`${styles.trendBadge} ${trendClass}`}>
                  {s.feirinha.priceHistory[trendKey]}
                  {stats.trendDelta !== 0 && (
                    <span>({stats.trendDelta > 0 ? '+' : ''}{stats.trendDelta}🪙)</span>
                  )}
                </div>

                {/* Stats */}
                <div className={styles.statsGrid}>
                  <div className={styles.statBox}>
                    <p className={styles.statLabel}>{s.feirinha.priceHistory.currentLabel}</p>
                    <p className={styles.statValue}>{stats.current}🪙</p>
                  </div>
                  <div className={styles.statBox}>
                    <p className={styles.statLabel}>{s.feirinha.priceHistory.avgLabel}</p>
                    <p className={styles.statValue}>{stats.avg}🪙</p>
                  </div>
                  <div className={styles.statBox}>
                    <p className={styles.statLabel}>{s.feirinha.priceHistory.minLabel}</p>
                    <p className={styles.statValue}>{stats.min}🪙</p>
                  </div>
                  <div className={styles.statBox}>
                    <p className={styles.statLabel}>{s.feirinha.priceHistory.maxLabel}</p>
                    <p className={styles.statValue}>{stats.max}🪙</p>
                  </div>
                </div>
              </>
            )}

            <button type="button" className={styles.btnClose} onClick={onClose}>
              {s.feirinha.priceHistory.close}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    modalRoot
  )
}
