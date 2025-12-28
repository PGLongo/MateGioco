<template>
  <div class="calculator card">
    <!-- Display -->
    <div class="display">
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
        🤔
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
        ⌫
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
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  userAnswer: ''
})

const displayValue = computed(() => {
  return props.userAnswer || ''
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
  padding: 24px;
}

.display {
  background: linear-gradient(135deg, var(--color-blue-lighter), #85C1E2);
  border-radius: 15px;
  padding: 18px;
  margin-bottom: 15px;
  min-height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: bold;
  color: #2874A6;
  box-shadow: inset 0 3px 6px rgba(52, 152, 219, 0.15);
}

.number-pad {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.number-btn {
  aspect-ratio: 1;
  min-height: 60px;
  font-size: 2rem;
  font-weight: bold;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--color-orange-light), var(--color-orange-medium));
  color: var(--color-orange-dark);
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 3px 10px rgba(248, 196, 113, 0.25);
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
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
  background: linear-gradient(135deg, #D5F4E6, var(--color-green-light));
  color: #239B56;
  font-size: 1.25rem;
  line-height: 1.2;
}

.btn-help:hover {
  background: linear-gradient(135deg, var(--color-green-light), var(--color-green-medium));
}

.btn-delete {
  background: linear-gradient(135deg, #D5F4E6, var(--color-green-light));
  color: #239B56;
  font-size: 1.25rem;
}

.btn-delete:hover {
  background: linear-gradient(135deg, var(--color-green-light), var(--color-green-medium));
}

.btn-submit {
  width: 100%;
  padding: 20px;
  font-size: 1.75rem;
  font-weight: bold;
  border: none;
  border-radius: 15px;
  background: linear-gradient(135deg, var(--color-green-light), var(--color-green-medium));
  color: var(--color-green-dark);
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 5px 15px rgba(125, 206, 160, 0.3);
  font-family: inherit;
  text-transform: uppercase;
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
    font-size: 3.5rem;
    min-height: 80px;
    padding: 22px;
  }

  .number-btn {
    font-size: 2.25rem;
    min-height: 75px;
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
    font-size: 2.5rem;
    min-height: 60px;
    padding: 14px;
  }

  .number-btn {
    min-height: 50px;
    font-size: 1.8rem;
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
    font-size: 2rem;
    min-height: 50px;
    padding: 12px;
  }

  .number-btn {
    min-height: 44px;
    font-size: 1.5rem;
  }

  .btn-submit {
    font-size: 1.6rem;
    padding: 14px;
  }
}
</style>
