import { motion } from 'framer-motion'
import { useStrings, useLanguage } from '../../i18n/index.js'
import styles from './AnimalCard.module.css'

const cardVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } },
}

const BTN_CLASS = {
  ajudante: styles.btnAjudante,
  parceiro: styles.btnParceiro,
  aliado:   styles.btnAliado,
}

export default function AnimalCard({ animal, owned, stock, isEquipped, onAction }) {
  const s = useStrings()
  const lang = useLanguage()
  const t = (obj) => obj?.[lang] ?? obj?.pt ?? obj

  const { category, cost } = animal
  const sc = s.cooperativa

  let buttonLabel, buttonDisabled
  if (category === 'ajudante') {
    buttonLabel    = stock > 0 ? sc.buttons.ajudanteUse : sc.buttons.ajudanteBuy
    buttonDisabled = false
  } else if (category === 'parceiro') {
    buttonLabel    = stock > 0 ? sc.buttons.parceiroUse : sc.buttons.parceiroBuy
    buttonDisabled = false
  } else {
    if (isEquipped) {
      buttonLabel    = sc.buttons.aliadoEquipped
      buttonDisabled = true
    } else if (owned) {
      buttonLabel    = sc.buttons.aliadoEquip
      buttonDisabled = false
    } else {
      buttonLabel    = sc.buttons.aliadoBuy
      buttonDisabled = false
    }
  }

  return (
    <motion.div
      className={styles.card}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.04, y: -4 }}
    >
      {category !== 'aliado' && (
        <div className={styles.stockBadge}>
          {sc.labels.stock.replace('{n}', stock ?? 0)}
        </div>
      )}

      <div className={styles.header}>
        <span className={styles.icon}>{animal.icon}</span>
        <h3 className={styles.name}>{t(animal.name)}</h3>
      </div>

      <p className={styles.flavor}>{t(animal.flavor)}</p>
      <p className={styles.description}>{t(animal.description)}</p>

      <div className={styles.footer}>
        <span className={styles.cost}>
          {cost > 0 ? `${cost} 🪙` : '—'}
        </span>
        {owned && category === 'aliado' && (
          <span className={styles.ownedBadge}>{sc.labels.owned}</span>
        )}
        <motion.button
          type="button"
          className={`${styles.actionBtn} ${BTN_CLASS[category]} ${buttonDisabled ? styles.btnDisabled : ''}`}
          onClick={buttonDisabled ? undefined : onAction}
          disabled={buttonDisabled}
          whileTap={buttonDisabled ? undefined : { scale: 0.94 }}
        >
          {buttonLabel}
        </motion.button>
      </div>
    </motion.div>
  )
}
