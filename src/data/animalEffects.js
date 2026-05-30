import { ANIMALS } from './animals.js';

export const ANIMAL_EFFECTS = {
  // ── AJUDANTES (consumíveis — efeitos pontuais) ──
  QUIZ_HINT_PREMIUM:   (state) => ({ quizFlags: { ...state.quizFlags, showExplanation: true } }),
  QUIZ_RETRY:          (state) => ({ quizFlags: { ...state.quizFlags, allowRetry: true } }),
  QUIZ_SKIP:           (state) => ({ quizFlags: { ...state.quizFlags, allowSkip: true } }),
  QUIZ_BONUS_COINS:    (state) => ({ quizFlags: { ...state.quizFlags, bonusCoins: 5 } }),
  QUIZ_REMOVE_TWO:     (state) => ({ quizFlags: { ...state.quizFlags, removeTwoWrong: true } }),
  QUIZ_DOUBLE_COINS:   (state) => ({ quizFlags: { ...state.quizFlags, doubleCoins: true } }),
  QUIZ_VISUAL_HINT:    (state) => ({ quizFlags: { ...state.quizFlags, showVisualHint: true } }),

  // ── PARCEIROS (buffs lidos por outros módulos) ──
  // O efeito é consultado por Feirinha/index.jsx via hasActivePartner().
  MARKET_PREVIEW_EVENT:  () => ({}),
  MARKET_SELL_BONUS:     () => ({}),
  COOP_DISCOUNT:         () => ({}),
  MARKET_STABILIZE:      () => ({}),
  MARKET_REVEAL_FUTURE:  () => ({}),
  MARKET_BUY_BONUS:      () => ({}),
  MARKET_GOOD_EVENT:     () => ({}),

  // ── ALIADOS (consultados via getActiveAllyEffect()) ──
  ALLY_DENDE_COOLDOWN:      () => ({}),
  ALLY_PASSIVE_INTEREST:    () => ({}),
  ALLY_TRANSACTION_BONUS:   () => ({}),
  ALLY_NEGATIVE_SHIELD:     () => ({}),
  ALLY_PASSIVE_COINS:       () => ({}),
  ALLY_BASKET_SLOT:         () => ({}),

  NONE: () => ({}),
};

export const hasActivePartner = (state, animalId) =>
  (state.cooperativa?.activePartners ?? []).some(p => p.id === animalId);

export const getActiveAllyEffect = (state) => {
  const allyId = state.cooperativa?.activeAlly;
  if (!allyId) return null;
  const ally = ANIMALS.find(a => a.id === allyId);
  return ally?.effect ?? null;
};
