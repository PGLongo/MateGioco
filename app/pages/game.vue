<template>
  <div class="game-page">
    <!-- Back Button -->
    <button class="back-button" @click="handleBack">
      <Icon name="mdi:arrow-left" class="icon-small" />
      {{ $t('game.back') }}
    </button>

    <div class="game-content">
      <h2 class="question-title">{{ $t('game.question') }}</h2>

      <MathProblem
        v-if="currentExercise"
        :num1="currentExercise.num1"
        :num2="currentExercise.num2"
        :operator="currentExercise.operator"
        :show-answer="showCorrectAnswer"
        :correct-answer="correctAnswerValue"
        class="math-problem"
      />

      <GameCalculator
        :user-answer="userAnswer"
        :disabled="!userAnswer"
        :feedback-state="feedbackState"
        :feedback-message="feedbackMessage"
        @digit="handleAddDigit"
        @delete="handleDeleteDigit"
        @help="showHelp"
        @submit="submitAnswer"
      />
    </div>

    <!-- Custom CSS Modal Overlay -->
    <div v-if="sessionCompleted" class="modal-overlay">
      <div class="modal-card">
        <h2 class="modal-title">Fantastico! 🎉</h2>
        <p class="modal-message">{{ $t('completion.message') }}</p>
        <div class="modal-stars">
           <Icon name="mdi:star" class="star-spin" />
           <span>+{{ sessionStars }}</span>
        </div>

        <button 
          class="modal-btn"
          @click="startNewSession"
        >
          {{ $t('completion.newSession') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { loadSettings } = useSettings()
const { loadStars, addStars } = useStars()
const { playSuccess, playError, playClick, playCelebration } = useSound()
const { celebrate, miniCelebration } = useConfetti()
const { vibrate } = useVibration()
const {
  currentExercise,
  userAnswer,
  sessionCompleted,
  generateExercises,
  addDigit,
  deleteDigit,
  checkAnswer,
  nextExercise,
  getHint,
  resetSession
} = useExercises()

const { t } = useI18n()
const router = useRouter()

// State
const feedbackMessage = ref('')
const feedbackState = ref<'success' | 'error' | 'info' | null>(null)
const sessionStars = ref(0)
const showCorrectAnswer = ref(false)
const correctAnswerValue = ref(0)

const handleBack = () => {
  router.push('/')
}

// Gestione input digitale
const handleAddDigit = (digit: string) => {
  addDigit(digit)
  playClick()
  vibrate(20)
}

// Gestione cancellazione
const handleDeleteDigit = () => {
  deleteDigit()
  playClick()
  vibrate(30)
}

// Mostra suggerimento
const showHelp = () => {
  if (!currentExercise.value) return

  playClick()
  vibrate([30, 20, 30])
  const hint = getHint()
  feedbackMessage.value = t('feedback.hint', { hint })
  feedbackState.value = 'info'

  setTimeout(() => {
    feedbackState.value = null
    feedbackMessage.value = ''
  }, 3000)
}

// Submit risposta
const submitAnswer = () => {
  if (!userAnswer.value) return

  vibrate(50)
  const correct = checkAnswer()

  if (correct) {
    playSuccess()
    miniCelebration()
    feedbackMessage.value = t('feedback.success')
    feedbackState.value = 'success'
    vibrate([100, 50, 100, 50, 100])

    if (currentExercise.value) {
      correctAnswerValue.value = currentExercise.value.correctAnswer
      showCorrectAnswer.value = true
    }

    addStars(1)
    sessionStars.value++

    setTimeout(() => {
      feedbackState.value = null
      feedbackMessage.value = ''
      showCorrectAnswer.value = false
      nextExercise()
    }, 2500)
  } else {
    playError()
    feedbackMessage.value = t('feedback.error')
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
  router.push('/')
}

// Watch per celebrazione completamento sessione
watch(sessionCompleted, (completed) => {
  if (completed) {
    playCelebration()
    celebrate()
  }
})

// Inizializzazione
onMounted(() => {
  loadSettings()
  loadStars()
  generateExercises()
})
</script>

<style scoped>
.game-page {
  width: 100%;
  flex: 1; 
  height: 100%; /* Force fit to parent */
  display: flex;
  flex-direction: column;
  position: relative;
  /* Quando il contenuto non ci sta (viewport bassa, landscape, zoom alto) deve
     traboccare e scrollare: prima veniva ritagliato, schiacciando il tastierino. */
  overflow-y: auto;
  min-height: 0; 
}

/* Back Button */
.back-button {
  position: absolute;
  top: 0;
  left: 0;
  color: var(--color-dark-navy, #2A3C55);
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  background: none;
  border: none;
  font-family: inherit;
  font-size: 1rem;
  z-index: 10;
  padding: 8px 0;
}

.back-button:hover {
  opacity: 0.75;
}

.icon-small {
  width: 24px;
  height: 24px;
}

.game-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 0; /* Allow shrinking */
}

.question-title {
  text-align: center;
  font-size: 1.5rem; /* Reduced from 1.875rem */
  font-weight: 700;
  color: var(--color-dark-navy, #2A3C55);
  margin-bottom: 8px; /* Reduced from 16px */
  animation: bounce-small 2s infinite;
}

.math-problem {
  margin-bottom: 16px; /* Reduced from 32px */
  transform: scale(1); /* Removed scale 1.1 to save space */
}

/* Modal styles - same as before */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  backdrop-filter: blur(4px);
  padding: 24px;
}

.modal-card {
  background-color: white;
  border-radius: 32px;
  padding: 32px;
  width: 100%;
  max-width: 400px;
  text-align: center;
  border: 8px solid rgba(136, 201, 65, 0.2);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  animation: pop-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.modal-title {
  font-size: 2rem;
  font-weight: 800;
  font-family: 'Fredoka', sans-serif;
  color: var(--color-green-primary, #88C941);
  margin-bottom: 16px;
}

.modal-message {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-dark-navy, #2A3C55);
  margin-bottom: 24px;
}

.modal-stars {
  font-size: 3rem;
  font-weight: 900;
  font-family: 'Fredoka', sans-serif;
  color: var(--color-orange-primary, #F9C05E);
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.star-spin {
  width: 48px;
  height: 48px;
  animation: spin-slow 3s linear infinite;
}

.modal-btn {
  width: 100%;
  background-color: var(--color-green-primary, #88C941);
  color: white;
  font-size: 1.5rem;
  font-family: 'Fredoka', sans-serif;
  font-weight: 800;
  padding: 16px 0;
  border-radius: 20px;
  box-shadow: 0 6px 0 #6EAB50;
  border: none;
  cursor: pointer;
  transition: all 0.1s;
}

.modal-btn:active {
  transform: translateY(4px);
  box-shadow: none;
}

@keyframes pop-in {
  0% { opacity: 0; transform: scale(0.9); }
  100% { opacity: 1; transform: scale(1); }
}

@keyframes bounce-small {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
