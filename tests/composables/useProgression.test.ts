import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { useProgression } from '../../app/composables/useProgression'

describe('useProgression', () => {
  beforeEach(() => {
    // Progressione azzerata: il composable e' un singleton di modulo e lo stato
    // sopravvive fra i test dello stesso file
    localStorage.clear()
    useProgression().resetProgression()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('sblocco', () => {
    it('should start with only the first level unlocked', () => {
      const { isUnlocked } = useProgression()

      // Il primo livello non ha requisiti, tutti gli altri sì
      expect(isUnlocked('sum-1')).toBe(true)
      expect(isUnlocked('sum-2')).toBe(false)
      expect(isUnlocked('sub-1')).toBe(false)
      expect(isUnlocked('mix-1')).toBe(false)
    })

    it('should not unlock the next level before the threshold is reached', () => {
      const { addStarsTo, isUnlocked, isCompleted } = useProgression()

      // Sette stelline su otto: una partita da 5 piu' una parziale non bastano
      addStarsTo('sum-1', 7)

      expect(isCompleted('sum-1')).toBe(false)
      expect(isUnlocked('sum-2')).toBe(false)
    })

    it('should unlock the next level when the threshold is reached', () => {
      const { addStarsTo, isUnlocked, isCompleted } = useProgression()

      // Otto stelline: soglia raggiunta
      addStarsTo('sum-1', 8)

      expect(isCompleted('sum-1')).toBe(true)
      expect(isUnlocked('sum-2')).toBe(true)
    })

    it('should open the subtraction world after the second sum level', () => {
      const { addStarsTo, isUnlocked } = useProgression()

      // sub-1 dipende da sum-2, non dall'intero mondo delle somme
      addStarsTo('sum-1', 8)
      expect(isUnlocked('sub-1')).toBe(false)

      addStarsTo('sum-2', 8)
      expect(isUnlocked('sub-1')).toBe(true)
    })

    it('should keep later levels locked when an earlier one is skipped', () => {
      const { addStarsTo, isUnlocked, isCompleted } = useProgression()

      // Stelline su un livello mai sbloccato non devono aprire nulla a valle
      addStarsTo('sub-3', 50)

      expect(isUnlocked('sub-3')).toBe(false)
      expect(isCompleted('sub-3')).toBe(false)
      expect(isUnlocked('sub-4')).toBe(false)
      expect(isUnlocked('sum-2')).toBe(false)
    })

    it('should unlock a whole chain only when every step is earned in order', () => {
      const { addStarsTo, isUnlocked } = useProgression()

      // Percorso fatto nell'ordine giusto: la catena si apre
      addStarsTo('sum-1', 8)
      addStarsTo('sum-2', 8)
      addStarsTo('sub-1', 8)
      addStarsTo('sub-2', 8)
      addStarsTo('sub-3', 8)

      expect(isUnlocked('sub-4')).toBe(true)
      expect(isUnlocked('mix-1')).toBe(false)
    })
  })

  describe('livello corrente', () => {
    it('should point at the first level on a fresh start', () => {
      const { currentLevel } = useProgression()

      expect(currentLevel.value.id).toBe('sum-1')
    })

    it('should advance to the next level once the current one is completed', () => {
      const { addStarsTo, currentLevel } = useProgression()

      addStarsTo('sum-1', 8)

      // Il livello su cui lavorare diventa il successivo sbloccato e non completato
      expect(currentLevel.value.id).toBe('sum-2')
    })

    it('should stay on the last unlocked level when everything is completed', () => {
      const { addStarsTo, currentLevel } = useProgression()

      // Completa tutto il percorso
      for (const id of ['sum-1', 'sum-2', 'sum-3', 'sum-4', 'sub-1', 'sub-2', 'sub-3', 'sub-4', 'mix-1']) {
        addStarsTo(id, 8)
      }

      // Non resta nulla da sbloccare: si continua a giocare l'ultimo livello
      expect(currentLevel.value.id).toBe('mix-1')
    })
  })

  describe('conteggio stelline', () => {
    it('should count stars per level, not globally', () => {
      const { addStarsTo, starsOn } = useProgression()

      addStarsTo('sum-1', 3)
      addStarsTo('sub-1', 5)

      expect(starsOn('sum-1')).toBe(3)
      expect(starsOn('sub-1')).toBe(5)
      expect(starsOn('sum-2')).toBe(0)
    })

    it('should accumulate stars across sessions on the same level', () => {
      const { addStarsTo, starsOn } = useProgression()

      // Due partite sullo stesso livello
      addStarsTo('sum-1', 4)
      addStarsTo('sum-1', 3)

      expect(starsOn('sum-1')).toBe(7)
    })

    it('should ignore non-positive amounts', () => {
      const { addStarsTo, starsOn } = useProgression()

      addStarsTo('sum-1', 0)
      addStarsTo('sum-1', -5)

      expect(starsOn('sum-1')).toBe(0)
    })

    it('should report how many stars are missing to the next level', () => {
      const { addStarsTo, starsToNextLevel } = useProgression()

      expect(starsToNextLevel('sum-1')).toBe(8)

      addStarsTo('sum-1', 5)
      expect(starsToNextLevel('sum-1')).toBe(3)

      // Oltre la soglia non scende sotto zero
      addStarsTo('sum-1', 10)
      expect(starsToNextLevel('sum-1')).toBe(0)
    })

    it('should return zero for an unknown level id', () => {
      const { starsOn, starsToNextLevel, isUnlocked, isCompleted } = useProgression()

      // Un id che non esiste piu' (config cambiata) non deve far esplodere l'interfaccia
      expect(starsOn('livello-inesistente')).toBe(0)
      expect(starsToNextLevel('livello-inesistente')).toBe(0)
      expect(isUnlocked('livello-inesistente')).toBe(false)
      expect(isCompleted('livello-inesistente')).toBe(false)
    })
  })

  describe('persistenza', () => {
    it('should save the progression in localStorage', async () => {
      const { addStarsTo } = useProgression()

      addStarsTo('sum-1', 4)
      await Promise.resolve()

      expect(JSON.parse(localStorage.getItem('mategioco-progression')!)).toEqual({
        levelStars: { 'sum-1': 4 }
      })
    })

    it('should load a progression saved by a previous session', () => {
      localStorage.setItem('mategioco-progression', JSON.stringify({ levelStars: { 'sum-1': 8, 'sum-2': 2 } }))

      const { loadProgression, starsOn, isUnlocked } = useProgression()
      loadProgression()

      expect(starsOn('sum-1')).toBe(8)
      expect(starsOn('sum-2')).toBe(2)
      expect(isUnlocked('sum-2')).toBe(true)
    })

    it('should fall back to an empty progression when the stored data is corrupted', () => {
      localStorage.setItem('mategioco-progression', 'non-e-json')

      const { loadProgression, starsOn, isUnlocked } = useProgression()
      loadProgression()

      // Meglio ricominciare che rompere il gioco
      expect(starsOn('sum-1')).toBe(0)
      expect(isUnlocked('sum-1')).toBe(true)
      expect(console.error).toHaveBeenCalled()
    })
  })
})
