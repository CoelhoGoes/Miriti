import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../../context/GameContext.jsx'
import { useStrings, useLanguage } from '../../i18n/index.js'
import { getAnimalsByCategory } from '../../data/animals.js'
import AnimalCard from './AnimalCard.jsx'
import CategoryTabs from './CategoryTabs.jsx'
import ActiveAllyBadge from './ActiveAllyBadge.jsx'
import PurchaseModal from './PurchaseModal.jsx'
import EquipAllyModal from './EquipAllyModal.jsx'
import styles from './index.module.css'

export default function Cooperativa({ onBack }) {
  const { state, dispatch } = useGame()
  const s = useStrings()
  const lang = useLanguage()
  const t = (obj) => (obj && typeof obj === 'object') ? (obj[lang] ?? obj.pt) : obj

  const [activeTab, setActiveTab] = useState('ajudante')
  const [pendingPurchase, setPendingPurchase] = useState(null)
  const [showSwapModal, setShowSwapModal] = useState(false)

  const { cooperativa } = state

  function handleAction(animal) {
    if (animal.category === 'aliado') {
      const owned     = cooperativa.alliesOwned.includes(animal.id)
      const isEquipped = cooperativa.activeAlly === animal.id
      if (isEquipped) return
      if (owned) {
        dispatch({ type: 'EQUIP_ALLY', payload: { animalId: animal.id } })
      } else if (animal.cost > 200) {
        setPendingPurchase(animal)
      } else {
        dispatch({ type: 'PURCHASE_ANIMAL', payload: { animalId: animal.id } })
      }
    } else if (animal.category === 'ajudante') {
      const stock = cooperativa.helpers[animal.id] ?? 0
      if (stock > 0) {
        dispatch({ type: 'USE_HELPER', payload: { animalId: animal.id } })
      } else {
        dispatch({ type: 'PURCHASE_ANIMAL', payload: { animalId: animal.id } })
      }
    } else {
      const stock = cooperativa.helpers[animal.id] ?? 0
      if (stock > 0) {
        dispatch({ type: 'ACTIVATE_PARTNER', payload: { animalId: animal.id } })
      } else {
        dispatch({ type: 'PURCHASE_ANIMAL', payload: { animalId: animal.id } })
      }
    }
  }

  function handleConfirmPurchase() {
    if (!pendingPurchase) return
    dispatch({ type: 'PURCHASE_ANIMAL', payload: { animalId: pendingPurchase.id } })
    setPendingPurchase(null)
  }

  const animals = getAnimalsByCategory(activeTab)

  return (
    <motion.div
      className={styles.screen}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
    >
      <header className={styles.header}>
        <motion.button
          type="button"
          className={styles.backBtn}
          onClick={onBack}
          whileTap={{ scale: 0.94 }}
        >
          ← {s.common.back}
        </motion.button>
        <h1 className={styles.title}>{s.cooperativa.title}</h1>
        <div className={styles.headerRight}>
          <span className={styles.coinsBadge}>
            <span aria-hidden="true">🪙</span>
            <span>{state.coins}</span>
          </span>
          <ActiveAllyBadge onSwapClick={() => setShowSwapModal(true)} />
        </div>
      </header>

      <CategoryTabs active={activeTab} onChange={setActiveTab} />

      <div className={styles.grid}>
        {animals.map(animal => (
          <AnimalCard
            key={animal.id}
            animal={animal}
            owned={cooperativa.alliesOwned.includes(animal.id)}
            stock={cooperativa.helpers[animal.id] ?? 0}
            isEquipped={cooperativa.activeAlly === animal.id}
            onAction={() => handleAction(animal)}
          />
        ))}
      </div>

      <AnimatePresence>
        {pendingPurchase && (
          <PurchaseModal
            key="purchase-modal"
            animal={pendingPurchase}
            onConfirm={handleConfirmPurchase}
            onClose={() => setPendingPurchase(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSwapModal && (
          <EquipAllyModal
            key="equip-modal"
            onClose={() => setShowSwapModal(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
