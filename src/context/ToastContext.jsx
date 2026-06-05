import { createContext, useContext, useState, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa'
import styles from './ToastContext.module.css'

const ToastContext = createContext(null)

const DEFAULT_DURATION = 3000

const TOAST_ICONS = {
  success: FaCheckCircle,
  error:   FaExclamationCircle,
  info:    FaInfoCircle,
  default: FaInfoCircle,
}

/**
 * Provider que expõe showToast para descendentes via useToast().
 * Renderiza o container de toasts num portal para #modal-root.
 *
 * Cada toast tem:
 *  - id (gerado automaticamente)
 *  - message: texto principal (string ou JSX)
 *  - type: 'success' | 'error' | 'info' | 'default'
 *  - duration: tempo em ms (default 3000; 0 = não fecha automaticamente)
 *  - icon: emoji opcional (sobrescreve o ícone do tipo)
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const idCounterRef = useRef(0)

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const showToast = useCallback((message, options = {}) => {
    const id = ++idCounterRef.current
    const toast = {
      id,
      message,
      type:     options.type     ?? 'default',
      duration: options.duration ?? DEFAULT_DURATION,
      icon:     options.icon     ?? null,
    }

    setToasts(prev => [...prev, toast])

    if (toast.duration > 0) {
      setTimeout(() => dismiss(id), toast.duration)
    }

    return id
  }, [dismiss])

  const modalRoot = typeof document !== 'undefined'
    ? document.getElementById('modal-root')
    : null

  return (
    <ToastContext.Provider value={{ showToast, dismiss }}>
      {children}

      {modalRoot && createPortal(
        <div className={styles.container} aria-live="polite" aria-atomic="false">
          <AnimatePresence>
            {toasts.map(toast => {
              const Icon = TOAST_ICONS[toast.type] ?? TOAST_ICONS.default
              return (
                <motion.div
                  key={toast.id}
                  className={`${styles.toast} ${styles[`toast_${toast.type}`]}`}
                  initial={{ opacity: 0, y: -20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  transition={{ type: 'spring', damping: 18, stiffness: 200 }}
                  layout
                  role="status"
                >
                  <div className={styles.iconBox} aria-hidden="true">
                    {toast.icon
                      ? <span className={styles.emoji}>{toast.icon}</span>
                      : <Icon />}
                  </div>
                  <div className={styles.message}>{toast.message}</div>
                  <button
                    type="button"
                    className={styles.closeButton}
                    onClick={() => dismiss(toast.id)}
                    aria-label="Fechar notificação"
                  >
                    <FaTimes />
                  </button>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>,
        modalRoot
      )}
    </ToastContext.Provider>
  )
}

/**
 * Hook para disparar toasts em qualquer componente descendente.
 *
 * @returns {{ showToast: Function, dismiss: Function }}
 *
 * @example
 *   const { showToast } = useToast()
 *   showToast('Aliado trocado!', { type: 'success', icon: '🐾' })
 *
 *   // Toast persistente (não fecha sozinho):
 *   const id = showToast('Carregando...', { type: 'info', duration: 0 })
 *   dismiss(id)
 */
export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast() deve ser usado dentro de <ToastProvider>')
  }
  return ctx
}
