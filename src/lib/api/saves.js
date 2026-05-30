import { supabase } from '../supabaseClient'

export async function saveGameState(playerId, gameState) {
  if (!playerId) return { ok: false, error: 'playerId é obrigatório' }

  const totalCoins = Number(gameState?.coins ?? 0)

  const { data, error } = await supabase
    .from('saves')
    .upsert(
      {
        player_id:   playerId,
        game_state:  gameState,
        total_coins: totalCoins,
      },
      { onConflict: 'player_id' }
    )
    .select()
    .single()

  if (error) return { ok: false, error: error.message }
  return { ok: true, data }
}

export async function loadGameState(playerId) {
  if (!playerId) return { ok: false, error: 'playerId é obrigatório' }

  const { data, error } = await supabase
    .from('saves')
    .select('game_state, total_coins, updated_at')
    .eq('player_id', playerId)
    .maybeSingle()

  if (error) return { ok: false, error: error.message }
  return { ok: true, data: data ?? null }
}
