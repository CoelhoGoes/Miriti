import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaCoins, FaPlus, FaMinus, FaCaretUp, FaCaretDown } from 'react-icons/fa'
import AnimatedBackground from './AnimatedBackground.jsx'
import TopHud from './TopHud.jsx'
import { STOCKS } from '../data/stocks.js'
import { sound } from '../utils/sound.js'
import { useGame } from '../context/GameContext.jsx'
import { useStrings, useLanguage, pick } from '../i18n/index.js'
import './StockMarketScreen.css'

function Sparkline({ history, up }) {
  const pts = history.length > 1 ? history : [history[0] || 0, history[0] || 0]
  const min = Math.min(...pts)
  const max = Math.max(...pts)
  const range = max - min || 1
  const W = 100, H = 34
  const coords = pts.map((p, i) => {
    const x = (i / (pts.length - 1)) * W
    const y = H - ((p - min) / range) * (H - 6) - 3
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
  return (
    <svg className="spark" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
      <polyline
        points={coords}
        fill="none"
        stroke={up ? '#16a34a' : '#dc2626'}
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function StockMarketScreen({ onBack }) {
  const { state, tickStocks, buyStock, sellStock } = useGame()
  const s = useStrings()
  const lang = useLanguage()

  useEffect(() => {
    const iv = setInterval(() => tickStocks(), 6000)
    return () => clearInterval(iv)
  }, [tickStocks])

  const portfolioValue = STOCKS.reduce(
    (sum, st) => sum + (state.portfolio[st.id] || 0) * (state.stocks[st.id]?.price || 0),
    0
  )

  const handleBuy = (id, price) => {
    if (state.coins < price) { sound.play('wrong'); return }
    sound.play('coin')
    buyStock(id)
  }
  const handleSell = (id) => {
    if ((state.portfolio[id] || 0) <= 0) { sound.play('wrong'); return }
    sound.play('coin')
    sellStock(id)
  }

  return (
    <>
      <AnimatedBackground gradient="linear-gradient(135deg, #4ade80 0%, #16a34a 55%, #0e7490 100%)" density={7} />
      <TopHud />

      <div className="stock-content">
        <motion.button
          className="stock-back-btn"
          onClick={() => { sound.play('click'); onBack() }}
          onMouseEnter={() => sound.play('hover')}
          whileHover={{ scale: 1.05, x: -4 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <FaArrowLeft /> {s.common.back}
        </motion.button>

        <motion.h1 className="stock-title" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          {s.stocks.title}
        </motion.h1>
        <p className="stock-subtitle">{s.stocks.subtitle}</p>
        <div className="stock-portfolio">
          {s.stocks.portfolio}: <strong>{portfolioValue}</strong> <FaCoins />
        </div>

        <div className="stock-list">
          {STOCKS.map((st, i) => {
            const data = state.stocks[st.id] || { price: st.basePrice, history: [st.basePrice] }
            const owned = state.portfolio[st.id] || 0
            const hist = data.history
            const prev = hist.length > 1 ? hist[hist.length - 2] : data.price
            const up = data.price >= prev
            const affordable = state.coins >= data.price

            return (
              <motion.div
                key={st.id}
                className="stock-card"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.07 }}
              >
                <div className="stock-card-head">
                  <span className="stock-emoji">{st.emoji}</span>
                  <div className="stock-name-wrap">
                    <div className="stock-name">{pick(st.name, lang)}</div>
                    <div className="stock-owned">{s.stocks.youOwn(owned)}</div>
                  </div>
                  <div className={`stock-price ${up ? 'up' : 'down'}`}>
                    {up ? <FaCaretUp /> : <FaCaretDown />}
                    {data.price}
                    <FaCoins className="stock-price-coin" />
                  </div>
                </div>

                <Sparkline history={hist} up={up} />

                <div className="stock-actions">
                  <button
                    className={`stock-btn sell ${owned <= 0 ? 'disabled' : ''}`}
                    onClick={() => handleSell(st.id)}
                    onMouseEnter={() => sound.play('hover')}
                    disabled={owned <= 0}
                  >
                    <FaMinus /> {s.stocks.sell}
                  </button>
                  <button
                    className={`stock-btn buy ${!affordable ? 'disabled' : ''}`}
                    onClick={() => handleBuy(st.id, data.price)}
                    onMouseEnter={() => sound.play('hover')}
                    disabled={!affordable}
                  >
                    <FaPlus /> {s.stocks.buy}
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="stock-tip">💡 {s.stocks.tip}</div>
      </div>
    </>
  )
}
