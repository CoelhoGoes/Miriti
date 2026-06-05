import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { FaTimes } from 'react-icons/fa'
import { useGame } from '../../context/GameContext'
import { useToast } from '../../context/ToastContext'
import { useScreen } from '../../context/ScreenContext'
import { useScreenContext } from '../../hooks/useScreenContext'
import { useTutorial } from '../../hooks/useTutorial'
import { useStrings, useLanguage } from '../../i18n'
import { getHelpersForArea } from '../../data/animals'
import styles from './HelperPouch.module.css'

const SCREENS_WITH_HELPER = ['quiz']

function pickLang(field, lang) {
  if (!field) return ''
  if (typeof field === 'string') return field
  return field[lang] ?? field.pt ?? ''
}

/**
 * Bolsa flutuante de Ajudantes consumíveis.
 *
 * - Aparece APENAS em áreas listadas em SCREENS_WITH_HELPER
 * - Esconde-se durante tutoriais activos
 * - Botão circular flutuante (canto inferior direito)
 * - Click abre drawer lateral com lista de ajudantes
 */
export default function HelperPouch() {
  const { state, useHelper } = useGame()
  const { showToast } = useToast()
  const { setScreen } = useScreen()
  const area = useScreenContext()
  const { isActive: isTutorialActive } = useTutorial()
  const s = useStrings()
  const lang = useLanguage()

  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setIsOpen(false)
  }, [area])

  useEffect(() => {
    if (!isOpen) return
    const handleEsc = (e) => { if (e.key === 'Escape') setIsOpen(false) }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen])

  if (isTutorialActive) return null
  if (!SCREENS_WITH_HELPER.includes(area)) return null

  const allHelpers = getHelpersForArea(area)
  const availableHelpers = allHelpers.filter(a =>
    (state.cooperativa.helpers[a.id] ?? 0) > 0
  )
  const totalCount = availableHelpers.reduce(
    (sum, a) => sum + (state.cooperativa.helpers[a.id] ?? 0), 0
  )

  const contextHint =
    s.helperPouch.contextHints[area] ??
    s.helperPouch.contextHints.default

  const handleUse = (animal) => {
    const stock = state.cooperativa.helpers[animal.id] ?? 0
    if (stock <= 0) {
      showToast(s.helperPouch.toast.notAvailable, { type: 'error' })
      return
    }
    useHelper(animal.id)
    const message = s.helperPouch.toast.used
      .replace('{name}', pickLang(animal.name, lang))
      .replace('{icon}', animal.icon)
    showToast(message, { type: 'success', icon: animal.icon })
    setIsOpen(false)
  }

  const handleGoToCoop = () => {
    setIsOpen(false)
    setScreen('cooperativa')
  }

  const modalRoot = typeof document !== 'undefined'
    ? document.getElementById('modal-root')
    : null

  return (
    <>
      <motion.button
        type="button"
        className={styles.floatingButton}
        onClick={() => setIsOpen(true)}
        aria-label={s.helperPouch.buttonAria}
        whileHover={{ scale: 1.06, y: -3 }}
        whileTap={{ scale: 0.94 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <span className={styles.buttonEmoji} aria-hidden="true">💼</span>
        {totalCount > 0 && (
          <motion.span
            className={styles.badge}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            key={totalCount}
            transition={{ type: 'spring', damping: 14, stiffness: 280 }}
          >
            {totalCount}
          </motion.span>
        )}
      </motion.button>

      {modalRoot && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className={styles.backdrop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false) }}
            >
              <motion.aside
                className={styles.drawer}
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 22, stiffness: 220 }}
                role="dialog"
                aria-modal="true"
                aria-labelledby="helper-pouch-title"
              >
                <header className={styles.drawerHeader}>
                  <div className={styles.drawerTitleArea}>
                    <h2 id="helper-pouch-title" className={styles.drawerTitle}>
                      💼 {s.helperPouch.title}
                    </h2>
                    <p className={styles.drawerHint}>{contextHint}</p>
                  </div>
                  <button
                    type="button"
                    className={styles.closeButton}
                    onClick={() => setIsOpen(false)}
                    aria-label={s.helperPouch.closeAria}
                  >
                    <FaTimes />
                  </button>
                </header>

                <div className={styles.drawerBody}>
                  {availableHelpers.length === 0 ? (
                    <div className={styles.empty}>
                      <span className={styles.emptyEmoji} aria-hidden="true">🪺</span>
                      <p className={styles.emptyText}>
                        {s.helperPouch.empty.message}
                      </p>
                      <button
                        type="button"
                        className={styles.emptyCta}
                        onClick={handleGoToCoop}
                      >
                        {s.helperPouch.empty.cta}
                      </button>
                    </div>
                  ) : (
                    <ul className={styles.helpersList}>
                      {availableHelpers.map(animal => {
                        const stock = state.cooperativa.helpers[animal.id] ?? 0
                        return (
                          <li key={animal.id} className={styles.helperCard}>
                            <span className={styles.helperIcon} aria-hidden="true">
                              {animal.icon}
                            </span>
                            <div className={styles.helperInfo}>
                              <div className={styles.helperNameRow}>
                                <span className={styles.helperName}>
                                  {pickLang(animal.name, lang)}
                                </span>
                                <span className={styles.helperStock}>
                                  ×{stock}
                                </span>
                              </div>
                              <span className={styles.helperEffect}>
                                {pickLang(animal.description, lang)}
                              </span>
                            </div>
                            <motion.button
                              type="button"
                              className={styles.useButton}
                              onClick={() => handleUse(animal)}
                              whileTap={{ scale: 0.94 }}
                            >
                              {s.helperPouch.useButton}
                            </motion.button>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>

                {availableHelpers.length > 0 && (
                  <footer className={styles.drawerFooter}>
                    <button
                      type="button"
                      className={styles.buyMoreButton}
                      onClick={handleGoToCoop}
                    >
                      {s.helperPouch.buyMore}
                    </button>
                  </footer>
                )}
              </motion.aside>
            </motion.div>
          )}
        </AnimatePresence>,
        modalRoot
      )}
    </>
  )
}
