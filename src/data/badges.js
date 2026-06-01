export const BADGES = [
  {
    id:          'aluno-atento',
    icon:        '🎓',
    tutorialId:  'tutorial.area.escola',
    coins:       5,
    accentToken: 'primary',
    name: { pt: 'Aluno Atento',        en: 'Attentive Student'  },
    desc: { pt: 'Você conheceu a Escola e está pronto para aprender!', en: 'You met the School and are ready to learn!' },
  },
  {
    id:          'comerciante-esperto',
    icon:        '🛒',
    tutorialId:  'tutorial.area.feira',
    coins:       10,
    accentToken: 'success',
    name: { pt: 'Comerciante Esperto', en: 'Smart Trader'       },
    desc: { pt: 'Você dominou a Feira do Jutaiteua!',            en: 'You mastered the Jutaiteua Market!' },
  },
  {
    id:          'amigo-dos-bichos',
    icon:        '🐾',
    tutorialId:  'tutorial.area.cooperativa',
    coins:       15,
    accentToken: 'warning',
    name: { pt: 'Amigo dos Bichos',    en: 'Friend of Animals'  },
    desc: { pt: 'Você aprendeu a cuidar dos animais da Cooperativa!', en: 'You learned how to care for the Cooperative animals!' },
  },
  {
    id:          'colecionador',
    icon:        '🏆',
    tutorialId:  'tutorial.area.conquistas',
    coins:       20,
    accentToken: 'warning',
    name: { pt: 'Colecionador',        en: 'Collector'          },
    desc: { pt: 'Você descobriu o mural de Conquistas!',         en: 'You discovered the Achievements wall!' },
  },
  {
    id:          'competidor',
    icon:        '👥',
    tutorialId:  'tutorial.area.ranking',
    coins:       25,
    accentToken: 'danger',
    name: { pt: 'Competidor',          en: 'Competitor'         },
    desc: { pt: 'Você está pronto para subir no Ranking!',       en: 'You are ready to climb the Ranking!' },
  },
]

export const getBadgeById          = (id)         => BADGES.find(b => b.id === id)         ?? null
export const getBadgeByTutorialId  = (tutorialId) => BADGES.find(b => b.tutorialId === tutorialId) ?? null
