<template>
  <div class="app-layout">
    <!-- Top Bar -->
    <AppHeader :stars="totalStars" />


    <!-- Main Content -->
    <main class="main-content">
      <slot />
    </main>

    <!-- Bottom Navigation -->
    <nav class="bottom-nav">
      <div class="nav-container">
        
        <NavigationButton icon="mdi:map" label="Mappa" />
        

        
        <NavigationButton icon="mdi:trophy" label="Trofei" />
        
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
const { totalStars } = useStars()
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  background-color: var(--color-blue-primary, #78CBE8); /* sky-blue */
  display: flex;
  flex-direction: column;
  font-family: 'Fredoka', sans-serif; /* Default sans */
}

.main-content {
  flex: 1;
  padding: 24px 16px;
  padding-bottom: 120px; /* Footer (96px) + 24px visual gap = Balanced with top */
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* Bottom Navigation */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  padding-bottom: 16px;
  padding-top: 8px;
  padding-left: 24px;
  padding-right: 24px;
  box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06);
  border-top: 4px solid white; /* Thicker white border for playful feel */
  z-index: 50;
}

.nav-container {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  max-width: 32rem; /* max-w-lg */
  margin: 0 auto;
}


</style>
