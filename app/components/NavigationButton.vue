<template>
  <button
    class="nav-button"
    :class="{ 'is-disabled': !to }"
    :disabled="!to"
    :data-cy="`nav-${icon.replace('mdi:', '')}`"
    @click="navigate"
  >
    <Icon :name="icon" class="nav-icon" />
    <span class="nav-label">{{ label }}</span>
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{
  icon: string
  label: string
  /** Rotta di destinazione; senza questa il pulsante resta spento invece di non fare nulla */
  to?: string
}>()

const router = useRouter()
const { playClick } = useSound()

const navigate = () => {
  if (!props.to) return

  playClick()
  router.push(props.to)
}
</script>

<style scoped>
.nav-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  background: none;
  border: none;
  cursor: pointer;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); /* bouncy */
  font-family: inherit;
  opacity: 0.6;
}

.nav-button:hover {
  transform: translateY(-4px) scale(1.1);
  opacity: 1;
}

.nav-button:active {
  transform: scale(0.95);
}

/* Voce senza destinazione (arrivera' con la bacheca dei badge): spenta e non premibile */
.nav-button.is-disabled {
  opacity: 0.3;
  cursor: default;
}

.nav-button.is-disabled:hover,
.nav-button.is-disabled:active {
  transform: none;
}

.nav-icon {
  width: 36px; /* Larger icon */
  height: 36px;
  color: var(--color-dark-navy, #2A3C55);
  filter: drop-shadow(0 4px 0 rgba(42, 60, 85, 0.1)); /* Subtle shadow for depth without container */
}

.nav-label {
  margin-top: 4px;
  font-size: 0.75rem; /* smaller label */
  font-weight: 800;
  color: var(--color-dark-navy, #2A3C55);
  font-family: 'Fredoka', sans-serif;
  opacity: 0.8;
}
</style>
