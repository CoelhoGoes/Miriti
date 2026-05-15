# 🎮 Diretrizes do Motor de Jogo (Phaser 3) - Projeto Miriti

Este documento define os padrões de desenvolvimento para a parte gráfica e interativa do projeto utilizando **Phaser 3**.

## 1. Arquitetura de Cenas

As cenas devem ser modulares e seguir este fluxo de ciclo de vida:

* **BootScene:** Carrega apenas o essencial (barra de progresso).
* **PreloadScene:** Carrega assets (Spritesheets, Áudio, Tilemaps). *Nota: Use Atlas de texturas para otimizar o carregamento em conexões Starlink.*
* **WorldScene (Main):** Gerencia o mapa da Vila Jutaiteua, colisões e movimentação do jogador.
* **InteractionScene:** Cenas específicas para minijogos (ex: colheita de açaí, pesagem de farinha).

## 2. Comunicação via Event Bus (Obrigatório)

O Phaser **nunca** deve atualizar o estado do React diretamente. Toda comunicação externa deve ser feita via `CustomEvents`.

### 2.1. Enviando Dados para o React (HUD/Diálogos)

```javascript
// Exemplo: Disparar um quiz pedagógico
window.dispatchEvent(new CustomEvent('PHASER_TRIGGER_QUIZ', { 
    detail: { 
        bloomLevel: 'analisar', 
        topic: 'investimento_plantacao' 
    } 
}));

```

### 2.2. Recebendo Dados do React

O Phaser deve ouvir eventos globais para atualizar elementos visuais (ex: ganhar moedas):

```javascript
window.addEventListener('REACT_UPDATE_BALANCE', (e) => {
    // Atualiza apenas a animação ou texto visual dentro da cena
    this.player.showCoinEffect(e.detail.amount);
});

```

## 3. Gestão de Assets e Performance

Como o público utiliza **Chromebooks**, a otimização é prioridade máxima:

* **Sprites:** Use o formato WebP para imagens sempre que possível.
* **Tilemaps:** Utilize o Tiled Editor (.json) e mantenha camadas de colisão simples.
* **Áudio:** Use arquivos .mp3 comprimidos. Evite trilhas sonoras longas sem loop eficiente.
* **FPS:** Fixar em 60fps, mas garantir que a lógica de física não quebre se houver quedas de frame.

## 4. Entidades e Personagens

* **PlayerController:** Centralizar lógica de input (Teclado e Touch).
* **NPCManager:** Os NPCs devem ser instanciados com base no `pedagogy_database.json`. Eles são gatilhos (`triggers`) para os eventos pedagógicos.
* **Interações:** Use `Phaser.Geom.Intersects` ou zonas de colisão (`Phaser.Physics.Arcade.Overlap`) para detectar proximidade com plantações ou comerciantes.

## 5. Integração com a Economia do Jogo

O motor gráfico não calcula o lucro. Ele apenas:

1. Detecta a ação do jogador (ex: clicar na mandioca pronta).
2. Emite o evento `PHASER_ACTION_HARVEST`.
3. Aguarda o evento `REACT_CONFIRM_HARVEST` para tocar a animação de sucesso e atualizar o visual da plantação.

## 6. Debugging

Mantenha uma flag `DEBUG_MODE` que, quando `true`, desenha os corpos de colisão (hitboxes) e exibe as coordenadas do jogador, facilitando o ajuste fino do mapa da Vila.
