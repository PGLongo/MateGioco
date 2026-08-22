import { describe, it, expect } from 'vitest'
import { BADGES, getBadgeForLevel } from '../../app/config/badges.config'
import { LEVELS } from '../../app/config/levels.config'

describe('configurazione dei badge', () => {

  it('should give every level exactly one badge', () => {
    // L'invariante del sistema: completare un livello consegna sempre un Guardiano.
    // Aggiungere un Mondo senza i suoi badge fa fallire questo test, non l'interfaccia
    for (const level of LEVELS) {
      expect(getBadgeForLevel(level.id), `manca il badge di ${level.id}`).toBeDefined()
    }

    expect(BADGES).toHaveLength(LEVELS.length)
  })

  it('should not reference levels that do not exist', () => {
    const levelIds = new Set(LEVELS.map(level => level.id))

    for (const badge of BADGES) {
      expect(levelIds.has(badge.levelId), `${badge.id} punta a ${badge.levelId}`).toBe(true)
    }
  })

  it('should use unique ids and unique art', () => {
    expect(new Set(BADGES.map(b => b.id)).size).toBe(BADGES.length)
    expect(new Set(BADGES.map(b => b.emoji)).size).toBe(BADGES.length)
  })
})

describe('configurazione dei livelli', () => {

  it('should reference unlock requirements that exist', () => {
    const ids = new Set(LEVELS.map(level => level.id))

    for (const level of LEVELS) {
      if (level.unlockReq) {
        expect(ids.has(level.unlockReq), `${level.id} richiede ${level.unlockReq}`).toBe(true)
      }
    }
  })

  it('should have exactly one entry level', () => {
    // Un solo livello senza requisiti, altrimenti il percorso avrebbe due inizi
    expect(LEVELS.filter(level => !level.unlockReq)).toHaveLength(1)
  })

  it('should never require a level that comes later in the path', () => {
    // La catena deve andare in avanti: un requisito piu' in basso nella lista renderebbe
    // il livello irraggiungibile
    LEVELS.forEach((level, index) => {
      if (!level.unlockReq) return
      const reqIndex = LEVELS.findIndex(candidate => candidate.id === level.unlockReq)
      expect(reqIndex, `${level.id} richiede un livello successivo`).toBeLessThan(index)
    })
  })

  it('should ask for a positive number of stars on every level', () => {
    for (const level of LEVELS) {
      expect(level.starsToUnlock).toBeGreaterThan(0)
    }
  })
})
