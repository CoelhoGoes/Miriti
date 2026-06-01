/**
 * Quiz "Chefão" de cada matéria — versão longa e com mais perguntas.
 * Vencer com ≥ 70% de acerto desbloqueia o mascote exclusivo da matéria.
 */

import { shuffleOptions } from './questions.js'

const DEFAULT_LANG = 'pt'

/** Mascotes exclusivos liberados ao vencer o chefão de cada matéria. */
export const BOSS_MASCOTS = {
  0: '🦊', // Primeiros Passos — raposa esperta
  1: '🐧', // Planejar os Gastos — pinguim organizado
  2: '🐢', // A Arte de Poupar — tartaruga paciente
  3: '🦁', // Pequenos Negócios — leão empreendedor
  4: '🦉'  // Investir no Futuro — coruja sábia
}

/** Acerto mínimo para vencer o chefão. */
export const BOSS_PASS_RATIO = 0.7

/** Perguntas longas de cada chefão (12+ por matéria). */
export const BOSS_QUESTIONS = {
  0: [
    {
      id: 'b1-1', correct: 1,
      question: { pt: 'O dinheiro funciona principalmente como...', en: 'Money works mainly as...' },
      options: {
        pt: ['Um enfeite', 'Um meio para trocar por bens e serviços', 'Comida', 'Um brinquedo'],
        en: ['A decoration', 'A way to trade for goods and services', 'Food', 'A toy']
      },
      explanation: { pt: 'Ele é o meio de troca que aceita-se quase em todo lugar.', en: 'It is the means of exchange accepted almost everywhere.' }
    },
    {
      id: 'b1-2', correct: 0,
      question: { pt: 'Precisar é diferente de querer porque...', en: 'Needing differs from wanting because...' },
      options: {
        pt: ['Precisar é essencial; querer é o que desejamos', 'Não há diferença', 'Querer é o mais importante', 'Precisar não existe'],
        en: ['Needing is essential; wanting is what we wish for', 'There is no difference', 'Wanting is the most important', 'Needing does not exist']
      },
      explanation: { pt: 'Necessidades vêm antes; desejos vêm depois.', en: 'Needs come first; wants come later.' }
    },
    {
      id: 'b1-3', correct: 2,
      question: { pt: 'Se um item custa R$ 12 e você paga R$ 20, seu troco é...', en: 'If an item costs R$ 12 and you pay R$ 20, your change is...' },
      options: {
        pt: ['R$ 6', 'R$ 7', 'R$ 8', 'R$ 9'],
        en: ['R$ 6', 'R$ 7', 'R$ 8', 'R$ 9']
      },
      explanation: { pt: '20 − 12 = 8.', en: '20 − 12 = 8.' }
    },
    {
      id: 'b1-4', correct: 1,
      question: { pt: 'Cédulas e moedas...', en: 'Banknotes and coins...' },
      options: {
        pt: ['São a mesma coisa', 'São formas de dinheiro: papel e metal', 'Só servem para colecionar', 'Não valem nada'],
        en: ['Are the same', 'Are forms of money: paper and metal', 'Are only for collecting', 'Are worthless']
      },
      explanation: { pt: 'Ambas são dinheiro: cédulas de papel, moedas de metal.', en: 'Both are money: paper notes and metal coins.' }
    },
    {
      id: 'b1-5', correct: 1,
      question: { pt: 'Economizar significa...', en: 'Saving means...' },
      options: {
        pt: ['Gastar tudo', 'Guardar para o futuro', 'Perder dinheiro', 'Esquecer no fundo do bolso'],
        en: ['Spending all', 'Setting aside for the future', 'Losing money', 'Forgetting it in your pocket']
      },
      explanation: { pt: 'Economizar é guardar — e isso protege o seu futuro.', en: 'Saving is setting aside — it protects your future.' }
    },
    {
      id: 'b1-6', correct: 1,
      question: { pt: 'Você tinha R$ 25 e gastou R$ 9. Sobrou:', en: 'You had R$ 25 and spent R$ 9. Left:' },
      options: { pt: ['R$ 14', 'R$ 16', 'R$ 18', 'R$ 11'], en: ['R$ 14', 'R$ 16', 'R$ 18', 'R$ 11'] },
      explanation: { pt: '25 − 9 = 16.', en: '25 − 9 = 16.' }
    },
    {
      id: 'b1-7', correct: 1,
      question: { pt: 'As pessoas trabalham principalmente para...', en: 'People work mainly to...' },
      options: {
        pt: ['Passar o tempo', 'Receber dinheiro e sustentar-se', 'Gastar energia', 'Ficar cansadas'],
        en: ['Pass the time', 'Earn money and support themselves', 'Burn energy', 'Get tired']
      },
      explanation: { pt: 'O trabalho é a forma honesta mais comum de ganhar dinheiro.', en: 'Work is the most common honest way to earn money.' }
    },
    {
      id: 'b1-8', correct: 1,
      question: { pt: 'Ao ganhar uma moeda, o mais sábio é...', en: 'When you get a coin, the wisest thing is to...' },
      options: {
        pt: ['Gastar imediatamente', 'Pensar antes: guardar ou usar com cuidado', 'Esquecer', 'Esconder dos pais'],
        en: ['Spend it immediately', 'Think first: save or use it carefully', 'Forget it', 'Hide it from parents']
      },
      explanation: { pt: 'Pensar antes de gastar é o primeiro passo.', en: 'Think before spending is the first step.' }
    },
    {
      id: 'b1-9', correct: 1,
      question: { pt: 'O preço de um produto serve para...', en: 'A product price is used to...' },
      options: {
        pt: ['Decorar a etiqueta', 'Mostrar quanto custa para comprar', 'Marcar a cor', 'Mostrar o peso'],
        en: ['Decorate the tag', 'Show how much it costs to buy', 'Mark the color', 'Show the weight']
      },
      explanation: { pt: 'O preço diz quanto você precisa pagar.', en: 'The price tells how much you need to pay.' }
    },
    {
      id: 'b1-10', correct: 1,
      question: { pt: 'Uma moeda de R$ 1 vale...', en: 'A R$ 1 coin is worth...' },
      options: {
        pt: ['10 moedas de R$ 0,25', '4 moedas de R$ 0,25', '2 moedas de R$ 0,25', '1 moeda de R$ 0,25'],
        en: ['10 coins of R$ 0.25', '4 coins of R$ 0.25', '2 coins of R$ 0.25', '1 coin of R$ 0.25']
      },
      explanation: { pt: '4 × 0,25 = 1,00.', en: '4 × 0.25 = 1.00.' }
    },
    {
      id: 'b1-11', correct: 1,
      question: { pt: 'Quem decide se algo é uma necessidade ou um desejo?', en: 'Who decides if something is a need or a want?' },
      options: {
        pt: ['A propaganda', 'Você, pensando com cuidado', 'A loja', 'Ninguém'],
        en: ['The advertising', 'You, thinking carefully', 'The store', 'No one']
      },
      explanation: { pt: 'Você decide pensando se realmente precisa.', en: 'You decide by thinking if you truly need it.' }
    },
    {
      id: 'b1-12', correct: 1,
      question: { pt: 'A melhor frase resume a Lição 1:', en: 'The best phrase summarizes Lesson 1:' },
      options: {
        pt: ['Gaste tudo, depois pense', 'Pense, depois gaste', 'Ignore o dinheiro', 'Compre tudo o que vir'],
        en: ['Spend all, think later', 'Think first, spend after', 'Ignore money', 'Buy everything you see']
      },
      explanation: { pt: 'Pensar antes evita arrependimento.', en: 'Thinking first avoids regret.' }
    }
  ],

  1: [
    {
      id: 'b2-1', correct: 1,
      question: { pt: 'Planejar gastos é...', en: 'Planning spending is...' },
      options: {
        pt: ['Sair comprando', 'Pensar onde o dinheiro vale a pena', 'Nunca gastar', 'Pedir mais'],
        en: ['Going shopping', 'Thinking where money is worth using', 'Never spending', 'Asking for more']
      },
      explanation: { pt: 'Planejar é decidir com calma.', en: 'Planning means deciding calmly.' }
    },
    {
      id: 'b2-2', correct: 1,
      question: { pt: 'Comparar preços ajuda porque...', en: 'Comparing prices helps because...' },
      options: { pt: ['Aumenta o preço', 'O mesmo produto custa valores diferentes', 'Confunde a gente', 'Não ajuda'], en: ['It raises the price', 'The same item costs different amounts', 'It confuses us', 'It does not help'] },
      explanation: { pt: 'O mesmo produto pode ser mais barato em outro lugar.', en: 'The same item can be cheaper elsewhere.' }
    },
    {
      id: 'b2-3', correct: 1,
      question: { pt: 'Promoção é...', en: 'A sale is...' },
      options: { pt: ['Defeito', 'Preço reduzido por tempo limitado', 'Produto velho', 'Sempre ruim'], en: ['A defect', 'A lower price for a limited time', 'Old product', 'Always bad'] },
      explanation: { pt: 'Mas só vale se você realmente precisa.', en: 'Only worth it if you actually need it.' }
    },
    {
      id: 'b2-4', correct: 0,
      question: { pt: 'Orçamento é...', en: 'A budget is...' },
      options: { pt: ['Plano de ganhos e gastos', 'Um lanche', 'Uma promoção', 'Uma loja'], en: ['A plan of income and expenses', 'A snack', 'A sale', 'A store'] },
      explanation: { pt: 'O orçamento organiza o dinheiro do mês.', en: 'A budget organizes the month\'s money.' }
    },
    {
      id: 'b2-5', correct: 2,
      question: { pt: 'Item de R$ 60, mesada de R$ 15/semana. Em quantas semanas você junta?', en: 'Item R$ 60, allowance R$ 15/week. Weeks to save?' },
      options: { pt: ['2', '3', '4', '5'], en: ['2', '3', '4', '5'] },
      explanation: { pt: '60 ÷ 15 = 4 semanas.', en: '60 ÷ 15 = 4 weeks.' }
    },
    {
      id: 'b2-6', correct: 1,
      question: { pt: 'Compra por impulso é...', en: 'An impulse buy is...' },
      options: { pt: ['Planejada', 'Sem pensar, só porque viu', 'Pesquisada', 'Combinada'], en: ['Planned', 'Without thinking, just because you saw it', 'Researched', 'Agreed'] },
      explanation: { pt: 'Esperar e pensar evita o impulso.', en: 'Waiting and thinking prevents impulse.' }
    },
    {
      id: 'b2-7', correct: 1,
      question: { pt: 'Anotar gastos serve para...', en: 'Writing down spending is for...' },
      options: { pt: ['Aumentar dívidas', 'Ver para onde o dinheiro vai', 'Confundir', 'Esquecer'], en: ['Increasing debt', 'Seeing where money goes', 'Getting confused', 'Forgetting'] },
      explanation: { pt: 'Anotar revela pequenos gastos invisíveis.', en: 'Writing reveals invisible small expenses.' }
    },
    {
      id: 'b2-8', correct: 1,
      question: { pt: 'Você recebeu R$ 30. O ideal é...', en: 'You got R$ 30. The ideal is...' },
      options: { pt: ['Gastar tudo num doce', 'Dividir: guardar, gastar com cuidado, doar', 'Esconder e esquecer', 'Pedir mais'], en: ['Spending all on candy', 'Split: save, spend wisely, donate', 'Hide and forget', 'Ask for more'] },
      explanation: { pt: 'A divisão equilibrada protege o futuro.', en: 'Balanced split protects the future.' }
    },
    {
      id: 'b2-9', correct: 1,
      question: { pt: 'Necessidade vem antes de...', en: 'Needs come before...' },
      options: { pt: ['Outras necessidades', 'Desejos', 'Trabalho', 'Estudo'], en: ['Other needs', 'Wants', 'Work', 'Study'] },
      explanation: { pt: 'Cuide das necessidades primeiro.', en: 'Take care of needs first.' }
    },
    {
      id: 'b2-10', correct: 0,
      question: { pt: 'Lista de compras serve para...', en: 'A shopping list helps to...' },
      options: { pt: ['Não comprar por impulso', 'Comprar mais', 'Esquecer o orçamento', 'Pagar mais caro'], en: ['Avoid impulse buys', 'Buy more', 'Forget the budget', 'Pay more'] },
      explanation: { pt: 'Quem leva lista compra apenas o necessário.', en: 'A list keeps you to what is needed.' }
    },
    {
      id: 'b2-11', correct: 1,
      question: { pt: 'Pagar à vista, em geral...', en: 'Paying upfront generally...' },
      options: { pt: ['É mais caro', 'Pode dar desconto', 'É proibido', 'Não muda nada'], en: ['Is more expensive', 'Can get a discount', 'Is forbidden', 'Changes nothing'] },
      explanation: { pt: 'Pagar à vista costuma render descontos.', en: 'Paying upfront often earns discounts.' }
    },
    {
      id: 'b2-12', correct: 1,
      question: { pt: 'Antes de comprar, a pergunta-chave é...', en: 'Before buying, the key question is...' },
      options: { pt: ['Está bonito?', 'Eu realmente preciso?', 'Está na moda?', 'Meu amigo tem?'], en: ['Is it pretty?', 'Do I really need it?', 'Is it trendy?', 'Does my friend have it?'] },
      explanation: { pt: '"Eu preciso?" é o filtro mais importante.', en: '"Do I need it?" is the most important filter.' }
    }
  ],

  2: [
    {
      id: 'b3-1', correct: 1,
      question: { pt: 'Poupar é...', en: 'To save is to...' },
      options: { pt: ['Gastar logo', 'Guardar uma parte com regularidade', 'Esquecer', 'Perder'], en: ['Spend quickly', 'Set aside regularly', 'Forget', 'Lose'] },
      explanation: { pt: 'Constância é a chave.', en: 'Consistency is the key.' }
    },
    {
      id: 'b3-2', correct: 1,
      question: { pt: '"Pague-se primeiro" é...', en: '"Pay yourself first" is...' },
      options: { pt: ['Gastar com você', 'Separar a poupança ao receber', 'Comprar antes', 'Pagar contas'], en: ['Spend on yourself', 'Set savings aside when paid', 'Buy first', 'Pay bills'] },
      explanation: { pt: 'Reserve antes de gastar.', en: 'Reserve before spending.' }
    },
    {
      id: 'b3-3', correct: 1,
      question: { pt: 'Item R$ 120, guardando R$ 30/mês. Tempo?', en: 'Item R$ 120, saving R$ 30/month. Time?' },
      options: { pt: ['2 meses', '4 meses', '6 meses', '12 meses'], en: ['2 months', '4 months', '6 months', '12 months'] },
      explanation: { pt: '120 ÷ 30 = 4 meses.', en: '120 ÷ 30 = 4 months.' }
    },
    {
      id: 'b3-4', correct: 1,
      question: { pt: 'Na poupança, o dinheiro...', en: 'In a savings account, money...' },
      options: { pt: ['Some', 'Rende um pouco com o tempo', 'Vira papel sem valor', 'Some sozinho'], en: ['Disappears', 'Earns a little over time', 'Becomes worthless', 'Vanishes'] },
      explanation: { pt: 'A poupança rende juros baixos, mas seguros.', en: 'Savings earn low but safe interest.' }
    },
    {
      id: 'b3-5', correct: 0,
      question: { pt: 'Reserva de emergência é...', en: 'An emergency fund is...' },
      options: { pt: ['Dinheiro guardado para imprevistos', 'Cofre de brinquedo', 'Dívida grande', 'Salário extra'], en: ['Money saved for surprises', 'A toy safe', 'A big debt', 'Extra salary'] },
      explanation: { pt: 'Serve para imprevistos sem se endividar.', en: 'It covers surprises without taking on debt.' }
    },
    {
      id: 'b3-6', correct: 1,
      question: { pt: 'A melhor frequência para poupar é...', en: 'Best frequency to save is...' },
      options: { pt: ['Uma vez por ano', 'Toda semana ou todo mês', 'Nunca', 'Só quando sobrar'], en: ['Once a year', 'Every week or month', 'Never', 'Only when there is leftover'] },
      explanation: { pt: 'Pouco e sempre vale mais que muito e raro.', en: 'Little and often beats a lot and rarely.' }
    },
    {
      id: 'b3-7', correct: 1,
      question: { pt: 'Cortar gastos pequenos do dia a dia...', en: 'Cutting small daily expenses...' },
      options: { pt: ['Não faz diferença', 'Pode liberar muito ao longo do mês', 'Empobrece', 'Tira o sono'], en: ['Makes no difference', 'Can free up a lot monthly', 'Makes you poor', 'Keeps you up at night'] },
      explanation: { pt: 'Pequenos cortes somam muito ao fim do mês.', en: 'Small cuts add up a lot by month-end.' }
    },
    {
      id: 'b3-8', correct: 1,
      question: { pt: 'Poupar exige principalmente...', en: 'Saving mainly requires...' },
      options: { pt: ['Sorte', 'Paciência e constância', 'Ser rico', 'Gastar muito'], en: ['Luck', 'Patience and consistency', 'Being rich', 'Spending a lot'] },
      explanation: { pt: 'Como plantar: cuidado constante traz colheita.', en: 'Like planting: constant care brings harvest.' }
    },
    {
      id: 'b3-9', correct: 1,
      question: { pt: 'Um cofrinho serve para...', en: 'A piggy bank is to...' },
      options: { pt: ['Decorar', 'Treinar o hábito de guardar moedinhas', 'Esconder de você mesmo', 'Confundir'], en: ['Decorate', 'Train the habit of saving small coins', 'Hide from yourself', 'Confuse'] },
      explanation: { pt: 'Ele torna o hábito visível e divertido.', en: 'It makes the habit visible and fun.' }
    },
    {
      id: 'b3-10', correct: 0,
      question: { pt: 'Ter uma meta clara ao poupar...', en: 'Having a clear goal when saving...' },
      options: { pt: ['Motiva muito mais', 'Não muda nada', 'Atrapalha', 'Confunde'], en: ['Motivates a lot more', 'Changes nothing', 'Disturbs', 'Confuses'] },
      explanation: { pt: 'Ver o "para quê" mantém a disciplina.', en: 'Seeing the "why" keeps discipline.' }
    },
    {
      id: 'b3-11', correct: 1,
      question: { pt: 'Se você guarda R$ 5 por dia, em 30 dias terá...', en: 'Saving R$ 5 a day, in 30 days you have...' },
      options: { pt: ['R$ 60', 'R$ 150', 'R$ 250', 'R$ 30'], en: ['R$ 60', 'R$ 150', 'R$ 250', 'R$ 30'] },
      explanation: { pt: '5 × 30 = 150.', en: '5 × 30 = 150.' }
    },
    {
      id: 'b3-12', correct: 1,
      question: { pt: 'O maior inimigo da poupança é...', en: 'The biggest enemy of saving is...' },
      options: { pt: ['Anotar tudo', 'Compras por impulso', 'Comparar preços', 'Trabalhar'], en: ['Writing it all down', 'Impulse purchases', 'Comparing prices', 'Working'] },
      explanation: { pt: 'O impulso engole a poupança aos poucos.', en: 'Impulse eats savings little by little.' }
    }
  ],

  3: [
    {
      id: 'b4-1', correct: 1,
      question: { pt: 'Empreender é...', en: 'To be an entrepreneur is to...' },
      options: { pt: ['Sempre trabalhar para outros', 'Criar e tocar uma ideia/ negócio próprio', 'Gastar muito', 'Não fazer nada'], en: ['Always work for others', 'Create and run your own idea/business', 'Spend a lot', 'Do nothing'] },
      explanation: { pt: 'Empreender é colocar uma ideia para funcionar.', en: 'Entrepreneuring is making an idea work.' }
    },
    {
      id: 'b4-2', correct: 0,
      question: { pt: 'Lucro é...', en: 'Profit is...' },
      options: { pt: ['Sobra depois de pagar os custos', 'Tudo que o cliente paga', 'A dívida', 'O troco'], en: ['Leftover after costs', 'Everything the customer pays', 'The debt', 'The change'] },
      explanation: { pt: 'Vendeu R$ 5, custou R$ 2 → lucro R$ 3.', en: 'Sold R$ 5, cost R$ 2 → profit R$ 3.' }
    },
    {
      id: 'b4-3', correct: 0,
      question: { pt: 'Custos são...', en: 'Costs are...' },
      options: { pt: ['Gastos para produzir e vender', 'O lucro', 'O troco', 'Um presente'], en: ['Expenses to produce and sell', 'The profit', 'The change', 'A gift'] },
      explanation: { pt: 'Materiais, embalagem, transporte.', en: 'Materials, packaging, transport.' }
    },
    {
      id: 'b4-4', correct: 1,
      question: { pt: 'Preço de venda ideal...', en: 'Ideal selling price...' },
      options: { pt: ['Abaixo do custo', 'Cobre custos e deixa lucro', 'O mais alto possível', 'Não importa'], en: ['Below cost', 'Covers costs and leaves profit', 'As high as possible', 'Does not matter'] },
      explanation: { pt: 'Sem cobrir custos não há negócio.', en: 'Without covering costs there is no business.' }
    },
    {
      id: 'b4-5', correct: 1,
      question: { pt: 'Cliente é...', en: 'Customer is...' },
      options: { pt: ['Quem fabrica', 'Quem compra o produto/serviço', 'O dono', 'O ajudante'], en: ['Who makes it', 'Who buys product/service', 'The owner', 'The helper'] },
      explanation: { pt: 'Cliente é quem leva e paga.', en: 'Customer is who takes and pays.' }
    },
    {
      id: 'b4-6', correct: 1,
      question: { pt: 'Divulgar serve para...', en: 'Advertising helps to...' },
      options: { pt: ['Gastar à toa', 'Mais gente conhecer e comprar', 'Esconder', 'Confundir'], en: ['Waste money', 'Get more people to know and buy', 'Hide', 'Confuse'] },
      explanation: { pt: 'Divulgação atrai novos clientes.', en: 'Advertising attracts new customers.' }
    },
    {
      id: 'b4-7', correct: 1,
      question: { pt: 'Reinvestir o lucro é...', en: 'Reinvesting profit is...' },
      options: { pt: ['Gastar todo com você', 'Usar parte para o negócio crescer', 'Jogar fora', 'Esconder'], en: ['Spend all on yourself', 'Use part to grow the business', 'Throw away', 'Hide'] },
      explanation: { pt: 'Mais material, mais venda, mais lucro futuro.', en: 'More material, more sales, more future profit.' }
    },
    {
      id: 'b4-8', correct: 1,
      question: { pt: 'Item custou R$ 4 para fazer e foi vendido por R$ 10. Lucro?', en: 'Cost R$ 4, sold for R$ 10. Profit?' },
      options: { pt: ['R$ 4', 'R$ 6', 'R$ 10', 'R$ 14'], en: ['R$ 4', 'R$ 6', 'R$ 10', 'R$ 14'] },
      explanation: { pt: '10 − 4 = 6.', en: '10 − 4 = 6.' }
    },
    {
      id: 'b4-9', correct: 1,
      question: { pt: 'Atender bem o cliente...', en: 'Treating the customer well...' },
      options: { pt: ['Atrapalha', 'Fideliza e atrai mais gente', 'Não muda nada', 'Encarece o produto'], en: ['Disturbs', 'Builds loyalty and attracts more', 'Changes nothing', 'Raises price'] },
      explanation: { pt: 'Bom atendimento traz cliente de volta.', en: 'Good service brings customers back.' }
    },
    {
      id: 'b4-10', correct: 1,
      question: { pt: 'Vender sem saber o custo é...', en: 'Selling without knowing the cost is...' },
      options: { pt: ['Esperto', 'Arriscado: pode dar prejuízo', 'Sempre lucro', 'Indiferente'], en: ['Smart', 'Risky: may cause loss', 'Always profit', 'Indifferent'] },
      explanation: { pt: 'Sem saber o custo o lucro pode virar prejuízo.', en: 'Without knowing cost, profit can turn into loss.' }
    },
    {
      id: 'b4-11', correct: 0,
      question: { pt: 'Concorrência é...', en: 'Competition is...' },
      options: { pt: ['Outros que vendem coisa parecida', 'O dono do negócio', 'O cliente', 'A loja'], en: ['Others selling something similar', 'The owner', 'The customer', 'The store'] },
      explanation: { pt: 'É bom olhar para diferenciar-se.', en: 'It is good to look at it to stand out.' }
    },
    {
      id: 'b4-12', correct: 1,
      question: { pt: 'Vender suco caseiro com a família é...', en: 'Selling homemade juice with family is...' },
      options: { pt: ['Errado', 'Empreender e aprender na prática', 'Inútil', 'Proibido'], en: ['Wrong', 'Entrepreneuring and learning by doing', 'Useless', 'Forbidden'] },
      explanation: { pt: 'Negócio simples ensina muito.', en: 'A simple business teaches a lot.' }
    }
  ],

  4: [
    {
      id: 'b5-1', correct: 1,
      question: { pt: 'Juros são...', en: 'Interest is...' },
      options: { pt: ['Castigo', 'Valor extra: ganhamos ao investir / pagamos ao tomar emprestado', 'Imposto', 'Preço fixo'], en: ['Punishment', 'Extra amount: earned when investing / paid when borrowing', 'A tax', 'A fixed price'] },
      explanation: { pt: 'Juros podem trabalhar a favor (investir) ou contra (dívida).', en: 'Interest works for you (investing) or against you (debt).' }
    },
    {
      id: 'b5-2', correct: 1,
      question: { pt: 'Juros compostos...', en: 'Compound interest...' },
      options: { pt: ['Some com o tempo', 'Fazem o rendimento crescer sobre o rendimento', 'Não existem', 'São proibidos'], en: ['Disappear over time', 'Earnings grow on earnings', 'Do not exist', 'Are forbidden'] },
      explanation: { pt: 'Tempo é amigo dos juros compostos.', en: 'Time is the friend of compound interest.' }
    },
    {
      id: 'b5-3', correct: 1,
      question: { pt: 'Capital inicial é...', en: 'Initial capital is...' },
      options: { pt: ['Lucro final', 'Dinheiro para começar (materiais, etc.)', 'Imposto', 'Troco'], en: ['Final profit', 'Money to start (materials, etc.)', 'Tax', 'Change'] },
      explanation: { pt: 'É o investimento para começar.', en: 'It is the investment to start.' }
    },
    {
      id: 'b5-4', correct: 1,
      question: { pt: 'Diversificar é...', en: 'Diversifying is...' },
      options: { pt: ['Colocar tudo no mesmo lugar', 'Espalhar o dinheiro em opções diferentes', 'Nunca investir', 'Gastar tudo'], en: ['Putting all in one place', 'Spreading money across options', 'Never investing', 'Spending all'] },
      explanation: { pt: 'Reduz risco de perder tudo de uma vez.', en: 'Reduces the risk of losing everything at once.' }
    },
    {
      id: 'b5-5', correct: 1,
      question: { pt: 'Investir cedo costuma render mais por causa...', en: 'Investing early usually returns more because of...' },
      options: { pt: ['Da sorte', 'Do tempo e dos juros compostos', 'Da loja', 'Do governo'], en: ['Luck', 'Time and compound interest', 'The shop', 'The government'] },
      explanation: { pt: 'O tempo multiplica o dinheiro investido.', en: 'Time multiplies invested money.' }
    },
    {
      id: 'b5-6', correct: 1,
      question: { pt: 'Bioeconomia da Amazônia propõe...', en: 'Amazon bioeconomy proposes...' },
      options: { pt: ['Derrubar a floresta', 'Gerar renda com a floresta em pé', 'Proibir o comércio', 'Ignorar a natureza'], en: ['Cut the forest', 'Generate income with standing forest', 'Ban trade', 'Ignore nature'] },
      explanation: { pt: 'Floresta viva também gera renda — açaí, castanha, óleos.', en: 'A living forest also generates income — açaí, nuts, oils.' }
    },
    {
      id: 'b5-7', correct: 1,
      question: { pt: 'Impacto socioambiental de uma compra é...', en: 'Social/environmental impact of a purchase is...' },
      options: { pt: ['O peso', 'O efeito nas pessoas e no meio ambiente', 'O preço', 'A cor'], en: ['Weight', 'Effects on people and the environment', 'Price', 'Color'] },
      explanation: { pt: 'Consumir consciente considera origem e resíduos.', en: 'Conscious consuming considers origin and waste.' }
    },
    {
      id: 'b5-8', correct: 1,
      question: { pt: 'Antes de um negócio maior, é sensato...', en: 'Before a bigger business, it is wise to...' },
      options: { pt: ['Gastar tudo', 'Planejar custos, preço e público', 'Copiar tudo', 'Não planejar'], en: ['Spend all', 'Plan costs, price and audience', 'Copy all', 'Not plan'] },
      explanation: { pt: 'Planejar aumenta muito a chance de sucesso.', en: 'Planning greatly raises chance of success.' }
    },
    {
      id: 'b5-9', correct: 1,
      question: { pt: 'Vida financeira equilibrada significa...', en: 'Balanced financial life means...' },
      options: { pt: ['Gastar mais do que ganha', 'Ganhar, gastar bem, poupar, investir e doar', 'Apenas guardar', 'Ignorar o dinheiro'], en: ['Spend more than earn', 'Earn, spend wisely, save, invest and donate', 'Only hoard', 'Ignore money'] },
      explanation: { pt: 'Tudo equilibrado: hoje e amanhã.', en: 'All balanced: today and tomorrow.' }
    },
    {
      id: 'b5-10', correct: 0,
      question: { pt: 'Você investiu R$ 100 a 10% ao ano. Em 1 ano (juros simples):', en: 'You invested R$ 100 at 10% per year. After 1 year (simple interest):' },
      options: { pt: ['R$ 110', 'R$ 120', 'R$ 100', 'R$ 90'], en: ['R$ 110', 'R$ 120', 'R$ 100', 'R$ 90'] },
      explanation: { pt: '100 + 10% = 110.', en: '100 + 10% = 110.' }
    },
    {
      id: 'b5-11', correct: 1,
      question: { pt: 'Risco em investimento é...', en: 'Investment risk is...' },
      options: { pt: ['Garantia de lucro', 'A chance de o resultado não ser o esperado', 'Nunca existe', 'Sempre prejuízo'], en: ['Profit guarantee', 'Chance the result is not as expected', 'Never exists', 'Always loss'] },
      explanation: { pt: 'Maior risco pode trazer maior retorno — ou perda.', en: 'Higher risk can bring higher return — or loss.' }
    },
    {
      id: 'b5-12', correct: 1,
      question: { pt: 'Doar parte do que se ganha é...', en: 'Donating part of what you earn is...' },
      options: { pt: ['Perda total', 'Parte de uma vida financeira saudável', 'Errado', 'Proibido'], en: ['Total loss', 'Part of a healthy financial life', 'Wrong', 'Forbidden'] },
      explanation: { pt: 'Doar fortalece a comunidade e o caráter.', en: 'Donating strengthens community and character.' }
    }
  ]
}

function tr(field, lang) {
  if (field == null) return ''
  if (typeof field === 'string') return field
  return field[lang] ?? field[DEFAULT_LANG] ?? ''
}

function hashString(str) {
  let h = 2166136261 >>> 0
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619) >>> 0
  }
  return h
}

export function getBossQuestions(phaseIndex, lang = DEFAULT_LANG, sessionSeed = null) {
  const list = BOSS_QUESTIONS[phaseIndex] || []
  const baseSeed = sessionSeed ?? Math.floor(Math.random() * 1e9)
  return list.map((q, idx) => {
    const translated = {
      id: q.id,
      correct: q.correct,
      question: tr(q.question, lang),
      options: q.options[lang] || q.options[DEFAULT_LANG],
      explanation: tr(q.explanation, lang)
    }
    return shuffleOptions(translated, hashString(`${q.id}-${baseSeed}-${idx}`))
  })
}
