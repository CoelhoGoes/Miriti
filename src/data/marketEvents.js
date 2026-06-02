/**
 * Eventos de mercado da Feirinha do Jutaiteua.
 *
 * Cada evento é inspirado num fenômeno real da Amazônia (safra, defeso,
 * cheias, secas, demanda externa) e movimenta o preço de 1 ou mais
 * produtos. As variações `delta` foram calibradas para que o jogador veja
 * a relação **causa → preço**, exercitando o nível 2 da taxonomia de Bloom
 * (compreensão de causa e efeito).
 */
export const MARKET_EVENTS = [
  {
    id: 'chuva_igarape',
    emoji: '☔',
    title: { pt: 'Chuva no Igarapé!', en: 'Rain at the Creek!' },
    description: {
      pt: 'O igarapé transbordou! Ficou difícil chegar na roça e produzir farinha.',
      en: 'The creek overflowed! Hard to reach the fields and make flour.'
    },
    effects: [{ productId: 'farinha', delta: +3 }],
    educationalTip: {
      pt: 'Quando fica difícil produzir, o preço sobe. Isso é oferta e demanda!',
      en: 'When something is hard to produce, the price goes up — supply and demand!'
    },
  },
  {
    id: 'safra_acai',
    emoji: '🫐',
    title: { pt: 'Safra do Açaí!', en: 'Açaí Harvest Peak!' },
    description: {
      pt: 'Entre julho e dezembro o açaizeiro dá tanto fruto que a lata fica baratinha.',
      en: 'July to December the açaí palm fruits so much the can gets cheap.'
    },
    effects: [{ productId: 'acai', delta: -6 }],
    educationalTip: {
      pt: 'Muita oferta + mesma demanda = preço cai. Hora de comprar e estocar?',
      en: 'More supply + same demand = price falls. Time to buy and store?'
    },
  },
  {
    id: 'entressafra_acai',
    emoji: '🔥',
    title: { pt: 'Entressafra do Açaí!', en: 'Açaí Off-Season!' },
    description: {
      pt: 'De janeiro a junho o açaí é escasso. O litro dobra de preço nas feiras.',
      en: 'January to June açaí is scarce. The price doubles at the market.'
    },
    effects: [{ productId: 'acai', delta: +10 }],
    educationalTip: {
      pt: 'Quando algo é raro, fica caro. Quem comprou na safra vende muito bem agora.',
      en: 'What is rare gets expensive. Whoever bought in harvest sells well now.'
    },
  },
  {
    id: 'casa_farinha_cheia',
    emoji: '🏠',
    title: { pt: 'Casa de Farinha Cheia!', en: 'Full Flour House!' },
    description: {
      pt: 'A casa de farinha trabalhou o fim de semana todo. Muita farinha no mercado.',
      en: 'The flour house worked all weekend. Lots of flour on the market.'
    },
    effects: [{ productId: 'farinha', delta: -3 }],
    educationalTip: {
      pt: 'Excesso de oferta empurra o preço pra baixo.',
      en: 'Oversupply pushes price down.'
    },
  },
  {
    id: 'praga_pimenta',
    emoji: '🐛',
    title: { pt: 'Praga na Pimenteira!', en: 'Pest on the Pepper Plants!' },
    description: {
      pt: 'Uma praga atacou as pimenteiras. A colheita do ano vai ser fraca.',
      en: 'A pest attacked the pepper plants. This year\'s harvest will be weak.'
    },
    effects: [{ productId: 'pimenta', delta: +8 }],
    educationalTip: {
      pt: 'Escassez dispara o preço. Quem tinha guardado lucra bastante.',
      en: 'Scarcity sends the price soaring. Whoever stored some profits a lot.'
    },
  },
  {
    id: 'defeso_pirarucu',
    emoji: '🚫',
    title: { pt: 'Defeso do Pirarucu', en: 'Pirarucu Closed Season' },
    description: {
      pt: 'O manejo proíbe a pesca por 6 meses para o peixe reproduzir. Estoque seco vale mais.',
      en: 'The 6-month no-fishing rule protects breeding. Dried stock is worth more.'
    },
    effects: [{ productId: 'pirarucu', delta: +12 }],
    educationalTip: {
      pt: 'Regras de manejo protegem o futuro: menos peixe agora, mais peixe depois.',
      en: 'Management rules protect the future: less fish now, more fish later.'
    },
  },
  {
    id: 'pedido_belem',
    emoji: '🍫',
    title: { pt: 'Pedido de Belém!', en: 'Order from Belém!' },
    description: {
      pt: 'A fábrica de chocolate em Belém pediu mais cacau fermentado da região!',
      en: 'The chocolate factory in Belém ordered more fermented cacao!'
    },
    effects: [{ productId: 'cacau', delta: +6 }],
    educationalTip: {
      pt: 'Quando alguém grande quer mais, a demanda sobe e o preço também.',
      en: 'When a big buyer wants more, demand and price rise together.'
    },
  },
  {
    id: 'festa_cirio',
    emoji: '🎉',
    title: { pt: 'Festa do Círio!', en: 'Círio Festival!' },
    description: {
      pt: 'No Círio de Nazaré todo mundo quer tacacá: tucupi e farinha disparam.',
      en: 'During the Círio festival everyone wants tacacá: tucupi and flour spike.'
    },
    effects: [
      { productId: 'tucupi', delta: +4 },
      { productId: 'farinha', delta: +2 },
    ],
    educationalTip: {
      pt: 'Eventos especiais aumentam a demanda de vários produtos ao mesmo tempo!',
      en: 'Special events raise demand for several products at the same time!'
    },
  },
  {
    id: 'boa_safra_pimenta',
    emoji: '☀️',
    title: { pt: 'Boa Safra de Pimenta!', en: 'Good Pepper Harvest!' },
    description: {
      pt: 'Sol e chuva na hora certa! A pimenta cresceu bem este ano.',
      en: 'Sun and rain at the right time! Pepper grew well this year.'
    },
    effects: [{ productId: 'pimenta', delta: -7 }],
    educationalTip: {
      pt: 'Colheita farta aumenta a oferta e derruba o preço.',
      en: 'A bountiful harvest increases supply and drops the price.'
    },
  },
  {
    id: 'castanha_safra',
    emoji: '🌰',
    title: { pt: 'Castanhas no Chão!', en: 'Brazil Nuts on the Ground!' },
    description: {
      pt: 'Janeiro a março: as castanheiras soltam ouriços e os extrativistas colhem muito.',
      en: 'January to March: Brazil nut trees drop pods and extractivists collect a lot.'
    },
    effects: [{ productId: 'castanha', delta: -5 }],
    educationalTip: {
      pt: 'A castanha mostra que dá pra ganhar dinheiro com a floresta em pé.',
      en: 'The Brazil nut shows you can earn money keeping the forest standing.'
    },
  },
  {
    id: 'demanda_exportacao',
    emoji: '🚢',
    title: { pt: 'Navio em Belém!', en: 'Ship in Belém!' },
    description: {
      pt: 'Um navio europeu chegou pedindo castanha-do-Pará. O preço dispara.',
      en: 'A European ship arrived wanting Brazil nuts. The price soars.'
    },
    effects: [{ productId: 'castanha', delta: +8 }],
    educationalTip: {
      pt: 'Exportação aumenta a demanda — produto local com mercado mundial vale mais.',
      en: 'Exports raise demand — local goods with world markets are worth more.'
    },
  },
  {
    id: 'queda_global_cacau',
    emoji: '📉',
    title: { pt: 'Cacau Caiu no Mundo!', en: 'Cacao Fell Worldwide!' },
    description: {
      pt: 'A bolsa de Nova York derrubou o preço do cacau. Reflexo bate até em Jutaiteua.',
      en: 'New York exchange dropped cacao prices. It echoes all the way to Jutaiteua.'
    },
    effects: [{ productId: 'cacau', delta: -8 }],
    educationalTip: {
      pt: 'O preço de produtos exportados depende do mundo, não só da sua roça.',
      en: 'Export prices depend on the world, not just on your farm.'
    },
  },
]
