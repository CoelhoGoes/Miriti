# Plano de Implementação do Modo Arcade

Este documento organiza a implementação do Modo Arcade no Miriti como uma segunda experiência do jogo, convivendo com o Modo História no mesmo build. O plano respeita a arquitetura atual do projeto: React como camada de interface e estado, Phaser como motor visual e de interação no canvas, conteúdo pedagógico em arquivos estáticos e persistência via localStorage com sincronização opcional no Supabase.

## 1. Objetivo do modo

O Modo Arcade deve oferecer uma partida rápida para adultos, com foco em gestão de recursos, cálculo mental e tomada de decisão. A experiência é guiada por um limite de 20 ações, começando com 1000 moedas e encerrando automaticamente quando as ações terminarem.

O modo convive com o Modo História, mas possui fluxo, pontuação, ranking, tutorial e persistência próprios.

## 2. Princípios técnicos

- React continua responsável por telas, HUD, modais, ranking e fluxos de UI.
- Phaser continua responsável apenas pela renderização e interação no mapa/canvas.
- A comunicação entre React e Phaser deve ocorrer por eventos globais com `window.dispatchEvent` e `window.addEventListener`.
- Nenhum conteúdo pedagógico deve ficar hardcoded em cenas ou componentes visuais.
- O estado global do jogador deve continuar centralizado em `src/context/GameContext.jsx`, com fallback offline.
- A persistência em nuvem deve usar Supabase, com tratamento gracioso para offline.

## 3. Fases de implementação

### Fase 1 - Estado global e contratos

Atualizar o estado global para suportar `gameMode` e o bloco `arcade` com os campos necessários para a sessão, ações restantes, moedas iniciais, data de início/fim, perguntas usadas e resultado final.

Também será preciso criar os novos eventos/reducers do modo Arcade, como início da sessão, consumo de ação, término da partida, reset e troca de modo.

Entregas previstas:

- `GameContext.jsx` com defaults seguros para saves antigos.
- Helpers de uso no hook global do jogo, como iniciar, consumir ação, finalizar e sair do Arcade.
- Integração com o fluxo de sync existente.

### Fase 2 - Entrada de modo e telas principais

Adaptar a Home para exibir dois caminhos claros: História e Arcade. O Arcade deve ter identidade visual própria e CTA específico.

Criar as novas telas de entrada e resultado do modo:

- `ArcadeStartScreen`
- `ArcadeResultScreen`
- `ArcadeActionsHUD`

Nessa fase também entram os novos estados de tela no controlador principal do app.

### Fase 3 - Mapa e navegação do modo Arcade

Adaptar o mapa principal para comportamento condicional quando `gameMode === 'arcade'`.

Pontos principais:

- esconder áreas que não fazem parte da experiência Arcade;
- transformar a escola em acesso direto ao quiz rápido;
- remover atalhos que não existirem nesse modo;
- exibir o contador de ações no HUD do mapa;
- consumir 1 ação ao entrar nas atividades que custam ação.

### Fase 4 - Quiz Arcade

Criar um banco próprio de questões em `src/data/arcadeQuestions.js`, separado do conteúdo do modo história.

O quiz do Arcade deve:

- sortear uma pergunta sem repetição na mesma sessão;
- reiniciar a rotação quando o banco acabar;
- recompensar respostas corretas com moedas conforme o tipo da pergunta;
- usar um fluxo curto de feedback e retorno ao mapa.

### Fase 5 - Cooperativa e recursos do modo

Adaptar a cooperativa para o Arcade, liberando todos os animais e mudando a lógica de aquisição/equipamento para o comportamento de desafio.

O consumo de ação deve ocorrer apenas na entrada da área, não em cada interação interna do modal ou da lista de animais.

### Fase 6 - Tutorial específico

Criar o tutorial `tutorial.arcade.welcome` em `src/data/secondaryTutorials.js`, com passos próprios e gatilho independente do modo história.

O fluxo de boas-vindas do Arcade deve permitir duas entradas:

- ver o tutorial antes de começar;
- pular o tutorial e iniciar imediatamente.

### Fase 7 - Persistência e ranking

Adicionar a tabela `arcade_sessions` no Supabase e uma API dedicada em `src/lib/api/arcade.js` para salvar sessão, consultar melhor resultado do jogador e carregar leaderboard do Arcade.

O término da partida deve sempre encerrar o estado local, mesmo se a gravação em nuvem falhar.

### Fase 8 - i18n e tokens visuais

Expandir `src/i18n/strings.js` com as chaves do Arcade em PT-BR e EN.

Atualizar `src/styles/tokens.css` e `index.html` para a identidade visual do modo, incluindo a fonte pixelada e o gradiente de destaque.

### Fase 9 - Validação

Validar que o fluxo respeita as regras de arquitetura do projeto:

- React não acessa Phaser diretamente;
- conteúdo pedagógico fica em arquivo de dados;
- saves antigos continuam abrindo sem quebrar;
- o modo Arcade não interfere no progresso do Modo História;
- a partida encerra corretamente ao esgotar as ações.

## 4. Arquivos que tendem a ser impactados

- `src/context/GameContext.jsx`
- `src/App.jsx`
- `src/components/HomeScreen.jsx`
- `src/components/FarmMap.jsx`
- `src/components/QuizScreen.jsx`
- `src/components/ShopScreen.jsx` ou `src/components/Cooperativa/*`
- `src/components/Leaderboard/*`
- `src/data/arcadeQuestions.js`
- `src/data/secondaryTutorials.js`
- `src/lib/api/arcade.js`
- `src/lib/api/*` relacionadas ao sync e ao ranking
- `src/hooks/useCloudSync.js`
- `src/i18n/strings.js`
- `src/styles/tokens.css`
- `index.html`
- `supabase/*.sql`

## 5. Riscos e cuidados

- O consumo de ações precisa passar por um único caminho para evitar contagem dupla.
- O estado do Arcade não pode sobrescrever o progresso do Modo História.
- Saves antigos precisam ser normalizados com defaults seguros.
- O conteúdo do quiz deve continuar isolado em arquivos de dados, sem texto pedagógico espalhado na UI.
- A gravação no Supabase deve ser tratada como melhoria, nunca como dependência obrigatória para jogar.

## 6. Critérios de pronto

O Modo Arcade estará pronto quando o jogador conseguir:

1. escolher Arcade na Home;
2. iniciar uma sessão com 20 ações e 1000 moedas;
3. jogar quiz, feira e cooperativa com consumo correto de ações;
4. ver a tela final automática ao zerar as ações;
5. salvar a sessão localmente e, quando possível, no Supabase;
6. alternar entre História e Arcade sem quebrar o save existente.

## 7. Ordem sugerida de execução

1. Estado global e migração de saves.
2. Home e telas Arcade.
3. Mapa, HUD de ações e rotas específicas.
4. Quiz Arcade e banco de perguntas.
5. Cooperativa adaptada e tutorial.
6. Persistência no Supabase e leaderboard.
7. i18n, ajustes visuais e validação final.
