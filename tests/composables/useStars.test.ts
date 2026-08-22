import { describe, it, expect, beforeEach } from 'vitest'
import { useStars } from '../../app/composables/useStars'

describe('useStars', () => {
  beforeEach(() => {
    // Azzera sia la persistenza sia lo stato in memoria: il composable e' un singleton
    // di modulo, quindi lo stato sopravvive fra i test dello stesso file
    localStorage.clear()
    useStars().resetStars()
  })

  it('should share the same counter across separate calls', () => {
    // Due consumatori distinti, come header e pagina di gioco
    const header = useStars()
    const gamePage = useStars()

    // La pagina di gioco accredita una stellina
    gamePage.addStars()

    // L'header deve vederla senza ricaricare: era il difetto per cui il contatore
    // restava fermo a zero
    expect(header.totalStars.value).toBe(1)
  })

  it('should persist the counter in localStorage', async () => {
    const { addStars } = useStars()

    // Tre risposte corrette
    addStars()
    addStars(2)

    // Il watch di auto-save e' asincrono: attende il flush del microtask
    await Promise.resolve()

    expect(localStorage.getItem('mategioco-stars')).toBe('3')
  })

  it('should load the counter already saved in localStorage', () => {
    // Simula una sessione precedente
    localStorage.setItem('mategioco-stars', '7')

    const { loadStars, totalStars } = useStars()
    loadStars()

    expect(totalStars.value).toBe(7)
  })

  it('should treat a corrupted stored value as zero', () => {
    // Un valore non numerico non deve propagare NaN nell'interfaccia
    localStorage.setItem('mategioco-stars', 'non-un-numero')

    const { loadStars, totalStars } = useStars()
    loadStars()

    expect(totalStars.value).toBe(0)
  })
})
