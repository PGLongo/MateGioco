<template>
  <header class="app-header">
    <div class="header-left">
      <span class="avatar">🎈</span>
      <h1 class="greeting">Ciao {{ userName }}!</h1>
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
interface Props {
  userName?: string
  stars?: number
}

withDefaults(defineProps<Props>(), {
  userName: 'Amico',
  stars: 0
})
</script>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: linear-gradient(135deg, var(--color-blue-primary), var(--color-blue-light));
  border-radius: 24px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(93, 173, 226, 0.3);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  font-size: 2rem;
  animation: bounce 2s ease-in-out infinite;
}

.greeting {
  font-size: 1.5rem;
  color: white;
  font-weight: bold;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
}

.stars-container {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 16px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.star-icon {
  font-size: 1.5rem;
  animation: pulse 1.5s ease-in-out infinite;
}

.stars-count {
  font-size: 1.3rem;
  font-weight: bold;
  color: white;
  min-width: 30px;
  text-align: center;
}

@media (max-width: 480px) {
  .greeting {
    font-size: 1.2rem;
  }

  .avatar {
    font-size: 1.5rem;
  }

  .stars-count {
    font-size: 1.1rem;
  }
}
</style>
