<template>
  <div class="math-problem card">
    <div class="problem-row">
      <span class="number">{{ num1 }}</span>
      <span class="operator">{{ operator }}</span>
      <span class="number">{{ num2 }}</span>
      <span class="equals">=</span>
      <span v-if="showAnswer" class="answer-reveal">{{ correctAnswer }}</span>
      <span v-else class="question-mark">?</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MathProblemProps } from '~/types/MathProblem'

withDefaults(defineProps<MathProblemProps>(), {
  showAnswer: false,
  correctAnswer: 0
})
</script>

<style scoped>
.math-problem {
  text-align: center;
  padding: 20px 16px;
  background: rgba(255, 255, 255, 0.9);
  border: 4px solid var(--color-blue-lighter);
  border-radius: 24px;
  box-shadow: 0 8px 16px rgba(52, 152, 219, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0;
  margin-bottom: 20px;
  flex-shrink: 0;
  height: 120px;
  box-sizing: border-box;
  backdrop-filter: blur(5px);
}

.problem-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  width: 100%;
}

.number {
  font-size: 3.5rem;
  font-weight: 700;
  color: var(--color-blue-primary);
  font-style: normal;
  line-height: 1;
}

.operator {
  font-size: 3rem;
  font-weight: 700;
  color: var(--color-orange-primary);
  font-style: normal;
  line-height: 1;
}

.equals {
  font-size: 3rem;
  font-weight: 700;
  color: var(--color-blue-primary);
  font-style: normal;
  line-height: 1;
}

.question-mark {
  font-size: 3.5rem;
  font-weight: 700;
  color: var(--color-orange-primary);
  animation: pulse 1.5s ease-in-out infinite;
  font-style: normal;
  line-height: 1;
}

.answer-reveal {
  font-size: 3.5rem;
  font-weight: 700;
  color: var(--color-green-dark);
  font-style: normal;
  line-height: 1;
  animation: celebrate 0.5s ease;
}

@media (min-width: 600px) {
  .math-problem {
    padding: 24px 20px;
    margin-bottom: 20px;
    height: 120px;
  }

  .number {
    font-size: 4.5rem;
  }

  .operator,
  .equals {
    font-size: 3.8rem;
  }

  .question-mark {
    font-size: 4.5rem;
  }

  .problem-row {
    gap: 20px;
  }
}

@media (max-width: 480px) {
  .math-problem {
    padding: 16px 12px;
    height: 90px;
  }

  .number {
    font-size: 3rem;
  }

  .operator,
  .equals {
    font-size: 2.5rem;
  }

  .question-mark {
    font-size: 3rem;
  }

  .problem-row {
    gap: 12px;
  }
}

@media (max-width: 360px) {
  .math-problem {
    padding: 14px 10px;
    height: 85px;
  }

  .number {
    font-size: 2.5rem;
  }

  .operator,
  .equals {
    font-size: 2rem;
  }

  .question-mark {
    font-size: 2.5rem;
  }

  .problem-row {
    gap: 10px;
  }
}
</style>
