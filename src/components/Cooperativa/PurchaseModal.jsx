import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { useStrings, useLanguage } from '../../i18n/index.js'
import styles from './PurchaseModal.module.css'

export default function PurchaseModal({ animal, onConfirm, onClose }) {
  const s = useStrings()
  const lang = useLanguage()
  const t = (obj) => (obj && typeof obj === 'object') ? (obj[lang] ?? obj.pt) : obj
  const sc = s.cooperativa

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
        <span className={styles.icon}>{animal.icon}</span>
        <h2 className={styles.title}>{sc.purchaseModal.title}</h2>
        <p className={styles.name}>{t(animal.name)}</p>
        <p className={styles.description}>{t(animal.description)}</p>
        <p className={styles.cost}>
          {sc.purchaseModal.cost.replace('{n}', animal.cost)}
        </p>
        <div className={styles.actions}>
          <motion.button
            type="button"
            className={styles.cancelBtn}
            onClick={onClose}
            whileTap={{ scale: 0.94 }}
          >
            {sc.purchaseModal.cancel}
          </motion.button>
          <motion.button
            type="button"
            className={styles.confirmBtn}
            onClick={onConfirm}
            whileTap={{ scale: 0.94 }}
          >
            {sc.purchaseModal.confirm}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )

  return createPortal(content, modalRoot)
}
