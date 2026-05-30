-- ═══════════════════════════════════════════════════════════
-- MIRITI — Schema do Supabase
-- Tabelas: players (identidade) + saves (estado do jogo)
-- ═══════════════════════════════════════════════════════════

-- ── Extensões necessárias ─────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── Tabela: players ───────────────────────────────────────
-- Identidade anónima do jogador. Sem PII (LGPD-friendly).
create table if not exists public.players (
  id              uuid primary key default uuid_generate_v4(),
  nickname        text not null,
  recovery_code   text not null unique,
  created_at      timestamptz not null default now(),
  last_seen_at    timestamptz not null default now(),

  -- Constraint: nickname único, normalizado (case-insensitive)
  constraint nickname_unique unique (nickname),
  constraint nickname_length check (char_length(nickname) between 2 and 20),
  constraint nickname_format check (nickname ~ '^[A-Za-zÀ-ÿ0-9 ._-]+$')
);

-- Índice para busca por recovery_code (recuperação)
create index if not exists idx_players_recovery_code
  on public.players (recovery_code);

-- Índice case-insensitive em nickname (para validação de unicidade)
create unique index if not exists idx_players_nickname_lower
  on public.players (lower(nickname));

-- ── Tabela: saves ─────────────────────────────────────────
-- Estado completo do jogo, atualizado a cada sync.
-- total_coins é um campo desnormalizado para o leaderboard.
create table if not exists public.saves (
  player_id      uuid primary key references public.players(id) on delete cascade,
  game_state     jsonb not null,
  total_coins    integer not null default 0,
  updated_at     timestamptz not null default now(),

  constraint total_coins_non_negative check (total_coins >= 0)
);

-- Índice CRÍTICO para o leaderboard (ORDER BY total_coins DESC)
create index if not exists idx_saves_total_coins
  on public.saves (total_coins desc);

-- Índice para queries por data (leaderboard semanal/mensal futuro)
create index if not exists idx_saves_updated_at
  on public.saves (updated_at desc);

-- ── Trigger: atualizar updated_at automaticamente ─────────
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trigger_saves_updated_at on public.saves;
create trigger trigger_saves_updated_at
  before update on public.saves
  for each row execute function public.update_updated_at_column();

-- ── Trigger: atualizar last_seen_at do player ao salvar ───
create or replace function public.update_player_last_seen()
returns trigger
language plpgsql
as $$
begin
  update public.players
    set last_seen_at = now()
    where id = new.player_id;
  return new;
end;
$$;

drop trigger if exists trigger_player_last_seen on public.saves;
create trigger trigger_player_last_seen
  after insert or update on public.saves
  for each row execute function public.update_player_last_seen();

-- ── View pública: leaderboard ─────────────────────────────
-- Encapsula a query do top 10 para uso direto pelo cliente.
create or replace view public.leaderboard as
  select
    p.nickname,
    s.total_coins,
    s.updated_at,
    row_number() over (order by s.total_coins desc) as rank
  from public.saves s
  join public.players p on p.id = s.player_id
  order by s.total_coins desc;
