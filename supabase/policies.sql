-- ═══════════════════════════════════════════════════════════
-- MIRITI — Row Level Security (RLS)
-- IMPORTANTE: O cliente usa a chave ANON. As policies aqui
-- limitam o que essa chave pode fazer.
-- ═══════════════════════════════════════════════════════════

-- ── Activar RLS em todas as tabelas ───────────────────────
alter table public.players enable row level security;
alter table public.saves enable row level security;

-- ── PLAYERS ───────────────────────────────────────────────

-- Qualquer um pode CRIAR um novo player (registo de novo jogador)
create policy "Anyone can register"
  on public.players for insert
  to anon
  with check (true);

-- Qualquer um pode LER players (necessário para validar nickname único
-- e para o leaderboard mostrar nicknames).
create policy "Anyone can read players"
  on public.players for select
  to anon
  using (true);

-- Atualização: permitida apenas para last_seen_at (controlado pelo trigger)
-- Nicknames não podem ser alterados pelo cliente directamente.
-- (Se quiseres permitir editar nickname, criar policy específica depois.)

-- Eliminação: NÃO permitida pelo cliente (apenas via dashboard/API admin)

-- ── SAVES ─────────────────────────────────────────────────

-- INSERT: qualquer um pode criar um save (mas apenas para um player_id existente)
create policy "Anyone can create save"
  on public.saves for insert
  to anon
  with check (
    exists (select 1 from public.players where id = saves.player_id)
  );

-- SELECT: qualquer um pode ler saves (necessário para load + leaderboard view)
-- Nota: a view leaderboard expõe nickname + total_coins, o que é o desejado.
-- O game_state em si pode ser lido por qualquer um, mas como não tem PII e
-- não é vinculável a uma pessoa real, é aceitável para esta demo.
-- TODO futuro: restringir SELECT do game_state a auth.uid() = player_id
create policy "Anyone can read saves"
  on public.saves for select
  to anon
  using (true);

-- UPDATE: qualquer um pode actualizar (sem auth, é confiar no cliente)
-- Em produção real, seria via API com auth. Para demo de jogo, aceitável.
create policy "Anyone can update saves"
  on public.saves for update
  to anon
  using (true)
  with check (true);

-- DELETE: NÃO permitida pelo cliente
-- (apagar progresso é uma operação destrutiva — só via dashboard)

-- ── Comentário sobre segurança ────────────────────────────
-- Esta configuração é adequada para uma DEMO educativa onde:
-- 1. Não há dados pessoais sensíveis
-- 2. O "pior caso" é alguém adulterar moedas no leaderboard
-- 3. Não há transações financeiras reais
--
-- Para um projecto em escala, recomenda-se:
-- - API routes na Vercel com service_role key (bypass RLS)
-- - Validação server-side de total_coins (evitar valores absurdos)
-- - Rate limiting por IP
