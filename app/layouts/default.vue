<template>
  <div class="app-layout">
    <!-- Top Bar -->
    <AppHeader
      :stars="totalStars"
      :user-name="displayName"
    />


    <!-- Main Content -->
    <main class="main-content">
      <slot />
    </main>

    <!-- Bottom Navigation -->
    <nav class="bottom-nav">
      <div class="nav-container">
        <NavigationButton
          icon="mdi:home"
          :label="$t('nav.home')"
          to="/"
        />

        <NavigationButton
          icon="mdi:map"
          :label="$t('nav.map')"
          to="/map"
        />
        

        
        <NavigationButton
          icon="mdi:trophy"
          :label="$t('nav.trophies')"
          to="/badges"
        />
        
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
const { totalStars, loadProgression } = useProgression()
const { settings, loadSettings } = useSettings()
const { t } = useI18n()

/** Il nome salvato, o il nome di cortesia nella lingua dell'interfaccia */
const displayName = computed(() => settings.value.userName || t('header.defaultName'))

onMounted(() => {
  loadProgression()
  loadSettings()
})
</script>

<style scoped>
.app-layout {
  height: 100vh;
  background-color: var(--surface-app, #78CBE8);
  display: flex;
  flex-direction: column;
  font-family: 'Fredoka', sans-serif; /* Default sans */
  overflow: hidden; /* Prevent global scroll */
}

.main-content {
  flex: 1; /* Take remaining space */
  padding: 24px 16px;
  overflow-y: auto; /* Allow internal scrolling if needed */
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

@media (max-width: 480px) {
  .main-content {
    /* Padding ridotto per stare su mobile, ma **non** azzerato in basso: con 0 la card
       arrivava a contatto con la barra di navigazione e la sua ombra veniva ritagliata
       dall'overflow, cosi' sembrava passarci sotto */
    padding: 12px 12px 12px 12px;
  }
}

/* Bottom Navigation */
.bottom-nav {
  /* Removed position: fixed */
  background-color: var(--surface-nav, rgba(255, 255, 255, 0.9));
  backdrop-filter: blur(12px);
  padding-bottom: 16px;
  padding-top: 8px;
  padding-left: 24px;
  padding-right: 24px;
  box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06);
  border-top: 4px solid white; /* Thicker white border for playful feel */
  z-index: 50;
  flex-shrink: 0; /* Ensure footer size is respected */
}

.nav-container {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  max-width: 32rem; /* max-w-lg */
  margin: 0 auto;
}



/* Schermi bassi: si recupera altezza da barra e spaziature, per far stare la pagina di
   gioco senza scroll fino all'iPhone SE */
@media (max-height: 720px) {
  .main-content {
    padding: 8px;
  }

  .bottom-nav {
    padding: 4px 16px 8px;
  }
}

@media (max-height: 640px) {
  .main-content {
    padding: 6px;
  }

  .bottom-nav {
    padding: 2px 16px 6px;
  }
}
</style>
