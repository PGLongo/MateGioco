import type { LevelConfig } from '~/types/Level'

export const mockSumLevel: LevelConfig = {
  id: 'sum-1',
  worldId: 'sum',
  nameKey: 'levels.sum1',
  operation: '+',
  minNumber: 1,
  maxNumber: 10,
  starsToUnlock: 8
}

export const mockSubLevel: LevelConfig = {
  id: 'sub-1',
  worldId: 'sub',
  nameKey: 'levels.sub1',
  operation: '-',
  minNumber: 1,
  maxNumber: 10,
  starsToUnlock: 8,
  unlockReq: 'sum-2'
}

export const mockMixLevel: LevelConfig = {
  id: 'mix-1',
  worldId: 'mix',
  nameKey: 'levels.mix1',
  operation: '+',
  minNumber: 1,
  maxNumber: 100,
  starsToUnlock: 8,
  unlockReq: 'sub-4'
}

export const mockHardSumLevel: LevelConfig = {
  ...mockSumLevel,
  id: 'sum-4',
  nameKey: 'levels.sum4',
  maxNumber: 100
}
