/**
 * SoundManager — re-exporta o singleton do sistema de áudio.
 *
 * Embora o áudio seja gerenciado via classe singleton (em utils/sound.js),
 * mantemos este módulo como ponto único de importação documentado.
 */
import { sound } from '../utils/sound.js'

export default sound
export { sound }
