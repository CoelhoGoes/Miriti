import { supabase, isSupabaseConfigured } from '../supabaseClient'

export async function saveArcadeSession(session) {
    if (!isSupabaseConfigured()) return { ok: false, error: 'not-configured' }

    try {
        const { data, error } = await supabase
            .from('arcade_sessions')
            .insert({
                nickname: session.nickname,
                started_at: session.startedAt,
                ended_at: session.endedAt,
                initial_coins: session.initialCoins,
                final_coins: session.finalCoins,
                actions_used: session.actionsUsed,
                tier: session.tier,
                duration_sec: session.durationSec,
                questions_count: session.questionsCount,
            })
            .select()
            .maybeSingle()

        if (error) return { ok: false, error }
        return { ok: true, data }
    } catch (error) {
        return { ok: false, error }
    }
}

export async function getArcadeLeaderboard(limit = 10) {
    if (!isSupabaseConfigured()) return { ok: false, error: 'not-configured' }

    try {
        const { data, error } = await supabase
            .from('arcade_sessions')
            .select('nickname, final_coins, tier, ended_at')
            .order('final_coins', { ascending: false })
            .limit(limit)

        if (error) return { ok: false, error }
        return { ok: true, data: data ?? [] }
    } catch (error) {
        return { ok: false, error }
    }
}