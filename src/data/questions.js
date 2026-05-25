/**
 * Banco de perguntas do Miriti — as lições da Escola.
 * 5 lições com dificuldade crescente (faixa de 9 a 12 anos), sem exibir a idade.
 * Textos traduzíveis usam { pt, en }; options usam { pt: [...], en: [...] }.
 */

const DEFAULT_LANG = 'pt'

export const PHASES = [
  {
    id: 0,
    name: { pt: 'Primeiros Passos', en: 'First Steps' },
    subtitle: { pt: 'O que é o dinheiro e para que serve', en: 'What money is and what it is for' },
    icon: '🪙',
    color: '#16a34a',
    gradient: 'linear-gradient(135deg, #4ade80 0%, #16a34a 50%, #15803d 100%)',
    questions: [
      {
        id: 'l1-1', correct: 1,
        question: { pt: 'O que é o dinheiro?', en: 'What is money?' },
        options: {
          pt: ['Um brinquedo colorido', 'Algo que usamos para trocar por bens e serviços', 'Um tipo de fruta', 'Papel sem nenhum valor'],
          en: ['A colorful toy', 'Something we use to trade for goods and services', 'A kind of fruit', 'Paper with no value at all']
        },
        explanation: {
          pt: 'O dinheiro é um meio de troca: com ele compramos comida, roupas e outras coisas. 💵',
          en: 'Money is a means of exchange: with it we buy food, clothes and other things. 💵'
        }
      },
      {
        id: 'l1-2', correct: 1,
        question: { pt: 'Qual é a diferença entre QUERER e PRECISAR?', en: 'What is the difference between WANTING and NEEDING?' },
        options: {
          pt: ['Não existe diferença', 'Precisar é o essencial; querer é o que gostaríamos de ter', 'Querer é sempre mais importante', 'Precisar é só para adultos'],
          en: ['There is no difference', 'Needing is the essential; wanting is what we would like to have', 'Wanting is always more important', 'Needing is only for adults']
        },
        explanation: {
          pt: 'Precisamos de comida e água para viver; queremos brinquedos e doces — esses são desejos. 🤔',
          en: 'We need food and water to live; we want toys and candy — those are wishes. 🤔'
        }
      },
      {
        id: 'l1-3', correct: 1,
        question: { pt: 'O que é o troco?', en: 'What is change (the money returned)?' },
        options: {
          pt: ['Um tipo de moeda rara', 'O dinheiro que volta quando pagamos mais do que o preço', 'Uma dívida', 'Um presente da loja'],
          en: ['A kind of rare coin', 'The money you get back when you pay more than the price', 'A debt', 'A gift from the store']
        },
        explanation: {
          pt: 'Se algo custa R$ 7 e você paga com R$ 10, recebe R$ 3 de troco! 🧮',
          en: 'If something costs R$ 7 and you pay with R$ 10, you get R$ 3 in change! 🧮'
        }
      },
      {
        id: 'l1-4', correct: 1,
        question: { pt: 'Qual é a diferença entre moeda e cédula?', en: 'What is the difference between a coin and a banknote?' },
        options: {
          pt: ['Não há diferença', 'Moeda é de metal e cédula é a nota de papel', 'Cédula é feita de metal', 'Moeda não vale nada'],
          en: ['There is no difference', 'A coin is made of metal and a banknote is the paper bill', 'A banknote is made of metal', 'A coin is worth nothing']
        },
        explanation: {
          pt: 'Moedas são feitas de metal; cédulas são as notas de papel, como a de R$ 10. 🪙',
          en: 'Coins are made of metal; banknotes are the paper bills, like the R$ 10 one. 🪙'
        }
      },
      {
        id: 'l1-5', correct: 1,
        question: { pt: 'Por que devemos economizar dinheiro?', en: 'Why should we save money?' },
        options: {
          pt: ['Para nunca mais gastar', 'Para ter dinheiro guardado para o futuro e imprevistos', 'Para gastar tudo de uma vez', 'Não devemos economizar'],
          en: ['To never spend again', 'To have money saved for the future and surprises', 'To spend it all at once', 'We should not save']
        },
        explanation: {
          pt: 'Economizar nos prepara para o futuro e para situações inesperadas. 🎯',
          en: 'Saving prepares us for the future and for unexpected situations. 🎯'
        }
      },
      {
        id: 'l1-6', correct: 1,
        question: { pt: 'Você tem R$ 10 e gasta R$ 6. Quanto sobra?', en: 'You have R$ 10 and spend R$ 6. How much is left?' },
        options: {
          pt: ['R$ 2', 'R$ 4', 'R$ 6', 'R$ 16'],
          en: ['R$ 2', 'R$ 4', 'R$ 6', 'R$ 16']
        },
        explanation: {
          pt: '10 menos 6 é igual a 4. Saber contar ajuda a controlar o dinheiro! 🧮',
          en: '10 minus 6 equals 4. Knowing how to count helps you control your money! 🧮'
        }
      },
      {
        id: 'l1-7', correct: 1,
        question: { pt: 'Por que as pessoas trabalham?', en: 'Why do people work?' },
        options: {
          pt: ['Só por diversão', 'Para receber dinheiro e sustentar a família', 'Para gastar energia', 'Não existe motivo'],
          en: ['Just for fun', 'To earn money and support the family', 'To use up energy', 'There is no reason']
        },
        explanation: {
          pt: 'O trabalho é a forma mais comum de ganhar dinheiro de maneira honesta. 💪',
          en: 'Work is the most common way to earn money honestly. 💪'
        }
      },
      {
        id: 'l1-8', correct: 1,
        question: { pt: 'Ao ganhar uma moeda de presente, o que é mais inteligente fazer?', en: 'When you get a coin as a gift, what is the smartest thing to do?' },
        options: {
          pt: ['Gastar na mesma hora', 'Pensar se guarda ou usa com cuidado', 'Jogar no rio', 'Esconder e esquecer'],
          en: ['Spend it right away', 'Think about whether to save it or use it carefully', 'Throw it in the river', 'Hide it and forget']
        },
        explanation: {
          pt: 'Pensar antes de gastar é o primeiro passo para cuidar bem do dinheiro. 🌟',
          en: 'Thinking before spending is the first step to taking good care of money. 🌟'
        }
      }
    ]
  },

  {
    id: 1,
    name: { pt: 'Planejar os Gastos', en: 'Planning Spending' },
    subtitle: { pt: 'Pensar antes de gastar e fazer boas escolhas', en: 'Thinking before spending and making good choices' },
    icon: '📝',
    color: '#0891b2',
    gradient: 'linear-gradient(135deg, #38bdf8 0%, #0891b2 50%, #0e7490 100%)',
    questions: [
      {
        id: 'l2-1', correct: 1,
        question: { pt: 'O que significa planejar os gastos?', en: 'What does it mean to plan your spending?' },
        options: {
          pt: ['Gastar tudo no primeiro dia', 'Pensar antes e decidir no que vale a pena usar o dinheiro', 'Nunca gastar nada', 'Pedir mais dinheiro o tempo todo'],
          en: ['Spending it all on the first day', 'Thinking ahead and deciding what the money is worth being used on', 'Never spending anything', 'Asking for more money all the time']
        },
        explanation: {
          pt: 'Planejar é decidir com calma onde o dinheiro será mais bem usado. 📝',
          en: 'Planning is calmly deciding where money will be best used. 📝'
        }
      },
      {
        id: 'l2-2', correct: 1,
        question: { pt: 'O que é comparar preços?', en: 'What is comparing prices?' },
        options: {
          pt: ['Ver qual loja é mais bonita', 'Olhar em lugares diferentes para achar o melhor preço', 'Comprar sempre o mais caro', 'Comprar sem olhar o preço'],
          en: ['Seeing which store is prettier', 'Looking in different places to find the best price', 'Always buying the most expensive', 'Buying without looking at the price']
        },
        explanation: {
          pt: 'O mesmo produto pode custar valores diferentes. Comparar ajuda a economizar! 🛒',
          en: 'The same product can cost different amounts. Comparing helps you save! 🛒'
        }
      },
      {
        id: 'l2-3', correct: 1,
        question: { pt: 'O que é uma compra por impulso?', en: 'What is an impulse purchase?' },
        options: {
          pt: ['Uma compra bem planejada', 'Comprar sem pensar, só porque viu na hora', 'Comprar com desconto', 'Comprar pela internet'],
          en: ['A well-planned purchase', 'Buying without thinking, just because you saw it', 'Buying with a discount', 'Buying online']
        },
        explanation: {
          pt: 'Compras por impulso fazem a gente gastar com o que não precisa. Pense duas vezes! 🛍️',
          en: 'Impulse purchases make us spend on what we do not need. Think twice! 🛍️'
        }
      },
      {
        id: 'l2-4', correct: 1,
        question: { pt: 'Promoção significa...', en: 'A sale (promotion) means...' },
        options: {
          pt: ['Produto com defeito', 'Produto com preço reduzido por um tempo', 'Produto mais caro', 'Produto que ninguém quer'],
          en: ['A defective product', 'A product with a reduced price for a while', 'A more expensive product', 'A product nobody wants']
        },
        explanation: {
          pt: 'Promoção é o preço mais baixo por um tempo — mas só vale a pena se você realmente precisa. 🏷️',
          en: 'A sale is a lower price for a while — but it is only worth it if you really need the item. 🏷️'
        }
      },
      {
        id: 'l2-5', correct: 1,
        question: { pt: 'Você tem R$ 15 de mesada. Qual é a divisão mais equilibrada?', en: 'You have R$ 15 of allowance. What is the most balanced way to split it?' },
        options: {
          pt: ['Gastar os R$ 15 em doces', 'Guardar uma parte, gastar outra e até doar um pouco', 'Esconder tudo e não usar', 'Emprestar e nunca cobrar'],
          en: ['Spend all R$ 15 on sweets', 'Save part, spend part and even donate a little', 'Hide it all and not use it', 'Lend it and never ask for it back']
        },
        explanation: {
          pt: 'Guardar, gastar com responsabilidade e doar um pouquinho é uma divisão sábia. 💚',
          en: 'Saving, spending responsibly and donating a little is a wise split. 💚'
        }
      },
      {
        id: 'l2-6', correct: 0,
        question: { pt: 'O que é um orçamento?', en: 'What is a budget?' },
        options: {
          pt: ['Um plano de quanto vamos ganhar e gastar', 'Um tipo de comida', 'Um brinquedo novo', 'Um cofre'],
          en: ['A plan of how much we will earn and spend', 'A kind of food', 'A new toy', 'A safe']
        },
        explanation: {
          pt: 'O orçamento organiza o que entra e o que sai, para não gastar mais do que temos. 📊',
          en: 'A budget organizes what comes in and goes out, so we do not spend more than we have. 📊'
        }
      },
      {
        id: 'l2-7', correct: 1,
        question: { pt: 'Você quer um item de R$ 50 e recebe R$ 10 por semana. O que fazer?', en: 'You want a R$ 50 item and receive R$ 10 per week. What should you do?' },
        options: {
          pt: ['Desistir para sempre', 'Juntar durante algumas semanas até alcançar o valor', 'Pegar emprestado e não pagar', 'Comprar mesmo sem ter o dinheiro'],
          en: ['Give up forever', 'Save for a few weeks until you reach the amount', 'Borrow and not pay back', 'Buy it even without having the money']
        },
        explanation: {
          pt: 'Em 5 semanas guardando R$ 10 você chega aos R$ 50. Isso é cumprir uma meta! 🎯',
          en: 'In 5 weeks saving R$ 10 you reach R$ 50. That is achieving a goal! 🎯'
        }
      },
      {
        id: 'l2-8', correct: 1,
        question: { pt: 'Por que anotar os gastos ajuda?', en: 'Why does writing down your spending help?' },
        options: {
          pt: ['Não ajuda em nada', 'Mostra para onde o dinheiro está indo', 'Faz a gente gastar mais', 'Serve só para adultos'],
          en: ['It does not help at all', 'It shows where the money is going', 'It makes us spend more', 'It is only for adults']
        },
        explanation: {
          pt: 'Quando anotamos, enxergamos os gastos pequenos que somam muito no fim do mês. 🔍',
          en: 'When we write things down, we can see the small expenses that add up to a lot by the end of the month. 🔍'
        }
      }
    ]
  },

  {
    id: 2,
    name: { pt: 'A Arte de Poupar', en: 'The Art of Saving' },
    subtitle: { pt: 'Guardar dinheiro com paciência e constância', en: 'Saving money with patience and consistency' },
    icon: '🐷',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
    questions: [
      {
        id: 'l3-1', correct: 1,
        question: { pt: 'O que significa poupar?', en: 'What does it mean to save?' },
        options: {
          pt: ['Gastar tudo rapidamente', 'Guardar uma parte do dinheiro com regularidade', 'Esconder o dinheiro e perder', 'Emprestar para os amigos'],
          en: ['Spending it all quickly', 'Regularly setting aside part of your money', 'Hiding money and losing it', 'Lending it to friends']
        },
        explanation: {
          pt: 'Poupar é o hábito de guardar um pouquinho sempre — assim a quantia cresce com o tempo. 🐷',
          en: 'Saving is the habit of always setting aside a little — that way the amount grows over time. 🐷'
        }
      },
      {
        id: 'l3-2', correct: 1,
        question: { pt: 'Qual é a melhor forma de poupar?', en: 'What is the best way to save?' },
        options: {
          pt: ['Guardar muito só uma vez por ano', 'Guardar um pouco, mas com frequência', 'Nunca guardar nada', 'Esperar sobrar, e quase nunca sobra'],
          en: ['Saving a lot just once a year', 'Saving a little, but often', 'Never saving anything', 'Waiting for leftovers, which rarely happen']
        },
        explanation: {
          pt: 'Guardar pouco e sempre funciona melhor do que esperar sobrar dinheiro. 💪',
          en: 'Saving a little and often works better than waiting for money to be left over. 💪'
        }
      },
      {
        id: 'l3-3', correct: 1,
        question: { pt: 'O que quer dizer "pague-se primeiro"?', en: 'What does "pay yourself first" mean?' },
        options: {
          pt: ['Gastar com você antes de tudo', 'Separar a poupança assim que recebe o dinheiro', 'Pagar as dívidas dos outros', 'Comprar o que quiser primeiro'],
          en: ['Spend on yourself before anything', 'Set aside savings as soon as you get money', "Pay other people's debts", 'Buy whatever you want first']
        },
        explanation: {
          pt: '"Pague-se primeiro" é separar a poupança logo de início, antes de gastar o resto. 🥇',
          en: '"Pay yourself first" means setting aside savings right away, before spending the rest. 🥇'
        }
      },
      {
        id: 'l3-4', correct: 0,
        question: { pt: 'Por que é bom ter dinheiro guardado?', en: 'Why is it good to have money saved?' },
        options: {
          pt: ['Para imprevistos e para realizar sonhos', 'Para nunca mais usar', 'Só para mostrar aos amigos', 'Não é bom guardar'],
          en: ['For surprises and to make dreams come true', 'To never use it again', 'Just to show it to friends', 'It is not good to save']
        },
        explanation: {
          pt: 'Uma reserva ajuda em imprevistos, como um conserto, e também a realizar metas. 🛟',
          en: 'A reserve helps with surprises, like a repair, and also helps reach goals. 🛟'
        }
      },
      {
        id: 'l3-5', correct: 1,
        question: { pt: 'Você quer um item de R$ 80 e guarda R$ 20 por mês. Em quanto tempo consegue?', en: 'You want an R$ 80 item and save R$ 20 a month. How long will it take?' },
        options: {
          pt: ['Em 1 mês', 'Em 4 meses', 'Nunca vai conseguir', 'Em 10 meses'],
          en: ['In 1 month', 'In 4 months', 'You will never get it', 'In 10 months']
        },
        explanation: {
          pt: 'R$ 20 por mês × 4 = R$ 80. Poupar com constância faz o sonho chegar! 🎯',
          en: 'R$ 20 a month × 4 = R$ 80. Saving steadily makes the dream come true! 🎯'
        }
      },
      {
        id: 'l3-6', correct: 1,
        question: { pt: 'O dinheiro guardado na poupança...', en: 'Money kept in a savings account...' },
        options: {
          pt: ['Desaparece com o tempo', 'Fica seguro e rende um pouquinho com o tempo', 'Vira papel sem valor', 'Precisa ser gasto no mesmo dia'],
          en: ['Disappears over time', 'Stays safe and earns a little over time', 'Becomes worthless paper', 'Must be spent the same day']
        },
        explanation: {
          pt: 'Na poupança o dinheiro fica seguro e ainda rende um pouquinho de juros. 🏦',
          en: 'In a savings account money stays safe and even earns a little interest. 🏦'
        }
      },
      {
        id: 'l3-7', correct: 1,
        question: { pt: 'Qual atitude ajuda a poupar mais?', en: 'Which habit helps you save more?' },
        options: {
          pt: ['Comprar tudo por impulso', 'Evitar gastos desnecessários do dia a dia', 'Pegar dinheiro emprestado', 'Gastar antes de receber'],
          en: ['Buying everything on impulse', 'Avoiding unnecessary everyday spending', 'Borrowing money', 'Spending before getting paid']
        },
        explanation: {
          pt: 'Cortar pequenos gastos desnecessários deixa mais dinheiro para a poupança. ✂️',
          en: 'Cutting small unnecessary expenses leaves more money for savings. ✂️'
        }
      },
      {
        id: 'l3-8', correct: 1,
        question: { pt: 'Poupar exige principalmente...', en: 'Saving mainly requires...' },
        options: {
          pt: ['Sorte', 'Paciência e constância', 'Já ser rico', 'Gastar muito'],
          en: ['Luck', 'Patience and consistency', 'Already being rich', 'Spending a lot']
        },
        explanation: {
          pt: 'Poupar é como plantar: com paciência e cuidado constante, a colheita vem. 🌱',
          en: 'Saving is like planting: with patience and steady care, the harvest comes. 🌱'
        }
      }
    ]
  },

  {
    id: 3,
    name: { pt: 'Pequenos Negócios', en: 'Small Businesses' },
    subtitle: { pt: 'Empreender, vender e ter lucro', en: 'Entrepreneurship, selling and making a profit' },
    icon: '🛒',
    color: '#a855f7',
    gradient: 'linear-gradient(135deg, #c084fc 0%, #a855f7 50%, #7c3aed 100%)',
    questions: [
      {
        id: 'l4-1', correct: 1,
        question: { pt: 'O que é empreender?', en: 'What does it mean to be an entrepreneur?' },
        options: {
          pt: ['Trabalhar sempre para os outros', 'Criar e tocar um negócio ou ideia própria', 'Apenas gastar dinheiro', 'Não fazer nada'],
          en: ['Always working for others', 'Creating and running your own business or idea', 'Just spending money', 'Doing nothing']
        },
        explanation: {
          pt: 'Empreender é tirar uma ideia do papel — como abrir uma barraquinha de limonada. 🍋',
          en: 'Being an entrepreneur is bringing an idea to life — like opening a lemonade stand. 🍋'
        }
      },
      {
        id: 'l4-2', correct: 0,
        question: { pt: 'O que é o lucro de uma venda?', en: 'What is the profit of a sale?' },
        options: {
          pt: ['O dinheiro que sobra depois de pagar os custos', 'Tudo o que o cliente paga', 'O dinheiro gasto para produzir', 'Uma dívida'],
          en: ['The money left after paying the costs', 'Everything the customer pays', 'The money spent to produce it', 'A debt']
        },
        explanation: {
          pt: 'Vendeu por R$ 5 e gastou R$ 2 para fazer? O lucro foi de R$ 3. 💚',
          en: 'Sold it for R$ 5 and spent R$ 2 to make it? The profit was R$ 3. 💚'
        }
      },
      {
        id: 'l4-3', correct: 0,
        question: { pt: 'O que são os custos de um negócio?', en: 'What are the costs of a business?' },
        options: {
          pt: ['O dinheiro gasto para produzir e vender', 'O lucro do mês', 'O troco do cliente', 'Um presente'],
          en: ['The money spent to produce and sell', "The month's profit", "The customer's change", 'A gift']
        },
        explanation: {
          pt: 'Custos são os gastos para fazer o produto: ingredientes, materiais e embalagem. 🧾',
          en: 'Costs are what you spend to make the product: ingredients, materials and packaging. 🧾'
        }
      },
      {
        id: 'l4-4', correct: 1,
        question: { pt: 'Como definir um bom preço de venda?', en: 'How do you set a good selling price?' },
        options: {
          pt: ['Um preço abaixo do custo', 'Um preço que cobre os custos e ainda deixa lucro', 'Sempre o preço mais alto possível', 'Qualquer preço, tanto faz'],
          en: ['A price below the cost', 'A price that covers the costs and still leaves a profit', 'Always the highest price possible', 'Any price, it does not matter']
        },
        explanation: {
          pt: 'O preço precisa cobrir os custos e deixar um lucro justo — sem assustar o cliente. 🏷️',
          en: 'The price must cover the costs and leave a fair profit — without scaring the customer. 🏷️'
        }
      },
      {
        id: 'l4-5', correct: 1,
        question: { pt: 'Quem é o cliente de um negócio?', en: 'Who is a business’s customer?' },
        options: {
          pt: ['Quem fabrica o produto', 'A pessoa que compra o produto ou serviço', 'O dono do negócio', 'O ajudante'],
          en: ['The person who makes the product', 'The person who buys the product or service', 'The business owner', 'The helper']
        },
        explanation: {
          pt: 'O cliente é quem compra. Entender o que ele quer é a chave de um bom negócio. 🤝',
          en: 'The customer is the buyer. Understanding what they want is the key to a good business. 🤝'
        }
      },
      {
        id: 'l4-6', correct: 1,
        question: { pt: 'Para que serve divulgar (fazer propaganda) o seu negócio?', en: 'Why advertise your business?' },
        options: {
          pt: ['Para gastar dinheiro à toa', 'Para mais pessoas conhecerem e comprarem', 'Para esconder o produto', 'Não serve para nada'],
          en: ['To waste money', 'So more people know about it and buy', 'To hide the product', 'It is useless']
        },
        explanation: {
          pt: 'Divulgar faz mais gente conhecer o seu produto — e mais clientes podem aparecer. 📣',
          en: 'Advertising lets more people learn about your product — and more customers may come. 📣'
        }
      },
      {
        id: 'l4-7', correct: 1,
        question: { pt: 'O que é reinvestir o lucro?', en: 'What does it mean to reinvest the profit?' },
        options: {
          pt: ['Gastar o lucro todo com você', 'Usar parte do lucro para o negócio crescer', 'Jogar o lucro fora', 'Esconder o lucro'],
          en: ['Spending all the profit on yourself', 'Using part of the profit to grow the business', 'Throwing the profit away', 'Hiding the profit']
        },
        explanation: {
          pt: 'Reinvestir é usar parte do lucro para comprar mais material e vender ainda mais. 🔁',
          en: 'Reinvesting means using part of the profit to buy more supplies and sell even more. 🔁'
        }
      },
      {
        id: 'l4-8', correct: 1,
        question: { pt: 'Uma criança que vende suco caseiro está...', en: 'A child selling homemade juice is...' },
        options: {
          pt: ['Fazendo algo errado', 'Empreendendo e aprendendo na prática', 'Perdendo tempo', 'Proibida de fazer isso'],
          en: ['Doing something wrong', 'Being an entrepreneur and learning by doing', 'Wasting time', 'Forbidden to do that']
        },
        explanation: {
          pt: 'Com a ajuda da família, vender suco é um ótimo primeiro negócio para aprender. 🧃',
          en: 'With family help, selling juice is a great first business to learn from. 🧃'
        }
      }
    ]
  },

  {
    id: 4,
    name: { pt: 'Investir no Futuro', en: 'Investing in the Future' },
    subtitle: { pt: 'Fazer o dinheiro crescer e cuidar do amanhã', en: 'Growing your money and caring for tomorrow' },
    icon: '📈',
    color: '#f97316',
    gradient: 'linear-gradient(135deg, #fb923c 0%, #f97316 50%, #dc2626 100%)',
    questions: [
      {
        id: 'l5-1', correct: 1,
        question: { pt: 'O que são juros, de forma simples?', en: 'What is interest, simply put?' },
        options: {
          pt: ['Um castigo do banco', 'Um valor extra: ganhamos ao investir e pagamos ao tomar emprestado', 'Um imposto fixo', 'O preço de uma loja'],
          en: ['A punishment from the bank', 'An extra amount: we earn it when investing and pay it when borrowing', 'A fixed tax', 'The price of a store']
        },
        explanation: {
          pt: 'Quem investe ganha juros; quem pega emprestado paga juros. Eles trabalham a favor ou contra você. 💹',
          en: 'Those who invest earn interest; those who borrow pay interest. It works for you or against you. 💹'
        }
      },
      {
        id: 'l5-2', correct: 1,
        question: { pt: 'O que acontece com os juros compostos ao longo do tempo?', en: 'What happens with compound interest over time?' },
        options: {
          pt: ['O dinheiro some', 'O rendimento de um período passa a render também nos períodos seguintes', 'Os juros desaparecem', 'O dinheiro nunca rende'],
          en: ['The money disappears', 'The earnings from one period start earning in the following periods too', 'The interest disappears', 'The money never grows']
        },
        explanation: {
          pt: 'Nos juros compostos, você ganha rendimento sobre o que já rendeu — por isso investir cedo vale tanto. 🌱',
          en: 'With compound interest, you earn returns on what has already earned — that is why investing early matters so much. 🌱'
        }
      },
      {
        id: 'l5-3', correct: 1,
        question: { pt: 'Numa pequena venda de artesanato, o que é o capital inicial?', en: 'In a small craft business, what is the initial capital?' },
        options: {
          pt: ['O lucro final', 'O dinheiro investido para comprar materiais e começar', 'Os impostos', 'O troco'],
          en: ['The final profit', 'The money invested to buy materials and get started', 'The taxes', 'The change']
        },
        explanation: {
          pt: 'Capital inicial é o dinheiro usado para começar o negócio, como comprar a palha e a tinta. 🪵',
          en: 'Initial capital is the money used to start the business, like buying the straw and the paint. 🪵'
        }
      },
      {
        id: 'l5-4', correct: 1,
        question: { pt: 'Diversificar os investimentos significa...', en: 'Diversifying investments means...' },
        options: {
          pt: ['Colocar todo o dinheiro num só lugar', 'Distribuir o dinheiro em opções diferentes para reduzir o risco', 'Nunca investir', 'Gastar tudo de uma vez'],
          en: ['Putting all the money in one place', 'Spreading the money across different options to reduce risk', 'Never investing', 'Spending it all at once']
        },
        explanation: {
          pt: '"Não pôr todos os ovos na mesma cesta": espalhar reduz o risco de perder tudo. 🧺',
          en: '"Do not put all your eggs in one basket": spreading out reduces the risk of losing everything. 🧺'
        }
      },
      {
        id: 'l5-5', correct: 1,
        question: { pt: 'O que é o impacto socioambiental de uma compra?', en: 'What is the social and environmental impact of a purchase?' },
        options: {
          pt: ['O peso do produto', 'Os efeitos da compra sobre as pessoas e o meio ambiente', 'O preço da etiqueta', 'A cor da embalagem'],
          en: ['The weight of the product', 'The effects of the purchase on people and the environment', 'The price on the tag', 'The color of the packaging']
        },
        explanation: {
          pt: 'Toda compra tem efeitos: de onde veio, quem produziu, quanto lixo gera. Consumir consciente considera isso. 🌎',
          en: 'Every purchase has effects: where it came from, who made it, how much waste it creates. Conscious consumption considers this. 🌎'
        }
      },
      {
        id: 'l5-6', correct: 1,
        question: { pt: 'A bioeconomia da Amazônia propõe...', en: 'The bioeconomy of the Amazon proposes...' },
        options: {
          pt: ['Derrubar a floresta para lucrar', 'Gerar renda usando a floresta em pé, de forma sustentável', 'Proibir todo tipo de comércio', 'Ignorar a natureza'],
          en: ['Cutting down the forest for profit', 'Generating income by using the standing forest sustainably', 'Banning all kinds of trade', 'Ignoring nature']
        },
        explanation: {
          pt: 'A bioeconomia gera renda com a floresta viva — açaí, castanha, óleos — em vez de destruí-la. 🌳',
          en: 'The bioeconomy generates income from the living forest — açaí, nuts, oils — instead of destroying it. 🌳'
        }
      },
      {
        id: 'l5-7', correct: 1,
        question: { pt: 'Antes de abrir um negócio maior, é mais sensato...', en: 'Before starting a bigger business, it is wiser to...' },
        options: {
          pt: ['Gastar todas as economias sem pensar', 'Planejar custos, preço de venda e público antes de começar', 'Copiar tudo de alguém', 'Não planejar nada'],
          en: ['Spend all your savings without thinking', 'Plan costs, selling price and audience before starting', 'Copy everything from someone', 'Not plan anything']
        },
        explanation: {
          pt: 'Planejar custos, preço de venda e quem vai comprar aumenta muito a chance de sucesso. 📋',
          en: 'Planning costs, selling price and who will buy greatly increases the chance of success. 📋'
        }
      },
      {
        id: 'l5-8', correct: 1,
        question: { pt: 'Qual atitude resume uma vida financeira equilibrada?', en: 'Which attitude sums up a balanced financial life?' },
        options: {
          pt: ['Gastar mais do que se ganha', 'Ganhar, gastar com sabedoria, poupar, investir e doar', 'Apenas guardar e nunca usar', 'Ignorar completamente o dinheiro'],
          en: ['Spending more than you earn', 'Earning, spending wisely, saving, investing and donating', 'Just hoarding and never using it', 'Completely ignoring money']
        },
        explanation: {
          pt: 'O equilíbrio reúne tudo: ganhar, gastar bem, poupar, investir e também doar. 🌟',
          en: 'Balance brings it all together: earning, spending well, saving, investing and also donating. 🌟'
        }
      }
    ]
  }
]

/** Resolve um campo { pt, en } para o idioma pedido. */
function tr(field, lang) {
  if (field == null) return ''
  if (typeof field === 'string') return field
  return field[lang] ?? field[DEFAULT_LANG] ?? ''
}

/**
 * Retorna as perguntas de uma fase já traduzidas para o idioma escolhido.
 * Cada item: { id, correct, question, options: [...], explanation }.
 */
export function getQuestions(phaseIndex, lang = DEFAULT_LANG) {
  const phase = PHASES[phaseIndex]
  if (!phase) return []
  return phase.questions.map(q => ({
    id: q.id,
    correct: q.correct,
    question: tr(q.question, lang),
    options: q.options[lang] || q.options[DEFAULT_LANG],
    explanation: tr(q.explanation, lang)
  }))
}
