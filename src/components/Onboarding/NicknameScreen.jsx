import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useStrings } from '../../i18n'
import { useGame } from '../../context/GameContext'
import { checkNicknameAvailable, createPlayer } from '../../lib/api/players'
import { isSupabaseConfigured } from '../../lib/supabaseClient'
import styles from './Onboarding.module.css'

/**
 * Fallback offline — quando o Supabase não está configurado ou a rede falha,
 * geramos um id e código de recuperação locais. O jogo continua funcionando,
 * apenas sem sincronização em nuvem.
 */
function createLocalPlayer(nickname) {
  const id = `local-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`
  const recovery = `LOCAL-${Math.random().toString(36).slice(2, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`
  return { id, nickname, recovery_code: recovery }
}

const VALIDATION = {
  IDLE:      'idle',
  CHECKING:  'checking',
  VALID:     'valid',
  TAKEN:     'taken',
  TOO_SHORT: 'too_short',
  TOO_LONG:  'too_long',
  INVALID:   'invalid',
}

const NICKNAME_REGEX = /^[A-Za-zÀ-ÿ0-9 ._-]+$/

function localValidate(value) {
  const trimmed = value.trim()
  if (trimmed.length === 0)           return VALIDATION.IDLE
  if (trimmed.length < 2)            return VALIDATION.TOO_SHORT
  if (trimmed.length > 20)           return VALIDATION.TOO_LONG
  if (!NICKNAME_REGEX.test(trimmed)) return VALIDATION.INVALID
  return null
}

function getFeedbackClass(validation, s) {
  if (validation === VALIDATION.VALID)    return { cls: styles.feedbackOk,       text: s.onboarding.available }
  if (validation === VALIDATION.CHECKING) return { cls: styles.feedbackChecking, text: s.onboarding.checking }
  if (validation === VALIDATION.TAKEN)    return { cls: styles.feedbackError,    text: s.onboarding.taken }
  if (validation === VALIDATION.TOO_SHORT)return { cls: styles.feedbackError,    text: s.onboarding.tooShort }
  if (validation === VALIDATION.TOO_LONG) return { cls: styles.feedbackError,    text: s.onboarding.tooLong }
  if (validation === VALIDATION.INVALID)  return { cls: styles.feedbackError,    text: s.onboarding.invalidChars }
  return { cls: '', text: '' }
}

export default function NicknameScreen({ onComplete, onSwitchToRecovery }) {
  const s = useStrings()
  const { setPlayer } = useGame()

  const [nickname, setNickname]     = useState('')
  const [validation, setValidation] = useState(VALIDATION.IDLE)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg]     = useState(null)

  const debounceTimerRef = useRef(null)

  useEffect(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)

    const localResult = localValidate(nickname)
    if (localResult !== null) {
      setValidation(localResult)
      return
    }

    // Sem Supabase configurado: aceita o nickname só com validação local.
    // Não bloqueia o usuário em modo offline.
    if (!isSupabaseConfigured()) {
      setValidation(VALIDATION.VALID)
      return
    }

    setValidation(VALIDATION.CHECKING)
    debounceTimerRef.current = setTimeout(async () => {
      const result = await checkNicknameAvailable(nickname)
      // Falha de rede / Supabase indisponível → fallback: aceita o nome.
      // Em modo offline o jogo segue, sem sincronizar com a nuvem.
      if (!result.ok) { setValidation(VALIDATION.VALID); return }
      setValidation(result.available ? VALIDATION.VALID : VALIDATION.TAKEN)
    }, 500)

    return () => { if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current) }
  }, [nickname])

  const handleSubmit = useCallback(async () => {
    if (validation !== VALIDATION.VALID || submitting) return

    setSubmitting(true)
    setErrorMsg(null)

    // Sem Supabase: cria jogador local direto.
    if (!isSupabaseConfigured()) {
      const local = createLocalPlayer(nickname.trim())
      setPlayer(local.id, local.nickname, local.recovery_code)
      onComplete(local)
      return
    }

    const result = await createPlayer(nickname.trim())

    // Falha em chegar ao Supabase (rede / projeto pausado / etc.):
    // cria jogador local pra não travar a criança fora do jogo.
    if (!result.ok) {
      const local = createLocalPlayer(nickname.trim())
      setPlayer(local.id, local.nickname, local.recovery_code)
      onComplete(local)
      return
    }

    setPlayer(result.data.id, result.data.nickname, result.data.recovery_code)
    onComplete(result.data)
  }, [nickname, validation, submitting, setPlayer, onComplete, s])

  const canSubmit = validation === VALIDATION.VALID && !submitting
  const { cls: feedbackClass, text: feedbackText } = getFeedbackClass(validation, s)

  return (
    <motion.div
      className={styles.wrapper}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className={styles.card}
        initial={{ scale: 0.85, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 18, stiffness: 200 }}
      >
        <h1 className={styles.title}>{s.onboarding.welcome}</h1>
        <p className={styles.subtitle}>{s.onboarding.askName}</p>

        <input
          type="text"
          className={styles.input}
          placeholder={s.onboarding.placeholder}
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={20}
          autoFocus
          disabled={submitting}
        />

        <div className={`${styles.feedback} ${feedbackClass}`}>
          {feedbackText || ' '}
        </div>

        <p className={styles.hint}>{s.onboarding.hint}</p>

        {errorMsg && (
          <div className={`${styles.feedback} ${styles.feedbackError}`}>
            {errorMsg}
          </div>
        )}

        <button
          type="button"
          className={styles.button}
          disabled={!canSubmit}
          onClick={handleSubmit}
        >
          {submitting ? s.onboarding.creating : s.onboarding.start}
        </button>

        <button
          type="button"
          className={styles.linkButton}
          onClick={onSwitchToRecovery}
          disabled={submitting}
        >
          {s.recoveryScreen.alreadyPlayed}
        </button>
      </motion.div>
    </motion.div>
  )
}
