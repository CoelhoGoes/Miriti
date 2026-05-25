/**
 * Textos da interface do Miriti em português e inglês.
 * As perguntas e lições têm os textos traduzidos em data/questions.js;
 * itens de loja, ações e conquistas têm textos nos arquivos data/*.js.
 */

export const LANGUAGES = [
  { id: 'pt', label: 'Português', flag: '🇧🇷' },
  { id: 'en', label: 'English', flag: '🇺🇸' }
]

export const STRINGS = {
  pt: {
    common: {
      back: 'Voltar',
      close: 'Fechar'
    },
    home: {
      subtitle: 'Educação Financeira na Fazendinha',
      cta: 'Toque na tela ou pressione qualquer tecla para começar'
    },
    farm: {
      title: 'Fazendinha Miriti',
      subtitle: 'Toque em um lugar da fazenda para visitar!',
      escolinha: 'Escolinha',
      shop: 'Loja',
      achievements: 'Conquistas',
      stocks: 'Feirinha do Jutaiteua',
      settings: 'Configurações',
      credits: 'Créditos'
    },
    hud: {
      energyFull: 'Cheia',
      nextIn: (t) => `+1 em ${t}`
    },
    escolinha: {
      title: 'Escolinha da Fazenda',
      subtitle: 'Escolha uma lição para aprender!',
      locked: 'Conclua a lição anterior',
      lessonLabel: (n) => `Lição ${n}`,
      cost: 'Custa 1 de energia',
      noEnergyTitle: 'Sem energia!',
      noEnergyMsg: 'Sua energia acabou. Espere ela se recarregar ou compre uma recarga na loja.',
      noEnergyOk: 'Entendi'
    },
    quiz: {
      phaseLabel: (n) => `Lição ${n}`,
      progress: 'Progresso',
      hint: 'Dica',
      noHints: 'Sem dicas',
      quitTitle: 'Sair da lição?',
      quitMessage: 'Seu progresso nesta lição será perdido.',
      quitKeep: 'Continuar jogando',
      quitConfirm: 'Sair'
    },
    question: {
      counter: (n, total) => `Pergunta ${n} de ${total}`,
      correct: 'Resposta correta!',
      wrong: 'Quase! Veja a explicação:',
      next: 'Próxima Pergunta',
      seeResult: 'Ver Resultado'
    },
    result: {
      completed: '✅ Lição Concluída!',
      titles: ['CONTINUE TENTANDO!', 'BOM TRABALHO!', 'MUITO BEM!', 'INCRÍVEL!'],
      messages: [
        'A prática leva à perfeição. Vamos tentar outra vez?',
        'Você está no caminho certo! Tente de novo para melhorar!',
        'Excelente desempenho! Continue aprendendo na escolinha!',
        'Você é um verdadeiro guardião da educação financeira! 🌟'
      ],
      statHits: 'Acertos',
      statAccuracy: 'Acerto',
      statCoins: 'Moedas',
      trophyLabel: 'Troféu desbloqueado!',
      trophyName: (phaseName) => `Mestre de ${phaseName}`,
      tryAgain: 'Tentar novamente',
      backToMap: 'Voltar à Escolinha'
    },
    options: {
      title: '⚙️ Configurações',
      music: 'Volume da música',
      sfx: 'Volume dos efeitos',
      animations: 'Animações',
      on: 'Ligado',
      off: 'Desligado',
      language: 'Idioma',
      reset: 'Apagar progresso',
      resetConfirm: 'Tem certeza? Esta ação não pode ser desfeita.',
      cancel: 'Cancelar',
      resetYes: 'Apagar tudo'
    },
    shop: {
      title: '🏪 Loja da Fazenda',
      subtitle: 'Use suas moedas para comprar itens e mascotes',
      buy: 'Comprar',
      owned: 'Você já tem',
      equip: 'Usar',
      equipped: 'Em uso',
      notEnough: 'Moedas insuficientes',
      hintsLabel: (n) => `Você tem ${n} dica(s)`
    },
    achievements: {
      title: '🏆 Conquistas',
      subtitle: 'Tudo o que você já conquistou na fazenda',
      progress: (n, total) => `${n} de ${total} conquistadas`,
      locked: 'Ainda não conquistada'
    },
    stocks: {
      title: '📈 Bolsa de Valores',
      subtitle: 'Compre barato, venda caro e faça o dinheiro crescer!',
      buy: 'Comprar',
      sell: 'Vender',
      youOwn: (n) => `Você tem: ${n}`,
      price: 'Preço',
      portfolio: 'Suas ações valem',
      tip: 'Dica: os preços sobem e descem. O segredo é comprar barato e vender quando subir!'
    },
    credits: {
      subtitle: 'Uma aventura na fazendinha amazônica para ensinar dinheiro e responsabilidade financeira às crianças',
      techTitle: 'Tecnologias',
      teamTitle: 'Equipe',
      roles: ['Criador', 'Desenvolvedores'],
      thanks: 'Agradecimentos especiais a todas as crianças que sonham com um futuro próspero e às famílias que ensinam o valor do dinheiro com amor e paciência.',
      version: 'Miriti v2.0 — feito com muito carinho'
    },
    error: {
      title: 'Ops! Algo deu errado',
      message: 'O jogo encontrou um probleminha, mas você pode continuar.',
      button: 'Voltar ao início'
    },
    mascot: {
      title: 'Curiosidade do mascote',
      subtitle: 'Toque para ouvir outra história!',
      another: 'Outra curiosidade',
      gotIt: 'Entendi!'
    },
    boss: {
      title: 'Chefão da matéria',
      subtitle: 'Quiz longo que vale um mascote exclusivo.',
      locked: 'Conclua a lição com pelo menos 1 estrela para liberar o chefão.',
      start: 'Encarar o chefão',
      progress: (n, total) => `Pergunta ${n} de ${total}`,
      wonTitle: 'Mascote desbloqueado!',
      wonMsg: 'Você venceu o chefão da matéria!',
      retry: 'Tentar de novo',
      done: 'Voltar à Escolinha',
      lostTitle: 'Quase lá!',
      lostMsg: 'Acerte ao menos 70% para conquistar o mascote.',
      alreadyWon: 'Já conquistado',
      replay: 'Refazer (treino)'
    },
    tutorial: {
      skip: 'Pular',
      next: 'Próximo',
      finish: 'Começar!',
      back: 'Anterior',
      steps: [
        { title: 'Bem-vindo à Fazendinha!', text: 'Eu sou seu mascote 🦜. Vou te guiar pelos primeiros passos da educação financeira.' },
        { title: 'Escolinha 🏫', text: 'Comece pela Escolinha. Cada lição ensina algo novo sobre dinheiro.' },
        { title: 'Feirinha 🧺', text: 'Compre e venda produtos da Amazônia para treinar suas escolhas.' },
        { title: 'Loja 🏪', text: 'Use suas moedas 🪙 para comprar dicas e novos mascotes!' },
        { title: 'Conquistas 🏆', text: 'Veja seus troféus e meta a meta cumpra desafios.' },
        { title: 'Toque no mascote!', text: 'No topo da tela, toque no seu mascote para ouvir curiosidades sobre dinheiro.' }
      ]
    },
    a11y: {
      sectionTitle: 'Acessibilidade',
      fontSize: 'Tamanho da fonte',
      fontSmall: 'P',
      fontMedium: 'M',
      fontLarge: 'G',
      fontXLarge: 'GG',
      colorblind: 'Modo daltônico',
      cbNone: 'Padrão',
      cbDeuter: 'Deutan',
      cbProtan: 'Protan',
      cbTritan: 'Tritan'
    },
    parents: {
      title: 'Área dos Pais e Professores',
      summary: 'Resumo da criança',
      timePlayed: 'Tempo jogado',
      lessonsCompleted: 'Lições concluídas',
      bossesBeaten: 'Chefões vencidos',
      weakSubjects: 'Matérias mais fracas',
      suggestions: 'Sugestões para praticar',
      nothing: 'Ainda sem dados — peça para a criança jogar algumas lições.',
      back: 'Voltar',
      enterButton: 'Pais e Professores'
    },
    feirinha: {
      title: 'Feirinha do Jutaiteua',
      round: 'Rodada',
      coinsAvailable: 'moedas disponíveis',
      buy: 'Comprar',
      sell: 'Vender',
      readyToSell: '✅ Pronto para vender',
      sellIn: 'Venda em {n} rodada(s)',
      basketTitle: 'Cesta da Família',
      totalInvested: 'Total investido:',
      currentValue: 'Valor atual:',
      difference: 'Diferença:',
      coins: 'moedas',
      whatChanges: 'O que muda na feirinha?',
      understood: 'Entendi! 👍',
      base: 'Base: {price}',
      sellModal: {
        boughtAt: 'Comprou por:',
        currentPrice: 'Preço atual:',
        profitPerUnit: 'Lucro por unidade:',
        sellOne: 'Vender 1',
        sellAll: 'Vender tudo',
        close: 'Fechar',
        cooldownWarn: 'Aguarde o cooldown para vender.'
      },
      barometer: {
        level1: 'Muito barato!',
        level2: 'Caindo',
        level3: 'Normal',
        level4: 'Subindo',
        level5: 'Muito caro!'
      }
    },
    farmMap: {
      title: 'Fazendinha Miriti',
      hint: '🗺️ Toque em um lugar para visitar!',
      settings: 'Configurações',
      credits: 'Créditos',
      parents: 'Pais e Professores',
      mascotTip: 'Toque para curiosidades',
      mascotLabel: 'Mascote — toque para curiosidades',
      nodes: {
        escolinha: 'Escolinha',
        feirinha: 'Feirinha do Jutaiteua',
        loja: 'Loja',
        conquistas: 'Conquistas'
      }
    }
  },

  en: {
    common: {
      back: 'Back',
      close: 'Close'
    },
    home: {
      subtitle: 'Financial Education on the Farm',
      cta: 'Tap the screen or press any key to start'
    },
    farm: {
      title: 'Miriti Farm',
      subtitle: 'Tap a place on the farm to visit it!',
      escolinha: 'School',
      shop: 'Shop',
      achievements: 'Achievements',
      stocks: 'Jutaiteua Market Fair',
      settings: 'Settings',
      credits: 'Credits'
    },
    hud: {
      energyFull: 'Full',
      nextIn: (t) => `+1 in ${t}`
    },
    escolinha: {
      title: 'Farm School',
      subtitle: 'Choose a lesson to learn!',
      locked: 'Finish the previous lesson',
      lessonLabel: (n) => `Lesson ${n}`,
      cost: 'Costs 1 energy',
      noEnergyTitle: 'Out of energy!',
      noEnergyMsg: 'Your energy ran out. Wait for it to recharge or buy a refill at the shop.',
      noEnergyOk: 'Got it'
    },
    quiz: {
      phaseLabel: (n) => `Lesson ${n}`,
      progress: 'Progress',
      hint: 'Hint',
      noHints: 'No hints',
      quitTitle: 'Leave the lesson?',
      quitMessage: 'Your progress in this lesson will be lost.',
      quitKeep: 'Keep playing',
      quitConfirm: 'Leave'
    },
    question: {
      counter: (n, total) => `Question ${n} of ${total}`,
      correct: 'Correct answer!',
      wrong: 'Almost! See the explanation:',
      next: 'Next Question',
      seeResult: 'See Result'
    },
    result: {
      completed: '✅ Lesson Complete!',
      titles: ['KEEP TRYING!', 'GOOD WORK!', 'GREAT JOB!', 'AMAZING!'],
      messages: [
        'Practice makes perfect. Shall we try again?',
        'You’re on the right track! Try again to do even better!',
        'Excellent work! Keep learning at the school!',
        'You are a true guardian of financial education! 🌟'
      ],
      statHits: 'Correct',
      statAccuracy: 'Accuracy',
      statCoins: 'Coins',
      trophyLabel: 'Trophy unlocked!',
      trophyName: (phaseName) => `Master of ${phaseName}`,
      tryAgain: 'Try again',
      backToMap: 'Back to School'
    },
    options: {
      title: '⚙️ Settings',
      music: 'Music volume',
      sfx: 'Sound effects volume',
      animations: 'Animations',
      on: 'On',
      off: 'Off',
      language: 'Language',
      reset: 'Erase progress',
      resetConfirm: 'Are you sure? This action cannot be undone.',
      cancel: 'Cancel',
      resetYes: 'Erase everything'
    },
    shop: {
      title: '🏪 Farm Shop',
      subtitle: 'Use your coins to buy items and mascots',
      buy: 'Buy',
      owned: 'You own it',
      equip: 'Use',
      equipped: 'In use',
      notEnough: 'Not enough coins',
      hintsLabel: (n) => `You have ${n} hint(s)`
    },
    achievements: {
      title: '🏆 Achievements',
      subtitle: 'Everything you have achieved on the farm',
      progress: (n, total) => `${n} of ${total} unlocked`,
      locked: 'Not unlocked yet'
    },
    stocks: {
      title: '📈 Stock Market',
      subtitle: 'Buy low, sell high and grow your money!',
      buy: 'Buy',
      sell: 'Sell',
      youOwn: (n) => `You own: ${n}`,
      price: 'Price',
      portfolio: 'Your stocks are worth',
      tip: 'Tip: prices go up and down. The trick is to buy low and sell when they rise!'
    },
    credits: {
      subtitle: 'A little Amazon farm adventure to teach children about money and financial responsibility',
      techTitle: 'Technologies',
      teamTitle: 'Team',
      roles: ['Creator', 'Developers'],
      thanks: 'Special thanks to all the children who dream of a prosperous future and to the families who teach the value of money with love and patience.',
      version: 'Miriti v2.0 — made with love'
    },
    error: {
      title: 'Oops! Something went wrong',
      message: 'The game ran into a little problem, but you can continue.',
      button: 'Back to start'
    },
    mascot: {
      title: 'Mascot fun fact',
      subtitle: 'Tap to hear another story!',
      another: 'Another fact',
      gotIt: 'Got it!'
    },
    boss: {
      title: 'Subject Boss',
      subtitle: 'A long quiz that rewards an exclusive mascot.',
      locked: 'Finish the lesson with at least 1 star to unlock the boss.',
      start: 'Face the boss',
      progress: (n, total) => `Question ${n} of ${total}`,
      wonTitle: 'Mascot unlocked!',
      wonMsg: 'You beat the subject boss!',
      retry: 'Try again',
      done: 'Back to School',
      lostTitle: 'Almost there!',
      lostMsg: 'Get at least 70% to earn the mascot.',
      alreadyWon: 'Already beaten',
      replay: 'Replay (practice)'
    },
    tutorial: {
      skip: 'Skip',
      next: 'Next',
      finish: 'Start!',
      back: 'Back',
      steps: [
        { title: 'Welcome to the Farm!', text: "I'm your mascot 🦜. I'll guide you through your first steps with money." },
        { title: 'School 🏫', text: 'Start at the School. Each lesson teaches something new about money.' },
        { title: 'Market Fair 🧺', text: 'Buy and sell Amazon products to train your choices.' },
        { title: 'Shop 🏪', text: 'Use your coins 🪙 to buy hints and new mascots!' },
        { title: 'Achievements 🏆', text: 'See your trophies and conquer challenges.' },
        { title: 'Tap the mascot!', text: 'At the top of the screen, tap your mascot to hear fun facts about money.' }
      ]
    },
    a11y: {
      sectionTitle: 'Accessibility',
      fontSize: 'Font size',
      fontSmall: 'S',
      fontMedium: 'M',
      fontLarge: 'L',
      fontXLarge: 'XL',
      colorblind: 'Colorblind mode',
      cbNone: 'Default',
      cbDeuter: 'Deutan',
      cbProtan: 'Protan',
      cbTritan: 'Tritan'
    },
    parents: {
      title: 'Parents & Teachers Area',
      summary: 'Child summary',
      timePlayed: 'Time played',
      lessonsCompleted: 'Lessons completed',
      bossesBeaten: 'Bosses beaten',
      weakSubjects: 'Weakest subjects',
      suggestions: 'Practice suggestions',
      nothing: 'No data yet — ask the child to play a few lessons.',
      back: 'Back',
      enterButton: 'Parents & Teachers'
    },
    feirinha: {
      title: 'Jutaiteua Market',
      round: 'Round',
      coinsAvailable: 'coins available',
      buy: 'Buy',
      sell: 'Sell',
      readyToSell: '✅ Ready to sell',
      sellIn: 'Sell in {n} round(s)',
      basketTitle: 'Family Basket',
      totalInvested: 'Total invested:',
      currentValue: 'Current value:',
      difference: 'Difference:',
      coins: 'coins',
      whatChanges: 'What changes at the market?',
      understood: 'Got it! 👍',
      base: 'Base: {price}',
      sellModal: {
        boughtAt: 'Bought at:',
        currentPrice: 'Current price:',
        profitPerUnit: 'Profit per unit:',
        sellOne: 'Sell 1',
        sellAll: 'Sell all',
        close: 'Close',
        cooldownWarn: 'Wait for the cooldown to sell.'
      },
      barometer: {
        level1: 'Very cheap!',
        level2: 'Falling',
        level3: 'Normal',
        level4: 'Rising',
        level5: 'Very expensive!'
      }
    },
    farmMap: {
      title: 'Miriti Farm',
      hint: '🗺️ Tap a place to visit!',
      settings: 'Settings',
      credits: 'Credits',
      parents: 'Parents & Teachers',
      mascotTip: 'Tap for fun facts',
      mascotLabel: 'Mascot — tap for fun facts',
      nodes: {
        escolinha: 'School',
        feirinha: 'Jutaiteua Market',
        loja: 'Shop',
        conquistas: 'Achievements'
      }
    }
  }
}
