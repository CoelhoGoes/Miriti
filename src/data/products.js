/**
 * Produtos da Feirinha do Jutaiteua.
 *
 * Cada item é um produto real da economia ribeirinha/amazônica.
 * `basePrice` reflete a ordem de grandeza do preço médio observado em
 * feiras do interior do Pará e no Ver-o-Peso (Belém) entre 2024-2025 e foi
 * arredondado para "moedas" (1 moeda ≈ R$ 1) para facilitar o cálculo
 * mental da criança.
 *
 * `minPrice` / `maxPrice` são os limites históricos de oscilação observados
 * (chuvas, defeso, safra). `volatility` resume o quanto o preço oscila ao
 * longo de uma rodada (low ≈ ±10%, medium ≈ ±20%, high ≈ ±40%).
 *
 * Fontes de referência: CONAB-PA, IBGE PEVS, SEDAP-PA e levantamentos de
 * preços do Ver-o-Peso entre 2024 e 2025.
 */
export const PRODUCTS = [
  {
    id: "farinha",
    name: { pt: "Farinha d'água", en: "Water Cassava Flour" },
    emoji: "🍚",
    description: {
      pt: "Feita da mandioca brava, é a base do prato de quase toda casa paraense.",
      en: "Made from bitter cassava, it's the base of almost every meal in Pará."
    },
    unit: { pt: "saca 30 kg", en: "30 kg sack" },
    basePrice: 12, // ≈ R$ 12/kg em 2025 (CONAB-PA)
    volatility: "low",
    minPrice: 8,
    maxPrice: 18,
    riskProfile: { pt: "Estável", en: "Stable" },
    lesson: {
      pt: "Itens essenciais têm demanda constante e margem menor — vendem todo dia, mas o lucro por unidade é fino.",
      en: "Essentials sell every day but with thinner margins."
    },
    hasCooldown: false,
  },
  {
    id: "acai",
    name: { pt: "Açaí (polpa)", en: "Açaí pulp" },
    emoji: "🫐",
    description: {
      pt: "O 'vinho da floresta'. Colhido no açaizeiro e batido na hora.",
      en: "The 'forest wine'. Harvested from the açaí palm and mashed fresh."
    },
    unit: { pt: "lata 14 L", en: "14 L can" },
    basePrice: 22, // ≈ R$ 20–25 a lata na safra
    volatility: "high",
    minPrice: 10, // safra (jul–dez) ≈ R$ 10
    maxPrice: 45, // entressafra (jan–jun) pode passar dos R$ 40
    riskProfile: { pt: "Safra/entressafra", en: "Seasonal swing" },
    lesson: {
      pt: "Na safra (jul-dez) o açaí é barato; na entressafra dobra de preço. Comprar no momento certo muda o lucro.",
      en: "In harvest season açaí is cheap; off-season it doubles. Timing matters."
    },
    hasCooldown: false,
  },
  {
    id: "castanha",
    name: { pt: "Castanha-do-Pará", en: "Brazil Nut" },
    emoji: "🌰",
    description: {
      pt: "Cai do castanheiro só quando madura. Coletada por extrativistas.",
      en: "Falls from the Brazil-nut tree only when ripe. Gathered by extractivists."
    },
    unit: { pt: "lata 12 kg", en: "12 kg can" },
    basePrice: 28,
    volatility: "medium",
    minPrice: 18,
    maxPrice: 48,
    riskProfile: { pt: "Sustentável", en: "Sustainable" },
    lesson: {
      pt: "A castanheira só dá fruto com a floresta em pé — exemplo de bioeconomia: renda sem desmatar.",
      en: "Brazil nut trees only fruit with the forest standing — bioeconomy in action."
    },
    hasCooldown: true,
    cooldownRounds: 2,
  },
  {
    id: "pirarucu",
    name: { pt: "Pirarucu (manejado)", en: "Pirarucu (managed)" },
    emoji: "🐟",
    description: {
      pt: "O 'bacalhau da Amazônia'. Só pode ser pescado no período permitido pelo manejo.",
      en: "The 'cod of the Amazon'. Only fished during the allowed managed period."
    },
    unit: { pt: "kg seco salgado", en: "kg salt-dried" },
    basePrice: 35, // R$ 30–40/kg seco
    volatility: "low",
    minPrice: 25,
    maxPrice: 55,
    riskProfile: { pt: "Manejo regulado", en: "Managed harvest" },
    lesson: {
      pt: "O manejo do pirarucu é exemplo de pesca sustentável: regras claras, peixe grande, renda boa.",
      en: "Pirarucu management shows that rules + patience = bigger fish + better income."
    },
    hasCooldown: true,
    cooldownRounds: 3,
  },
  {
    id: "cacau",
    name: { pt: "Cacau (amêndoa)", en: "Cacao (bean)" },
    emoji: "🍫",
    description: {
      pt: "Do igarapé do Tapajós ao chocolate fino. Mais valorizado quando seco e fermentado.",
      en: "From the Tapajós creek to fine chocolate. Worth more when dried and fermented."
    },
    unit: { pt: "kg amêndoa seca", en: "kg dried bean" },
    basePrice: 30, // 2024-25 explodiu acima de R$ 70/kg, base 30 para jogabilidade
    volatility: "high",
    minPrice: 14,
    maxPrice: 60,
    riskProfile: { pt: "Sazonal/global", en: "Seasonal/global" },
    lesson: {
      pt: "O preço do cacau depende do mundo todo. Quem agrega valor (seca, fermenta) ganha o dobro de quem só colhe.",
      en: "Cacao prices depend on the whole world. Adding value (dry, ferment) doubles the income."
    },
    hasCooldown: false,
  },
  {
    id: "pimenta",
    name: { pt: "Pimenta-do-reino", en: "Black Pepper" },
    emoji: "🌶️",
    description: {
      pt: "Pequena, valente e exportada. Pode valer ouro num ano e quase nada no outro.",
      en: "Small, bold and exported. Worth gold one year, almost nothing the next."
    },
    unit: { pt: "saca 60 kg", en: "60 kg sack" },
    basePrice: 18, // ≈ R$ 18/kg em pico recente
    volatility: "high",
    minPrice: 6,
    maxPrice: 38,
    riskProfile: { pt: "Alto risco", en: "High risk" },
    lesson: {
      pt: "Ativos voláteis exigem atenção e timing. Alto risco pode trazer alto retorno — ou prejuízo.",
      en: "Volatile assets require attention and timing. High risk, high return — or loss."
    },
    hasCooldown: false,
  },
  {
    id: "tucupi",
    name: { pt: "Tucupi", en: "Tucupi" },
    emoji: "🟡",
    description: {
      pt: "Caldo amarelo da mandioca brava. Alma do tacacá e do pato no tucupi.",
      en: "Yellow broth from bitter cassava. Soul of tacacá and duck-in-tucupi."
    },
    unit: { pt: "garrafa 1 L", en: "1 L bottle" },
    basePrice: 8,
    volatility: "medium",
    minPrice: 4,
    maxPrice: 14,
    riskProfile: { pt: "Artesanal", en: "Artisanal" },
    lesson: {
      pt: "Produto artesanal: preço depende da habilidade do ribeirinho — quanto melhor a receita, melhor o preço.",
      en: "Artisanal goods price by the maker's skill — better recipe, better price."
    },
    hasCooldown: false,
  },
]
