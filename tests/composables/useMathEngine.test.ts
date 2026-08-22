import { describe, it, expect } from 'vitest'
import { useMathEngine } from '../../app/composables/useMathEngine'
import { mockSumLevel, mockSubLevel, mockMixLevel, mockHardSumLevel } from '../fixtures/levels'

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
