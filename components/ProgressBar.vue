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
      <a
        href="https://github.com/PGLongo/MateGioco"
        target="_blank"
        rel="noopener noreferrer"
        class="footer-btn footer-link"
        title="GitHub Repository"
      >
        <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
        </svg>
      </a>
      <button
        class="footer-btn"
        @click="$emit('theme')"
        title="Cambia tema"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
          <path d="M12 5a7 7 0 000 14 7 7 0 000-14z" opacity="0.4"/>
        </svg>
      </button>
      <button
        class="footer-btn"
        @click="$emit('settings')"
        title="Impostazioni"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/>
          <path fill-rule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clip-rule="evenodd"/>
        </svg>
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
  theme: []
  settings: []
}>()
</script>

<style scoped>
.progress-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px 16px 12px;
  background: #F8F9F9;
  box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.08);
  flex-shrink: 0;
}

.progress-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: #5D6D7E;
}

.progress-text {
  font-weight: 500;
  font-style: normal;
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
  border: none;
  border-radius: 12px;
  background: var(--color-bg-white);
  color: var(--color-text);
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-style: normal;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  text-decoration: none;
}

.footer-btn:hover {
  background: var(--color-blue-lighter);
  color: var(--color-blue-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(93, 173, 226, 0.2);
}

.footer-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.footer-link {
  color: #5D6D7E;
}

.footer-link:hover {
  color: #24292e;
  background: #F6F8FA;
}

@media (min-width: 600px) {
  .progress-bar {
    padding: 15px 25px 24px 25px;
  }

  .progress-info {
    font-size: 1rem;
  }

  .footer-btn {
    width: 52px;
    height: 52px;
  }

  .footer-btn svg {
    width: 24px;
    height: 24px;
  }
}

@media (max-width: 480px) {
  .progress-bar {
    padding: 10px 12px 18px 12px;
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
  }

  .footer-btn svg {
    width: 18px;
    height: 18px;
  }
}
</style>
