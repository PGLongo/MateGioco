<template>
  <header class="app-header">
    <div class="header-left">
      <span class="avatar">🎈</span>
      <h1 class="greeting">{{ $t('header.greeting', { name: userName }) }}</h1>
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
  padding: 10px 12px;
  background: linear-gradient(135deg, var(--color-blue-primary), var(--color-blue-light));
  border-radius: 0;
  box-shadow: 0 2px 8px rgba(93, 173, 226, 0.2);
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.avatar {
  font-size: 1.5rem;
  font-style: normal;
}

.greeting {
  font-size: 1.1rem;
  color: white;
  font-weight: 600;
  margin: 0;
  font-style: normal;
}

.header-right {
  display: flex;
  align-items: center;
}

.stars-container {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.2);
  padding: 6px 12px;
  border-radius: 16px;
  backdrop-filter: blur(10px);
}

.star-icon {
  font-size: 1.2rem;
  font-style: normal;
}

.stars-count {
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  min-width: 24px;
  text-align: center;
  font-style: normal;
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
