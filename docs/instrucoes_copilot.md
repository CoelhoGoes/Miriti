# 🤖 INSTRUÇÕES DE CONTEXTO PARA O COPILOT (PDR)

## 1. Visão Geral do Projeto

**Nome:** Projeto Miriti
**Objetivo:** Criar um simulador de gestão de fazenda em 2D (jogo web) focado em educação financeira gamificada para crianças de 9 a 11 anos.
**Contexto Regional:** O jogo baseia-se na bioeconomia amazônica (Vila Jutaiteua, Pará). As culturas principais são Açaí e Mandioca (produção de farinha).
**Restrição de Hardware:** O jogo rodará em Chromebooks escolares básicos conectados via Starlink. O código deve ser extremamente leve e otimizado. Futuramente, será convertido para `.exe` via Electron para a Steam.

## 2. Stack Tecnológica

Atue sempre como um Desenvolvedor Sênior utilizando a seguinte stack:

* **Empacotador:** Vite
* **Linguagem:** JavaScript (ES6+) / TypeScript
* **Motor de Jogo (Apenas para o mapa e movimentação):** Phaser 3 (v3.80+)
* **Interface de Usuário (Menus, Quizzes, Loja):** React.js (ou Vanilla JS/HTML/CSS, sobreposto ao canvas).
* **Persistência de Dados:** `localStorage` (salvar progresso, moedas e níveis de forma offline-first).

## 3. Arquitetura do Sistema (Híbrida)

Não misture lógica de interface com lógica de jogo. Siga este padrão:

* **Phaser (Canvas):** Cuida apenas da renderização do mapa (Tilemaps), posicionamento das plantações (açaí/mandioca), animações e detecção de cliques no cenário.
* **UI (DOM):** Modais, botões, sistema de perguntas (Taxonomia de Bloom) e loja devem ser feitos em HTML/React e ficar "flutuando" acima do Canvas via `z-index`.
* **Comunicação:** Use um `EventEmitter` (Event Bus) para a comunicação bidirecional. Exemplo: O Phaser detecta um clique na "Casa de Farinha" e emite um evento; o React escuta o evento e abre o modal de atividades.

## 4. Regras de Código e Boas Práticas (Siga rigorosamente)

1. **Caminhos de Arquivos:** Use sempre caminhos relativos (ex: `./assets/image.png`) para facilitar a futura conversão para Electron.
2. **Performance (Phaser):** Use `pauseOnBlur: true` nas configurações iniciais para economizar processamento quando o aluno mudar de aba. (Nota: O jogo **não** usará Pixel Art, portanto as configurações de anti-aliasing e escala devem favorecer imagens de alta resolução/suaves).
3. **Modularidade:** Evite arquivos gigantes. Separe as Cenas do Phaser (`BootScene`, `FarmScene`) em arquivos distintos.
4. **Gerenciamento de Estado:** Crie um módulo separado (ex: `PlayerState.js`) para gerenciar as "Moedas", "XP" e "Inventário". Este módulo deve fazer a leitura e gravação no `localStorage`.
5. **Responsividade:** O jogo deve usar `Phaser.Scale.FIT` com resolução base de 1280x720 para se adaptar bem ao modo tela cheia de PCs e Chromebooks.

## 5. Objetivo Principal: MVP Funcional

Ao gerar código, o foco absoluto é entregar um **MVP (Produto Mínimo Viável) 100% funcional**. A base de código gerada deve garantir que o jogador consiga realizar o ciclo completo do jogo:

* **Core Loop:** Mecânica de plantar semente -> Lógica de tempo (aguardar crescimento) -> Clicar para colher -> Vender os produtos -> Receber recompensa (Moedas/XP).
* **Integração Pedagógica (BNCC/Bloom):** O sistema deve ser capaz de disparar pop-ups/modais na UI com dilemas ou decisões financeiras que afetam o progresso.
* **Feedback de Interface (HUD):** A interface deve refletir imediatamente na tela as mudanças de saldo e experiência conforme as ações ocorrem no Phaser.
