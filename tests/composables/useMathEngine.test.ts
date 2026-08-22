import { describe, it, expect } from 'vitest'
import { useMathEngine } from '../../app/composables/useMathEngine'
import { mockSumLevel, mockSubLevel, mockMixLevel, mockHardSumLevel, mockMulLevel, mockDivLevel, mockSupremeLevel } from '../fixtures/levels'

// Gli esercizi sono casuali: ogni invariante si verifica su molte generazioni, non su una
const RUNS = 300

describe('useMathEngine', () => {

  describe('somme', () => {
    it('should never produce a result above the level ceiling', () => {
      const { generateExercise } = useMathEngine()

      // Livello "entro 10": nessun risultato puo' superarlo
      for (let i = 0; i < RUNS; i++) {
        const exercise = generateExercise(mockSumLevel)
        expect(exercise.correctAnswer).toBeLessThanOrEqual(mockSumLevel.maxNumber)
        expect(exercise.correctAnswer).toBe(exercise.num1 + exercise.num2)
      }
    })

    it('should use the level range on a harder level', () => {
      const { generateExercise } = useMathEngine()

      // Livello "entro 100": il tetto sale, l'invariante resta
      for (let i = 0; i < RUNS; i++) {
        const exercise = generateExercise(mockHardSumLevel)
        expect(exercise.correctAnswer).toBeLessThanOrEqual(100)
        expect(exercise.operator).toBe('+')
      }
    })
  })

  describe('sottrazioni', () => {
    it('should never produce a negative result', () => {
      const { generateExercise } = useMathEngine()

      // Il vincolo non negoziabile: i numeri negativi non esistono per un bambino di 4 anni
      for (let i = 0; i < RUNS; i++) {
        const exercise = generateExercise(mockSubLevel)
        expect(exercise.operator).toBe('-')
        expect(exercise.correctAnswer).toBeGreaterThanOrEqual(0)
        expect(exercise.num1).toBeGreaterThanOrEqual(exercise.num2)
      }
    })

    it('should keep the minuend within the level ceiling', () => {
      const { generateExercise } = useMathEngine()

      for (let i = 0; i < RUNS; i++) {
        const exercise = generateExercise(mockSubLevel)
        expect(exercise.num1).toBeLessThanOrEqual(mockSubLevel.maxNumber)
      }
    })
  })

  describe('mondo misto', () => {
    it('should alternate additions and subtractions', () => {
      const { generateSession } = useMathEngine()

      // Su 300 esercizi devono comparire entrambe le operazioni: e' il senso della sfida finale
      const operators = new Set(generateSession(mockMixLevel, RUNS).map(e => e.operator))

      expect(operators.has('+')).toBe(true)
      expect(operators.has('-')).toBe(true)
    })

    it('should respect both invariants whichever operation comes up', () => {
      const { generateSession } = useMathEngine()

      for (const exercise of generateSession(mockMixLevel, RUNS)) {
        expect(exercise.correctAnswer).toBeGreaterThanOrEqual(0)
        expect(exercise.correctAnswer).toBeLessThanOrEqual(mockMixLevel.maxNumber)
      }
    })
  })

  describe('sessione', () => {
    it('should generate exactly the requested number of exercises', () => {
      const { generateSession } = useMathEngine()

      expect(generateSession(mockSumLevel, 5)).toHaveLength(5)
    })

    it('should format an exercise as a readable question', () => {
      const { formatExercise } = useMathEngine()

      expect(formatExercise({ num1: 3, num2: 4, operator: '+', correctAnswer: 7 })).toBe('3 + 4 = ?')
    })
  })
})

describe('useMathEngine - moltiplicazioni e divisioni', () => {

  describe('moltiplicazioni', () => {
    it('should never produce a product above the level ceiling', () => {
      const { generateExercise } = useMathEngine()

      for (let i = 0; i < RUNS; i++) {
        const exercise = generateExercise(mockMulLevel)
        expect(exercise.operator).toBe('×')
        expect(exercise.correctAnswer).toBe(exercise.num1 * exercise.num2)
        expect(exercise.correctAnswer).toBeLessThanOrEqual(mockMulLevel.maxNumber)
      }
    })

    it('should never use zero as a factor', () => {
      const { generateExercise } = useMathEngine()

      // Moltiplicare per zero non insegna la tabellina, insegna solo che fa zero
      for (let i = 0; i < RUNS; i++) {
        const exercise = generateExercise(mockMulLevel)
        expect(exercise.num1).toBeGreaterThanOrEqual(1)
        expect(exercise.num2).toBeGreaterThanOrEqual(1)
      }
    })
  })

  describe('divisioni', () => {
    it('should never leave a remainder', () => {
      const { generateExercise } = useMathEngine()

      // Il vincolo che giustifica la costruzione al contrario dell'esercizio
      for (let i = 0; i < RUNS; i++) {
        const exercise = generateExercise(mockDivLevel)
        expect(exercise.operator).toBe('÷')
        expect(exercise.num1 % exercise.num2).toBe(0)
        expect(exercise.correctAnswer).toBe(exercise.num1 / exercise.num2)
      }
    })

    it('should never divide by zero', () => {
      const { generateExercise } = useMathEngine()

      for (let i = 0; i < RUNS; i++) {
        expect(generateExercise(mockDivLevel).num2).toBeGreaterThanOrEqual(1)
      }
    })

    it('should also propose divisions by one', () => {
      const { generateSession } = useMathEngine()

      // Non e' un caso degenere da escludere: che dividere per uno non cambi il numero
      // e' uno dei concetti che il livello deve insegnare
      const divisions = generateSession(mockDivLevel, RUNS)

      expect(divisions.some(e => e.num2 === 1)).toBe(true)
    })

    it('should keep the dividend within the level ceiling', () => {
      const { generateExercise } = useMathEngine()

      for (let i = 0; i < RUNS; i++) {
        expect(generateExercise(mockDivLevel).num1).toBeLessThanOrEqual(mockDivLevel.maxNumber)
      }
    })
  })

  describe('sfida suprema', () => {
    it('should draw from all four operations', () => {
      const { generateSession } = useMathEngine()

      // Il livello finale mescola tutto: su 300 esercizi devono comparire tutti gli operatori
      const operators = new Set(generateSession(mockSupremeLevel, RUNS).map(e => e.operator))

      expect([...operators].sort()).toEqual(['+', '-', '÷', '×'].sort())
    })

    it('should respect every invariant whichever operation comes up', () => {
      const { generateSession } = useMathEngine()

      for (const exercise of generateSession(mockSupremeLevel, RUNS)) {
        expect(exercise.correctAnswer).toBeGreaterThanOrEqual(0)
        expect(exercise.correctAnswer).toBeLessThanOrEqual(mockSupremeLevel.maxNumber)
        if (exercise.operator === '÷') expect(exercise.num1 % exercise.num2).toBe(0)
      }
    })

    it('should keep a level without mixedOperations on its own operation', () => {
      const { generateSession } = useMathEngine()

      // mul-1 non e' un livello-sfida: solo moltiplicazioni
      const operators = new Set(generateSession(mockMulLevel, 50).map(e => e.operator))

      expect([...operators]).toEqual(['×'])
    })
  })
})


describe('useMathEngine - varieta della sessione', () => {

  it('should not repeat the same exercise inside a session', () => {
    const { generateSession } = useMathEngine()

    // Tre volte "8 + 2" su cinque domande fa sembrare il gioco rotto: capitava nel 30%
    // delle sessioni perche' ogni esercizio veniva sorteggiato indipendentemente
    for (let sessione = 0; sessione < 200; sessione++) {
      const chiavi = generateSession(mockSumLevel, 5).map(e => `${e.num1}${e.operator}${e.num2}`)
      expect(new Set(chiavi).size).toBe(chiavi.length)
    }
  })

  it('should not repeat exercises on the harder levels either', () => {
    const { generateSession } = useMathEngine()

    for (const livello of [mockHardSumLevel, mockSubLevel, mockMulLevel, mockDivLevel]) {
      const chiavi = generateSession(livello, 5).map(e => `${e.num1}${e.operator}${e.num2}`)
      expect(new Set(chiavi).size).toBe(chiavi.length)
    }
  })

  it('should still fill a session when the space is smaller than it', () => {
    const { generateSession } = useMathEngine()

    // Livello minuscolo: due sole somme possibili (1+1, 1+2, 2+1). Meglio un doppione
    // che una domanda in meno
    const minuscolo = { ...mockSumLevel, maxNumber: 3 }

    expect(generateSession(minuscolo, 5)).toHaveLength(5)
  })

  it('should spread exercises across the whole space', () => {
    const { generateSession } = useMathEngine()

    // La generazione sequenziale concentrava l'11% delle domande su "9 + 1", perche' con
    // il primo addendo a 9 il secondo non poteva che essere 1
    const conteggi = new Map<string, number>()
    let totale = 0
    for (let i = 0; i < 200; i++) {
      for (const e of generateSession(mockSumLevel, 5)) {
        const chiave = `${e.num1}+${e.num2}`
        conteggi.set(chiave, (conteggi.get(chiave) ?? 0) + 1)
        totale++
      }
    }

    // Su 45 coppie valide ne devono comparire molte, e nessuna deve dominare
    expect(conteggi.size).toBeGreaterThan(30)
    const massimo = Math.max(...conteggi.values()) / totale
    expect(massimo).toBeLessThan(0.06)
  })
})
