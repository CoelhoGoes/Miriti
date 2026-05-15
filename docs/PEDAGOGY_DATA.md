# 📚 DIRETRIZES PEDAGÓGICAS E DE DADOS (Projeto Miriti)

Este documento estabelece a estrutura de dados e as regras de acionamento para o conteúdo educativo do Projeto Miriti. Todo o conteúdo financeiro e matemático (focado em crianças de 9 a 11 anos da Vila Jutaiteua) baseia-se na Taxonomia de Bloom e deve ser gerido de forma independente do motor gráfico (Phaser).

## 1. Regra de Ouro: Desacoplamento do Conteúdo

Nenhuma pergunta, alternativa ou texto de feedback pedagógico deve ser inserido diretamente (hardcoded) nos ficheiros de cena do Phaser ou nos componentes visuais do React. Todo o conteúdo deve residir num ficheiro JSON estático dedicado (ex: `pedagogy_database.json`) para facilitar a edição e a expansão offline.

## 2. Estrutura do Banco de Questões (Taxonomia de Bloom)

Sempre que a IA precisar de ler ou criar novas questões, DEVE respeitar rigorosamente a seguinte estrutura de objeto JSON. Cada nível de Bloom exige um tipo diferente de reflexão do aluno.

```json
{
  "quizzes": [
    {
      "id": 101,
      "tema": "orcamento_familiar",
      "nivel_bloom": "lembrar",
      "pergunta": "Na colheita da mandioca, a sua família arrecadou 100 Tindins, mas gastou 40 Tindins com transporte. O que são os 40 Tindins?",
      "alternativas": [
        { "id": "a", "texto": "Lucro", "correta": false },
        { "id": "b", "texto": "Despesa/Custo", "correta": true },
        { "id": "c", "texto": "Reserva de Emergência", "correta": false }
      ],
      "feedback": "As despesas são os custos necessários para produzir ou vender algo.",
      "recompensa": { "xp": 10, "moedas": 5 }
    },
    {
      "id": 204,
      "tema": "investimento",
      "nivel_bloom": "analisar",
      "pergunta": "Você tem 50 Tindins. Comprar um saco de adubo custa 40 Tindins e faz a plantação render o dobro, mas o deixa quase sem dinheiro. Qual é a melhor decisão a longo prazo?",
      "alternativas": [
        { "id": "a", "texto": "Comprar doces na vila.", "correta": false },
        { "id": "b", "texto": "Guardar tudo no cofre.", "correta": false },
        { "id": "c", "texto": "Comprar o adubo, pois o investimento trará mais lucro no futuro.", "correta": true }
      ],
      "feedback": "Investir no seu negócio rural traz retornos maiores do que apenas guardar o dinheiro sem propósito.",
      "recompensa": { "xp": 25, "moedas": 15 }
    }
  ]
}
```

## 3. Dilemas Financeiros (Situações-Problema)

Além dos Quizzes de múltipla escolha, o jogo possui "Dilemas Financeiros". Estes não têm uma única resposta 100% certa ou errada, mas ensinam consequências, simulando as decisões rurais reais das famílias da região.

**Estrutura de um Dilema:**

```json
{
  "dilemas": [
    {
      "id": "dil_01",
      "titulo": "A Crise da Safra Curta",
      "descricao": "A safra do açaí está a acabar. O que vai fazer com os 100 Tindins que poupou?",
      "opcoes": [
        {
          "texto": "Comprar sementes de mandioca para ter renda o ano todo.",
          "consequencia": { "tindins": -30, "sementes_mandioca": 5, "mensagem": "Excelente! Diversificou a sua renda." }
        },
        {
          "texto": "Gastar tudo numa roupa nova no catálogo.",
          "consequencia": { "tindins": -100, "sementes_mandioca": 0, "mensagem": "Ficou sem capital de giro para a entressafra!" }
        }
      ]
    }
  ]
}
```

## 4. Gatilhos e Eventos (Triggers)

As questões de Bloom e os Dilemas não aparecem aleatoriamente; são acionados por ações específicas do jogador na camada do Phaser.

**Fluxo de Execução:**

1. **Gatilho no Jogo (Phaser):** O jogador atinge o nível 2 ou tenta comprar um item caro.
2. **Emissão do Evento:** O Phaser dispara `window.dispatchEvent(new CustomEvent('PEDAGOGY_TRIGGER', { detail: { tipo: 'quiz', tema: 'orcamento_familiar' } }))`.
3. **Pausa:** O Phaser pausa a cena imediatamente (`this.scene.pause()`).
4. **Interface (React):** O componente `QuizModal.jsx` escuta o evento, lê o `pedagogy_database.json`, sorteia uma pergunta não respondida e exibe o modal escurecendo o fundo.
5. **Resolução:** O aluno responde. O estado guarda o ID da pergunta como respondida, entrega a recompensa (via `STATE_MANAGEMENT`) e envia o evento `window.dispatchEvent(new Event('PEDAGOGY_RESOLVED'))`.
6. **Retorno:** O Phaser escuta a resolução e retoma o jogo (`this.scene.resume()`).

## 5. Progressão da Taxonomia

Para garantir o alinhamento com as metodologias de ensino:

- **Nível 1 (Lembrar / Entender):** Acionado nos primeiros níveis do jogo ou ao desbloquear o primeiro talhão de terra.
- **Nível 2 (Aplicar / Analisar):** Acionado durante o gerenciamento de recursos, como a decisão de quando colher ou vender.
- **Nível 3 (Avaliar / Criar):** Acionado através de missões complexas, como montar o orçamento mensal simulado da fazenda no final do "Mês" no jogo.
