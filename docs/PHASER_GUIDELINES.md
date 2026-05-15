# 🎮 DIRETRIZES DO PHASER 3 (Projeto Miriti)

Este documento dita as regras rigorosas para a geração de código relacionado com o motor gráfico Phaser 3 no Projeto Miriti. Qualquer código Phaser gerado deve obedecer a estas diretrizes.

## 1. Regra de Ouro: Separação de Responsabilidades (Engine vs. UI)

* **O Phaser serve APENAS para renderizar o mapa 2D:** Cenários, plantações (Açaí, Mandioca), ciclo de dia/noite e deteção de cliques no mapa.
* **PROIBIDO criar UI no Phaser:** Não crie botões, caixas de texto (`this.add.text`), barras de progresso ou modais usando o Phaser. Toda a interface visual deve ser feita em HTML/React/DOM.

## 2. Configuração Principal (`config.js` ou `config.ts`)

Como o jogo será executado em Chromebooks com recursos limitados, mas focado em imagens de alta qualidade (sem *Pixel Art*), utilize a seguinte base para a configuração:

```javascript
const config = {
    type: Phaser.AUTO,
    parent: 'game-container', // Div onde o canvas será injetado
    width: 1280,
    height: 720,
    backgroundColor: '#4CAF50', // Cor de fundo temporária (verde fazenda)
    pixelArt: false, // O projeto NÃO usa pixel art. Imagens devem ser suaves.
    antialias: true, // Garante que as imagens não ficam serrilhadas.
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    },
    // Pausa a renderização se o aluno mudar de aba, poupando a bateria do Chromebook:
    callbacks: {
        postBoot: function (game) {
            game.events.on('hidden', () => { game.scene.pause('FarmScene'); });
            game.events.on('visible', () => { game.scene.resume('FarmScene'); });
        }
    }
};

```

## 3. Caminhos e Carregamento de Ficheiros (Assets)

* Utilize **SEMPRE caminhos relativos** ao importar imagens ou áudios (ex: `./assets/images/acai.png`). O uso de caminhos absolutos (`/assets/...`) causará erros fatais na conversão futura para executável de desktop (.exe).
* Todo o carregamento pesado deve ser feito exclusivamente na `BootScene`.

## 4. Estrutura das Cenas (Scenes)

Divida sempre a lógica do jogo nestas duas cenas principais:

1. **`BootScene`:**
    * Responsável apenas pelo `preload()`.
    * Deve carregar imagens, *spritesheets* e ficheiros JSON de mapas.
    * Quando o carregamento terminar, deve chamar a próxima cena: `this.scene.start('FarmScene')`.

2. **`FarmScene`:**
    * É o *Core Loop* (o centro do jogo).
    * Responsável por desenhar o mapa e instanciar os objetos de plantação.
    * Não deve conter lógicas de cálculo financeiro (isso pertence ao Gestor de Estado) nem perguntas pedagógicas.

## 5. Interatividade e Ponte com a Interface (Event Bus)

Quando o utilizador clicar em algum elemento gráfico (por exemplo, na Casa de Farinha), o Phaser não deve tentar abrir um painel. Em vez disso, deve **emitir um evento** para que a camada DOM (React/HTML) atue.

**Padrão Exigido:**

```javascript
// Exemplo dentro da FarmScene
this.casaDeFarinha.setInteractive();

this.casaDeFarinha.on('pointerdown', () => {
    // Emite um evento global que será escutado pela interface React/HTML
    window.dispatchEvent(new CustomEvent('PHASER_CLICK_CASA_FARINHA', {
        detail: { buildingId: 'casa_farinha', state: 'pronta_para_produzir' }
    }));
});

```

## 6. Programação Orientada a Objetos (Entidades)

Não polua a `FarmScene` com lógicas individuais de plantas. Crie classes estendidas.
Exemplo: Se for necessário criar uma plantação de Açaí, crie um ficheiro `AcaiPlant.js` que estenda `Phaser.GameObjects.Sprite` ou `Phaser.GameObjects.Container`. Essa classe deve encapsular os seus próprios temporizadores de crescimento.

***
