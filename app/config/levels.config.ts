import type { LevelConfig, WorldConfig } from '~/types/Level'

/**
 * Percorso educativo di MateGioco: tre Mondi (tipo di operazione) divisi in Livelli
 * (difficolta' numerica). Solo dati: la generazione degli esercizi sta in useMathEngine,
 * lo stato di avanzamento in useProgression.
 *
 * `starsToUnlock` e' 8 su tutti i livelli: con sessioni da 5 esercizi serve piu' di una
 * partita per avanzare, che e' l'incentivo alla ripetizione voluto dal design.
 */

export const WORLDS: WorldConfig[] = [
  { id: 'sum', nameKey: 'worlds.sum', operation: '+', icon: 'mdi:plus-circle' },
  { id: 'sub', nameKey: 'worlds.sub', operation: '-', icon: 'mdi:minus-circle' },
  { id: 'mix', nameKey: 'worlds.mix', operation: '+', icon: 'mdi:crown' }
]

export const LEVELS: LevelConfig[] = [
  // Mondo 1: L'Isola delle Somme
  { id: 'sum-1', worldId: 'sum', nameKey: 'levels.sum1', operation: '+', minNumber: 1, maxNumber: 10, starsToUnlock: 8 },
  { id: 'sum-2', worldId: 'sum', nameKey: 'levels.sum2', operation: '+', minNumber: 1, maxNumber: 20, starsToUnlock: 8, unlockReq: 'sum-1' },
  { id: 'sum-3', worldId: 'sum', nameKey: 'levels.sum3', operation: '+', minNumber: 1, maxNumber: 50, starsToUnlock: 8, unlockReq: 'sum-2' },
  { id: 'sum-4', worldId: 'sum', nameKey: 'levels.sum4', operation: '+', minNumber: 1, maxNumber: 100, starsToUnlock: 8, unlockReq: 'sum-3' },

  // Mondo 2: La Valle delle Sottrazioni. Si apre dopo il secondo livello di somme, non
  // dopo tutto il Mondo 1: il design doc voleva alternare le operazioni presto
  { id: 'sub-1', worldId: 'sub', nameKey: 'levels.sub1', operation: '-', minNumber: 1, maxNumber: 10, starsToUnlock: 8, unlockReq: 'sum-2' },
  { id: 'sub-2', worldId: 'sub', nameKey: 'levels.sub2', operation: '-', minNumber: 1, maxNumber: 20, starsToUnlock: 8, unlockReq: 'sub-1' },
  { id: 'sub-3', worldId: 'sub', nameKey: 'levels.sub3', operation: '-', minNumber: 1, maxNumber: 50, starsToUnlock: 8, unlockReq: 'sub-2' },
  { id: 'sub-4', worldId: 'sub', nameKey: 'levels.sub4', operation: '-', minNumber: 1, maxNumber: 100, starsToUnlock: 8, unlockReq: 'sub-3' },

  // Mondo 3: La Grande Sfida. `operation` qui e' indicativa: useMathEngine alterna somme
  // e sottrazioni quando il livello appartiene al mondo 'mix'
  { id: 'mix-1', worldId: 'mix', nameKey: 'levels.mix1', operation: '+', minNumber: 1, maxNumber: 100, starsToUnlock: 8, unlockReq: 'sub-4' }
]

/** Il primo livello del percorso: sempre sbloccato, non ha requisiti */
export const FIRST_LEVEL_ID = 'sum-1'

export const getLevel = (id: string): LevelConfig | undefined =>
  LEVELS.find(level => level.id === id)

export const getWorldLevels = (worldId: string): LevelConfig[] =>
  LEVELS.filter(level => level.worldId === worldId)

export const getWorld = (worldId: string): WorldConfig | undefined =>
  WORLDS.find(world => world.id === worldId)

/** Posizione del livello dentro il suo mondo, a partire da 1: e' quella mostrata all'utente */
export const getLevelNumber = (id: string): number => {
  const level = getLevel(id)
  if (!level) return 0

  return getWorldLevels(level.worldId).findIndex(candidate => candidate.id === id) + 1
}
