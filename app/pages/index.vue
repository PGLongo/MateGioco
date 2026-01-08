<template>
  <div class="page-container">
    
    <!-- Hero Section -->
    <div class="hero-section">
      
      <!-- Next Challenge Card with nested Play Button -->
      <ChallengeCard 
        :current-stars="totalStars"
        :total-needed="100"
      >
        <GameButton 
          variant="orange" 
          size="xl" 
          pill 
          @click="startGame"
          class="play-button-full"
        >
          <span class="btn-text">GIOCA ORA</span>
          <Icon name="mdi:play" class="btn-icon" />
        </GameButton>
      </ChallengeCard>

    </div>
  </div>
</template>

<script setup lang="ts">
const { totalStars } = useStars()
const { playClick } = useSound()
const router = useRouter()

const startGame = () => {
    playClick()
    router.push('/game')
}
</script>

<style scoped>
.page-container {
  flex: 1; /* Fill the parent flex container (.main-content) */
  display: flex;
  flex-direction: column;
  width: 100%;
}

.hero-section {
  flex: 1; /* Grow to fill page-container */
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px; /* Increased from 28rem (448px) to allow more growth, but kept to avoid extreme stretching */
  margin: 0 auto; /* Center horizontally */
  animation: pop-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.play-button-full {
  width: 100%;
}

.btn-text {
  letter-spacing: 0.05em; /* tracking-wide */
  font-family: 'Fredoka', sans-serif;
  font-size: 1.5rem;
}

.btn-icon {
  width: 32px;
  height: 32px;
}

@keyframes pop-in {
  0% { opacity: 0; transform: scale(0.9); }
  100% { opacity: 1; transform: scale(1); }
}
</style>
