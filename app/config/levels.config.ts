import type { LevelConfig, WorldConfig } from '~/types/Level'

/**
 * Percorso educativo di MateGioco: tre Mondi (tipo di operazione) divisi in Livelli
 * (difficolta' numerica). Solo dati: la generazione degli esercizi sta in useMathEngine,
 * lo stato di avanzamento in useProgression.
 *
 * `starsToUnlock` e' 25 su tutti i livelli: con sessioni da 5 esercizi e una stellina per
 * risposta giusta servono **almeno 5 partite** per avanzare, che e' l'incentivo alla
 * ripetizione voluto dal design. Chi sbaglia qualche risposta ne gioca di piu'.
 */

export const WORLDS: WorldConfig[] = [
  { id: 'sum', nameKey: 'worlds.sum', operation: '+', icon: 'mdi:plus-circle' },
  { id: 'sub', nameKey: 'worlds.sub', operation: '-', icon: 'mdi:minus-circle' },
  { id: 'mix', nameKey: 'worlds.mix', operation: '+', icon: 'mdi:crown' },
  { id: 'mul', nameKey: 'worlds.mul', operation: '*', icon: 'mdi:close-circle' },
  { id: 'div', nameKey: 'worlds.div', operation: '/', icon: 'mdi:division' }
]

export const LEVELS: LevelConfig[] = [
  // Mondo 1: L'Isola delle Somme
  { id: 'sum-1', worldId: 'sum', nameKey: 'levels.sum1', operation: '+', minNumber: 1, maxNumber: 10, starsToUnlock: 25 },
  { id: 'sum-2', worldId: 'sum', nameKey: 'levels.sum2', operation: '+', minNumber: 1, maxNumber: 20, starsToUnlock: 25, unlockReq: 'sum-1' },
  { id: 'sum-3', worldId: 'sum', nameKey: 'levels.sum3', operation: '+', minNumber: 1, maxNumber: 50, starsToUnlock: 25, unlockReq: 'sum-2' },
  { id: 'sum-4', worldId: 'sum', nameKey: 'levels.sum4', operation: '+', minNumber: 1, maxNumber: 100, starsToUnlock: 25, unlockReq: 'sum-3' },

  // Mondo 2: La Valle delle Sottrazioni. Si apre dopo il secondo livello di somme, non
  // dopo tutto il Mondo 1: il design doc voleva alternare le operazioni presto
  { id: 'sub-1', worldId: 'sub', nameKey: 'levels.sub1', operation: '-', minNumber: 1, maxNumber: 10, starsToUnlock: 25, unlockReq: 'sum-2' },
  { id: 'sub-2', worldId: 'sub', nameKey: 'levels.sub2', operation: '-', minNumber: 1, maxNumber: 20, starsToUnlock: 25, unlockReq: 'sub-1' },
  { id: 'sub-3', worldId: 'sub', nameKey: 'levels.sub3', operation: '-', minNumber: 1, maxNumber: 50, starsToUnlock: 25, unlockReq: 'sub-2' },
  { id: 'sub-4', worldId: 'sub', nameKey: 'levels.sub4', operation: '-', minNumber: 1, maxNumber: 100, starsToUnlock: 25, unlockReq: 'sub-3' },

  // Mondo 3: La Grande Sfida. `mixedOperations` dice al motore fra cosa pescare
  { id: 'mix-1', worldId: 'mix', nameKey: 'levels.mix1', operation: '+', minNumber: 1, maxNumber: 100, starsToUnlock: 25, unlockReq: 'sub-4', mixedOperations: ['+', '-'] },

  // Mondo 4: Il Prato delle Tabelline. Si apre dopo la Grande Sfida: moltiplicare presuppone
  // saper sommare in colonna
  { id: 'mul-1', worldId: 'mul', nameKey: 'levels.mul1', operation: '*', minNumber: 1, maxNumber: 20, starsToUnlock: 25, unlockReq: 'mix-1' },
  { id: 'mul-2', worldId: 'mul', nameKey: 'levels.mul2', operation: '*', minNumber: 1, maxNumber: 50, starsToUnlock: 25, unlockReq: 'mul-1' },
  { id: 'mul-3', worldId: 'mul', nameKey: 'levels.mul3', operation: '*', minNumber: 1, maxNumber: 100, starsToUnlock: 25, unlockReq: 'mul-2' },

  // Mondo 5: Lo Stagno delle Divisioni, sempre senza resto. Si apre dopo la prima tabellina,
  // come le sottrazioni si aprivano dopo la seconda somma
  { id: 'div-1', worldId: 'div', nameKey: 'levels.div1', operation: '/', minNumber: 1, maxNumber: 20, starsToUnlock: 25, unlockReq: 'mul-1' },
  { id: 'div-2', worldId: 'div', nameKey: 'levels.div2', operation: '/', minNumber: 1, maxNumber: 50, starsToUnlock: 25, unlockReq: 'div-1' },
  { id: 'div-3', worldId: 'div', nameKey: 'levels.div3', operation: '/', minNumber: 1, maxNumber: 100, starsToUnlock: 25, unlockReq: 'div-2' },

  // La Sfida Suprema: tutte e quattro le operazioni, ultimo livello del percorso
  { id: 'mix-2', worldId: 'mix', nameKey: 'levels.mix2', operation: '+', minNumber: 1, maxNumber: 100, starsToUnlock: 25, unlockReq: 'div-3', mixedOperations: ['+', '-', '*', '/'] }
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
