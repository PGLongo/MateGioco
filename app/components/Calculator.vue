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
        @click="$emit('help')"
        title="Aiuto"
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
        @click="$emit('delete')"
        title="Cancella"
      >
        <Icon name="mdi:backspace" class="btn-icon" />
      </button>
    </div>

    <!-- Pulsante OK -->
    <button
      class="btn-submit"
      @click="$emit('submit')"
      :disabled="disabled"
    >
      ✓ OK!
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  disabled?: boolean
  userAnswer?: string
  feedbackState?: 'success' | 'error' | 'info' | null
  feedbackMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
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
  background: linear-gradient(135deg, var(--color-blue-lighter), #85C1E2);
  border-radius: 12px;
  padding: 20px 16px;
  margin-bottom: 10px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3.5rem;
  font-weight: 700;
  color: #2874A6;
  box-shadow: inset 0 2px 4px rgba(52, 152, 219, 0.15);
  font-style: normal;
  flex-shrink: 0;
  overflow: hidden;
  box-sizing: border-box;
  transition: all 0.3s ease;
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
  gap: 8px;
  margin-bottom: 10px;
  flex: 1;
}

.number-btn {
  min-height: 50px;
  font-size: 1.6rem;
  font-weight: 700;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--color-orange-light), var(--color-orange-medium));
  color: var(--color-orange-dark);
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(248, 196, 113, 0.25);
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  font-style: normal;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.number-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(248, 196, 113, 0.35);
}

.number-btn:active {
  transform: scale(0.95);
  box-shadow: 0 2px 5px rgba(248, 196, 113, 0.25);
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
  width: 100%;
  padding: 14px;
  font-size: 1.4rem;
  font-weight: 700;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--color-green-light), var(--color-green-medium));
  color: var(--color-green-dark);
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 10px rgba(125, 206, 160, 0.3);
  font-family: inherit;
  text-transform: uppercase;
  font-style: normal;
  flex-shrink: 0;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 7px 20px rgba(125, 206, 160, 0.4);
}

.btn-submit:active:not(:disabled) {
  transform: scale(0.98);
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

@media (max-width: 480px) {
  .calculator {
    padding: 16px;
  }

  .display {
    font-size: 3rem;
    height: 90px;
    padding: 16px 12px;
  }

  .number-btn {
    min-height: 50px;
    font-size: 1.8rem;
  }

  .btn-icon {
    width: 32px;
    height: 32px;
    font-size: 32px;
  }

  .btn-submit {
    font-size: 1.8rem;
    padding: 16px;
  }
}

@media (max-width: 360px) {
  .number-pad {
    gap: 8px;
  }

  .display {
    font-size: 2.5rem;
    height: 85px;
    padding: 14px 10px;
  }

  .number-btn {
    min-height: 44px;
    font-size: 1.5rem;
  }

  .btn-icon {
    width: 28px;
    height: 28px;
    font-size: 28px;
  }

  .btn-submit {
    font-size: 1.6rem;
    padding: 14px;
  }
}
</style>
