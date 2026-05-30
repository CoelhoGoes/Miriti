import { motion, LayoutGroup } from 'framer-motion'
import { useStrings } from '../../i18n/index.js'
import { ANIMAL_CATEGORIES } from '../../data/animals.js'
import styles from './CategoryTabs.module.css'

const TABS = [
  ANIMAL_CATEGORIES.AJUDANTE,
  ANIMAL_CATEGORIES.PARCEIRO,
  ANIMAL_CATEGORIES.ALIADO,
]

export default function CategoryTabs({ active, onChange }) {
  const s = useStrings()

  return (
    <LayoutGroup id="cooperativa-tabs">
      <div className={styles.container} role="tablist">
        {TABS.map((tab) => (
          <motion.button
            key={tab}
            role="tab"
            type="button"
            aria-selected={active === tab}
            className={`${styles.tab} ${active === tab ? styles.active : ''}`}
            onClick={() => onChange(tab)}
            whileTap={{ scale: 0.96 }}
          >
            {s.cooperativa.tabs[tab]}
            {active === tab && (
              <motion.div
                layoutId="tabUnderline"
                className={styles.underline}
              />
            )}
          </motion.button>
        ))}
      </div>
    </LayoutGroup>
  )
}
