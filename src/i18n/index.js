import { useGame } from '../context/GameContext.jsx'
import { STRINGS, LANGUAGES } from './strings.js'

export { LANGUAGES }

/** Idioma padrão usado como fallback. */
export const DEFAULT_LANGUAGE = 'pt'

/** Retorna um valor traduzido de um objeto { pt, en }, com fallback. */
export function pick(field, lang) {
  if (field == null) return ''
  if (typeof field === 'string') return field
  return field[lang] ?? field[DEFAULT_LANGUAGE] ?? ''
}

/**
 * Hook que devolve os textos de interface no idioma ativo.
 * Uso: const s = useStrings(); ... s.farm.title
 */
export function useStrings() {
  const { state } = useGame()
  const lang = state.settings.language || DEFAULT_LANGUAGE
  return STRINGS[lang] || STRINGS[DEFAULT_LANGUAGE]
}

/** Hook que devolve apenas o código do idioma ativo ('pt' | 'en'). */
export function useLanguage() {
  const { state } = useGame()
  return state.settings.language || DEFAULT_LANGUAGE
}
