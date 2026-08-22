import type { LevelConfig, OperationType } from '~/types/Level'

export interface Exercise {
  num1: number
  num2: number
  operator: '+' | '-' | '×' | '÷'
  correctAnswer: number
}

/** Coppia di operandi ammessa per un livello */
type Operands = [number, number]

const pickRandom = <T>(items: T[]): T => items[Math.floor(Math.random() * items.length)]!

/**
 * Genera esercizi conformi a una LevelConfig.
 *
 * Tre invarianti che valgono per ogni livello:
 * - il risultato sta sempre fra 0 e `maxNumber` (e' il risultato a non dover sforare, non
 *   gli operandi: 45 + 32 appartiene al livello "entro 100", 45 + 70 no);
 * - una sottrazione non produce mai un risultato negativo, perche' i numeri negativi non
 *   esistono per un bambino di 4 anni;
 * - una divisione non ha mai resto, per la stessa ragione: le frazioni arrivano dopo.
 *
 * Il campionamento **enumera lo spazio degli esercizi validi** e ne pesca uno a caso,
 * invece di sorteggiare un operando alla volta. Sorteggiare in sequenza sembra equivalente
 * e non lo e': sul livello "entro 10" faceva uscire `9 + 1` l'11% delle volte contro il 2%
 * che gli spetta, perche' con il primo addendo a 9 il secondo non poteva che essere 1.
 */
export const useMathEngine = () => {

  /** Coppie (addendo, addendo) con somma entro il tetto */
  const additionOperands = (level: LevelConfig): Operands[] => {
    const pairs: Operands[] = []
    for (let a = level.minNumber; a <= level.maxNumber - level.minNumber; a++) {
      for (let b = level.minNumber; a + b <= level.maxNumber; b++) {
        pairs.push([a, b])
      }
    }
    return pairs
  }

  /** Coppie (minuendo, sottraendo) con minuendo >= sottraendo: risultato mai negativo */
  const subtractionOperands = (level: LevelConfig): Operands[] => {
    const pairs: Operands[] = []
    for (let a = level.minNumber; a <= level.maxNumber; a++) {
      for (let b = 0; b <= a; b++) {
        pairs.push([a, b])
      }
    }
    return pairs
  }

  /** Coppie (fattore, fattore) con prodotto entro il tetto */
  const multiplicationOperands = (level: LevelConfig): Operands[] => {
    const pairs: Operands[] = []
    for (let a = 1; a <= level.maxNumber; a++) {
      for (let b = 1; a * b <= level.maxNumber; b++) {
        pairs.push([a, b])
      }
    }
    return pairs
  }

  /**
   * Coppie (dividendo, divisore) senza resto: si costruiscono al contrario, dal divisore e
   * dal quoziente. Il divisore parte da 1 di proposito, perche' sapere che dividere per uno
   * non cambia il numero fa parte di quello che il livello insegna.
   */
  const divisionOperands = (level: LevelConfig): Operands[] => {
    const pairs: Operands[] = []
    for (let divisor = 1; divisor <= level.maxNumber; divisor++) {
      for (let quotient = 1; divisor * quotient <= level.maxNumber; quotient++) {
        pairs.push([divisor * quotient, divisor])
      }
    }
    return pairs
  }

  const operandsFor = (level: LevelConfig, operation: OperationType): Operands[] => {
    switch (operation) {
      case '-': return subtractionOperands(level)
      case '*': return multiplicationOperands(level)
      case '/': return divisionOperands(level)
      default: return additionOperands(level)
    }
  }

  const buildExercise = (operation: OperationType, [num1, num2]: Operands): Exercise => {
    switch (operation) {
      case '-': return { num1, num2, operator: '-', correctAnswer: num1 - num2 }
      case '*': return { num1, num2, operator: '×', correctAnswer: num1 * num2 }
      case '/': return { num1, num2, operator: '÷', correctAnswer: num1 / num2 }
      default: return { num1, num2, operator: '+', correctAnswer: num1 + num2 }
    }
  }

  /** Nei livelli-sfida l'operazione cambia a ogni esercizio */
  const pickOperation = (level: LevelConfig): OperationType => {
    const pool = level.mixedOperations
    if (!pool || pool.length === 0) return level.operation

    return pickRandom(pool)
  }

  const generateExercise = (level: LevelConfig): Exercise => {
    const operation = pickOperation(level)

    return buildExercise(operation, pickRandom(operandsFor(level, operation)))
  }

  /**
   * Genera una sessione **senza esercizi ripetuti**: vedere tre volte "8 + 2" su cinque
   * domande fa sembrare il gioco rotto, e capitava nel 30% delle sessioni. Se lo spazio
   * degli esercizi e' piu' piccolo della sessione (livelli molto elementari), la
   * ripetizione torna ammessa: meglio un doppione che una domanda in meno.
   */
  const generateSession = (level: LevelConfig, count: number): Exercise[] => {
    const pools = new Map<OperationType, Operands[]>()
    const used = new Set<string>()
    const session: Exercise[] = []

    for (let i = 0; i < count; i++) {
      const operation = pickOperation(level)

      if (!pools.has(operation)) {
        pools.set(operation, operandsFor(level, operation))
      }
      const operands = pools.get(operation)!

      let chosen: Operands | null = null
      for (let attempt = 0; attempt < 30 && !chosen; attempt++) {
        const candidate = pickRandom(operands)
        const key = `${operation}:${candidate[0]}:${candidate[1]}`
        if (!used.has(key)) {
          used.add(key)
          chosen = candidate
        }
      }

      session.push(buildExercise(operation, chosen ?? pickRandom(operands)))
    }

    return session
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
