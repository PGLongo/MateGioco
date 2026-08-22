<template>
  <header class="app-header">
    <button
      v-if="canGoBack"
      class="back-button"
      :aria-label="$t('nav.back')"
      data-cy="header-back"
      @click="goBack"
    >
      <Icon name="mdi:chevron-left" class="back-icon" />
      <span class="back-label">{{ $t('nav.back') }}</span>
    </button>

    <!-- Il saluto vive nella home. Nelle pagine interne la barra fa il suo mestiere di
         navigazione: con entrambi, su 375px il selettore del tema finiva sopra al nome -->
    <div v-if="!canGoBack" class="header-content">
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
const router = useRouter()
const route = useRoute()

const isDark = computed(() => colorMode.value === 'dark')

/** Fuori dalla home c'e' sempre un posto dove tornare */
const canGoBack = computed(() => route.path !== '/')

const goBack = () => {
  playClick()

  // Se si e' arrivati da dentro l'app si torna indietro nella cronologia; se la pagina e'
  // stata aperta di sbieco (link diretto, PWA riaperta) si va alla home invece di uscire
  if (window.history.state?.back) {
    router.back()
  } else {
    router.push('/')
  }
}

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

.back-button {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 8px 8px 8px 0;
  margin-right: 4px;
  border: none;
  background: none;
  color: var(--text-strong, #2A3C55);
  font-family: inherit;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  flex-shrink: 0;
}

.back-button:active {
  transform: scale(0.94);
}

.back-icon {
  width: 28px;
  height: 28px;
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
  margin-left: auto;
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
  color: var(--text-strong, #2A3C55);
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

/* Schermi bassi (iPhone SE): l'header da 118px mangiava lo spazio che serve al tastierino
   della pagina di gioco. Si stringono le spaziature, non i caratteri: il saluto resta
   leggibile. */
@media (max-height: 720px) {
  .app-header {
    padding: 12px 16px;
  }

  .greeting {
    font-size: 1.5rem;
  }
}
</style>
