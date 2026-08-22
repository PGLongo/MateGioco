<template>
  <div class="star-counter">
    <Icon name="mdi:star" class="star-icon" />
    <span class="count">{{ count }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  count: number
}>()
</script>

<style scoped>
.star-counter {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background-color: var(--color-bg-white, #FFFFFF);
  padding: 12px 24px;
  border-radius: 9999px; /* rounded-full */
  box-shadow: 
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-lg */
  border-bottom: 4px solid rgba(0, 0, 0, 0.05); /* border-black/5 */
  min-width: 140px;
}

.star-icon {
  width: 32px;
  height: 32px;
  color: var(--color-orange-primary, #F9C05E); /* bingo-orange fallback */
}

.count {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.875rem; /* text-3xl */
  font-weight: 900;    /* font-black */
  color: var(--color-dark-navy, #2A3C55); /* dark-navy fallback */
  line-height: 1;
}
</style>
