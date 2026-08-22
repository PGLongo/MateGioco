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

    <!-- Nuovo badge conquistato: ha la precedenza sulla modale di fine sessione,
         perche' e' la notizia piu' importante per il bambino -->
    <div v-if="sessionCompleted && newBadges.length" class="modal-overlay">
      <div class="modal-card">
        <h2 class="modal-title">{{ $t('badges.newBadge') }}</h2>

        <div class="badge-showcase">
          <span
            v-for="badge in newBadges"
            :key="badge.id"
            class="badge-showcase-emoji"
            :data-cy="`new-badge-${badge.id}`"
          >{{ badge.emoji }}</span>
        </div>

        <p class="modal-message">{{ $t(newBadges[0]!.nameKey) }}</p>
        <p class="badge-showcase-desc">{{ $t(newBadges[0]!.descKey) }}</p>

        <button class="modal-btn" @click="goToBadges">
          {{ $t('badges.toBoard') }}
        </button>
        <button class="modal-btn is-secondary" @click="dismissBadges">
          {{ $t('badges.keepPlaying') }}
        </button>
      </div>
    </div>

    <!-- Custom CSS Modal Overlay -->
    <div v-else-if="sessionCompleted" class="modal-overlay">
      <div class="modal-card">
        <h2 class="modal-title">{{ $t('completion.title') }}</h2>
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
import type { Badge } from '~/types/Badge'
import type { LevelConfig } from '~/types/Level'
import { getLevel } from '~/config/levels.config'

const { loadSettings } = useSettings()
const { currentLevel, isUnlocked, addStarsTo, checkForNewBadges, loadProgression } = useProgression()
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
const route = useRoute()

/**
 * Livello della sessione: quello scelto nella mappa (`?level=`) se e' davvero sbloccato,
 * altrimenti quello a cui il bambino e' arrivato. Il controllo di sblocco sta qui perche'
 * la query e' modificabile a mano nella barra degli indirizzi.
 *
 * E' un `ref` fissato all'avvio e **non** un computed su `currentLevel`: completando il
 * livello a metà sessione, un computed scivolava sul livello successivo e le stelline
 * rimanenti venivano accreditate a un livello mai giocato.
 */
const sessionLevel = ref<LevelConfig>(currentLevel.value)

const resolveSessionLevel = (): LevelConfig => {
  const requested = typeof route.query.level === 'string' ? getLevel(route.query.level) : undefined

  return requested && isUnlocked(requested.id) ? requested : currentLevel.value
}

// State
const feedbackMessage = ref('')
const feedbackState = ref<'success' | 'error' | 'info' | null>(null)
const sessionStars = ref(0)
const newBadges = ref<Badge[]>([])
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

    // Una sola scrittura: il totale nell'header e' derivato dalle stelline per livello
    addStarsTo(sessionLevel.value.id, 1)
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

const goToBadges = () => {
  playClick()
  router.push('/badges')
}

/** Chiude la modale del badge e lascia vedere il riepilogo della sessione */
const dismissBadges = () => {
  playClick()
  newBadges.value = []
}

// Watch per celebrazione completamento sessione
watch(sessionCompleted, (completed) => {
  if (!completed) return

  playCelebration()
  celebrate()

  // I livelli completati durante la sessione consegnano i loro Guardiani. La funzione
  // restituisce solo i badge nuovi, quindi rigiocare un livello non li ripropone
  newBadges.value = checkForNewBadges()
})

// Inizializzazione
onMounted(() => {
  loadSettings()
  loadProgression()

  // La sessione si gioca sul livello a cui il bambino e' arrivato, non su una difficolta'
  // fissa, e quel livello resta lo stesso fino alla fine della partita
  sessionLevel.value = resolveSessionLevel()
  generateExercises(sessionLevel.value)
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
  background-color: var(--color-bg-white, #FFFFFF);
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

.badge-showcase {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: 4px 0 8px;
}

.badge-showcase-emoji {
  font-size: 4rem;
  line-height: 1;
  animation: bounce-small 1.4s infinite;
}

.badge-showcase-desc {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text-light, #7A7A8C);
  margin-bottom: 8px;
}

.modal-btn.is-secondary {
  background-color: var(--color-blue-lighter, #E1F4FA);
  color: var(--color-dark-navy, #2A3C55);
  box-shadow: none;
  margin-top: 8px;
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
