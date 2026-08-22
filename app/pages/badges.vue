<template>
  <div class="badges-page">
    <h1 class="badges-title">
      {{ $t('badges.title') }}
    </h1>

    <p class="badges-count">
      {{ $t('badges.count', { current: earnedCount, total: BADGES.length }) }}
    </p>

    <div class="badges-grid">
      <BadgeCard
        v-for="badge in BADGES"
        :key="badge.id"
        :badge="badge"
        :unlocked="isCompleted(badge.levelId)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { BADGES } from '~/config/badges.config'

const { isCompleted, loadProgression } = useProgression()

onMounted(() => {
  loadProgression()
})

/**
 * Conquistato = livello completato. La bacheca non guarda il registro dei badge, che serve
 * a sapere cosa festeggiare e quando: cosi' un livello completato prima che i badge
 * esistessero non fa mentire il conteggio.
 */
const earnedCount = computed(() => BADGES.filter(badge => isCompleted(badge.levelId)).length)
</script>

<style scoped>
.badges-page {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 8px;
}

.badges-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--color-dark-navy, #2A3C55);
  text-align: center;
}

.badges-count {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-dark-navy, #2A3C55);
  text-align: center;
  opacity: 0.75;
}

.badges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
}

@media (max-width: 480px) {
  .badges-title {
    font-size: 1.5rem;
  }

  .badges-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
