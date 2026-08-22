import { ref, computed } from 'vue'
import type { LevelConfig } from '~/types/Level'
import type { Exercise } from './useMathEngine'
import { useMathEngine } from './useMathEngine'
import { LEVELS, FIRST_LEVEL_ID, getLevel } from '~/config/levels.config'

const EXERCISES_PER_SESSION = 5

export const useExercises = () => {
  const { generateSession, formatExercise } = useMathEngine()

  const exercises = ref<Exercise[]>([])
  const currentExerciseIndex = ref(0)
  const userAnswer = ref('')
  const isCorrect = ref<boolean | null>(null)
  const sessionCompleted = ref(false)

  // Livello della sessione in corso: chi chiama puo' passarne uno, altrimenti si parte
  // dal primo del percorso
  const currentLevel = ref<LevelConfig>(getLevel(FIRST_LEVEL_ID) ?? LEVELS[0]!)

  // Esercizio corrente
  const currentExercise = computed(() => {
    return exercises.value[currentExerciseIndex.value] || null
  })

  // Progresso
  const progress = computed(() => {
    return {
      current: currentExerciseIndex.value + 1,
      total: EXERCISES_PER_SESSION
    }
  })

  // Genera esercizi per la sessione, conformi al livello indicato
  const generateExercises = (level?: LevelConfig) => {
    if (level) {
      currentLevel.value = level
    }

    exercises.value = generateSession(currentLevel.value, EXERCISES_PER_SESSION)
    currentExerciseIndex.value = 0
    userAnswer.value = ''
    isCorrect.value = null
    sessionCompleted.value = false
  }

  // Aggiungi cifra alla risposta
  const addDigit = (digit: string) => {
    if (userAnswer.value.length < 3) {
      userAnswer.value += digit
    }
  }

  // Cancella ultima cifra
  const deleteDigit = () => {
    userAnswer.value = userAnswer.value.slice(0, -1)
  }

  // Cancella tutta la risposta
  const clearAnswer = () => {
    userAnswer.value = ''
  }

  // Valida risposta
  const checkAnswer = (): boolean => {
    if (!currentExercise.value || userAnswer.value === '') {
      return false
    }

    const answer = parseInt(userAnswer.value, 10)
    isCorrect.value = answer === currentExercise.value.correctAnswer

    return isCorrect.value
  }

  // Vai al prossimo esercizio
  const nextExercise = () => {
    if (currentExerciseIndex.value < exercises.value.length - 1) {
      currentExerciseIndex.value++
      userAnswer.value = ''
      isCorrect.value = null
    } else {
      sessionCompleted.value = true
    }
  }

  // Ottieni suggerimento (mostra metà della risposta)
  const getHint = (): string => {
    if (!currentExercise.value) return ''

    const answer = currentExercise.value.correctAnswer.toString()
    const halfLength = Math.ceil(answer.length / 2)
    return answer.substring(0, halfLength) + '?'.repeat(answer.length - halfLength)
  }

  // Reset per nuova sessione, sullo stesso livello
  const resetSession = () => {
    generateExercises()
  }

  return {
    // State
    exercises,
    currentExerciseIndex,
    currentExercise,
    currentLevel,
    userAnswer,
    isCorrect,
    sessionCompleted,
    progress,

    // Methods
    generateExercises,
    addDigit,
    deleteDigit,
    clearAnswer,
    checkAnswer,
    nextExercise,
    getHint,
    formatExercise,
    resetSession
  }
}
