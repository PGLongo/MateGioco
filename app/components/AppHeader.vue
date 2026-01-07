<template>
  <header class="app-header">
    <div class="header-content">
      <h1 class="greeting">Ciao,</h1>
      <span class="username">{{ userName }}!</span>
    </div>
    
    <div class="star-wrapper">
      <StarCounter :count="stars" />
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
  position: sticky;
  top: 0;
  z-index: 50;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--color-blue-primary);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.greeting {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.875rem; /* text-3xl */
  font-weight: 900;    /* font-black */
  color: white;
  line-height: 1;
  letter-spacing: 0.025em; /* tracking-wide */
  filter: drop-shadow(0 1px 1px rgba(0,0,0,0.1));
  margin: 0;
}

.username {
  font-family: 'Fredoka', sans-serif;
  font-size: 2.25rem; /* text-4xl */
  font-weight: 900;
  color: white;
  line-height: 1;
  letter-spacing: 0.025em;
  filter: drop-shadow(0 1px 1px rgba(0,0,0,0.1));
}

.star-wrapper {
  transform: rotate(-2deg);
  transition: transform 300ms;
}

.star-wrapper:hover {
  transform: rotate(2deg);
}
</style>
