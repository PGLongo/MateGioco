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
 * Tre invarianti che valgono per ogni livello:
 * - il risultato sta sempre fra 0 e `maxNumber` (e' il risultato a non dover sforare, non
 *   gli operandi: 45 + 32 appartiene al livello "entro 100", 45 + 70 no);
 * - una sottrazione non produce mai un risultato negativo, perche' i numeri negativi non
 *   esistono per un bambino di 4 anni;
 * - una divisione non ha mai resto, per la stessa ragione: le frazioni arrivano dopo.
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

  const generateMultiplication = (level: LevelConfig): Exercise => {
    // Il primo fattore non supera la radice del tetto, cosi' resta sempre almeno un
    // secondo fattore valido; poi il secondo si limita a quel che ci sta nel prodotto
    const maxFirst = Math.max(1, Math.floor(Math.sqrt(level.maxNumber)) + 1)
    const num1 = randomInt(1, maxFirst)
    const num2 = randomInt(1, Math.max(1, Math.floor(level.maxNumber / num1)))

    return { num1, num2, operator: '×', correctAnswer: num1 * num2 }
  }

  const generateDivision = (level: LevelConfig): Exercise => {
    // Si costruisce al contrario: prima divisore e quoziente, poi il dividendo come loro
    // prodotto. E' l'unico modo di garantire che non ci sia resto.
    // Il divisore parte da 1 di proposito: "18 ÷ 1 = 18" e' uno dei concetti da imparare,
    // cioe' che dividere per uno non cambia il numero
    const divisor = randomInt(1, Math.max(1, Math.floor(Math.sqrt(level.maxNumber)) + 1))
    const quotient = randomInt(1, Math.max(1, Math.floor(level.maxNumber / divisor)))

    return { num1: divisor * quotient, num2: divisor, operator: '÷', correctAnswer: quotient }
  }

  /** Nei livelli-sfida l'operazione cambia a ogni esercizio */
  const pickOperation = (level: LevelConfig): OperationType => {
    const pool = level.mixedOperations
    if (!pool || pool.length === 0) return level.operation

    return pool[Math.floor(Math.random() * pool.length)]!
  }

  const generateExercise = (level: LevelConfig): Exercise => {
    switch (pickOperation(level)) {
      case '-': return generateSubtraction(level)
      case '*': return generateMultiplication(level)
      case '/': return generateDivision(level)
      default: return generateAddition(level)
    }
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
