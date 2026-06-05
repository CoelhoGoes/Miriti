Modo Arcade — Especificação Completa

🎮 Modo Arcade — Especificação Completa
Segunda versão do Miriti — experiência rápida para adultos
📐 Decisões Fundamentais (Confirmadas)
Aspecto Decisão
Convivência Modo Arcade convive com Modo História no mesmo build. Escolha feita na HOME.
Limitação Sistema de 20 Ações que o jogador gasta como quiser
Saldo inicial coins: 1000
Nível Médio ≥ 5000 moedas finais → 🥈 Prata (5× base)
Nível Avançado ≥ 10000 moedas finais → 🥇 Ouro (10× base)
Quiz 20-25 perguntas em banco separado (cálculo mental + cenário comparativo, sem termos técnicos, Bloom-1)
Cooperativa Disponível, todos os animais já desbloqueados
Conquistas ❌ Removidas
Painel de Pais ❌ Removido
Persistência Tabelas próprias no Supabase
i18n PT-BR + EN
Tutorial Fluxo único tutorial.arcade.welcome
🎯 1. Sistema de Ações (Coração do Modo)
Custo em ações por atividade
Atividade Custo
Completar 1 lição no Quiz 1 ação
Avançar 1 rodada na Feira (sair e voltar) 1 ação
Acessar a Cooperativa 1 ação
Trocar Aliado em campo (modal) 0 ações
Usar Ajudante consumível 0 ações
Olhar Cesta da Família 0 ações
💡 Lição embutida: ensina custo de oportunidade — adultos sentem como gestão de portfólio. Cada acesso tem peso.

Comportamento ao chegar em 0 ações
HUD mostra "ÚLTIMA AÇÃO!" no contador quando actions === 1
Ao gastar a última ação, o jogo dispara automaticamente a Tela de Resultado Final com o saldo final + nível alcançado
Não há tempo, não há confirmação — é morte súbita educativa
🏗️ 2. Arquitetura Técnica
2.1. Flag de Modo no Estado Global
Adicionar em GameContext.jsx no initialState:

js
gameMode: 'classic',        // 'classic' | 'arcade'
arcade: {
active: false,
actionsRemaining: 20,
actionsTotal: 20,
initialCoins: 1000,
startedAt: null,           // timestamp ISO
endedAt: null,
finalCoins: null,
finalTier: null,           // 'basic' | 'medium' | 'advanced'
questionsAnswered: [],     // IDs das perguntas já feitas (evita repetir)
lastSessionResult: null,   // { tier, coins, actionsUsed, durationSec } — para tela de resultado
}
2.2. Novas Actions no Reducer
js
ARCADE_START                  // inicializa sessão arcade
ARCADE_CONSUME_ACTION         // decrementa actionsRemaining
ARCADE_END                    // calcula tier final e persiste resultado
ARCADE_RESET                  // limpa para nova partida
ARCADE_MARK_QUESTION_USED     // adiciona ID em questionsAnswered
ARCADE_RETURN_TO_HOME         // volta pro modo classic
SET_GAME_MODE                 // troca entre 'classic' e 'arcade'
2.3. Helpers Expostos por useGame()
js
startArcade()                 // dispatch ARCADE_START + SET_GAME_MODE='arcade'
consumeAction(reason)         // 'quiz' | 'fair' | 'coop' — apenas log, decrementa
endArcade()                   // calcula tier, salva, dispara modal de resultado
exitArcade()                  // volta pra HOME do modo classic
markArcadeQuestionUsed(id)
2.4. Lógica de Pontuação Final
js
function calculateArcadeTier(finalCoins) {
if (finalCoins >= 10000) return 'advanced';
if (finalCoins >= 5000)  return 'medium';
return 'basic';
}
🎬 3. Mudanças no Fluxo de Telas
3.1. Nova HOME
A HomeScreen.jsx ganha 2 cards de modo lado a lado:

┌────────────────────────────────────────────────────┐
│                  Miriti                            │
│         Aventura Amazônica                         │
│                                                    │
│  ┌──────────────────┐    ┌──────────────────┐     │
│  │   🌾 HISTÓRIA    │    │   🎮 ARCADE      │     │
│  │                  │    │                  │     │
│  │  Aventura        │    │  20 ações        │     │
│  │  completa.       │    │  Maximize        │     │
│  │  Aprenda no      │    │  suas moedas!    │     │
│  │  seu ritmo.      │    │                  │     │
│  │                  │    │  ⏱️ Rápido       │     │
│  │  [ Jogar ]       │    │  [ Desafiar ]    │     │
│  └──────────────────┘    └──────────────────┘     │
└────────────────────────────────────────────────────┘
Estilização do card Arcade:

Fonte da palavra "Arcade" usa font-family: 'Press Start 2P', 'Courier New', monospace (ou similar pixelada/retrô)
Cor de destaque: gradiente linear-gradient(135deg, var(--color-warning), var(--color-danger)) (laranja→vermelho)
Borda animada com framer-motion (pulsante leve para chamar atenção)
Badge "NOVO!" no canto superior direito (apenas se state.player.hasPlayedArcade === false)
3.2. Nova Constante em SCREENS
js
const SCREENS = {
HOME: 'home',
// ... existentes
ARCADE_TUTORIAL: 'arcade_tutorial',     // ← NOVO
ARCADE_RESULT: 'arcade_result',         // ← NOVO
}
3.3. Telas Acessíveis em Cada Modo
Tela Modo Classic Modo Arcade
HOME ✅ ✅ (saída)
FARM (FarmMap) ✅ ✅
ESCOLINHA (lista de lições) ✅ ❌ — vai direto pro QUIZ
QUIZ ✅ ✅ (banco diferente)
RESULT (resultado individual de lição) ✅ ❌ — não existe no Arcade
STOCKS / Feirinha ✅ ✅
SHOP / Cooperativa ✅ ✅ (todos animais owned)
ACHIEVEMENTS ✅ ❌
LEADERBOARD ✅ ✅ (mas separado por modo)
PARENTS ✅ ❌
CREDITS ✅ ✅
BOSS ✅ ❌
ARCADE_TUTORIAL ❌ ✅
ARCADE_RESULT ❌ ✅
3.4. FarmMap Adaptado para Arcade
No FarmMap, quando gameMode === 'arcade':

Node "Conquistas" → escondido
Node "Escola" → vira "Quiz Rápido" e leva direto pro QUIZ (pula EscolinhaScreen)
Botão "Painel dos Pais" no header → escondido
Header ganha HUD de Ações (próximo passo)
🎛️ 4. Novos Componentes da UI
4.1. ArcadeActionsHUD (canto superior direito do FarmMap)
┌─────────────────────┐
│  🎯 AÇÕES           │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░ │
│       17 / 20       │
└─────────────────────┘
Barra de progresso com cor que muda conforme decai:
20-11 ações → verde (var(--color-success))
10-4 ações → âmbar (var(--color-warning))
3-1 ações → vermelho (var(--color-danger))
Animação de "shake" do contador ao consumir ação (framer-motion)
Última ação: pulso vermelho intenso
4.2. ArcadeStartScreen (primeira vez ao entrar no modo)
Tela de boas-vindas pré-tutorial:

┌────────────────────────────────────────────┐
│           🎮 MIRITI ARCADE                 │
│                                            │
│        Pronto pro desafio?                 │
│                                            │
│  Você tem 20 ações pra fazer suas moedas   │
│  crescerem o máximo possível!              │
│                                            │
│  💰 Você começa com:    1000 moedas        │
│  🎯 Você tem:           20 ações           │
│                                            │
│  Boa sorte! 🐷                             │
│                                            │
│   [ Quero ver o tutorial ]                 │
│   [ Pular e começar agora ]                │
└────────────────────────────────────────────┘
4.3. ArcadeResultScreen (tela final ao acabar as ações)
┌──────────────────────────────────────────────┐
│              🎉 ACABOU!                      │
│                                              │
│              [TIER ÍCONE]                    │
│              🥈 PRATA                        │
│                                              │
│         Você ganhou 6.420 moedas!            │
│                                              │
│  ┌────────────────────────────────────────┐ │
│  │ 💰 Saldo final:           6.420 🪙     │ │
│  │ 📈 Lucro:                +5.420 🪙     │ │
│  │ 🎯 Ações usadas:         20 / 20       │ │
│  │ ⏱️ Tempo de partida:      4min 32s     │ │
│  └────────────────────────────────────────┘ │
│                                              │
│  [Mensagem motivacional do Cofrinho]         │
│                                              │
│   [ Jogar de novo ]   [ Voltar pra Home ]   │
└──────────────────────────────────────────────┘
Mensagens motivacionais por tier
Tier Mensagem do Cofrinho
🥉 Básico "Boa primeira partida! Que tal tentar de novo e tentar bater o seu próprio recorde? 🐷"
🥈 Prata "Uau! Você é um(a) bom comerciante! Bora tentar o ouro? 💪"
🥇 Ouro "INCRÍVEL! Você dominou a Fazendinha! Mestre dos negócios! 🏆"
Animação de revelação do tier
Fade-in do badge com framer-motion (delay 0.5s, scale 0.5 → 1.2 → 1)
Confete usando framer-motion (não importar libs novas) — partículas animadas com SVG
Som de fanfarra (já existem em useSound)
📚 5. Banco de Perguntas do Arcade
5.1. Novo arquivo: src/data/arcadeQuestions.js
22 perguntas Bloom-1, foco em cálculo mental e cenário comparativo:

js
export const ARCADE_QUESTIONS = [

// === CÁLCULO MENTAL — JUROS SIMPLES ===
{
  id: 'arc-q1',
  type: 'calc',
  text: 'Você guardou 200 moedas e elas rendem 10% por mês. Quanto você terá depois de 1 mês?',
  options: ['210 moedas', '220 moedas', '300 moedas', '250 moedas'],
  correct: 1,
  explanation: '10% de 200 é 20. Então 200 + 20 = 220 moedas!',
},
{
  id: 'arc-q2',
  type: 'calc',
  text: 'Se você tem 500 moedas e gasta 30%, quanto sobra?',
  options: ['150 moedas', '350 moedas', '470 moedas', '300 moedas'],
  correct: 1,
  explanation: '30% de 500 é 150. Sobra: 500 - 150 = 350.',
},

// === CÁLCULO MENTAL — DESCONTOS ===
{
  id: 'arc-q3',
  type: 'calc',
  text: 'Um produto custa 80 moedas com 25% de desconto. Quanto era o preço original?',
  options: ['100 moedas', '105 moedas', '110 moedas', '120 moedas'],
  correct: 2,
  explanation: 'Se 80 já tem 25% de desconto, 80 representa 75% do original. 80 ÷ 0,75 ≈ 107. Mais próximo: 110.',
},

// === CENÁRIO COMPARATIVO ===
{
  id: 'arc-q4',
  type: 'comparison',
  text: 'Maria tem 2 opções:\nA) Guardar 100 moedas que rendem 5% ao mês\nB) Guardar 100 moedas que rendem 50% ao ano\n\nQual rende mais em 1 ano?',
  options: [
    'Opção A — 5% ao mês',
    'Opção B — 50% ao ano',
    'As duas rendem igual',
    'Não tem como saber',
  ],
  correct: 0,
  explanation: '5% ao mês × 12 meses = 60% ao ano. É mais que 50% ao ano!',
},
{
  id: 'arc-q5',
  type: 'comparison',
  text: 'Você quer comprar um item de 300 moedas. Tem 2 jeitos:\nA) Pagar 300 à vista\nB) Pagar 350 em 5 vezes\n\nQual é melhor pro seu bolso?',
  options: [
    'À vista',
    'Parcelado',
    'Tanto faz',
    'Depende',
  ],
  correct: 0,
  explanation: 'À vista você paga 300. Parcelado, paga 50 a mais (350). À vista é melhor!',
},

// === CENÁRIO COMPARATIVO — INVESTIMENTO ===
{
  id: 'arc-q6',
  type: 'comparison',
  text: 'Dois produtos da feira:\nA) Açaí: comprou por 8, hoje vale 12 moedas\nB) Cacau: comprou por 20, hoje vale 25 moedas\n\nQual deu MAIOR lucro PERCENTUAL?',
  options: [
    'Açaí (50% de lucro)',
    'Cacau (25% de lucro)',
    'Os dois iguais',
    'Os dois deram prejuízo',
  ],
  correct: 0,
  explanation: 'Açaí: lucrou 4 sobre 8 = 50%. Cacau: lucrou 5 sobre 20 = 25%. Açaí ganhou!',
},

// === CÁLCULO MENTAL — POUPANÇA ===
{
  id: 'arc-q7',
  type: 'calc',
  text: 'Se você guarda 50 moedas por mês, quanto terá em 1 ano?',
  options: ['500 moedas', '550 moedas', '600 moedas', '650 moedas'],
  correct: 2,
  explanation: '50 × 12 = 600 moedas em 1 ano!',
},
{
  id: 'arc-q8',
  type: 'calc',
  text: 'Se você dobra suas moedas a cada mês começando com 10, quantas terá no fim do 4º mês?',
  options: ['40', '80', '160', '320'],
  correct: 2,
  explanation: 'Mês 1: 20. Mês 2: 40. Mês 3: 80. Mês 4: 160!',
},

// === CENÁRIO — RISCO E RETORNO ===
{
  id: 'arc-q9',
  type: 'comparison',
  text: 'Pedro pode escolher:\nA) Garantia de ganhar 100 moedas\nB) 50% de chance de ganhar 250 ou 0\n\nQual a escolha mais SEGURA?',
  options: [
    'Opção A — garantida',
    'Opção B — pode ganhar mais',
    'As duas são iguais',
    'Nenhuma das duas',
  ],
  correct: 0,
  explanation: 'A é segura: ganha 100 sempre. B é arriscada: pode ganhar 0!',
},

// === CÁLCULO — DIVISÃO ===
{
  id: 'arc-q10',
  type: 'calc',
  text: 'Você ganhou 120 moedas e quer dividir igualmente em 3 partes: gastar, guardar e investir. Quanto vai pra cada?',
  options: ['30 moedas', '40 moedas', '60 moedas', '50 moedas'],
  correct: 1,
  explanation: '120 ÷ 3 = 40 moedas pra cada finalidade.',
},

// === CÁLCULO — JUROS COMPOSTOS SIMPLES ===
{
  id: 'arc-q11',
  type: 'calc',
  text: 'Você guardou 100 moedas que rendem 10% ao mês. Quanto você terá depois de 2 meses?',
  options: ['120 moedas', '121 moedas', '125 moedas', '130 moedas'],
  correct: 1,
  explanation: 'Mês 1: 100 + 10 = 110. Mês 2: 110 + 11 = 121. (Os juros rendem juros!)',
},

// === CENÁRIO — INFLAÇÃO ===
{
  id: 'arc-q12',
  type: 'comparison',
  text: 'No ano passado um pão custava 2 moedas. Hoje custa 3 moedas.\nE no ano passado seu salário comprava 100 pães. Hoje compra quantos?',
  options: ['100 pães', '67 pães', '50 pães', '33 pães'],
  correct: 1,
  explanation: 'Mesmo dinheiro, pão mais caro = 200 moedas ÷ 3 ≈ 67 pães. Inflação!',
},

// === CÁLCULO — META FINANCEIRA ===
{
  id: 'arc-q13',
  type: 'calc',
  text: 'Você quer juntar 600 moedas pra uma bicicleta. Se guardar 25 moedas por semana, em quantas semanas chega lá?',
  options: ['12 semanas', '20 semanas', '24 semanas', '30 semanas'],
  correct: 2,
  explanation: '600 ÷ 25 = 24 semanas pra bater a meta!',
},

// === CENÁRIO — DESPESAS ===
{
  id: 'arc-q14',
  type: 'comparison',
  text: 'Sua renda é 1000 moedas/mês.\nA) Aluguel 400, comida 300, lazer 100\nB) Aluguel 400, comida 300, lazer 400\n\nQual orçamento sobra dinheiro pra poupar?',
  options: [
    'Apenas A sobra',
    'Apenas B sobra',
    'Os dois sobram',
    'Nenhum sobra',
  ],
  correct: 0,
  explanation: 'A = 800 gastos, sobra 200. B = 1100 gastos, ficou no negativo!',
},

// === CÁLCULO — CONVERSÃO PERCENTUAL ===
{
  id: 'arc-q15',
  type: 'calc',
  text: 'Você tem 250 moedas e quer guardar 20% delas. Quanto vai poupar?',
  options: ['25 moedas', '50 moedas', '40 moedas', '60 moedas'],
  correct: 1,
  explanation: '20% de 250 = 50 moedas pra poupar.',
},

// === CENÁRIO — DIVERSIFICAÇÃO ===
{
  id: 'arc-q16',
  type: 'comparison',
  text: 'Maria e João investiram 1000 moedas:\nA) Maria: 1000 só em pimenta (subiu 50%)\nB) João: 500 em pimenta + 500 em peixe (pimenta subiu 50%, peixe caiu 30%)\n\nQuem ganhou mais?',
  options: [
    'Maria — 1500',
    'João — 1100',
    'Empate',
    'Os dois perderam',
  ],
  correct: 0,
  explanation: 'Maria: 1000 × 1.5 = 1500. João: 750 + 350 = 1100. Maria ganhou mais arriscando!',
},

// === CÁLCULO — TROCO ===
{
  id: 'arc-q17',
  type: 'calc',
  text: 'Você comprou itens de 17, 24 e 33 moedas. Pagou com 100 moedas. Quanto recebe de troco?',
  options: ['16 moedas', '26 moedas', '36 moedas', '46 moedas'],
  correct: 1,
  explanation: '17 + 24 + 33 = 74. Troco: 100 - 74 = 26.',
},

// === CENÁRIO — OFERTA E DEMANDA ===
{
  id: 'arc-q18',
  type: 'comparison',
  text: 'Houve enchente e a colheita de cacau caiu pela metade. O que vai acontecer com o preço do cacau?',
  options: [
    'Vai subir (menos cacau no mercado)',
    'Vai cair (sobrou pouco)',
    'Não muda',
    'Cacau vira de graça',
  ],
  correct: 0,
  explanation: 'Pouca oferta + mesma procura = preço sobe! É a lei da oferta e demanda.',
},

// === CÁLCULO — SOBRA ===
{
  id: 'arc-q19',
  type: 'calc',
  text: 'Sua renda é 800 e seus gastos somam 650. Quanto pode poupar por mês?',
  options: ['100', '150', '200', '250'],
  correct: 1,
  explanation: '800 - 650 = 150 moedas pra poupar.',
},

// === CÁLCULO — DOBRO/METADE ===
{
  id: 'arc-q20',
  type: 'calc',
  text: 'Se você tem 480 moedas e gasta a METADE em comida, quanto sobra pro resto do mês?',
  options: ['120 moedas', '180 moedas', '240 moedas', '320 moedas'],
  correct: 2,
  explanation: 'Metade de 480 = 240. Sobra 240 pro resto.',
},

// === CENÁRIO — RESERVA DE EMERGÊNCIA ===
{
  id: 'arc-q21',
  type: 'comparison',
  text: 'Você tem 2000 moedas. Pode escolher:\nA) Guardar 500 pra emergência e investir 1500\nB) Investir tudo (2000)\n\nQual é mais SEGURO se acontecer um imprevisto?',
  options: [
    'Opção A — tem reserva',
    'Opção B — tudo investido',
    'Tanto faz',
    'Não tem como saber',
  ],
  correct: 0,
  explanation: 'A reserva te protege se algo der errado e você precisar de dinheiro rápido!',
},

// === CÁLCULO — TAXA ===
{
  id: 'arc-q22',
  type: 'calc',
  text: 'Um banco cobra 5 moedas de taxa por mês. Em 1 ano, quanto você paga em taxas?',
  options: ['50 moedas', '60 moedas', '70 moedas', '120 moedas'],
  correct: 1,
  explanation: '5 × 12 = 60 moedas/ano em taxas.',
},
];
5.2. Comportamento do Quiz no Arcade
Pergunta sorteada sem repetição dentro da mesma sessão (questionsAnswered rastreia)
Quando todas as 22 forem usadas, sortear de novo do banco completo
Recompensa por acerto:
Quiz tipo calc: +150 moedas
Quiz tipo comparison: +200 moedas (mais difícil cognitivamente)
Recompensa por erro: 0 moedas (não dá penalidade, mas não recompensa)
Após 1 pergunta, vai direto pra tela de resultado da pergunta e volta pro FarmMap
5.3. Sem Lições, Sem Estrelas
No Arcade, o conceito de "Lição" some. Cada acesso ao Quiz = 1 pergunta sorteada aleatoriamente. O fluxo é:

FarmMap → Quiz Rápido (consome 1 ação) → 1 pergunta → resposta → tela de feedback rápido (2s)
      → volta pro FarmMap
A EscolinhaScreen.jsx é pulada no Arcade.

🎓 6. Tutorial do Modo Arcade
6.1. Novo arquivo de roteiro
Adicionar em src/data/secondaryTutorials.js:

js
ARCADE_WELCOME: {
id: 'tutorial.arcade.welcome',
triggerOn: 'arcade-first-time',
reward: { coins: 0, badge: null },     // sem reward — apenas didático
steps: [
  {
    id: 'arcade-intro',
    target: null,
    cofrinhoState: 'celebrating',
    text: 'Oi! Bem-vindo ao Modo Arcade! Aqui o desafio é ser o melhor comerciante em pouco tempo!',
    advance: 'button',
    bubblePosition: 'center',
  },
  {
    id: 'arcade-actions',
    target: '[data-tutorial="arcade-actions-hud"]',
    cofrinhoState: 'pointing',
    text: 'Você tem 20 AÇÕES! Cada quiz, rodada da Feira ou visita à Cooperativa gasta 1 ação. Use bem!',
    advance: 'button',
    bubblePosition: 'bottom',
  },
  {
    id: 'arcade-coins',
    target: '[data-tutorial="coins-badge"]',
    cofrinhoState: 'pointing',
    text: 'Você começa com 1000 moedas! Seu objetivo é fazer essa quantia CRESCER o máximo possível!',
    advance: 'button',
    bubblePosition: 'bottom',
  },
  {
    id: 'arcade-school',
    target: '[data-tutorial="node-school"]',
    cofrinhoState: 'pointing',
    text: 'No Quiz Rápido, cada pergunta certa rende moedas! São perguntas de raciocínio rápido — bora?',
    advance: 'button',
    bubblePosition: 'top',
  },
  {
    id: 'arcade-fair',
    target: '[data-tutorial="node-fair"]',
    cofrinhoState: 'pointing',
    text: 'Na Feira, compre barato e venda caro! Cada rodada que você passa lá conta como 1 ação!',
    advance: 'button',
    bubblePosition: 'top',
  },
  {
    id: 'arcade-coop',
    target: '[data-tutorial="node-coop"]',
    cofrinhoState: 'pointing',
    text: 'A Cooperativa tá liberada! Todos os bichos disponíveis pra te ajudar. Mas cuidado: visitar custa 1 ação!',
    advance: 'button',
    bubblePosition: 'top',
  },
  {
    id: 'arcade-tiers',
    target: null,
    cofrinhoState: 'idle',
    text: '🥉 Acabar a partida = nível Básico\n🥈 5000 moedas = PRATA\n🥇 10000 moedas = OURO!\nDá pra chegar no ouro?',
    advance: 'button',
    bubblePosition: 'center',
  },
  {
    id: 'arcade-go',
    target: null,
    cofrinhoState: 'celebrating',
    text: 'Boa sorte! 🐷 Vai com tudo!',
    advance: 'button',
    bubblePosition: 'center',
  },
],
}
6.2. Disparo do Tutorial
Acionado automaticamente ao entrar no Arcade pela primeira vez
Após ArcadeStartScreen, se o jogador clicou "Quero ver o tutorial" → vai pra ARCADE_TUTORIAL
Se clicou "Pular e começar agora" → marca tutorial como completo automaticamente
Acessível a qualquer momento via botão ❓ no header (mesmo padrão do classic, reutiliza TutorialHelpButton)
💾 7. Persistência (Supabase)
7.1. Nova tabela: arcade_sessions
sql
CREATE TABLE arcade_sessions (
id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
player_id       UUID REFERENCES players(id) ON DELETE CASCADE,
started_at      TIMESTAMPTZ NOT NULL,
ended_at        TIMESTAMPTZ NOT NULL,
initial_coins   INTEGER NOT NULL DEFAULT 1000,
final_coins     INTEGER NOT NULL,
actions_used    INTEGER NOT NULL,
tier            TEXT NOT NULL,           -- 'basic' | 'medium' | 'advanced'
duration_sec    INTEGER NOT NULL,
questions_count INTEGER NOT NULL DEFAULT 0,
created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_arcade_sessions_player ON arcade_sessions(player_id);
CREATE INDEX idx_arcade_sessions_score  ON arcade_sessions(final_coins DESC);
7.2. Novo arquivo de API: src/lib/api/arcade.js
js
import { supabase } from '../supabaseClient';

export async function saveArcadeSession({
playerId,
startedAt,
endedAt,
initialCoins,
finalCoins,
actionsUsed,
tier,
durationSec,
questionsCount,
}) {
const { data, error } = await supabase
  .from('arcade_sessions')
  .insert({
    player_id: playerId,
    started_at: startedAt,
    ended_at: endedAt,
    initial_coins: initialCoins,
    final_coins: finalCoins,
    actions_used: actionsUsed,
    tier,
    duration_sec: durationSec,
    questions_count: questionsCount,
  })
  .select()
  .single();

if (error) throw error;
return data;
}

export async function getPlayerBestArcadeScore(playerId) {
const { data, error } = await supabase
  .from('arcade_sessions')
  .select('final_coins, tier, ended_at')
  .eq('player_id', playerId)
  .order('final_coins', { ascending: false })
  .limit(1)
  .single();

if (error && error.code !== 'PGRST116') throw error;
return data;
}

export async function getArcadeLeaderboard(limit = 10) {
const { data, error } = await supabase
  .from('arcade_sessions')
  .select('final_coins, tier, ended_at, players(nickname)')
  .order('final_coins', { ascending: false })
  .limit(limit);

if (error) throw error;
return data;
}
7.3. Salvamento no endArcade()
A função endArcade() no Context dispara saveArcadeSession() ao terminar a partida:

js
async function endArcade() {
const finalCoins = state.coins;
const tier = calculateArcadeTier(finalCoins);
const durationSec = Math.floor(
  (Date.now() - new Date(state.arcade.startedAt).getTime()) / 1000
);

const result = {
  tier,
  coins: finalCoins,
  actionsUsed: state.arcade.actionsTotal - state.arcade.actionsRemaining,
  durationSec,
};

dispatch({ type: 'ARCADE_END', payload: result });

// Salvar no Supabase (não bloquear se offline)
if (state.player.id && navigator.onLine) {
  try {
    await saveArcadeSession({
      playerId: state.player.id,
      startedAt: state.arcade.startedAt,
      endedAt: new Date().toISOString(),
      initialCoins: state.arcade.initialCoins,
      finalCoins,
      actionsUsed: result.actionsUsed,
      tier,
      durationSec,
      questionsCount: state.arcade.questionsAnswered.length,
    });
  } catch (err) {
    console.warn('Falha ao salvar sessão arcade no Supabase:', err);
    // continua: dados ficam em localStorage para sync futuro se quisermos
  }
}
}
7.4. Adicionar arcade à lista de campos sincronizados em useCloudSync
js
const SYNCED_FIELDS = [
// ... existentes
'arcade',         // ← NOVO
'gameMode',       // ← NOVO
];
7.5. Migration Guard no loadGameState
js
// Saves antigos não tem campo arcade nem gameMode — preencher com defaults
const safeState = {
...savedState,
gameMode: savedState.gameMode ?? 'classic',
arcade: savedState.arcade ?? {
  active: false,
  actionsRemaining: 20,
  actionsTotal: 20,
  initialCoins: 1000,
  startedAt: null,
  endedAt: null,
  finalCoins: null,
  finalTier: null,
  questionsAnswered: [],
  lastSessionResult: null,
},
};
🌐 8. i18n — Novas Chaves
Adicionar em src/i18n/strings.js:

PT-BR
js
arcade: {
title: 'Arcade',
subtitle: 'Modo Desafio',
homeCardTitle: '🎮 Arcade',
homeCardDescription: '20 ações. Maximize suas moedas!',
homeCardSpeed: '⏱️ Rápido',
homeCardCta: 'Desafiar',
homeCardBadge: 'NOVO!',

startTitle: 'Pronto pro desafio?',
startDesc: 'Você tem 20 ações pra fazer suas moedas crescerem o máximo possível!',
startInitialCoins: 'Você começa com',
startActions: 'Você tem',
startGoodLuck: 'Boa sorte! 🐷',
startCtaTutorial: 'Quero ver o tutorial',
startCtaSkip: 'Pular e começar agora',

hudActions: 'Ações',
hudLastAction: 'ÚLTIMA AÇÃO!',

resultTitle: 'Acabou!',
resultCoinsEarned: 'Você ganhou {coins} moedas!',
resultFinalBalance: 'Saldo final',
resultProfit: 'Lucro',
resultActionsUsed: 'Ações usadas',
resultDuration: 'Tempo de partida',
resultPlayAgain: 'Jogar de novo',
resultBackHome: 'Voltar pra Home',

tierBasic: 'Básico',
tierMedium: 'Prata',
tierAdvanced: 'Ouro',

motivBasic: 'Boa primeira partida! Que tal tentar de novo e bater seu próprio recorde? 🐷',
motivMedium: 'Uau! Você é um(a) bom comerciante! Bora tentar o ouro? 💪',
motivAdvanced: 'INCRÍVEL! Você dominou a Fazendinha! Mestre dos negócios! 🏆',

schoolNodeLabel: 'Quiz Rápido',
}
EN
js
arcade: {
title: 'Arcade',
subtitle: 'Challenge Mode',
homeCardTitle: '🎮 Arcade',
homeCardDescription: '20 actions. Maximize your coins!',
homeCardSpeed: '⏱️ Fast',
homeCardCta: 'Challenge',
homeCardBadge: 'NEW!',

startTitle: 'Ready for the challenge?',
startDesc: 'You have 20 actions to grow your coins as much as possible!',
startInitialCoins: 'You start with',
startActions: 'You have',
startGoodLuck: 'Good luck! 🐷',
startCtaTutorial: 'Show me the tutorial',
startCtaSkip: 'Skip and start now',

hudActions: 'Actions',
hudLastAction: 'LAST ACTION!',

resultTitle: 'Time\'s up!',
resultCoinsEarned: 'You earned {coins} coins!',
resultFinalBalance: 'Final balance',
resultProfit: 'Profit',
resultActionsUsed: 'Actions used',
resultDuration: 'Match duration',
resultPlayAgain: 'Play again',
resultBackHome: 'Back to Home',

tierBasic: 'Basic',
tierMedium: 'Silver',
tierAdvanced: 'Gold',

motivBasic: 'Nice first match! How about trying again and beating your own record? 🐷',
motivMedium: 'Wow! You\'re a good trader! Want to try gold? 💪',
motivAdvanced: 'INCREDIBLE! You mastered the Farm! Business master! 🏆',

schoolNodeLabel: 'Quick Quiz',
}
🎨 9. Estilo Visual do Modo Arcade
9.1. Identidade visual diferenciada
Para deixar claro que é um modo separado, o Arcade tem uma camada visual extra:

Elemento Classic Arcade
Fonte do título Nunito 900 Press Start 2P (pixelado)
Cor de destaque Primary blue Gradient warning→danger
Animação de entrada Fade simples Glitch effect leve (framer-motion)
HUD adicional — Contador de ações grande
Som de fundo Ambient (opcional, mais energético)
9.2. Token CSS específico
Adicionar em tokens.css:

css
:root {
--arcade-accent-start: #F39C12;       /*warning */
--arcade-accent-end:   #E74C3C;       /* danger*/
--arcade-gradient: linear-gradient(135deg, var(--arcade-accent-start), var(--arcade-accent-end));
--font-arcade: 'Press Start 2P', 'Courier New', monospace;
}
9.3. Importar a fonte (Google Fonts)
No index.html:

html
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
🧰 10. Cooperativa Adaptada para Arcade
Mudanças na Cooperativa/index.jsx
Quando gameMode === 'arcade':

Todos os animais aparecem com selo "DISPONÍVEL" (sem custo em moedas)
Botão muda de "Adotar/Convidar/Chamar" → "Equipar" / "Ativar"
Não consome moedas — apenas adiciona ao inventário ou equipa diretamente
Header da Cooperativa mostra aviso: "⚡ No Modo Arcade todos os bichos estão liberados! Mas visitar custa 1 ação."
Reutilização sem dor
A estrutura existente (CategoryTabs, AnimalCard, ActiveAllyBadge, EquipAllyModal) é reutilizada por completo
A lógica condicional fica em Cooperativa/index.jsx:
jsx
const isArcade = state.gameMode === 'arcade';

const handlePurchase = (animalId) => {
if (isArcade) {
  // No arcade, equipa direto sem custo
  if (animal.category === 'aliado') equipAlly(animalId);
  else if (animal.category === 'parceiro') activatePartner(animalId);
  else if (animal.category === 'ajudante') addHelperToInventory(animalId);
  return { ok: true };
}
// Fluxo normal do classic
return purchaseAnimal(animalId);
};
Consumo de Ação ao Entrar
Quando o jogador navega de qualquer tela para SCREENS.COOPERATIVA em modo Arcade, dispara consumeAction('coop') antes de renderizar
Atenção: apenas 1 vez por entrada — fechar e reabrir o EquipAllyModal não consome ação adicional
🏆 11. Leaderboard do Arcade
11.1. Nova rota condicional
A LeaderboardScreen.jsx ganha um seletor:

┌──────────────────────────┐
│  [ História ] [ Arcade ] │
└──────────────────────────┘
Quando "Arcade" está selecionado, o ranking usa getArcadeLeaderboard() em vez de getTopPlayers().

11.2. Layout específico do Arcade
┌─────────────────────────────────────┐
│  🎮 RANKING ARCADE                  │
│  Top jogadores por moedas finais    │
├─────────────────────────────────────┤
│  🥇  Joaomestre      12.450 🪙      │
│  🥈  Ana             9.870 🪙       │
│  🥉  Pedro           7.200 🪙       │
│  #4  Maria           6.100 🪙       │
│  ...                                │
└─────────────────────────────────────┘
✅ Checklist de Implementação por Fase
Fase 1 — Fundação do Estado
 Adicionar gameMode e arcade ao initialState em GameContext.jsx
 Implementar actions ARCADE_START, ARCADE_CONSUME_ACTION, ARCADE_END, ARCADE_RESET, SET_GAME_MODE, ARCADE_MARK_QUESTION_USED
 Expor helpers startArcade, consumeAction, endArcade, exitArcade, markArcadeQuestionUsed via useGame()
 Adicionar arcade e gameMode à lista de campos do useCloudSync
 Migration guard no loadGameState preenchendo defaults
Fase 2 — Telas Principais
 Adaptar HomeScreen.jsx com 2 cards (História/Arcade)
 Criar ArcadeStartScreen.jsx (boas-vindas pré-tutorial)
 Criar ArcadeResultScreen.jsx (resultado final + tier)
 Criar ArcadeActionsHUD.jsx (contador de ações)
 Adicionar ARCADE_TUTORIAL e ARCADE_RESULT ao enum SCREENS em App.jsx
 App.jsx adapta renderScreen() quando gameMode === 'arcade'
Fase 3 — Adaptação do FarmMap
 Esconder node "Conquistas" quando arcade
 Esconder botão "Painel dos Pais" quando arcade
 Renderizar ArcadeActionsHUD no topo quando arcade
 Node "Escola" leva direto pro QUIZ (pula EscolinhaScreen) quando arcade
 Decrementar ação ao entrar em QUIZ, FAIR, COOP
Fase 4 — Quiz Adaptado
 Criar src/data/arcadeQuestions.js com as 22 perguntas
 QuizScreen.jsx aceita prop mode='arcade' e sorteia de ARCADE_QUESTIONS
 Evitar repetição usando state.arcade.questionsAnswered
 Recompensa: +150 (calc) ou +200 (comparison) por acerto
 Não exibir tela de "Lição completa" — feedback rápido e volta pro FarmMap
Fase 5 — Cooperativa Adaptada
 Detectar gameMode === 'arcade' em Cooperativa/index.jsx
 Todos animais aparecem como "Disponível"
 Botões mudam para "Equipar/Ativar" sem custo
 Aviso visual no header
 Decrementar 1 ação ao navegar para a Cooperativa (não a cada interação)
Fase 6 — Tutorial
 Adicionar roteiro ARCADE_WELCOME em secondaryTutorials.js
 ArcadeStartScreen dispara o tutorial se usuário escolheu "ver tutorial"
 data-tutorial atributos nos elementos-alvo (arcade-actions-hud, coins-badge, node-school, node-fair, node-coop)
 TutorialHelpButton (❓) acessível também no modo Arcade
Fase 7 — Persistência
 Criar tabela arcade_sessions no Supabase (script SQL)
 Criar src/lib/api/arcade.js com saveArcadeSession, getPlayerBestArcadeScore, getArcadeLeaderboard
 endArcade() salva sessão (com try/catch para offline)
 Sessões offline ficam pendentes em localStorage para sync futuro (opcional na v1)
Fase 8 — Leaderboard
 LeaderboardScreen.jsx ganha seletor "História / Arcade"
 Usa getArcadeLeaderboard() quando aba "Arcade" ativa
 Layout específico com tier (🥇🥈🥉) ao lado do nome
Fase 9 — i18n
 Adicionar todas as chaves arcade.*em PT-BR e EN
 Validar com useStrings() em todos os componentes novos
Fase 10 — Estilo Final
 Importar fonte "Press Start 2P" no index.html
 Adicionar tokens --arcade-* em tokens.css
 Aplicar fonte e gradiente nos títulos do modo Arcade
 Animação de entrada glitch leve no logo "Arcade"
 Confete SVG na ArcadeResultScreen para tier Médio/Avançado
🚨 Riscos e Pontos de Atenção
Ações precisam ser decrementadas em UM lugar só — passar todo decremento por consumeAction() para evitar bug de "ação não contada". Cuidado com cliques duplos.

endArcade() deve ser atômico — se a chamada ao Supabase falhar, ainda assim o estado local precisa marcar a sessão como encerrada. Usar try/catch e degradação graciosa.

Persistência de saldo entre modos — quando o jogador volta do Arcade pro Classic, as moedas do Classic precisam ser restauradas do save, não substituídas pelas do Arcade. Recomendo manter dois campos separados (coins para classic, arcade.currentCoins para arcade) e nunca cruzar.

Tutorial do Arcade não conta no progresso de tutoriais do Classic — manter IDs separados (tutorial.arcade.welcome vs tutorial.first-time) para evitar conflito.

Aliados/Parceiros do Arcade não persistem entre partidas — ao iniciar nova sessão Arcade, todos voltam ao default. Isso precisa ser explícito no ARCADE_RESET.

Bug potencial: se o jogador entra na Cooperativa, gasta 1 ação, decide não comprar nada e volta — a ação foi consumida. Isso é intencional (ensina a planejar a visita), mas precisa ser claro no tutorial.
