import { supabase } from '../supabaseClient'

function generateRecoveryCode() {
  const words = [
    'FAZENDA', 'MIRITI', 'JUTAITEUA', 'AÇAÍ', 'CACAU',
    'IGARAPE', 'PALMEIRA', 'RIO', 'FLORESTA', 'COFRINHO',
    'GALINHA', 'JABUTI', 'TUCANO', 'CAPIVARA', 'BOTO',
  ]
  const w1 = words[Math.floor(Math.random() * words.length)]
  let w2 = words[Math.floor(Math.random() * words.length)]
  while (w2 === w1) w2 = words[Math.floor(Math.random() * words.length)]

  const num = String(Math.floor(1000 + Math.random() * 9000))
  return `${w1}-${num}-${w2}`
}

export async function checkNicknameAvailable(nickname) {
  const trimmed = nickname.trim()
  if (trimmed.length < 2 || trimmed.length > 20) {
    return { ok: false, error: 'Nickname deve ter entre 2 e 20 caracteres' }
  }

  const { data, error } = await supabase
    .from('players')
    .select('id')
    .ilike('nickname', trimmed)
    .maybeSingle()

  if (error) return { ok: false, error: error.message }
  return { ok: true, available: !data }
}

export async function createPlayer(nickname) {
  const trimmed = nickname.trim()

  for (let attempt = 0; attempt < 5; attempt++) {
    const recoveryCode = generateRecoveryCode()

    const { data, error } = await supabase
      .from('players')
      .insert({ nickname: trimmed, recovery_code: recoveryCode })
      .select()
      .single()

    if (!error) return { ok: true, data }

    if (error.code === '23505') {
      if (error.message.includes('nickname')) {
        return { ok: false, error: 'Esse nome já está em uso.' }
      }
      continue
    }

    return { ok: false, error: error.message }
  }

  return { ok: false, error: 'Falha ao gerar código único. Tente novamente.' }
}

export async function getPlayerById(playerId) {
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('id', playerId)
    .single()

  if (error) return { ok: false, error: error.message }
  return { ok: true, data }
}

export async function deactivateAccount(playerId) {
  if (!playerId) return { ok: false, error: 'playerId é obrigatório' }

  const { data, error } = await supabase
    .from('players')
    .update({ is_active: false })
    .eq('id', playerId)
    .select()
    .single()

  if (error) return { ok: false, error: error.message }
  return { ok: true, data }
}

export async function reactivateAccount(playerId) {
  if (!playerId) return { ok: false, error: 'playerId é obrigatório' }

  const { data, error } = await supabase
    .from('players')
    .update({ is_active: true })
    .eq('id', playerId)
    .select()
    .single()

  if (error) return { ok: false, error: error.message }
  return { ok: true, data }
}

export async function deleteAccount(playerId) {
  if (!playerId) return { ok: false, error: 'playerId é obrigatório' }

  const { error } = await supabase
    .from('players')
    .delete()
    .eq('id', playerId)

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}
