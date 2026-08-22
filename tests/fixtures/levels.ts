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
  unlockReq: 'sub-4',
  mixedOperations: ['+', '-']
}

export const mockHardSumLevel: LevelConfig = {
  ...mockSumLevel,
  id: 'sum-4',
  nameKey: 'levels.sum4',
  maxNumber: 100
}

export const mockMulLevel: LevelConfig = {
  id: 'mul-1',
  worldId: 'mul',
  nameKey: 'levels.mul1',
  operation: '*',
  minNumber: 1,
  maxNumber: 20,
  starsToUnlock: 8,
  unlockReq: 'mix-1'
}

export const mockDivLevel: LevelConfig = {
  id: 'div-1',
  worldId: 'div',
  nameKey: 'levels.div1',
  operation: '/',
  minNumber: 1,
  maxNumber: 20,
  starsToUnlock: 8,
  unlockReq: 'mul-1'
}

export const mockSupremeLevel: LevelConfig = {
  id: 'mix-2',
  worldId: 'mix',
  nameKey: 'levels.mix2',
  operation: '+',
  minNumber: 1,
  maxNumber: 100,
  starsToUnlock: 8,
  unlockReq: 'div-3',
  mixedOperations: ['+', '-', '*', '/']
}
