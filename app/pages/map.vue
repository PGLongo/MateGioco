<template>
  <div class="map-page">
    <h1 class="map-title">
      {{ $t('map.title') }}
    </h1>

    <div
      v-for="world in WORLDS"
      :key="world.id"
      class="world-block"
    >
      <div class="world-header">
        <Icon
          :name="world.icon"
          class="world-icon"
        />
        <h2 class="world-name">
          {{ $t(world.nameKey) }}
        </h2>
      </div>

      <div class="level-list">
        <button
          v-for="level in getWorldLevels(world.id)"
          :key="level.id"
          class="level-card"
          :class="{
            'is-locked': !isUnlocked(level.id),
            'is-completed': isCompleted(level.id),
            'is-current': level.id === currentLevel.id
          }"
          :disabled="!isUnlocked(level.id)"
          :data-cy="`level-${level.id}`"
          @click="playLevel(level)"
        >
          <div class="level-main">
            <span class="level-name">{{ $t(level.nameKey) }}</span>
            <span
              v-if="isUnlocked(level.id)"
              class="level-stars"
            >
              {{ $t('map.stars', { current: starsOn(level.id), total: level.starsToUnlock }) }}
            </span>
            <span
              v-else
              class="level-hint"
            >
              {{ $t('map.locked', { level: $t(requirementNameKey(level)) }) }}
            </span>
          </div>

          <Icon
            v-if="!isUnlocked(level.id)"
            name="mdi:lock"
            class="level-badge"
          />
          <Icon
            v-else-if="isCompleted(level.id)"
            name="mdi:check-circle"
            class="level-badge is-check"
          />
          <Icon
            v-else
            name="mdi:play-circle"
            class="level-badge is-play"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LevelConfig } from '~/types/Level'
import { WORLDS, getWorldLevels, getLevel } from '~/config/levels.config'

const { currentLevel, isUnlocked, isCompleted, starsOn, loadProgression } = useProgression()
const { playClick } = useSound()
const router = useRouter()

onMounted(() => {
  loadProgression()
})

/** Nome del livello che va completato per sbloccare quello mostrato */
const requirementNameKey = (level: LevelConfig): string => {
  return getLevel(level.unlockReq ?? '')?.nameKey ?? level.nameKey
}

const playLevel = (level: LevelConfig) => {
  if (!isUnlocked(level.id)) return

  playClick()
  router.push({ path: '/game', query: { level: level.id } })
}
</script>

<style scoped>
.map-page {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 8px;
}

.map-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--text-strong, #2A3C55);
  text-align: center;
}

.world-block {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.world-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.world-icon {
  width: 28px;
  height: 28px;
  color: var(--text-strong, #2A3C55);
}

.world-name {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-strong, #2A3C55);
}

.level-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.level-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 64px;
  padding: 12px 16px;
  border: none;
  border-radius: 20px;
  background-color: var(--color-bg-white, #FFFFFF);
  box-shadow: 0 4px 0 var(--color-blue-dark, #4F9BCC);
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  transition: transform 0.1s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.level-card:active {
  transform: translateY(2px);
  box-shadow: 0 2px 0 var(--color-blue-dark, #4F9BCC);
}

.level-card.is-current {
  outline: 3px solid var(--color-orange-primary, #E88C4B);
}

.level-card.is-completed {
  box-shadow: 0 4px 0 var(--color-green-dark, #6EAB50);
}

.level-card.is-locked {
  background-color: var(--color-bg-secondary, #FFFdf7);
  box-shadow: none;
  opacity: 0.55;
  cursor: not-allowed;
}

.level-main {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.level-name {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-text, #454555);
}

.level-stars,
.level-hint {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-muted, #7A7A8C);
}

.level-badge {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  color: var(--text-muted, #7A7A8C);
}

.level-badge.is-check {
  color: var(--color-green-primary, #91D371);
}

.level-badge.is-play {
  color: var(--color-orange-primary, #E88C4B);
}

@media (max-width: 480px) {
  .map-title {
    font-size: 1.5rem;
  }

  .level-card {
    min-height: 56px;
  }
}
</style>
