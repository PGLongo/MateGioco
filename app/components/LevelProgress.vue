<template>
  <div class="level-progress">
    <div class="progress-info">
      <span class="level-label">{{ $t('home.level', { n: level }) }}</span>
      <span class="stars-label">{{ current }}/{{ total }} ⭐</span>
    </div>
    <div class="progress-track">
      <div 
        class="progress-fill"
        :style="{ width: `${percentage}%` }"
      >
        <div class="shimmer-effect"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  level: number
  current: number
  total: number
}>()

const percentage = computed(() => Math.min(100, (props.current / props.total) * 100))
</script>

<style scoped>
.level-progress {
  width: 100%;
  position: relative;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-family: 'Fredoka', sans-serif;
  font-weight: 700;
  color: var(--color-dark-navy, #2A3C55);
}

.progress-track {
  height: 24px; /* h-6 */
  background-color: var(--color-bg-white, #FFFFFF);
  border-radius: 9999px; /* rounded-full */
  padding: 4px; /* p-1 */
  box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06); /* shadow-inner */
}

.progress-fill {
  height: 100%;
  background-color: var(--color-orange-primary, #F9C05E); /* bingo-orange fallback */
  border-radius: 9999px;
  transition: width 500ms cubic-bezier(0, 0, 0.2, 1); /* duration-500 ease-out */
  position: relative;
  overflow: hidden; /* Needed for shimmer */
}

.shimmer-effect {
  position: absolute;
  inset: 0;
  background-color: var(--surface-overlay, rgba(255, 255, 255, 0.2));
  border-radius: 9999px;
  animation: shimmer 2s infinite linear;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
</style>
