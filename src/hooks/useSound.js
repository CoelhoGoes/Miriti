import { useCallback } from 'react'
import { sound } from '../utils/sound.js'

/**
 * Hook conveniente para tocar sons.
 * Uso: const { play } = useSound(); play('click')
 */
export function useSound() {
  const play = useCallback((name) => {
    sound.play(name)
  }, [])

  return { play, sound }
}
