import { ref, computed } from 'vue'

export interface Exercise {
  num1: number
  num2: number
  operator: '+' | '-' | '×' | '÷'
  correctAnswer: number
}

const EXERCISES_PER_SESSION = 5

export const useExercises = () => {
  const exercises = ref<Exercise[]>([])
  const currentExerciseIndex = ref(0)
  const userAnswer = ref('')
  const isCorrect = ref<boolean | null>(null)
  const sessionCompleted = ref(false)

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

  // Genera un numero casuale tra min e max (inclusi)
  const randomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  // Genera un esercizio di somma
  const generateAdditionExercise = (): Exercise => {
    const num1 = randomInt(1, 10)
    const num2 = randomInt(1, 10)
    return {
      num1,
      num2,
      operator: '+',
      correctAnswer: num1 + num2
    }
  }

  // Genera esercizi per la sessione
  const generateExercises = () => {
    exercises.value = []
    for (let i = 0; i < EXERCISES_PER_SESSION; i++) {
      // Per MVP: solo somme
      exercises.value.push(generateAdditionExercise())
    }
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

  // Formatta l'esercizio come stringa
  const formatExercise = (exercise: Exercise): string => {
    return `${exercise.num1} ${exercise.operator} ${exercise.num2} = ?`
  }

  // Reset per nuova sessione
  const resetSession = () => {
    generateExercises()
  }

  return {
    // State
    exercises,
    currentExerciseIndex,
    currentExercise,
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
