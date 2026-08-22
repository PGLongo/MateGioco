<template>
  <div
    class="badge-card"
    :class="{ 'is-locked': !unlocked }"
    :data-cy="`badge-${badge.id}`"
  >
    <div class="badge-art">
      <span
        v-if="unlocked"
        class="badge-emoji"
      >{{ badge.emoji }}</span>
      <Icon
        v-else
        name="mdi:lock"
        class="badge-lock"
      />
    </div>

    <span class="badge-name">
      {{ unlocked ? $t(badge.nameKey) : '???' }}
    </span>

    <span class="badge-detail">
      {{ unlocked ? $t(badge.descKey) : $t('badges.lockedHint', { level: $t(levelNameKey) }) }}
    </span>
  </div>
</template>

<script setup lang="ts">
import type { Badge } from '~/types/Badge'
import { getLevel } from '~/config/levels.config'

const props = defineProps<{
  badge: Badge
  /** Conquistato: il livello associato e' stato completato */
  unlocked: boolean
}>()

const levelNameKey = computed(() => getLevel(props.badge.levelId)?.nameKey ?? 'levels.sum1')
</script>

<style scoped>
.badge-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 14px 10px;
  border-radius: 24px;
  background-color: var(--color-bg-white, #FFFFFF);
  box-shadow: 0 4px 0 var(--color-blue-dark, #4F9BCC);
  text-align: center;
}

/* Bloccato: silhouette spenta, come da design. Il badge resta visibile perche' vedere
   cosa si puo' conquistare e' metà del senso di una collezione */
.badge-card.is-locked {
  background-color: var(--color-bg-secondary, #FFFdf7);
  box-shadow: none;
  opacity: 0.6;
}

.badge-art {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: var(--color-blue-lighter, #E1F4FA);
}

.badge-card.is-locked .badge-art {
  background-color: rgba(0, 0, 0, 0.06);
}

.badge-emoji {
  font-size: 2.25rem;
  line-height: 1;
}

.badge-lock {
  width: 28px;
  height: 28px;
  color: var(--color-text-light, #7A7A8C);
}

.badge-name {
  font-size: 0.95rem;
  font-weight: 800;
  color: var(--color-dark-navy, #2A3C55);
}

.badge-detail {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-light, #7A7A8C);
  line-height: 1.25;
}

@media (max-width: 480px) {
  .badge-art {
    width: 56px;
    height: 56px;
  }

  .badge-emoji {
    font-size: 2rem;
  }
}
</style>
