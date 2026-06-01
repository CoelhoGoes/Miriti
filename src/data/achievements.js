/**
 * Conquistas do Miriti. Cada uma tem um id verificado em GameContext.
 * Categorias internas (só para organização visual):
 *   'progresso'   — caminhada pelas lições
 *   'mestria'     — desempenho (estrelas, chefões)
 *   'economia'    — moedas e compras
 *   'feirinha'    — produtos da Feira
 *   'cooperativa' — aliados/parceiros
 *   'descoberta'  — explorar funcionalidades do app
 */
export const ACHIEVEMENTS = [
  // ── Progresso ────────────────────────────────────────────
  {
    id: 'first_lesson',
    icon: '🎓',
    category: 'progresso',
    name: { pt: 'Primeira Lição', en: 'First Lesson' },
    desc: { pt: 'Concluiu sua primeira lição na escolinha.', en: 'Finished your first lesson at the school.' }
  },
  {
    id: 'all_lessons',
    icon: '🏫',
    category: 'progresso',
    name: { pt: 'Formado!', en: 'Graduate!' },
    desc: { pt: 'Concluiu todas as lições da escolinha.', en: 'Finished every lesson at the school.' }
  },

  // ── Mestria ───────────────────────────────────────────────
  {
    id: 'perfect',
    icon: '💯',
    category: 'mestria',
    name: { pt: 'Nota Máxima', en: 'Top Marks' },
    desc: { pt: 'Conquistou 3 estrelas em uma lição.', en: 'Earned 3 stars in a lesson.' }
  },
  {
    id: 'star_collector',
    icon: '⭐',
    category: 'mestria',
    name: { pt: 'Caçador de Estrelas', en: 'Star Collector' },
    desc: { pt: 'Juntou 9 estrelas no total.', en: 'Collected 9 stars in total.' }
  },
  {
    id: 'boss_slayer',
    icon: '👹',
    category: 'mestria',
    name: { pt: 'Caçador de Chefões', en: 'Boss Slayer' },
    desc: { pt: 'Venceu pelo menos um chefão de matéria.', en: 'Beat at least one subject boss.' }
  },
  {
    id: 'all_bosses',
    icon: '🏆',
    category: 'mestria',
    name: { pt: 'Mestre dos Chefões', en: 'Boss Master' },
    desc: { pt: 'Venceu os chefões de todas as matérias.', en: 'Beat the boss of every subject.' }
  },

  // ── Economia ──────────────────────────────────────────────
  {
    id: 'rich',
    icon: '💰',
    category: 'economia',
    name: { pt: 'Cofrinho Cheio', en: 'Full Piggy Bank' },
    desc: { pt: 'Teve 300 moedas guardadas ao mesmo tempo.', en: 'Held 300 coins at the same time.' }
  },
  {
    id: 'shopper',
    icon: '🛍️',
    category: 'economia',
    name: { pt: 'Primeira Compra', en: 'First Purchase' },
    desc: { pt: 'Comprou algo na Cooperativa.', en: 'Bought something at the Cooperative.' }
  },
  {
    id: 'big_saver',
    icon: '🏦',
    category: 'economia',
    name: { pt: 'Grande Poupador', en: 'Big Saver' },
    desc: { pt: 'Acumulou 1.000 moedas — paciência compensa!', en: 'Saved 1,000 coins — patience pays!' }
  },

  // ── Feirinha ──────────────────────────────────────────────
  {
    id: 'first_sale',
    icon: '🧺',
    category: 'feirinha',
    name: { pt: 'Primeira Venda', en: 'First Sale' },
    desc: { pt: 'Vendeu um produto na Feirinha do Jutaiteua.', en: 'Sold a product at the Jutaiteua Market.' }
  },
  {
    id: 'market_trader',
    icon: '💹',
    category: 'feirinha',
    name: { pt: 'Comerciante de Faro', en: 'Sharp Trader' },
    desc: { pt: 'Vendeu um produto por mais do que pagou.', en: 'Sold a product for more than you paid.' }
  },
  {
    id: 'investor',
    icon: '📈',
    category: 'feirinha',
    name: { pt: 'Pequeno Investidor', en: 'Little Investor' },
    desc: { pt: 'Comprou pelo menos 3 produtos diferentes na Feira.', en: 'Bought at least 3 different Fair products.' }
  },
  {
    id: 'amazon_pride',
    icon: '🫐',
    category: 'feirinha',
    name: { pt: 'Orgulho da Amazônia', en: 'Pride of the Amazon' },
    desc: { pt: 'Comprou açaí, castanha e cacau — os 3 produtos sustentáveis.', en: 'Bought açaí, Brazil nuts and cacao — the 3 sustainable goods.' }
  },

  // ── Cooperativa ───────────────────────────────────────────
  {
    id: 'first_ally',
    icon: '🤝',
    category: 'cooperativa',
    name: { pt: 'Companhia da Floresta', en: 'Forest Companion' },
    desc: { pt: 'Adotou seu primeiro aliado além do Cofrinho.', en: 'Adopted your first ally beyond the Piggy.' }
  },
  {
    id: 'collector',
    icon: '🐔',
    category: 'cooperativa',
    name: { pt: 'Amigo dos Bichos', en: 'Animal Friend' },
    desc: { pt: 'Teve 3 aliados diferentes na Cooperativa.', en: 'Owned 3 different Cooperative allies.' }
  },
  {
    id: 'full_team',
    icon: '🌳',
    category: 'cooperativa',
    name: { pt: 'Time da Mata', en: 'Forest Crew' },
    desc: { pt: 'Reuniu todos os aliados disponíveis.', en: 'Gathered every available ally.' }
  },

  // ── Descoberta ────────────────────────────────────────────
  {
    id: 'curious',
    icon: '💡',
    category: 'descoberta',
    name: { pt: 'Curioso', en: 'Curious' },
    desc: { pt: 'Ouviu pelo menos 5 curiosidades do mascote.', en: 'Heard at least 5 mascot fun facts.' }
  },
  {
    id: 'tutorial_done',
    icon: '🗺️',
    category: 'descoberta',
    name: { pt: 'Bússola Pronta', en: 'Compass Ready' },
    desc: { pt: 'Concluiu o tutorial inicial.', en: 'Completed the starting tutorial.' }
  },
  {
    id: 'time_traveler',
    icon: '⏱️',
    category: 'descoberta',
    name: { pt: 'Visitante Frequente', en: 'Frequent Visitor' },
    desc: { pt: 'Jogou por pelo menos 30 minutos no total.', en: 'Played for at least 30 minutes in total.' }
  },
]
