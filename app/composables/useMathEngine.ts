import type { LevelConfig, OperationType } from '~/types/Level'

export interface Exercise {
  num1: number
  num2: number
  operator: '+' | '-' | '×' | '÷'
  correctAnswer: number
}

const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Genera esercizi conformi a una LevelConfig.
 *
 * Due invarianti che valgono per ogni livello:
 * - il risultato sta sempre fra 0 e `maxNumber` (e' il risultato a non dover sforare, non
 *   gli operandi: 45 + 32 appartiene al livello "entro 100", 45 + 70 no);
 * - una sottrazione non produce mai un risultato negativo, perche' i numeri negativi non
 *   esistono per un bambino di 4 anni.
 */
export const useMathEngine = () => {

  const generateAddition = (level: LevelConfig): Exercise => {
    // Il primo addendo lascia sempre spazio al secondo dentro maxNumber
    const num1 = randomInt(level.minNumber, Math.max(level.minNumber, level.maxNumber - level.minNumber))
    const num2 = randomInt(level.minNumber, level.maxNumber - num1)

    return { num1, num2, operator: '+', correctAnswer: num1 + num2 }
  }

  const generateSubtraction = (level: LevelConfig): Exercise => {
    // Il minuendo viene per primo, il sottraendo non lo supera mai: risultato >= 0
    const num1 = randomInt(level.minNumber, level.maxNumber)
    const num2 = randomInt(0, num1)

    return { num1, num2, operator: '-', correctAnswer: num1 - num2 }
  }

  /** Nel mondo 'mix' l'operazione cambia a ogni esercizio: e' il punto della sfida finale */
  const pickMixedOperation = (): OperationType => (Math.random() < 0.5 ? '+' : '-')

  const generateExercise = (level: LevelConfig): Exercise => {
    const operation = level.worldId === 'mix' ? pickMixedOperation() : level.operation

    return operation === '-' ? generateSubtraction(level) : generateAddition(level)
  }

  const generateSession = (level: LevelConfig, count: number): Exercise[] => {
    return Array.from({ length: count }, () => generateExercise(level))
  }

  const formatExercise = (exercise: Exercise): string => {
    return `${exercise.num1} ${exercise.operator} ${exercise.num2} = ?`
  }

  return {
    generateExercise,
    generateSession,
    formatExercise
  }
}
