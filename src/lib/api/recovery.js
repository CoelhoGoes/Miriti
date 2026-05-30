import { supabase } from '../supabaseClient'

export async function recoverByCode(recoveryCode) {
  const code = recoveryCode.trim().toUpperCase()

  if (!/^[A-ZÀ-Ú]+-\d{4}-[A-ZÀ-Ú]+$/.test(code)) {
    return { ok: false, error: 'Formato inválido. Exemplo: FAZENDA-7421-MIRITI' }
  }

  const { data: player, error: playerErr } = await supabase
    .from('players')
    .select('*')
    .eq('recovery_code', code)
    .maybeSingle()

  if (playerErr) return { ok: false, error: playerErr.message }
  if (!player) {
    return { ok: false, error: 'Código não encontrado. Verifica e tenta de novo.' }
  }

  const { data: save } = await supabase
    .from('saves')
    .select('game_state, total_coins, updated_at')
    .eq('player_id', player.id)
    .maybeSingle()

  return { ok: true, data: { player, save } }
}
