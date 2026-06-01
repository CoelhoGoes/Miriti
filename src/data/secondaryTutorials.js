import { useStrings } from '../i18n'

/**
 * Constrói o array de steps a partir do namespace de strings.
 * Suporta i18nKeyOverride para referenciar strings fora do namespace do tutorial.
 */
export function buildSteps(namespace, stepDefs, fullStrings = null) {
  return stepDefs.map(def => {
    let title = ''
    let text  = ''

    if (def.i18nKeyOverride && fullStrings) {
      const { ns, index } = def.i18nKeyOverride
      const path = ns.split('.')
      let target = fullStrings
      for (const key of path) {
        target = target?.[key]
        if (!target) break
      }
      const stepData = Array.isArray(target) ? target[index] : null
      title = stepData?.title ?? ''
      text  = stepData?.text  ?? ''
    } else if (def.i18nKey && namespace) {
      title = namespace[def.i18nKey]?.title ?? ''
      text  = namespace[def.i18nKey]?.text  ?? ''
    }

    return {
      id:            def.id,
      target:        def.target,
      side:          def.side,
      cofrinhoState: def.cofrinhoState,
      title,
      text,
    }
  })
}

export const SECONDARY_TUTORIALS = {

  // ═══════════ TUTORIAL INICIAL — Primeira vez no FarmMap ═══════════
  INITIAL: {
    id:          'tutorial.first-time',
    reward:      null,
    i18nKey:     null,
    triggerArea: 'home',
    stepDefs: [
      { id: 'initial-welcome',      target: null,                                    side: 'bottom', cofrinhoState: 'celebrating', i18nKeyOverride: { ns: 'tutorial.steps', index: 0 } },
      { id: 'initial-escola',       target: '[data-tutorial="node-escolinha"]',      side: 'bottom', cofrinhoState: 'pointing',    i18nKeyOverride: { ns: 'tutorial.steps', index: 1 } },
      { id: 'initial-feira',        target: '[data-tutorial="node-feirinha"]',       side: 'bottom', cofrinhoState: 'pointing',    i18nKeyOverride: { ns: 'tutorial.steps', index: 2 } },
      { id: 'initial-cooperativa',  target: '[data-tutorial="node-cooperativa"]',    side: 'bottom', cofrinhoState: 'pointing',    i18nKeyOverride: { ns: 'tutorial.steps', index: 3 } },
      { id: 'initial-conquistas',   target: '[data-tutorial="node-conquistas"]',     side: 'bottom', cofrinhoState: 'pointing',    i18nKeyOverride: { ns: 'tutorial.steps', index: 4 } },
      { id: 'initial-ally',         target: '[data-tutorial="active-ally-overlay"]', side: 'top',    cofrinhoState: 'pointing',    i18nKeyOverride: { ns: 'tutorial.steps', index: 5 } },
    ],
  },

  // ═══════════ ESCOLA ═══════════
  ESCOLA: {
    id:          'tutorial.area.escola',
    reward:      { coins: 5 },
    i18nKey:     'escola',
    triggerArea: 'escola',
    stepDefs: [
      { id: 'school-welcome', target: null,                                  side: 'bottom', cofrinhoState: 'celebrating', i18nKey: 'step1' },
      { id: 'school-stars',   target: '[data-tutorial="lesson-stars"]',      side: 'bottom', cofrinhoState: 'pointing',    i18nKey: 'step2' },
      { id: 'school-locked',  target: '[data-tutorial="lesson-locked"]',     side: 'right',  cofrinhoState: 'pointing',    i18nKey: 'step3' },
      { id: 'school-boss',    target: '[data-tutorial="boss-badge"]',        side: 'left',   cofrinhoState: 'pointing',    i18nKey: 'step4' },
      { id: 'school-final',   target: null,                                  side: 'bottom', cofrinhoState: 'celebrating', i18nKey: 'step5' },
    ],
  },

  FEIRA: {
    id:          'tutorial.area.feira',
    reward:      { coins: 10 },
    i18nKey:     'feira',
    triggerArea: 'feirinha',
    stepDefs: [
      { id: 'fair-welcome',     target: null,                                side: 'bottom', cofrinhoState: 'celebrating', i18nKey: 'step1' },
      { id: 'fair-thermometer', target: '[data-tutorial="product-card"]',    side: 'right',  cofrinhoState: 'pointing',    i18nKey: 'step2' },
      { id: 'fair-basket',      target: '[data-tutorial="basket-section"]',  side: 'top',    cofrinhoState: 'pointing',    i18nKey: 'step3' },
      { id: 'fair-filters',     target: '[data-tutorial="fair-tabs"]',       side: 'bottom', cofrinhoState: 'pointing',    i18nKey: 'step4' },
      { id: 'fair-rounds',      target: '[data-tutorial="round-counter"]',   side: 'bottom', cofrinhoState: 'pointing',    i18nKey: 'step5' },
    ],
  },

  COOPERATIVA: {
    id:          'tutorial.area.cooperativa',
    reward:      { coins: 15 },
    i18nKey:     'cooperativa',
    triggerArea: 'cooperativa',
    stepDefs: [
      { id: 'coop-welcome',     target: null,                                    side: 'bottom', cofrinhoState: 'celebrating', i18nKey: 'step1' },
      { id: 'coop-tabs',        target: '[data-tutorial="coop-tabs"]',           side: 'bottom', cofrinhoState: 'pointing',    i18nKey: 'step2' },
      { id: 'coop-active-ally', target: '[data-tutorial="active-ally-coop"]',    side: 'bottom', cofrinhoState: 'pointing',    i18nKey: 'step3' },
      { id: 'coop-animal-card', target: '[data-tutorial="animal-card"]',         side: 'right',  cofrinhoState: 'pointing',    i18nKey: 'step4' },
    ],
  },

  CONQUISTAS: {
    id:          'tutorial.area.conquistas',
    reward:      { coins: 20 },
    i18nKey:     'conquistas',
    triggerArea: 'achievements',
    stepDefs: [
      { id: 'ach-welcome', target: null,                                      side: 'bottom', cofrinhoState: 'celebrating', i18nKey: 'step1' },
      { id: 'ach-locked',  target: '[data-tutorial="achievement-locked"]',    side: 'right',  cofrinhoState: 'pointing',    i18nKey: 'step2' },
      { id: 'ach-rewards', target: null,                                      side: 'bottom', cofrinhoState: 'celebrating', i18nKey: 'step3' },
    ],
  },

  RANKING: {
    id:          'tutorial.area.ranking',
    reward:      { coins: 25 },
    i18nKey:     'ranking',
    triggerArea: 'leaderboard',
    stepDefs: [
      { id: 'rank-podium',    target: '[data-tutorial="podium"]',            side: 'bottom', cofrinhoState: 'celebrating', i18nKey: 'step1' },
      { id: 'rank-criterion', target: '[data-tutorial="ranking-subtitle"]',  side: 'bottom', cofrinhoState: 'pointing',    i18nKey: 'step2' },
      { id: 'rank-refresh',   target: '[data-tutorial="refresh-button"]',    side: 'left',   cofrinhoState: 'pointing',    i18nKey: 'step3' },
    ],
  },
}

/**
 * Hook que retorna um tutorial completo (steps traduzidos + reward).
 * Para INITIAL, usa i18nKeyOverride com fullStrings = s (acede a tutorial.steps).
 */
export function useSecondaryTutorialData(key) {
  const s      = useStrings()
  const config = SECONDARY_TUTORIALS[key]
  if (!config) return null

  const namespace = config.i18nKey
    ? s?.secondaryTutorials?.[config.i18nKey]
    : null

  const steps = buildSteps(namespace, config.stepDefs, s)

  return { id: config.id, reward: config.reward, steps, triggerArea: config.triggerArea }
}

export const SECONDARY_TUTORIAL_KEYS = Object.keys(SECONDARY_TUTORIALS)

export const AREA_TO_TUTORIAL_KEY = Object.entries(SECONDARY_TUTORIALS)
  .reduce((acc, [key, config]) => { acc[config.triggerArea] = key; return acc }, {})
