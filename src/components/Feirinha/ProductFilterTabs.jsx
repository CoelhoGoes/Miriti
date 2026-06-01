/* eslint-disable react/prop-types */
import { motion } from 'framer-motion'
import { useStrings } from '../../i18n/index.js'
import styles from './ProductFilterTabs.module.css'

export const FILTER_TYPES = {
  ALL:       'all',
  CHEAP:     'cheap',
  EXPENSIVE: 'expensive',
  IN_BASKET: 'inBasket',
}

export default function ProductFilterTabs({ active, counts, onChange }) {
  const s = useStrings()

  const tabs = [
    { id: FILTER_TYPES.ALL,       icon: '🛒', label: s.feirinha.filterTabs.all },
    { id: FILTER_TYPES.CHEAP,     icon: '❄️', label: s.feirinha.filterTabs.cheap },
    { id: FILTER_TYPES.EXPENSIVE, icon: '🔥', label: s.feirinha.filterTabs.expensive },
    { id: FILTER_TYPES.IN_BASKET, icon: '🧺', label: s.feirinha.filterTabs.inBasket },
  ]

  return (
    <div className={styles.tabsWrapper} role="tablist">
      {tabs.map(tab => {
        const isActive = active === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}
            onClick={() => onChange(tab.id)}
          >
            {isActive && (
              <motion.div
                layoutId="filterTabHighlight"
                className={styles.tabHighlight}
                transition={{ type: 'spring', damping: 22, stiffness: 280 }}
              />
            )}
            <span className={styles.tabIcon}>{tab.icon}</span>
            <span>{tab.label}</span>
            <span className={`${styles.tabBadge} ${!isActive ? styles.tabBadgeInactive : ''}`}>
              {counts[tab.id] ?? 0}
            </span>
          </button>
        )
      })}
    </div>
  )
}
