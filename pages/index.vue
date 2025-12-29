<template>
  <div class="page-container">
    <AppHeader
      :user-name="settings.userName"
      :stars="totalStars"
    />

    <main class="main-content">
      <h2 class="question-title">Quanto fa?</h2>

      <MathProblem
        v-if="currentExercise"
        :num1="currentExercise.num1"
        :num2="currentExercise.num2"
        :operator="currentExercise.operator"
        :show-answer="showCorrectAnswer"
        :correct-answer="correctAnswerValue"
      />

      <Calculator
        :user-answer="userAnswer"
        :disabled="!userAnswer"
        :feedback-state="feedbackState"
        :feedback-message="feedbackMessage"
        @digit="handleAddDigit"
        @delete="handleDeleteDigit"
        @help="showHelp"
        @submit="submitAnswer"
      />

      <!-- Completion modal -->
      <Transition name="modal">
        <div v-if="sessionCompleted" class="modal-overlay" @click="startNewSession">
          <div class="modal-content" @click.stop>
            <h2 class="modal-title">🎉 Complimenti!</h2>
            <p class="modal-text">Hai completato tutti gli esercizi!</p>
            <p class="modal-stars">Hai guadagnato {{ sessionStars }} stelline! ⭐</p>
            <button class="modal-btn" @click="startNewSession">
              Nuova Sessione
            </button>
          </div>
        </div>
      </Transition>
    </main>

    <ProgressBar
      :current="progress.current"
      :total="progress.total"
      @home="goHome"
      @theme="changeTheme"
      @settings="openSettings"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Composables
const { settings, loadSettings } = useSettings()
const { totalStars, loadStars, addStars } = useStars()
const {
  currentExercise,
  userAnswer,
  isCorrect,
  sessionCompleted,
  progress,
  generateExercises,
  addDigit,
  deleteDigit,
  checkAnswer,
  nextExercise,
  getHint,
  resetSession
} = useExercises()

// State
const feedbackMessage = ref('')
const feedbackState = ref<'success' | 'error' | 'info' | null>(null)
const sessionStars = ref(0)
const showCorrectAnswer = ref(false)
const correctAnswerValue = ref(0)

// Vibrazione helper
const vibrate = (pattern: number | number[]) => {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern)
  }
}

// Gestione input digitale
const handleAddDigit = (digit: string) => {
  addDigit(digit)
  vibrate(20)
}

// Gestione cancellazione
const handleDeleteDigit = () => {
  deleteDigit()
  vibrate(30)
}

// Mostra suggerimento
const showHelp = () => {
  if (!currentExercise.value) return

  vibrate([30, 20, 30])
  const hint = getHint()
  feedbackMessage.value = `💡 ${hint}`
  feedbackState.value = 'info'

  setTimeout(() => {
    feedbackState.value = null
    feedbackMessage.value = ''
  }, 3000)
}

// Submit risposta
const submitAnswer = () => {
  if (!userAnswer.value) return

  // Vibrazione al click del pulsante OK
  vibrate(50)

  const correct = checkAnswer()

  if (correct) {
    // Risposta corretta! - Vibrazione celebrativa
    feedbackMessage.value = '🎉 Bravo!'
    feedbackState.value = 'success'
    vibrate([100, 50, 100, 50, 100])

    // Mostra la risposta corretta nel problema
    if (currentExercise.value) {
      correctAnswerValue.value = currentExercise.value.correctAnswer
      showCorrectAnswer.value = true
    }

    // Aggiungi stellina
    addStars(1)
    sessionStars.value++

    // Vai al prossimo dopo 2 secondi
    setTimeout(() => {
      feedbackState.value = null
      feedbackMessage.value = ''
      showCorrectAnswer.value = false
      nextExercise()
    }, 2500)
  } else {
    // Risposta sbagliata - Vibrazione più lunga
    feedbackMessage.value = '❌ Riprova!'
    feedbackState.value = 'error'
    vibrate([300])

    setTimeout(() => {
      feedbackState.value = null
      feedbackMessage.value = ''
    }, 2000)
  }
}

// Nuova sessione
const startNewSession = () => {
  sessionStars.value = 0
  resetSession()
}

// Footer actions
const goHome = () => {
  startNewSession()
}

const changeTheme = () => {
  feedbackMessage.value = '🎨 Coming soon!'
  feedbackState.value = 'info'

  setTimeout(() => {
    feedbackState.value = null
    feedbackMessage.value = ''
  }, 2500)
}

const openSettings = () => {
  const name = prompt('Come ti chiami?', settings.value.userName)
  if (name && name.trim()) {
    const { setUserName } = useSettings()
    setUserName(name)
  }
}

// Inizializzazione
onMounted(() => {
  loadSettings()
  loadStars()
  generateExercises()
})
</script>

<style scoped>
.page-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: white;
  overflow: hidden;
}

.main-content {
  flex: 1;
  padding: 8px 12px;
  background: linear-gradient(to bottom, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.question-title {
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-blue-primary);
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-style: normal;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  padding: 32px;
  border-radius: 24px;
  text-align: center;
  max-width: 400px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  animation: celebrate 0.5s ease;
}

.modal-title {
  font-size: 2rem;
  color: var(--color-blue-primary);
  margin-bottom: 16px;
}

.modal-text {
  font-size: 1.3rem;
  color: var(--color-text);
  margin-bottom: 16px;
}

.modal-stars {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--color-orange-dark);
  margin-bottom: 24px;
}

.modal-btn {
  padding: 16px 32px;
  font-size: 1.3rem;
  font-weight: bold;
  border: none;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--color-green-medium), var(--color-green-dark));
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
  box-shadow: 0 4px 12px rgba(30, 132, 73, 0.3);
}

.modal-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(30, 132, 73, 0.4);
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

@media (min-width: 600px) {
  .page-container {
    border-radius: 30px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(52, 152, 219, 0.2);
    min-height: auto;
    margin: 20px auto;
  }

  .question-title {
    font-size: 1.8rem;
  }
}

@media (max-width: 480px) {
  .question-title {
    font-size: 1.3rem;
  }

  .feedback-message {
    font-size: 1rem;
    padding: 12px 16px;
  }

  .modal-title {
    font-size: 1.6rem;
  }

  .modal-text {
    font-size: 1.1rem;
  }

  .modal-stars {
    font-size: 1.3rem;
  }
}
</style>
