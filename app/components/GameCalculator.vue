<template>
  <div class="calculator card">
    <!-- Display -->
    <div class="display" :class="displayClass">
      {{ displayValue }}
    </div>

    <!-- Tastierino numerico -->
    <div class="number-pad">
      <button
        v-for="num in [1, 2, 3, 4, 5, 6, 7, 8, 9]"
        :key="num"
        class="number-btn"
        @click="$emit('digit', num.toString())"
      >
        {{ num }}
      </button>

      <!-- Riga inferiore -->
      <button
        class="number-btn btn-help"
        :title="$t('game.help')"
        @click="$emit('help')"
      >
        <Icon name="mdi:lightbulb-on" class="btn-icon" />
      </button>

      <button
        class="number-btn"
        @click="$emit('digit', '0')"
      >
        0
      </button>

      <button
        class="number-btn btn-delete"
        :title="$t('game.delete')"
        @click="$emit('delete')"
      >
        <Icon name="mdi:backspace" class="btn-icon" />
      </button>

      <!-- Pulsante OK (Row 5) -->
      <button
        class="btn-submit"
        :disabled="disabled"
        @click="$emit('submit')"
      >
        ✓ OK!
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { GameCalculatorProps } from '~/types/GameCalculator'

const props = withDefaults(defineProps<GameCalculatorProps>(), {
  disabled: false,
  userAnswer: '',
  feedbackState: null,
  feedbackMessage: ''
})

const displayValue = computed(() => {
  // Se c'è un feedback, mostra il messaggio
  if (props.feedbackState && props.feedbackMessage) {
    return props.feedbackMessage
  }
  // Altrimenti mostra la risposta dell'utente
  return props.userAnswer || ''
})

const displayClass = computed(() => {
  if (props.feedbackState === 'success') return 'display-success'
  if (props.feedbackState === 'error') return 'display-error'
  if (props.feedbackState === 'info') return 'display-info'
  return ''
})

defineEmits<{
  digit: [value: string]
  delete: []
  help: []
  submit: []
}>()
</script>

<style scoped>
.calculator {
  padding: 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.display {
  background: var(--color-bg-white, #FFFFFF);
  border: 3px solid var(--color-blue-light);
  border-bottom-width: 6px;
  border-radius: 20px;
  padding: 20px 16px;
  margin-bottom: 20px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3.5rem;
  font-weight: 700;
  color: var(--text-accent, #4F9BCC);
  font-style: normal;
  flex-shrink: 0;
  overflow: hidden;
  box-sizing: border-box;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: inset 0 2px 10px rgba(0,0,0,0.05);
}

.display-success {
  background: linear-gradient(135deg, var(--color-green-light), var(--color-green-medium)) !important;
  color: var(--color-green-dark) !important;
  animation: celebrate 0.5s ease;
}

.display-error {
  background: linear-gradient(135deg, #FFE5E5, #FFB3B3) !important;
  color: var(--color-error) !important;
  animation: shake 0.5s ease;
}

.display-info {
  background: linear-gradient(135deg, var(--color-orange-light), var(--color-orange-medium)) !important;
  color: var(--color-orange-dark) !important;
}

.number-pad {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(5, 1fr); /* 5 equal rows (numbers + actions + ok) */
  gap: 16px;
  margin-bottom: 20px;
  flex: 1; /* Occupy all remaining vertical space */
  /* min-content invece di 0: le righe possono restringersi fino al min-height dei
     bottoni, non oltre. Su viewport basse il tastierino traboccava a 0px di altezza
     e il gioco diventava inutilizzabile. */
  min-height: min-content;
}

.number-btn {
  /* Pavimento di 44px: sotto questa altezza un dito di bambino non centra il tasto.
     Il tastierino scala ancora con la griglia 1fr, ma non collassa piu'. */
  min-height: 44px;
  height: 100%; /* Fill the grid cell */
  font-size: 1.8rem;
  font-weight: 800;
  border: none;
  border-radius: 16px;
  background: var(--color-orange-medium);
  color: white;
  cursor: pointer;
  transition: all 0.1s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 4px 0 var(--color-orange-dark);
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  font-style: normal;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  position: relative;
  text-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.number-btn:hover {
  filter: brightness(1.05);
  transform: translateY(-2px);
  box-shadow: 0 6px 0 var(--color-orange-dark);
}

.number-btn:active {
  transform: translateY(4px);
  box-shadow: 0 0 0 var(--color-orange-dark);
}

.btn-help {
  background: linear-gradient(135deg, var(--color-pink-light), var(--color-pink-medium));
  color: var(--color-pink-dark);
  font-size: 1.1rem;
  line-height: 1.2;
}

.btn-help:hover {
  background: linear-gradient(135deg, var(--color-pink-medium), var(--color-pink-dark));
  color: white;
}

.btn-delete {
  background: linear-gradient(135deg, var(--color-pink-light), var(--color-pink-medium));
  color: var(--color-pink-dark);
  font-size: 1.1rem;
}

.btn-delete:hover {
  background: linear-gradient(135deg, var(--color-pink-medium), var(--color-pink-dark));
  color: white;
}

.btn-icon {
  width: 36px;
  height: 36px;
  font-size: 36px;
}

.btn-submit {
  grid-column: 1 / -1; /* Span all columns */
  width: 100%;
  height: 100%; /* Fill grid cell */
  font-size: 1.6rem;
  font-weight: 800;
  border: none;
  border-radius: 20px;
  background: var(--color-green-primary);
  color: white;
  cursor: pointer;
  transition: all 0.1s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 4px 0 var(--color-green-dark);
  font-family: inherit;
  text-transform: uppercase;
  font-style: normal;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  text-shadow: 0 1px 2px rgba(0,0,0,0.1);
  display: flex; /* Ensure centering text */
  align-items: center;
  justify-content: center;
}

.btn-submit:hover:not(:disabled) {
  filter: brightness(1.05);
  transform: translateY(-2px);
  box-shadow: 0 6px 0 var(--color-green-dark);
}

.btn-submit:active:not(:disabled) {
  transform: translateY(4px);
  box-shadow: 0 0 0 var(--color-green-dark);
}

.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (min-width: 600px) {
  .calculator {
    padding: 20px;
  }

  .display {
    font-size: 4.5rem;
    height: 120px;
    padding: 24px 20px;
  }

  .number-btn {
    font-size: 2.25rem;
    min-height: 75px;
  }

  .btn-icon {
    width: 44px;
    height: 44px;
    font-size: 44px;
  }

  .btn-submit {
    font-size: 2rem;
    padding: 22px;
  }
}

@media (max-width: 480px), (max-height: 950px) {
  .calculator {
    padding: 8px; /* Slightly more padding */
  }

  .display {
    font-size: 2.5rem;
    min-height: 85px; /* Taller as requested */
    flex-shrink: 0; /* Try to maintain size */
    height: auto; 
    padding: 10px 14px;
    margin-bottom: 12px; /* More separation */
  }

  .number-pad {
    gap: 12px; /* Increased from 4px */
    margin-bottom: 10px;
    flex-shrink: 2; 
  }

  .number-btn, .btn-submit {
    min-height: 0;
    font-size: 1.5rem;
    line-height: 1;
    border-radius: 14px;
  }

  .btn-icon {
    width: 26px;
    height: 26px;
    font-size: 26px;
  }

  .btn-submit {
    padding: 10px;
  }
}

@media (max-width: 360px) {
  .number-pad {
    gap: 6px;
  }

  .display {
    font-size: 2.5rem;
    height: 85px;
    padding: 14px 10px;
  }

  .number-btn, .btn-submit {
    min-height: 0;
    font-size: 1.4rem;
  }
}

/* Schermi bassi: spaziature del tastierino ridotte, altezza minima dei tasti intatta */
@media (max-height: 720px) {
  .number-pad {
    gap: 8px;
    margin-bottom: 8px;
  }
}

/* Viewport molto corti (iPhone 13 Mini in Safari: 629pt utili): mancavano 20px per far
   stare tutto.
   Le dichiarazioni ripetono `min-height` e non solo `height` perche' il blocco
   `(max-width: 480px), (max-height: 950px)` piu' sopra - che vale per qualunque telefono -
   impone un `min-height: 85px` al display e azzera il pavimento dei tasti: senza
   riaffermarli qui, questi valori non arriverebbero mai a effetto. */
@media (max-height: 640px) {
  .display {
    min-height: 64px;
    height: 64px;
    padding: 8px 14px;
    margin-bottom: 8px;
    font-size: 2.25rem;
  }

  .number-pad {
    gap: 6px;
    margin-bottom: 4px;
  }

  .number-btn,
  .btn-submit {
    min-height: 44px;
  }
}
</style>
