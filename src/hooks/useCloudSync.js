import { useEffect, useRef, useState, useCallback } from 'react'
import { saveGameState, loadGameState } from '../lib/api/saves'
import { isSupabaseConfigured } from '../lib/supabaseClient'
import { useOnlineStatus } from './useOnlineStatus'

const SYNC_DEBOUNCE_MS = 3000

export const SYNC_STATUS = {
  IDLE:    'idle',
  PENDING: 'pending',
  SYNCING: 'syncing',
  SUCCESS: 'success',
  ERROR:   'error',
  OFFLINE: 'offline',
}

/**
 * Sincroniza o gameState com o Supabase em background com debounce de 3s.
 * Nunca bloqueia a UI. Ao voltar online, faz flush imediato.
 */
export function useCloudSync(playerId, gameState) {
  const [status, setStatus]         = useState(SYNC_STATUS.IDLE)
  const [lastSyncAt, setLastSyncAt] = useState(null)
  const isOnline                    = useOnlineStatus()

  const debounceTimerRef = useRef(null)
  const pendingStateRef  = useRef(null)
  const lastSyncedRef    = useRef(null)

  const flush = useCallback(async () => {
    if (!playerId || !pendingStateRef.current) return
    if (!isSupabaseConfigured()) {
      setStatus(SYNC_STATUS.OFFLINE)
      return
    }

    setStatus(SYNC_STATUS.SYNCING)
    const stateToSync = pendingStateRef.current
    const result = await saveGameState(playerId, stateToSync)

    if (result.ok) {
      lastSyncedRef.current = JSON.stringify(stateToSync)
      pendingStateRef.current = null
      setLastSyncAt(new Date())
      setStatus(SYNC_STATUS.SUCCESS)
    } else {
      console.warn('[useCloudSync] Falha:', result.error)
      setStatus(SYNC_STATUS.ERROR)
    }
  }, [playerId])

  // Detecta mudanças e agenda debounce
  useEffect(() => {
    if (!playerId || !gameState) return

    const serialized = JSON.stringify(gameState)
    if (serialized === lastSyncedRef.current) return

    pendingStateRef.current = gameState
    setStatus(isOnline ? SYNC_STATUS.PENDING : SYNC_STATUS.OFFLINE)

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)

    if (isOnline) {
      debounceTimerRef.current = setTimeout(flush, SYNC_DEBOUNCE_MS)
    }

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
    }
  }, [playerId, gameState, isOnline, flush])

  // Flush imediato ao voltar online
  useEffect(() => {
    if (isOnline && pendingStateRef.current) {
      flush()
    } else if (!isOnline) {
      setStatus(SYNC_STATUS.OFFLINE)
    }
  }, [isOnline, flush])

  const forceSync = useCallback(async () => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
    await flush()
  }, [flush])

  const loadFromCloud = useCallback(async (id) => {
    const targetId = id ?? playerId
    if (!targetId) return { ok: false, error: 'Sem playerId' }
    return await loadGameState(targetId)
  }, [playerId])

  return { status, lastSyncAt, forceSync, loadFromCloud, isOnline }
}
