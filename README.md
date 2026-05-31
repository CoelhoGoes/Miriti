# 🐷 Miriti — Educação Financeira para Crianças

Jogo educacional em React que ensina conceitos de finanças pessoais a crianças de forma lúdica. Inclui quiz por fases, feirinha de produtos, cooperativa de animais, ranking global e sincronização de progresso na nuvem.

![Made with React](https://img.shields.io/badge/Made%20with-React-61dafb?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Built%20with-Vite-646cff?style=flat-square&logo=vite)
![Supabase](https://img.shields.io/badge/Backend-Supabase-3ecf8e?style=flat-square&logo=supabase)

---

## 🚀 Como rodar

### Pré-requisitos

- **Node.js 20+** e **npm**

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

> O `.env.example` já contém as credenciais do projecto Supabase de desenvolvimento.
> Basta copiar — não é necessário alterar nada para o ambiente local.

### 3. Iniciar em modo desenvolvimento

```bash
npm run dev
```

O servidor abrirá em <http://localhost:5173>.

### 4. Build de produção

```bash
npm run build   # gera dist/
npm run preview # serve o build localmente
```

---

## ☁️ Ligação ao Supabase

O jogo funciona **offline** com localStorage como fallback. A ligação ao Supabase activa:

| Funcionalidade         | Sem Supabase | Com Supabase |
| ---------------------- | :----------: | :----------: |
| Jogar                  | ✅           | ✅           |
| Progresso local        | ✅           | ✅           |
| Criar conta (nickname) | ❌           | ✅           |
| Sync entre dispositivos| ❌           | ✅           |
| Recovery code          | ❌           | ✅           |
| Leaderboard global     | ❌           | ✅           |

Se `VITE_SUPABASE_URL` ou `VITE_SUPABASE_ANON_KEY` não estiverem definidas, o jogo arranca normalmente mas salta o onboarding de conta e o ranking fica inactivo.

### Variáveis de ambiente

| Variável                | Descrição                                               |
| ----------------------- | ------------------------------------------------------- |
| `VITE_SUPABASE_URL`     | URL do projecto (Settings → API → Project URL)          |
| `VITE_SUPABASE_ANON_KEY`| Chave pública anon (Settings → API → anon public)       |

> ⚠️ Usar **sempre** a `anon` key, nunca a `service_role`. A `anon` key é segura para expor no cliente.

### Setup de um projecto Supabase próprio

Consultar **[docs/supabase-setup.md](docs/supabase-setup.md)** para instruções completas de criação de tabelas, políticas RLS e configuração na Vercel.

---

## ✨ Funcionalidades

- 🎓 **Escolinha** — 3 fases × 10 perguntas sobre dinheiro, poupança e investimentos
- 🧺 **Feirinha do Jutaiteua** — comprar e vender produtos com flutuação de preços e eventos de mercado
- 🐾 **Cooperativa dos Bichos** — sistema de aliados, parceiros e ajudantes com buffs reais no jogo
- 🏆 **Leaderboard global** — top 10 com medalhas + posição do jogador fora do top
- 👤 **Conta de jogador** — nickname único, recovery code para continuar noutro dispositivo
- ☁️ **Sync automático** — progresso guardado na nuvem com debounce de 3s, indicador visual no header
- 🎵 **Som sintetizado** — música e efeitos via Web Audio API, sem ficheiros externos
- ♿ **Acessibilidade** — modo daltónico (deuter/protan/tritan), escala de fonte, navegação por teclado
- 📱 **Responsivo** — desktop e tablet

---

## 📁 Estrutura do projecto

```text
miriti/
├── .env.example              # credenciais Supabase (copiar para .env)
├── docs/
│   └── supabase-setup.md     # guia de setup do banco de dados
├── supabase/
│   ├── schema.sql            # tabelas players + saves + view leaderboard
│   └── policies.sql          # políticas RLS
└── src/
    ├── App.jsx               # controlador de telas e gate de onboarding
    ├── context/
    │   └── GameContext.jsx   # estado global + reducer + sync com Supabase
    ├── hooks/
    │   ├── useCloudSync.js   # sync automático com debounce e detecção offline
    │   └── useOnlineStatus.js
    ├── lib/
    │   ├── supabaseClient.js
    │   └── api/
    │       ├── players.js    # criar jogador, verificar nickname
    │       ├── saves.js      # guardar/carregar estado do jogo
    │       ├── leaderboard.js
    │       └── recovery.js   # recuperar conta por código secreto
    ├── components/
    │   ├── Onboarding/       # NicknameScreen, RecoveryCelebration, RecoveryScreen
    │   ├── Cooperativa/      # ecrã da cooperativa de animais
    │   ├── Feirinha/         # mercado de produtos
    │   ├── Leaderboard/      # ranking global
    │   ├── SyncIndicator/    # badge ☁️ no header com 6 estados
    │   ├── LogoutModal.jsx   # logout defensivo com confirmação do código
    │   ├── FarmMap.jsx       # mapa principal da fazenda
    │   ├── HomeScreen.jsx
    │   ├── QuizScreen.jsx
    │   ├── OptionsModal.jsx  # configurações + código de recuperação
    │   └── ...
    ├── data/
    │   ├── questions.js      # banco de perguntas
    │   ├── animals.js        # dados da cooperativa
    │   └── animalEffects.js  # efeitos dos animais no estado do jogo
    ├── i18n/
    │   └── strings.js        # todas as strings PT/EN
    └── styles/
        └── tokens.css        # variáveis CSS de cor e tipografia
```

---

## 🔑 Fluxo de primeiro login

```text
Abrir jogo
  └─ player.id == null?
       ├─ SIM → NicknameScreen
       │         ├─ Criar conta → RecoveryCelebration (mostra código secreto)
       │         └─ "Já joguei antes" → RecoveryScreen (inserir código)
       └─ NÃO → HomeScreen → FarmMap (jogo normal)
```

O **recovery code** (formato `PALAVRA-NNNN-PALAVRA`) permite recuperar o progresso completo noutro dispositivo ou após limpar o cache.

---

## 🛠️ Tecnologias

| Tecnologia                                                    | Uso                                    |
| ------------------------------------------------------------- | -------------------------------------- |
| [React 18](https://react.dev/)                                | UI e estado                            |
| [Vite 5](https://vitejs.dev/)                                 | Build e dev server                     |
| [Supabase](https://supabase.com/)                             | Base de dados, auth-less, RLS          |
| [Framer Motion](https://www.framer.com/motion/)               | Animações                              |
| [React Spring](https://www.react-spring.dev/)                 | Animações de física                    |
| [React Icons](https://react-icons.github.io/react-icons/)     | Ícones                                 |
| Web Audio API                                                 | Som sintetizado sem ficheiros externos |
| CSS Modules + custom properties                               | Estilos isolados com tokens de design  |

---

## 📝 Licença

Projecto educacional aberto. Livre para usar, modificar e ensinar. 💜
