/**
 * Catálogo da loja do Miriti.
 * kind: 'energy' (recarrega energia) | 'hint' (dicas de quiz) | 'mascot' (cosmético)
 */
export const SHOP_ITEMS = [
  {
    id: 'energy_refill',
    kind: 'energy',
    icon: '⚡',
    price: 60,
    name: { pt: 'Recarga de Energia', en: 'Energy Refill' },
    desc: { pt: 'Enche toda a sua energia na hora', en: 'Instantly fills all your energy' }
  },
  {
    id: 'hint_pack',
    kind: 'hint',
    payload: 3,
    icon: '💡',
    price: 45,
    name: { pt: 'Pacote de 3 Dicas', en: 'Pack of 3 Hints' },
    desc: { pt: 'A dica elimina 2 respostas erradas no quiz', en: 'A hint removes 2 wrong answers in the quiz' }
  },
  {
    id: 'mascot_monkey',
    kind: 'mascot',
    payload: '🐵',
    icon: '🐵',
    price: 100,
    name: { pt: 'Mascote Macaco', en: 'Monkey Mascot' },
    desc: { pt: 'Um macaquinho levado para a fazenda', en: 'A playful little monkey for the farm' }
  },
  {
    id: 'mascot_sloth',
    kind: 'mascot',
    payload: '🦥',
    icon: '🦥',
    price: 130,
    name: { pt: 'Mascote Bicho-Preguiça', en: 'Sloth Mascot' },
    desc: { pt: 'Calmo e tranquilo, igual a uma boa poupança', en: 'Calm and slow, just like good savings' }
  },
  {
    id: 'mascot_frog',
    kind: 'mascot',
    payload: '🐸',
    icon: '🐸',
    price: 110,
    name: { pt: 'Mascote Sapo', en: 'Frog Mascot' },
    desc: { pt: 'Um sapinho saltitante da floresta', en: 'A hopping little forest frog' }
  },
  {
    id: 'mascot_turtle',
    kind: 'mascot',
    payload: '🐢',
    icon: '🐢',
    price: 150,
    name: { pt: 'Mascote Tartaruga', en: 'Turtle Mascot' },
    desc: { pt: 'Devagar e sempre, ela alcança suas metas', en: 'Slow and steady, it reaches its goals' }
  }
]
