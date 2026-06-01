import { useMemo } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useElementRect } from '../../hooks/useElementRect'
import styles from './CofrinhoBubble.module.css'

const BUBBLE_GAP = 16
const BUBBLE_WIDTH_DEFAULT = 360

const COFRINHO_EMOJIS = {
  idle:        '🐷',
  pointing:    '🐽',
  celebrating: '🐖',
}

function computeBubblePosition(rect, preferredSide) {
  if (!rect) return null

  const vw = window.innerWidth
  const vh = window.innerHeight
  const bubbleW = Math.min(BUBBLE_WIDTH_DEFAULT, vw - 32)
  const estimatedH = 200

  let side = preferredSide ?? 'bottom'

  const fitsBottom = rect.bottom + estimatedH + BUBBLE_GAP < vh
  const fitsTop    = rect.top    - estimatedH - BUBBLE_GAP > 0
  const fitsRight  = rect.right  + bubbleW    + BUBBLE_GAP < vw
  const fitsLeft   = rect.left   - bubbleW    - BUBBLE_GAP > 0

  if      (side === 'bottom' && !fitsBottom) side = fitsTop    ? 'top'    : fitsRight ? 'right' : 'left'
  else if (side === 'top'    && !fitsTop)    side = fitsBottom ? 'bottom' : fitsRight ? 'right' : 'left'
  else if (side === 'right'  && !fitsRight)  side = fitsLeft   ? 'left'   : fitsBottom ? 'bottom' : 'top'
  else if (side === 'left'   && !fitsLeft)   side = fitsRight  ? 'right'  : fitsBottom ? 'bottom' : 'top'

  let top, left, arrow

  switch (side) {
    case 'top':
      top   = rect.top - estimatedH - BUBBLE_GAP
      left  = Math.max(16, Math.min(vw - bubbleW - 16, rect.left + rect.width / 2 - bubbleW / 2))
      arrow = 'arrowBottom'
      break
    case 'left':
      top   = Math.max(16, Math.min(vh - estimatedH - 16, rect.top + rect.height / 2 - estimatedH / 2))
      left  = rect.left - bubbleW - BUBBLE_GAP
      arrow = 'arrowRight'
      break
    case 'right':
      top   = Math.max(16, Math.min(vh - estimatedH - 16, rect.top + rect.height / 2 - estimatedH / 2))
      left  = rect.right + BUBBLE_GAP
      arrow = 'arrowLeft'
      break
    case 'bottom':
    default:
      top   = rect.bottom + BUBBLE_GAP
      left  = Math.max(16, Math.min(vw - bubbleW - 16, rect.left + rect.width / 2 - bubbleW / 2))
      arrow = 'arrowTop'
      break
  }

  return { top, left, arrow, width: bubbleW }
}

export default function CofrinhoBubble({
  isOpen,
  targetSelector,
  preferredSide = 'bottom',
  cofrinhoState = 'idle',
  title,
  text,
  currentStep,
  totalSteps,
  canSkip = true,
  canGoBack = true,
  onSkip,
  onPrev,
  onNext,
  isFinalStep,
  labels = {
    skip:   'Pular',
    prev:   'Voltar',
    next:   'Próximo',
    finish: 'Concluir',
  },
}) {
  const rect = useElementRect(targetSelector, [isOpen, currentStep])

  const position = useMemo(
    () => (targetSelector ? computeBubblePosition(rect, preferredSide) : null),
    [rect, preferredSide, targetSelector]
  )

  const modalRoot = document.getElementById('modal-root')
  if (!modalRoot) return null

  const isCentered = !targetSelector || !rect
  const emoji = COFRINHO_EMOJIS[cofrinhoState] ?? COFRINHO_EMOJIS.idle

  const emojiAnimation =
    cofrinhoState === 'celebrating' ? { rotate: [0, -10, 10, -10, 0] } :
    cofrinhoState === 'pointing'    ? { x: [0, 4, 0] } :
                                      { y: [0, -4, 0] }

  const emojiTransition = {
    duration: cofrinhoState === 'celebrating' ? 1.2 : 2,
    repeat: Infinity,
    ease: 'easeInOut',
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key={`bubble-${currentStep}`}
          className={
            isCentered
              ? styles.bubbleCentered
              : `${styles.bubble} ${styles[position.arrow]}`
          }
          style={isCentered ? undefined : {
            top:   position.top,
            left:  position.left,
            width: position.width,
          }}
          initial={isCentered
            ? { opacity: 0, scale: 0.85, x: '-50%', y: '-50%' }
            : { opacity: 0, scale: 0.85, x: 0, y: 10 }}
          animate={isCentered
            ? { opacity: 1, scale: 1,    x: '-50%', y: '-50%' }
            : { opacity: 1, scale: 1,    x: 0, y: 0 }}
          exit={isCentered
            ? { opacity: 0, scale: 0.85, x: '-50%', y: '-50%' }
            : { opacity: 0, scale: 0.85, x: 0, y: 10 }}
          transition={{ type: 'spring', damping: 18, stiffness: 220 }}
        >
          <div className={styles.cofrinhoHead}>
            <motion.span
              className={styles.cofrinhoEmoji}
              key={cofrinhoState}
              animate={emojiAnimation}
              transition={emojiTransition}
              aria-hidden="true"
            >
              {emoji}
            </motion.span>
            {title && <h3 className={styles.cofrinhoTitle}>{title}</h3>}
          </div>

          <p className={styles.bubbleText}>{text}</p>

          <div className={styles.footer}>
            {totalSteps > 1 && (
              <div className={styles.progress} aria-hidden="true">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <span
                    key={i}
                    className={`${styles.progressDot} ${i === currentStep ? styles.progressDotActive : ''}`}
                  />
                ))}
              </div>
            )}

            <div className={styles.actions}>
              {canSkip && !isFinalStep && (
                <button type="button" className={`${styles.btn} ${styles.btnSkip}`} onClick={onSkip}>
                  {labels.skip}
                </button>
              )}

              {canGoBack && currentStep > 0 && (
                <button type="button" className={`${styles.btn} ${styles.btnPrev}`} onClick={onPrev}>
                  ← {labels.prev}
                </button>
              )}

              <button
                type="button"
                className={`${styles.btn} ${isFinalStep ? styles.btnFinish : styles.btnNext}`}
                onClick={onNext}
              >
                {isFinalStep ? labels.finish : `${labels.next} →`}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    modalRoot
  )
}
