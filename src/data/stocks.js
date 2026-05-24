/**
 * Mini bolsa de valores do Miriti — empresas fictícias da Amazônia.
 * Cada ação tem um preço-base; os preços oscilam durante o jogo.
 */
export const STOCKS = [
  {
    id: 'acai',
    emoji: '🫐',
    basePrice: 22,
    name: { pt: 'Açaí S.A.', en: 'Açaí Inc.' }
  },
  {
    id: 'castanha',
    emoji: '🌰',
    basePrice: 38,
    name: { pt: 'Castanha & Cia.', en: 'Brazil Nut Co.' }
  },
  {
    id: 'pescado',
    emoji: '🐟',
    basePrice: 15,
    name: { pt: 'Pescados do Rio', en: 'River Fish Ltd.' }
  },
  {
    id: 'turismo',
    emoji: '🛶',
    basePrice: 50,
    name: { pt: 'Turismo na Mata', en: 'Jungle Tours' }
  }
]

export const STOCK_META = Object.fromEntries(STOCKS.map(s => [s.id, s]))
