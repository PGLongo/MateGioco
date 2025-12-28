<template>
  <footer class="progress-bar">
    <div class="progress-info">
      <span class="progress-text">{{ current }} di {{ total }}</span>
      <div class="progress-dots">
        <div
          v-for="i in total"
          :key="i"
          class="dot"
          :class="{ active: i <= current }"
        />
      </div>
    </div>
    <div class="footer-buttons">
      <button
        class="footer-btn"
        @click="$emit('home')"
        title="Home"
      >
        🏠
      </button>
      <button
        class="footer-btn"
        @click="$emit('theme')"
        title="Tema"
      >
        🎨
      </button>
      <button
        class="footer-btn"
        @click="$emit('settings')"
        title="Impostazioni"
      >
        ⚙️
      </button>
    </div>
  </footer>
</template>

<script setup lang="ts">
interface Props {
  current: number
  total: number
}

defineProps<Props>()

defineEmits<{
  home: []
  theme: []
  settings: []
}>()
</script>

<style scoped>
.progress-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  background: #F8F9F9;
  box-shadow: 0 -3px 8px rgba(0, 0, 0, 0.08);
}

.progress-info {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.875rem;
  color: #5D6D7E;
}

.progress-text {
  font-weight: normal;
}

.progress-dots {
  display: flex;
  gap: 6px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #D5DBDB;
  transition: all 0.3s ease;
}

.dot.active {
  background: linear-gradient(135deg, var(--color-blue-primary), #3498DB);
  animation: pulse 0.5s ease;
}

.footer-buttons {
  display: flex;
  gap: 8px;
}

.footer-btn {
  width: 44px;
  height: 44px;
  border: 2px solid #D5DBDB;
  border-radius: 10px;
  background: white;
  font-size: 1.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer-btn:hover {
  border-color: var(--color-blue-primary);
  transform: scale(1.05);
}

.footer-btn:active {
  transform: scale(0.95);
  border-color: var(--color-blue-primary);
}

@media (min-width: 600px) {
  .progress-bar {
    padding: 15px 25px;
  }

  .progress-info {
    font-size: 1rem;
  }

  .footer-btn {
    padding: 10px 16px;
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .progress-bar {
    padding: 10px 12px;
  }

  .progress-info {
    font-size: 0.8rem;
  }

  .progress-dots {
    gap: 5px;
  }

  .dot {
    width: 10px;
    height: 10px;
  }

  .footer-btn {
    width: 40px;
    height: 40px;
    font-size: 1.1rem;
  }
}
</style>
