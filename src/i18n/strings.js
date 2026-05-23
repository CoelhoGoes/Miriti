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
      stocks: 'Bolsa de Valores',
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
      stocks: 'Stock Market',
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
    }
  }
}
