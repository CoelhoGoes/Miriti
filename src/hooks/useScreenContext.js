import { useScreen } from '../context/ScreenContext'

/**
 * Mapa das chaves do SCREENS para "áreas lógicas" usadas em features
 * como HelperPouch (filtra ajudantes por usableIn) e ActiveBuffsBar
 * (decide se mostra a barra).
 */
const SCREEN_TO_AREA = {
  home:         'home',
  farm:         'farm',
  escolinha:    'school',
  quiz:         'quiz',
  result:       'result',
  shop:         'cooperativa', // legacy: SHOP redirige para Cooperativa
  cooperativa:  'cooperativa',
  achievements: 'achievements',
  leaderboard:  'leaderboard',
  stocks:       'fair',        // STOCKS = Feirinha
  credits:      'credits',
  parents:      'parents',
  boss:         'boss',
}

/**
 * Hook que retorna a "área lógica" actual.
 * @returns {string} ex: 'farm', 'fair', 'quiz', 'cooperativa'
 * @example
 * const area = useScreenContext()
 * if (area === 'fair') { ... }
 */
export function useScreenContext() {
  const { screen } = useScreen()
  return SCREEN_TO_AREA[screen] ?? 'unknown'
}
