-- ═══════════════════════════════════════════════════════════
-- MIGRATION — Estado da Conta (is_active)
-- Adiciona possibilidade de inativar conta sem apagar.
-- ═══════════════════════════════════════════════════════════

-- ── 1. Adicionar coluna is_active em players ──────────────
alter table public.players
  add column if not exists is_active boolean not null default true;

-- ── 2. Índice parcial para queries do leaderboard ─────────
create index if not exists idx_players_is_active
  on public.players (is_active) where is_active = true;

-- ── 3. Recriar a view leaderboard com filtro ──────────────
drop view if exists public.leaderboard;

create or replace view public.leaderboard as
  select
    p.nickname,
    s.total_coins,
    s.updated_at,
    row_number() over (order by s.total_coins desc) as rank
  from public.saves s
  join public.players p on p.id = s.player_id
  where p.is_active = true
  order by s.total_coins desc;

-- ── 4. Policy de UPDATE em players ────────────────────────
drop policy if exists "Anyone can update player status" on public.players;

create policy "Anyone can update player status"
  on public.players for update
  to anon
  using (true)
  with check (true);

-- ── 5. Policy de DELETE em players ────────────────────────
-- saves é apagado em cascata (foreign key on delete cascade).
drop policy if exists "Anyone can delete account" on public.players;

create policy "Anyone can delete account"
  on public.players for delete
  to anon
  using (true);
