import { supabase } from '../supabaseClient'

export async function getTopPlayers(limit = 10) {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('nickname, total_coins, updated_at, rank')
    .limit(limit)

  if (error) return { ok: false, error: error.message }
  return { ok: true, data: data ?? [] }
}

export async function getPlayerRank(playerId) {
  const { data: playerSave, error: saveErr } = await supabase
    .from('saves')
    .select('total_coins')
    .eq('player_id', playerId)
    .maybeSingle()

  if (saveErr || !playerSave) {
    return { ok: false, error: 'Save não encontrado' }
  }

  const { count, error: rankErr } = await supabase
    .from('saves')
    .select('player_id', { count: 'exact', head: true })
    .gt('total_coins', playerSave.total_coins)

  if (rankErr) return { ok: false, error: rankErr.message }

  return { ok: true, data: { rank: (count ?? 0) + 1, coins: playerSave.total_coins } }
}
