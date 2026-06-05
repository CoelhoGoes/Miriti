import { AnimatePresence, motion } from 'framer-motion'
import AllySwitcher from '../AllySwitcher/AllySwitcher'
import ActiveBuffsBar from '../ActiveBuffsBar/ActiveBuffsBar'
import styles from './HudBar.module.css'

/**
 * Wrapper fixo que posiciona AllySwitcher e ActiveBuffsBar como uma
 * única linha flex centrada no topo. Evita sobreposição entre os dois
 * componentes (que antes tinham position:fixed independentes).
 *
 * Cada filho decide internamente se renderiza (useScreenContext).
 * O container usa pointer-events: none para não bloquear cliques.
 */
export default function HudBar() {
  return (
    <AnimatePresence>
      <motion.div
        className={styles.bar}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.25 }}
      >
        <AllySwitcher />
        <ActiveBuffsBar />
      </motion.div>
    </AnimatePresence>
  )
}
