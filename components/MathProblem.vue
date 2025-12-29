<template>
  <div class="math-problem card">
    <div class="problem-row">
      <span class="number">{{ num1 }}</span>
      <span class="operator">{{ operator }}</span>
      <span class="number">{{ num2 }}</span>
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
  padding: 8px 12px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(52, 152, 219, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  margin-bottom: 8px;
  flex-shrink: 0;
}

.problem-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
}

.number {
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--color-blue-primary);
  font-style: normal;
}

.operator {
  font-size: 1.8rem;
  font-weight: 700;
  color: #F39C12;
  font-style: normal;
}

.equals {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-blue-primary);
  font-style: normal;
}

.question-mark {
  font-size: 2.2rem;
  font-weight: 700;
  color: #F39C12;
  animation: pulse 1.5s ease-in-out infinite;
  font-style: normal;
}

@media (min-width: 600px) {
  .math-problem {
    padding: 12px 20px;
    margin-bottom: 20px;
  }

  .number {
    font-size: 3.5rem;
  }

  .operator,
  .equals {
    font-size: 2.8rem;
  }

  .question-mark {
    font-size: 3.5rem;
  }

  .problem-row {
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .math-problem {
    padding: 8px 12px;
  }

  .number {
    font-size: 2rem;
  }

  .operator,
  .equals {
    font-size: 1.6rem;
  }

  .question-mark {
    font-size: 2rem;
  }

  .problem-row {
    gap: 10px;
  }
}

@media (max-width: 360px) {
  .number {
    font-size: 1.8rem;
  }

  .operator,
  .equals {
    font-size: 1.4rem;
  }

  .question-mark {
    font-size: 1.8rem;
  }

  .problem-row {
    gap: 8px;
  }
}
</style>
