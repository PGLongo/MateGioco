<template>
  <button 
    class="game-btn"
    :class="[
      `variant-${variant}`,
      `size-${size}`,
      { 'is-pill': pill }
    ]"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { useSound } from '#imports'

const props = withDefaults(defineProps<{
  variant?: 'orange' | 'green' | 'blue' | 'red'
  size?: 'md' | 'lg' | 'xl'
  pill?: boolean
  sound?: boolean
}>(), {
  variant: 'orange',
  size: 'md',
  pill: false,
  sound: true
})

const { playClick } = useSound()

const handleClick = () => {
  if (props.sound) {
    playClick()
  }
}
</script>

<style scoped>
.game-btn {
  border: none;
  font-family: 'Fredoka', sans-serif;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.1s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  position: relative;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  text-shadow: 0 1px 2px rgba(0,0,0,0.1);
  transform: translateY(0);
}

.game-btn:active {
  transform: translateY(4px);
  box-shadow: 0 0 0 !important;
}

.game-btn:hover {
  filter: brightness(1.05);
  transform: translateY(-2px);
}

.game-btn:active:hover {
  transform: translateY(4px);
}

/* Variants */
.variant-orange {
  background: var(--color-orange-medium);
  color: white;
  box-shadow: 0 4px 0 var(--color-orange-dark);
}
.variant-orange:hover {
  box-shadow: 0 6px 0 var(--color-orange-dark);
}

.variant-green {
  background: var(--color-green-primary);
  color: white;
  box-shadow: 0 4px 0 var(--color-green-dark);
}
.variant-green:hover {
  box-shadow: 0 6px 0 var(--color-green-dark);
}

/* Sizes */
.size-md {
  padding: 12px 24px;
  font-size: 1.5rem;
  border-radius: 16px;
}

.size-lg {
  padding: 16px 32px;
  font-size: 1.8rem;
  border-radius: 20px;
}

.size-xl {
  padding: 24px 48px;
  font-size: 2.5rem;
  width: 100%;
}

/* Pill override */
.is-pill {
  border-radius: 9999px;
}
</style>
