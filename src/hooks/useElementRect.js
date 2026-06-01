import { useEffect, useState, useCallback } from 'react'

/**
 * Retorna o bounding rect de um elemento DOM e actualiza-o em tempo real.
 *
 * Trata dois casos especiais:
 *  - display:contents → sem caixa de layout própria; usa o primeiro filho
 *  - elemento fora do viewport → scroll instantâneo antes de medir
 */
export function useElementRect(selector, deps = []) {
  const [rect, setRect] = useState(null)

  const measure = useCallback(() => {
    if (!selector) {
      setRect(null)
      return
    }
    const el = document.querySelector(selector)
    if (!el) {
      setRect(null)
      return
    }

    let r = el.getBoundingClientRect()

    // display:contents não tem caixa de layout — usa o primeiro filho
    let layoutEl = el
    if (r.width === 0 && r.height === 0 && el.children.length > 0) {
      layoutEl = el.children[0]
      r = layoutEl.getBoundingClientRect()
    }

    // Ainda sem rect utilizável (elemento não está no DOM visível)
    if (r.width === 0 && r.height === 0) {
      setRect(null)
      return
    }

    // Fora do viewport verticalmente → scroll instantâneo ao centro
    const vh = window.innerHeight
    if (r.bottom < 0 || r.top > vh) {
      layoutEl.scrollIntoView({ behavior: 'instant', block: 'center' })
      r = layoutEl.getBoundingClientRect()
    }

    setRect({
      top:    r.top,
      left:   r.left,
      width:  r.width,
      height: r.height,
      bottom: r.bottom,
      right:  r.right,
    })
  }, [selector])

  useEffect(() => {
    measure()

    if (!selector) return

    let attempts = 0
    const maxAttempts = 20
    let rafId

    const tryMeasure = () => {
      const el = document.querySelector(selector)
      if (el) {
        measure()
        return
      }
      attempts++
      if (attempts < maxAttempts) {
        rafId = requestAnimationFrame(tryMeasure)
      }
    }
    tryMeasure()

    const handleUpdate = () => measure()
    window.addEventListener('resize', handleUpdate)
    window.addEventListener('scroll', handleUpdate, true)

    const observer = new MutationObserver(handleUpdate)
    observer.observe(document.body, {
      childList:       true,
      subtree:         true,
      attributes:      true,
      attributeFilter: ['style', 'class'],
    })

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener('resize', handleUpdate)
      window.removeEventListener('scroll', handleUpdate, true)
      observer.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selector, measure, ...deps])

  return rect
}
