# 🖥️ DIRETRIZES DE INTERFACE DE USUÁRIO (Projeto Miriti)

Este documento estabelece as regras para a criação de toda a Interface de Usuário (UI) do Projeto Miriti. A UI engloba menus, HUD (status do jogador), loja de insumos e os modais de perguntas pedagógicas (Taxonomia de Bloom).

## 1. Regra de Ouro: Sobreposição Híbrida (DOM sobre Canvas)

A interface **NÃO** deve ser desenhada dentro do Phaser. Toda a UI será construída em **React.js** (ou Vanilla DOM) e ficará "flutuando" por cima do canvas do jogo.

**Estrutura Base do HTML/CSS:**

```html
<div id="app-container" style="position: relative; width: 100vw; height: 100vh;">
    <div id="game-container" style="position: absolute; inset: 0; z-index: 1;"></div>
    
    <div id="ui-root" style="position: absolute; inset: 0; z-index: 10; pointer-events: none;">
        </div>
</div>

```

*Nota importante para a IA:* O contêiner pai da UI deve ter `pointer-events: none` para que os cliques passem direto para a fazenda no Phaser. Apenas os botões e painéis reais da UI devem ter `pointer-events: auto`.

## 2. Padrões de Design e Acessibilidade (Público-Alvo: 9 a 11 anos)

O jogo rodará em Chromebooks na escola da Vila Jutaiteua. O design deve ser adequado para crianças:

* **Tamanho dos Elementos:** Botões grandes e fáceis de clicar.
* **Tipografia:** Use fontes sem serifa, legíveis e grandes (mínimo de `16px` ou `1rem` para textos secundários e `24px` para títulos).
* **Feedback Visual:** Todo botão deve ter estados claros de `:hover` (passar o mouse) e `:active` (clicar).
* **Cores:** Utilize uma paleta vibrante, mas que garanta bom contraste (ex: botões de ação em verde/laranja, textos em cores escuras sobre fundos claros).

## 3. Comunicação Bidirecional (Event Bus)

A UI e o Phaser não devem importar arquivos um do outro diretamente para evitar loops de dependência. Use `window.dispatchEvent` e `window.addEventListener` como ponte de comunicação.

**Exemplo: O React escutando um clique que veio do Phaser:**

```javascript
// Dentro do componente React (ex: LojaModal.jsx)
useEffect(() => {
    const handleAbrirLoja = (event) => {
        const { idPlanta } = event.detail;
        setLojaAberta(true);
        carregarItens(idPlanta);
    };

    window.addEventListener('PHASER_ABRIR_LOJA', handleAbrirLoja);
    return () => window.removeEventListener('PHASER_ABRIR_LOJA', handleAbrirLoja);
}, []);

```

**Exemplo: O React enviando um comando para o Phaser:**

```javascript
// Quando o aluno compra uma semente de açaí na UI do React
const comprarSemente = () => {
    if (saldo >= custoSemente) {
        descontarSaldo(custoSemente);
        window.dispatchEvent(new CustomEvent('UI_SEMENTE_COMPRADA', {
            detail: { tipo: 'acai', quantidade: 1 }
        }));
    }
};

```

## 4. Estrutura de Componentes Obrigatória

Seja modular. Não crie componentes gigantes. Divida a UI da seguinte forma:

* **`HUD.jsx` (Heads-Up Display):** Fica fixo no topo da tela. Mostra o Nível/XP atual e o saldo de Moedas (Tindins).
* **`ActionMenu.jsx`:** Fica fixo na parte inferior ou lateral. Contém botões rápidos como "Inventário", "Loja" e "Missões".
* **`QuizModal.jsx`:** Um componente genérico de sobreposição (Modal) com fundo escurecido (`rgba(0,0,0,0.5)`). Recebe as perguntas pedagógicas por `props` e exibe alternativas.
* **`NotificationToast.jsx`:** Pequenos avisos que aparecem na lateral da tela e somem após 3 segundos (ex: "+50 Moedas", "Açaí Colhido!").

## 5. Responsividade

Os Chromebooks possuem resolução base HD. Garanta que a UI seja responsiva utilizando `flexbox` ou `CSS Grid`. Use `vh` (viewport height) e `vw` (viewport width) para posicionar os elementos HUD, garantindo que eles acompanhem o redimensionamento da janela do Phaser sem distorcer.

***
