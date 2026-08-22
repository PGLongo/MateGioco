import type { Badge } from '~/types/Badge'

/**
 * I Guardiani dei Numeri: un badge per livello completato.
 *
 * L'arte e' un'emoji e non un file: il design doc esprimeva ogni badge come animale-emoji,
 * l'app ne usa gia' nei messaggi di feedback, e cosi' i badge scalano a qualsiasi
 * dimensione senza asset binari in una PWA che deve funzionare offline. Sostituire
 * `emoji` con un percorso a un SVG piu' avanti non tocca la logica ne' i componenti.
 */
export const BADGES: Badge[] = [
  // Mondo 1: animali tropicali e marini
  { id: 'badge-crab', levelId: 'sum-1', emoji: '🦀', nameKey: 'badges.crab.name', descKey: 'badges.crab.desc' },
  { id: 'badge-turtle', levelId: 'sum-2', emoji: '🐢', nameKey: 'badges.turtle.name', descKey: 'badges.turtle.desc' },
  { id: 'badge-parrot', levelId: 'sum-3', emoji: '🦜', nameKey: 'badges.parrot.name', descKey: 'badges.parrot.desc' },
  { id: 'badge-dolphin', levelId: 'sum-4', emoji: '🐬', nameKey: 'badges.dolphin.name', descKey: 'badges.dolphin.desc' },

  // Mondo 2: animali del bosco
  { id: 'badge-squirrel', levelId: 'sub-1', emoji: '🐿️', nameKey: 'badges.squirrel.name', descKey: 'badges.squirrel.desc' },
  { id: 'badge-owl', levelId: 'sub-2', emoji: '🦉', nameKey: 'badges.owl.name', descKey: 'badges.owl.desc' },
  { id: 'badge-fox', levelId: 'sub-3', emoji: '🦊', nameKey: 'badges.fox.name', descKey: 'badges.fox.desc' },
  { id: 'badge-bear', levelId: 'sub-4', emoji: '🐻', nameKey: 'badges.bear.name', descKey: 'badges.bear.desc' },

  // Mondo 3: leggendario
  { id: 'badge-lion', levelId: 'mix-1', emoji: '🦁', nameKey: 'badges.lion.name', descKey: 'badges.lion.desc' }
]

export const getBadge = (id: string): Badge | undefined =>
  BADGES.find(badge => badge.id === id)

export const getBadgeForLevel = (levelId: string): Badge | undefined =>
  BADGES.find(badge => badge.levelId === levelId)
