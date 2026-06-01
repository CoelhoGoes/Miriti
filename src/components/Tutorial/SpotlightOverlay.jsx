import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useElementRect } from '../../hooks/useElementRect'
import styles from './SpotlightOverlay.module.css'

const TARGET_PADDING = 8

export default function SpotlightOverlay({ isOpen, targetSelector, onBlockerClick }) {
  const rect = useElementRect(targetSelector, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow }
  }, [isOpen])

  const modalRoot = document.getElementById('modal-root')
  if (!modalRoot) return null

  const hasTarget = Boolean(targetSelector && rect)

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="blocker"
            className={styles.clickBlocker}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onBlockerClick}
          />

          {hasTarget ? (
            <motion.div
              key="spotlight"
              className={styles.spotlight}
              style={{
                top:    rect.top    - TARGET_PADDING,
                left:   rect.left   - TARGET_PADDING,
                width:  rect.width  + TARGET_PADDING * 2,
                height: rect.height + TARGET_PADDING * 2,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              aria-hidden="true"
            />
          ) : (
            <motion.div
              key="spotlight-centered"
              className={styles.spotlightCentered}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              aria-hidden="true"
            />
          )}
        </>
      )}
    </AnimatePresence>,
    modalRoot
  )
}
