import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { useGame } from '../../context/GameContext.jsx'
import { useStrings, useLanguage } from '../../i18n/index.js'
import { ANIMALS } from '../../data/animals.js'
import styles from './EquipAllyModal.module.css'

export default function EquipAllyModal({ onClose, onGoToCooperativa }) {
  const { state, dispatch } = useGame()
  const s = useStrings()
  const lang = useLanguage()
  const t = (obj) => (obj && typeof obj === 'object') ? (obj[lang] ?? obj.pt) : obj

  const { alliesOwned, activeAlly } = state.cooperativa
  const sc = s.cooperativa

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose() }
    globalThis.addEventListener('keydown', handleEsc)
    return () => globalThis.removeEventListener('keydown', handleEsc)
  }, [onClose])

  function handleEquip(animalId) {
    dispatch({ type: 'EQUIP_ALLY', payload: { animalId } })
    onClose()
  }

  const ownedAnimals = alliesOwned
    .map(id => ANIMALS.find(a => a.id === id))
    .filter(Boolean)

  const modalRoot = document.getElementById('modal-root')
  if (!modalRoot) return null

  const content = (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onClose}
    >
      <motion.div
        className={styles.modal}
        initial={{ scale: 0.7, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.7, opacity: 0, y: 40 }}
        transition={{ type: 'spring', damping: 18, stiffness: 200 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className={styles.title}>{sc.activeAlly.title}</h2>

        <div className={styles.list}>
          {ownedAnimals.map(ally => {
            const isActive = ally.id === activeAlly
            return (
              <div
                key={ally.id}
                className={`${styles.allyItem} ${isActive ? styles.allyActive : ''}`}
              >
                <span className={styles.allyIcon}>{ally.icon}</span>
                <span className={styles.allyName}>{t(ally.name)}</span>
                <motion.button
                  type="button"
                  className={styles.equipBtn}
                  onClick={() => !isActive && handleEquip(ally.id)}
                  disabled={isActive}
                  whileTap={isActive ? undefined : { scale: 0.94 }}
                >
                  {isActive ? sc.buttons.aliadoEquipped : sc.activeAlly.confirm}
                </motion.button>
              </div>
            )
          })}

          {onGoToCooperativa && (
            <motion.button
              type="button"
              className={styles.coopLink}
              onClick={onGoToCooperativa}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
            >
              🐾 {sc.buttons?.goToCooperativa ?? 'Adotar mais aliados →'}
            </motion.button>
          )}
        </div>

        <motion.button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          whileTap={{ scale: 0.94 }}
        >
          {sc.activeAlly.cancel}
        </motion.button>
      </motion.div>
    </motion.div>
  )

  return createPortal(content, modalRoot)
}

EquipAllyModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onGoToCooperativa: PropTypes.func,
}
