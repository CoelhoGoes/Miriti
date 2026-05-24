import { motion } from 'framer-motion'
import { FaArrowLeft, FaCoins, FaCheck } from 'react-icons/fa'
import AnimatedBackground from './AnimatedBackground.jsx'
import TopHud from './TopHud.jsx'
import { SHOP_ITEMS } from '../data/shop.js'
import { sound } from '../utils/sound.js'
import { useGame } from '../context/GameContext.jsx'
import { useStrings, useLanguage, pick } from '../i18n/index.js'
import './ShopScreen.css'

export default function ShopScreen({ onBack }) {
  const { state, buyItem, selectMascot } = useGame()
  const s = useStrings()
  const lang = useLanguage()

  const handleAction = (item, owned, equipped) => {
    if (item.kind === 'mascot' && owned) {
      if (!equipped) { sound.play('click'); selectMascot(item.payload) }
      return
    }
    if (state.coins < item.price) { sound.play('wrong'); return }
    sound.play('coin')
    buyItem(item)
  }

  return (
    <>
      <AnimatedBackground gradient="linear-gradient(135deg, #fde047 0%, #f59e0b 60%, #d97706 100%)" density={7} />
      <TopHud />

      <div className="shop-content">
        <motion.button
          className="shop-back-btn"
          onClick={() => { sound.play('click'); onBack() }}
          onMouseEnter={() => sound.play('hover')}
          whileHover={{ scale: 1.05, x: -4 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <FaArrowLeft /> {s.common.back}
        </motion.button>

        <motion.h1 className="shop-title" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          {s.shop.title}
        </motion.h1>
        <p className="shop-subtitle">{s.shop.subtitle}</p>
        <div className="shop-hints-badge">💡 {s.shop.hintsLabel(state.inventory.hint || 0)}</div>

        <div className="shop-grid">
          {SHOP_ITEMS.map((item, i) => {
            const owned = item.kind === 'mascot' && state.ownedMascots.includes(item.payload)
            const equipped = owned && state.selectedMascot === item.payload
            const affordable = state.coins >= item.price
            const showPrice = !owned

            return (
              <motion.div
                key={item.id}
                className="shop-card"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
              >
                <div className="shop-card-icon">{item.icon}</div>
                <div className="shop-card-name">{pick(item.name, lang)}</div>
                <div className="shop-card-desc">{pick(item.desc, lang)}</div>

                <button
                  className={`shop-buy-btn ${equipped ? 'equipped' : ''} ${showPrice && !affordable ? 'disabled' : ''}`}
                  onClick={() => handleAction(item, owned, equipped)}
                  onMouseEnter={() => sound.play('hover')}
                  disabled={equipped || (showPrice && !affordable)}
                >
                  {equipped && <><FaCheck /> {s.shop.equipped}</>}
                  {owned && !equipped && <>{s.shop.equip}</>}
                  {showPrice && (
                    <>
                      {s.shop.buy} · {item.price} <FaCoins />
                    </>
                  )}
                </button>
                {showPrice && !affordable && (
                  <div className="shop-warn">{s.shop.notEnough}</div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </>
  )
}
