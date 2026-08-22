<template>
  <header class="app-header">
    <div class="header-content">
      <h1 class="greeting">{{ $t('header.hello') }}</h1>
      <span class="username">{{ userName }}!</span>
    </div>
    
    <div class="header-actions">
      <button
        class="theme-toggle"
        :title="$t('header.theme')"
        :aria-label="$t('header.theme')"
        data-cy="theme-toggle"
        @click="toggleTheme"
      >
        <Icon :name="isDark ? 'mdi:weather-sunny' : 'mdi:weather-night'" class="theme-icon" />
      </button>

      <StarCounter :count="stars" />
    </div>
  </header>
</template>

<script setup lang="ts">
import type { AppHeaderProps } from '~/types/AppHeader'

withDefaults(defineProps<AppHeaderProps>(), {
  userName: '',
  stars: 0
})

const colorMode = useColorMode()
const { playClick } = useSound()

const isDark = computed(() => colorMode.value === 'dark')

const toggleTheme = () => {
  playClick()
  colorMode.preference = isDark.value ? 'light' : 'dark'
}
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
  background-color: var(--surface-header, #78CBE8);
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

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background-color: var(--color-bg-white, #FFFFFF);
  color: var(--color-dark-navy, #2A3C55);
  cursor: pointer;
  transition: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.theme-toggle:active {
  transform: scale(0.92);
}

.theme-icon {
  width: 22px;
  height: 22px;
}

.star-wrapper {
  transform: rotate(-2deg);
  transition: transform 300ms;
}

.star-wrapper:hover {
  transform: rotate(2deg);
}
</style>
