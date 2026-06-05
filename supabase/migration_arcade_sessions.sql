-- Tabela de sessões do Modo Arcade (identidade separada do jogador clássico)
create table if not exists public.arcade_sessions (
  id              uuid primary key default gen_random_uuid(),
  nickname        text not null,
  started_at      timestamptz not null,
  ended_at        timestamptz not null,
  initial_coins   integer not null default 1000,
  final_coins     integer not null,
  actions_used    integer not null,
  tier            text not null,
  duration_sec    integer not null default 0,
  questions_count integer not null default 0,
  created_at      timestamptz not null default now(),
  -- CHECK defensivo: bloqueia lixo acidental (NAO impede forging deliberado — modelo demo)
  constraint arcade_sessions_nickname_len   check (char_length(nickname) between 1 and 20),
  constraint arcade_sessions_final_coins_ok check (final_coins >= 0),
  constraint arcade_sessions_actions_ok     check (actions_used between 0 and 20),
  constraint arcade_sessions_tier_ok        check (tier in ('basic','medium','advanced')),
  constraint arcade_sessions_duration_ok    check (duration_sec >= 0)
);

create index if not exists idx_arcade_sessions_score on public.arcade_sessions(final_coins desc);

alter table public.arcade_sessions enable row level security;

-- Modelo demo (alinhado com policies existentes): anon pode inserir e ler.
create policy "arcade_sessions anon insert"
  on public.arcade_sessions for insert to anon with check (true);
create policy "arcade_sessions anon select"
  on public.arcade_sessions for select to anon using (true);
-- NOTA: sem UPDATE/DELETE para anon (ranking e append-only).