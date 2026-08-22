import { describe, it, expect } from 'vitest'
import { useExercises } from '../../app/composables/useExercises'
import { mockSubLevel, mockHardSumLevel } from '../fixtures/levels'

describe('useExercises', () => {

  it('should generate a session of five exercises on the first level by default', () => {
    const { generateExercises, exercises, currentLevel } = useExercises()

    // Nessun livello passato: si parte dal primo del percorso
    generateExercises()

    expect(exercises.value).toHaveLength(5)
    expect(currentLevel.value.id).toBe('sum-1')
  })

  it('should generate exercises for the level it is given', () => {
    const { generateExercises, exercises, currentLevel } = useExercises()

    // Sessione sul livello di sottrazioni
    generateExercises(mockSubLevel)

    expect(currentLevel.value.id).toBe('sub-1')
    expect(exercises.value.every(e => e.operator === '-')).toBe(true)
  })

  it('should keep the level when the session is restarted', () => {
    const { generateExercises, resetSession, currentLevel, exercises } = useExercises()

    // Il bambino gioca un livello difficile e chiede "nuova sessione"
    generateExercises(mockHardSumLevel)
    resetSession()

    expect(currentLevel.value.id).toBe('sum-4')
    expect(exercises.value).toHaveLength(5)
  })

  it('should validate the answer against the current exercise', () => {
    const { generateExercises, currentExercise, userAnswer, checkAnswer, isCorrect } = useExercises()
    generateExercises()

    // Risposta giusta
    userAnswer.value = String(currentExercise.value!.correctAnswer)
    expect(checkAnswer()).toBe(true)
    expect(isCorrect.value).toBe(true)

    // Risposta sbagliata
    userAnswer.value = String(currentExercise.value!.correctAnswer + 1)
    expect(checkAnswer()).toBe(false)
  })

  it('should refuse to validate an empty answer', () => {
    const { generateExercises, checkAnswer } = useExercises()
    generateExercises()

    // Nessuna cifra inserita: non e' un errore, e' un non-tentativo
    expect(checkAnswer()).toBe(false)
  })

  it('should complete the session after the last exercise', () => {
    const { generateExercises, nextExercise, sessionCompleted, progress } = useExercises()
    generateExercises()

    // Avanza attraverso tutti e cinque gli esercizi
    for (let i = 0; i < 4; i++) {
      nextExercise()
      expect(sessionCompleted.value).toBe(false)
    }
    expect(progress.value).toEqual({ current: 5, total: 5 })

    nextExercise()
    expect(sessionCompleted.value).toBe(true)
  })

  it('should cap the typed answer at three digits', () => {
    const { generateExercises, addDigit, deleteDigit, userAnswer } = useExercises()
    generateExercises()

    // Il tastierino non deve accettare numeri fuori scala
    '12345'.split('').forEach(addDigit)
    expect(userAnswer.value).toBe('123')

    deleteDigit()
    expect(userAnswer.value).toBe('12')
  })

  it('should reveal half of the answer as a hint', () => {
    const { generateExercises, currentExercise, getHint } = useExercises()
    generateExercises(mockHardSumLevel)

    const answer = String(currentExercise.value!.correctAnswer)
    const hint = getHint()

    // Il suggerimento mostra le prime cifre e maschera le altre
    expect(hint).toHaveLength(answer.length)
    expect(hint.startsWith(answer.slice(0, Math.ceil(answer.length / 2)))).toBe(true)
  })
})
