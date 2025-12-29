<template>
  <header class="app-header">
    <div class="header-left">
      <h1 class="app-title">MateGioco</h1>
      <span class="player-name">{{ userName }}</span>
    </div>
    <div class="header-right">
      <div class="stars-container">
        <span class="star-icon">⭐</span>
        <span class="stars-count">{{ stars }}</span>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { AppHeaderProps } from '~/types/AppHeader'

withDefaults(defineProps<AppHeaderProps>(), {
  userName: 'Amico',
  stars: 0
})
</script>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: var(--color-blue-primary);
  border-bottom: 4px solid var(--color-blue-dark);
  border-radius: 0;
  box-shadow: 0 4px 0 rgba(0,0,0,0.05);
  flex-shrink: 0;
  z-index: 100;
}

.header-left {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.app-title {
  font-size: 1.4rem;
  color: white;
  font-weight: 800;
  margin: 0;
  font-style: normal;
  letter-spacing: 1px;
  text-shadow: 0 2px 0 rgba(0,0,0,0.1);
  line-height: 1.1;
}

.player-name {
  font-size: 1rem;
  color: var(--color-blue-lighter);
  font-weight: 600;
  font-style: normal;
}

.header-right {
  display: flex;
  align-items: center;
}

.stars-container {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.9);
  padding: 8px 16px;
  border-radius: 20px;
  border: 3px solid #FFD700;
  box-shadow: 0 4px 0 #DAA520;
  transform: rotate(-2deg);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.stars-container:hover {
  transform: rotate(2deg) scale(1.05);
}

.star-icon {
  font-size: 1.4rem;
  font-style: normal;
  filter: drop-shadow(0 2px 2px rgba(0,0,0,0.2));
  animation: pulse 2s infinite ease-in-out;
}

.stars-count {
  font-size: 1.2rem;
  font-weight: 800;
  color: #DAA520; /* Color oro scuro */
  min-width: 24px;
  text-align: center;
  font-style: normal;
  text-shadow: 0 1px 0 rgba(255,255,255,0.5);
}

@media (max-width: 480px) {
  .greeting {
    font-size: 1rem;
  }

  .avatar {
    font-size: 1.3rem;
  }

  .stars-count {
    font-size: 1rem;
  }
}
</style>
