<template>
  <div class="challenge-card">
    <div class="card-content">
      
      <!-- Icon Wrapper -->
      <div class="icon-wrapper">
         <Icon :name="worldIcon" class="world-icon" />
      </div>

      <div class="text-content">
        <h2 class="level-title">{{ $t(level.nameKey) }}</h2>
        <p class="level-desc">{{ $t(worldNameKey) }}</p>
      </div>

      <!-- Progress -->
      <LevelProgress 
        :level="levelNumber"
        :current="currentStars"
        :total="level.starsToUnlock"
      />
      
      <p class="stars-needed">
        {{ $t('home.starsNeeded', { count: starsMissing }) }}
      </p>

      <!-- Slot for action button -->
      <div class="card-action">
        <slot />
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import type { LevelConfig } from '~/types/Level'
import { getWorld, getLevelNumber } from '~/config/levels.config'

const props = defineProps<{
  level: LevelConfig
  currentStars: number
}>()

const world = computed(() => getWorld(props.level.worldId))
const worldIcon = computed(() => world.value?.icon ?? 'mdi:earth')
const worldNameKey = computed(() => world.value?.nameKey ?? 'worlds.sum')
const levelNumber = computed(() => getLevelNumber(props.level.id))
const starsMissing = computed(() => Math.max(0, props.level.starsToUnlock - props.currentStars))
</script>

<style scoped>
.challenge-card {
  background-color: var(--color-bg-white, #FFFFFF);
  border-radius: 32px;
  padding: 24px;
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 4px solid var(--card-border, rgba(255, 255, 255, 0.8));
  backdrop-filter: blur(4px);
  width: 100%;
  flex: 1; /* Explicitly grow to fill parent */
  display: flex;
  flex-direction: column;
}

.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between; /* Distribute space evenly */
  text-align: center;
  gap: 16px; 
  padding-bottom: 16px; /* Add some padding at bottom */
}

/* Make icon larger */
.icon-wrapper {
  width: 140px;
  height: 140px;
  background-color: #DBEAFE;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  animation: float 6s ease-in-out infinite;
  flex-shrink: 0;
}

.world-icon {
  width: 100px;
  height: 100px;
  color: var(--text-accent, #4F9BCC);
}

.text-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
  justify-content: center; /* Center text vertically if it grows */
}

/* Allow Level Title to scale slightly? - keep font static for now but ensure spacing */

.card-action {
  width: 100%;
  /* margin-top managed by justify-content: space-between */
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
</style>
