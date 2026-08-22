<template>
  <div class="challenge-card">
    <div class="card-content">
      
      <!-- Icon Wrapper -->
      <div class="icon-wrapper">
         <Icon name="mdi:earth" class="world-icon" />
      </div>

      <div class="text-content">
        <h2 class="level-title">{{ $t('home.challengeTitle') }}</h2>
        <p class="level-desc">{{ $t('home.challengeDesc') }}</p>
      </div>

      <!-- Progress -->
      <LevelProgress 
        :level="1"
        :current="currentStars"
        :total="totalNeeded"
      />
      
      <p class="stars-needed">
        {{ $t('home.starsNeeded', { count: totalNeeded - currentStars }) }}
      </p>

      <!-- Slot for action button -->
      <div class="card-action">
        <slot />
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  currentStars: number
  totalNeeded: number
}>()
</script>

<style scoped>
.challenge-card {
  background-color: white;
  border-radius: 32px;
  padding: 24px;
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 4px solid rgba(255, 255, 255, 0.8);
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
  color: var(--color-blue-primary, #78CBE8);
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
