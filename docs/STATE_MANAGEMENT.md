# 💾 DIRETRIZES DE GESTÃO DE ESTADO E DADOS (Projeto Miriti)

Este documento define o contrato rigoroso para o armazenamento, leitura e manipulação do progresso do utilizador no jogo "Projeto Miriti". Como o jogo será executado em Chromebooks com internet instável (Starlink), a persistência **offline-first** é obrigatória.

## 1. Regra de Ouro: Ponto Único de Verdade (Single Source of Truth)

Nenhum ficheiro do Phaser ou componente do React deve aceder diretamente ao `localStorage`. Todo o acesso deve ser feito através de um módulo central dedicado (ex: `PlayerState.js` ou um *store* do Zustand/Redux se estiver a usar React).

## 2. O Contrato de Dados (Estrutura do JSON)

Sempre que a IA precisar de ler ou atualizar o estado do jogador, DEVE respeitar rigorosamente a seguinte estrutura de objeto:

```json
{
  "perfil": {
    "nome": "Aluno",
    "nivel": 1,
    "xp": 0
  },
  "economia": {
    "moedas": 50,           // A moeda virtual do jogo (Tindins)
    "diaAtual": 1
  },
  "inventario": {
    "sementes_acai": 2,
    "sementes_mandioca": 5,
    "fertilizante": 0
  },
  "fazenda": [
    {
      "id": "plot_1",
      "tipo": "acai",       // 'acai', 'mandioca' ou null
      "plantadoEm": 1715620000000, // Timestamp (Date.now()) do momento do plantio
      "prontoParaColher": false
    }
  ],
  "progressoPedagogico": {
    "quizzesRespondidos": [101, 104], // IDs das questões já resolvidas
    "conceitosDesbloqueados": ["juros_simples", "lucro"]
  }
}

```

## 3. Gestão do Tempo (Crescimento das Plantas)

A lógica de tempo não deve depender de o jogo estar aberto.

* **Regra de Plantio:** Quando o jogador planta uma semente, guarde o `Date.now()` no campo `plantadoEm`.
* **Regra de Verificação:** Quando o Phaser carregar a `FarmScene`, ele deve ler o `plantadoEm` do estado e calcular: `Tempo Decorrido = Date.now() - plantadoEm`. Se for maior que o tempo de crescimento exigido, a planta já deve ser renderizada na fase final (pronta para colher).

## 4. Inicialização e "Novo Jogo" (Fallback)

Se for a primeira vez que o aluno abre o jogo (ou se o `localStorage` estiver vazio), o gestor de estado deve injetar automaticamente um estado inicial predefinido (com 50 moedas, nível 1 e fazenda vazia) para que o jogo não falhe com erros de *undefined*.

## 5. Fluxo de Atualização (UI <-> Estado <-> Phaser)

Quando uma ação alterar os dados (ex: colher mandioca), o fluxo exato deve ser:

1. O Phaser deteta o clique na mandioca pronta e emite o evento de colheita.
2. O módulo de Estado escuta o evento, adiciona +10 Moedas e +5 XP ao JSON.
3. O módulo de Estado guarda o novo JSON no `localStorage`.
4. O módulo de Estado avisa a Interface (React) que os dados mudaram.
5. O HUD (Interface) atualiza o ecrã para mostrar o novo saldo.

## 6. Prevenção de Manipulação (Anti-Cheat Básico)

Apesar de ser um jogo educativo, evite guardar o objeto JSON puro e solto na raiz do `localStorage` sem uma chave específica. Utilize uma chave única para o projeto, como `miriti_save_data`.

**Exemplo de Leitura:**

```javascript
const carregarEstado = () => {
    const dados = localStorage.getItem('miriti_save_data');
    return dados ? JSON.parse(dados) : estadoInicialPadrao;
};

```
