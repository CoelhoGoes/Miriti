# Setup do Supabase para o Miriti

## 1. Criar projeto Supabase

1. Aceder a https://supabase.com e fazer login
2. Clicar "New Project"
3. Nome: `miriti-game`
4. Região: `South America (São Paulo)` para latência mínima
5. Password do DB: gerar uma forte e guardar (não vais usar diretamente)
6. Plano: Free
7. Aguardar ~2 min provisionar

## 2. Executar o schema

1. No Supabase Studio, ir a **SQL Editor**
2. Copiar TODO o conteúdo de `supabase/schema.sql`
3. Colar e clicar **Run**
4. Verificar mensagem: "Success. No rows returned"

## 3. Aplicar as policies de segurança (RLS)

1. Ainda no SQL Editor
2. Copiar TODO o conteúdo de `supabase/policies.sql`
3. Colar e clicar **Run**

## 4. Obter as credenciais

1. Ir a **Settings → API**
2. Copiar:
   - `Project URL` → será `VITE_SUPABASE_URL`
   - `anon public` key → será `VITE_SUPABASE_ANON_KEY`

## 5. Configurar variáveis no projeto local

1. Copiar `.env.example` para `.env`
2. Preencher com as credenciais do passo 4
3. **Nunca commitar o `.env`** (já está no `.gitignore`)

## 6. Configurar variáveis na Vercel

1. Aceder ao projeto na Vercel → **Settings → Environment Variables**
2. Adicionar:
   - `VITE_SUPABASE_URL` = (mesmo valor do `.env`)
   - `VITE_SUPABASE_ANON_KEY` = (mesmo valor do `.env`)
3. Aplicar a: Production, Preview, Development
4. Fazer redeploy

## 7. Verificar tabelas criadas

No Supabase Studio → **Table Editor** devem aparecer:
- `players`
- `saves`

E em **Database → Indexes** deve existir:
- `idx_saves_total_coins` (para o leaderboard)
