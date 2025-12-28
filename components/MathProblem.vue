<template>
  <div class="math-problem card">
    <div class="problem-row">
      <span class="number">{{ num1 }}</span>
      <span class="operator">{{ operator }}</span>
      <span class="number">{{ num2 }}</span>
    </div>
    <div class="problem-row">
      <span class="equals">=</span>
      <span class="question-mark">?</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  num1: number
  num2: number
  operator: string
}

defineProps<Props>()
</script>

<style scoped>
.math-problem {
  text-align: center;
  padding: 18px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
}

.problem-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  width: 100%;
}

.number {
  font-size: 3.25rem;
  font-weight: bold;
  color: var(--color-blue-primary);
  text-shadow: 2px 2px 4px rgba(93, 173, 226, 0.2);
}

.operator {
  font-size: 2.75rem;
  font-weight: bold;
  color: #F39C12;
}

.equals {
  font-size: 2.75rem;
  font-weight: bold;
  color: var(--color-blue-primary);
}

.question-mark {
  font-size: 3.5rem;
  font-weight: bold;
  color: #F39C12;
  animation: pulse 1.5s ease-in-out infinite;
}

@media (min-width: 600px) {
  .math-problem {
    padding: 25px;
    margin-bottom: 20px;
  }

  .number {
    font-size: 4rem;
  }

  .operator,
  .equals {
    font-size: 3.25rem;
  }

  .question-mark {
    font-size: 4.25rem;
  }
}

@media (max-width: 480px) {
  .math-problem {
    padding: 16px;
  }

  .number {
    font-size: 2.75rem;
  }

  .operator,
  .equals {
    font-size: 2.25rem;
  }

  .question-mark {
    font-size: 3rem;
  }

  .problem-row {
    gap: 16px;
  }
}

@media (max-width: 360px) {
  .number {
    font-size: 2.25rem;
  }

  .operator,
  .equals {
    font-size: 1.875rem;
  }

  .question-mark {
    font-size: 2.5rem;
  }

  .problem-row {
    gap: 12px;
  }
}
</style>
