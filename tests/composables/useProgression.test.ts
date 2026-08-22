import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { useProgression } from '../../app/composables/useProgression'
import { LEVELS, getLevel } from '../../app/config/levels.config'

/** Soglia di sblocco del livello, letta dalla configurazione: i test descrivono il
 *  comportamento, non il numero di stelline scelto dal prodotto */
const soglia = (id: string): number => getLevel(id)!.starsToUnlock

/** Porta un livello esattamente alla sua soglia */
const completa = (id: string) => useProgression().addStarsTo(id, soglia(id))

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

      // Una stellina sotto la soglia: non basta
      addStarsTo('sum-1', soglia('sum-1') - 1)

      expect(isCompleted('sum-1')).toBe(false)
      expect(isUnlocked('sum-2')).toBe(false)
    })

    it('should unlock the next level when the threshold is reached', () => {
      const { isUnlocked, isCompleted } = useProgression()

      // Soglia raggiunta
      completa('sum-1')

      expect(isCompleted('sum-1')).toBe(true)
      expect(isUnlocked('sum-2')).toBe(true)
    })

    it('should open the subtraction world after the second sum level', () => {
      const { isUnlocked } = useProgression()

      // sub-1 dipende da sum-2, non dall'intero mondo delle somme
      completa('sum-1')
      expect(isUnlocked('sub-1')).toBe(false)

      completa('sum-2')
      expect(isUnlocked('sub-1')).toBe(true)
    })

    it('should keep later levels locked when an earlier one is skipped', () => {
      const { addStarsTo, isUnlocked, isCompleted } = useProgression()

      // Stelline su un livello mai sbloccato non devono aprire nulla a valle
      addStarsTo('sub-3', soglia('sub-3') * 2)

      expect(isUnlocked('sub-3')).toBe(false)
      expect(isCompleted('sub-3')).toBe(false)
      expect(isUnlocked('sub-4')).toBe(false)
      expect(isUnlocked('sum-2')).toBe(false)
    })

    it('should unlock a whole chain only when every step is earned in order', () => {
      const { isUnlocked } = useProgression()

      // Percorso fatto nell'ordine giusto: la catena si apre
      for (const id of ['sum-1', 'sum-2', 'sub-1', 'sub-2', 'sub-3']) completa(id)

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
      const { currentLevel } = useProgression()

      completa('sum-1')

      // Il livello su cui lavorare diventa il successivo sbloccato e non completato
      expect(currentLevel.value.id).toBe('sum-2')
    })

    it('should stay on the last unlocked level when everything is completed', () => {
      const { addStarsTo, currentLevel } = useProgression()

      // Completa tutto il percorso, qualunque sia la sua lunghezza: cosi' il test non si
      // rompe quando si aggiungono Mondi
      for (const level of LEVELS) {
        addStarsTo(level.id, level.starsToUnlock)
      }

      // Non resta nulla da sbloccare: si continua a giocare l'ultimo livello
      expect(currentLevel.value.id).toBe(LEVELS[LEVELS.length - 1]!.id)
    })
  })

  describe('catena dei Mondi nuovi', () => {
    it('should open the multiplication world after the great challenge', () => {
      const { isUnlocked } = useProgression()

      // Le tabelline presuppongono somme e sottrazioni: si aprono dopo mix-1
      for (const id of ['sum-1', 'sum-2', 'sum-3', 'sum-4', 'sub-1', 'sub-2', 'sub-3', 'sub-4']) completa(id)
      expect(isUnlocked('mul-1')).toBe(false)

      completa('mix-1')
      expect(isUnlocked('mul-1')).toBe(true)
      expect(isUnlocked('div-1')).toBe(false)
    })

    it('should open the division world after the first multiplication level', () => {
      const { isUnlocked } = useProgression()

      for (const id of ['sum-1', 'sum-2', 'sum-3', 'sum-4', 'sub-1', 'sub-2', 'sub-3', 'sub-4', 'mix-1', 'mul-1']) completa(id)

      // Dividere presuppone la prima tabellina, non tutte
      expect(isUnlocked('div-1')).toBe(true)
      expect(isUnlocked('mul-2')).toBe(true)
      expect(isUnlocked('mix-2')).toBe(false)
    })

    it('should keep the supreme challenge locked until every division is done', () => {
      const { isUnlocked } = useProgression()

      for (const level of LEVELS) {
        if (level.id !== 'div-3' && level.id !== 'mix-2') completa(level.id)
      }
      expect(isUnlocked('mix-2')).toBe(false)

      completa('div-3')
      expect(isUnlocked('mix-2')).toBe(true)
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

      expect(starsToNextLevel('sum-1')).toBe(soglia('sum-1'))

      addStarsTo('sum-1', 5)
      expect(starsToNextLevel('sum-1')).toBe(soglia('sum-1') - 5)

      // Oltre la soglia non scende sotto zero
      addStarsTo('sum-1', soglia('sum-1'))
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
        levelStars: { 'sum-1': 4 },
        badges: {},
        legacyStars: 0
      })
    })

    it('should load a progression saved by a previous session', () => {
      localStorage.setItem('mategioco-progression', JSON.stringify({ levelStars: { 'sum-1': soglia('sum-1'), 'sum-2': 2 } }))

      const { loadProgression, starsOn, isUnlocked } = useProgression()
      loadProgression()

      expect(starsOn('sum-1')).toBe(soglia('sum-1'))
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

describe('useProgression - badge', () => {
  beforeEach(() => {
    localStorage.clear()
    useProgression().resetProgression()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should award no badge before any level is completed', () => {
    const { checkForNewBadges, unlockedBadges } = useProgression()

    // Una stellina sotto la soglia: livello non completato, nessun badge
    useProgression().addStarsTo('sum-1', soglia('sum-1') - 1)

    expect(checkForNewBadges()).toEqual([])
    expect(unlockedBadges.value).toEqual([])
  })

  it('should award the badge of a completed level', () => {
    const { checkForNewBadges, isBadgeUnlocked } = useProgression()

    completa('sum-1')
    const nuovi = checkForNewBadges()

    // Il granchio e' il guardiano del primo livello
    expect(nuovi.map(b => b.id)).toEqual(['badge-crab'])
    expect(isBadgeUnlocked('badge-crab')).toBe(true)
  })

  it('should return a new badge only once', () => {
    const { checkForNewBadges, unlockedBadges } = useProgression()

    completa('sum-1')
    checkForNewBadges()

    // Seconda sessione sullo stesso livello: niente da festeggiare di nuovo
    expect(checkForNewBadges()).toEqual([])
    expect(unlockedBadges.value).toHaveLength(1)
  })

  it('should award several badges at once when more levels are completed', () => {
    const { checkForNewBadges } = useProgression()

    // Progressione caricata da un salvataggio con due livelli gia' completati
    completa('sum-1')
    completa('sum-2')

    expect(checkForNewBadges().map(b => b.id)).toEqual(['badge-crab', 'badge-turtle'])
  })

  it('should not award a badge for a level completed out of order', () => {
    const { addStarsTo, checkForNewBadges } = useProgression()

    // sub-3 ha la soglia ma non era sbloccato: la catena stretta vale anche per i badge
    addStarsTo('sub-3', soglia('sub-3'))

    expect(checkForNewBadges()).toEqual([])
  })

  it('should record when the badge was unlocked', () => {
    const { checkForNewBadges, badgeUnlockedAt } = useProgression()

    completa('sum-1')
    checkForNewBadges()

    // La bacheca mostra la data di conquista
    expect(badgeUnlockedAt('badge-crab')).toMatch(/^\d{4}-\d{2}-\d{2}T/)
  })

  it('should persist unlocked badges', async () => {
    const { checkForNewBadges } = useProgression()

    completa('sum-1')
    checkForNewBadges()
    await Promise.resolve()

    const salvato = JSON.parse(localStorage.getItem('mategioco-progression')!)
    expect(Object.keys(salvato.badges)).toEqual(['badge-crab'])
  })

  it('should keep working with a progression saved before badges existed', () => {
    // Salvataggio della versione precedente: nessun campo badges
    localStorage.setItem('mategioco-progression', JSON.stringify({ levelStars: { 'sum-1': soglia('sum-1') } }))

    const { loadProgression, checkForNewBadges, unlockedBadges } = useProgression()
    loadProgression()

    // Il badge arretrato viene assegnato, non perso
    expect(checkForNewBadges().map(b => b.id)).toEqual(['badge-crab'])
    expect(unlockedBadges.value).toHaveLength(1)
  })
})


describe('useProgression - totale delle stelline', () => {
  beforeEach(() => {
    localStorage.clear()
    useProgression().resetProgression()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should sum the stars of every level', () => {
    const { addStarsTo, totalStars } = useProgression()

    // Il totale dell'header e' derivato, non un contatore parallelo che puo' divergere
    addStarsTo('sum-1', 8)
    addStarsTo('sum-2', 3)

    expect(totalStars.value).toBe(11)
  })

  it('should start from zero', () => {
    expect(useProgression().totalStars.value).toBe(0)
  })

  it('should recover the stars saved before levels existed', () => {
    // Un bambino che aveva giocato la versione senza livelli: nessuna progressione salvata,
    // 42 stelline sulla vecchia chiave
    localStorage.clear()
    localStorage.setItem('mategioco-stars', '42')

    const { loadProgression, totalStars } = useProgression()
    loadProgression()

    // Non sono attribuibili a un livello, ma non vengono perse
    expect(totalStars.value).toBe(42)
  })

  it('should add new level stars on top of the recovered ones', () => {
    localStorage.clear()
    localStorage.setItem('mategioco-stars', '42')

    const { loadProgression, addStarsTo, totalStars } = useProgression()
    loadProgression()
    addStarsTo('sum-1', 3)

    expect(totalStars.value).toBe(45)
  })

  it('should recover the old stars only once', async () => {
    localStorage.clear()
    localStorage.setItem('mategioco-stars', '42')

    const { loadProgression, totalStars } = useProgression()
    loadProgression()
    await Promise.resolve()

    // Un secondo caricamento non le somma di nuovo: il campo e' gia' salvato
    loadProgression()

    expect(totalStars.value).toBe(42)
  })

  it('should ignore a corrupted legacy value', () => {
    localStorage.clear()
    localStorage.setItem('mategioco-stars', 'tante')

    const { loadProgression, totalStars } = useProgression()
    loadProgression()

    expect(totalStars.value).toBe(0)
  })
})


describe('useProgression - soglia alzata', () => {
  beforeEach(() => {
    localStorage.clear()
    useProgression().resetProgression()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should require at least five perfect sessions per level', () => {
    // Cinque esercizi per sessione, una stellina per risposta giusta
    const sessioniPerfette = Math.ceil(soglia('sum-1') / 5)

    expect(sessioniPerfette).toBeGreaterThanOrEqual(5)
  })

  it('should keep a level completed when the threshold is raised afterwards', () => {
    // Progressione salvata quando la soglia era 8: il livello era stato superato e il suo
    // Guardiano conquistato. Alzando la soglia a 25 non deve tornare bloccato
    localStorage.setItem('mategioco-progression', JSON.stringify({
      levelStars: { 'sum-1': 8 },
      badges: { 'badge-crab': '2026-08-22T10:00:00.000Z' },
      legacyStars: 0
    }))

    const { loadProgression, isCompleted, isUnlocked } = useProgression()
    loadProgression()

    expect(isCompleted('sum-1')).toBe(true)
    expect(isUnlocked('sum-2')).toBe(true)
  })

  it('should not grant completion to a level whose badge was never earned', () => {
    // Stelline sotto la soglia e nessun badge: il livello resta da finire
    localStorage.setItem('mategioco-progression', JSON.stringify({
      levelStars: { 'sum-1': 8 },
      badges: {},
      legacyStars: 0
    }))

    const { loadProgression, isCompleted, isUnlocked } = useProgression()
    loadProgression()

    expect(isCompleted('sum-1')).toBe(false)
    expect(isUnlocked('sum-2')).toBe(false)
  })

  it('should carry the grandfathered completion down the chain', () => {
    // Chi era arrivato alle sottrazioni con la soglia vecchia le mantiene sbloccate
    localStorage.setItem('mategioco-progression', JSON.stringify({
      levelStars: { 'sum-1': 8, 'sum-2': 8 },
      badges: { 'badge-crab': '2026-08-22T10:00:00.000Z', 'badge-turtle': '2026-08-22T10:00:00.000Z' },
      legacyStars: 0
    }))

    const { loadProgression, isUnlocked } = useProgression()
    loadProgression()

    expect(isUnlocked('sub-1')).toBe(true)
  })
})
