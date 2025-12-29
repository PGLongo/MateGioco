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
        :title="$t('footer.github')"
      >
        <Icon name="mdi:github" class="footer-icon" />
      </a>
      <button
        class="footer-btn"
        :title="$t('footer.theme')"
        @click="$emit('theme')"
      >
        <Icon name="mdi:theme-light-dark" class="footer-icon" />
      </button>
      <button
        class="footer-btn"
        :title="$t('footer.settings')"
        @click="$emit('settings')"
      >
        <Icon name="mdi:cog" class="footer-icon" />
      </button>
    </div>
  </footer>
</template>

<script setup lang="ts">
import type { ProgressBarProps } from '~/types/ProgressBar'

defineProps<ProgressBarProps>()

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

.footer-icon {
  width: 28px;
  height: 28px;
  font-size: 28px;
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

  .footer-icon {
    width: 32px;
    height: 32px;
    font-size: 32px;
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

  .footer-icon {
    width: 24px;
    height: 24px;
    font-size: 24px;
  }
}
</style>
