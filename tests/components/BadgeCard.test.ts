import { describe, it, expect, beforeEach, vi } from 'vitest'
import { computed } from 'vue'
import { mount } from '@vue/test-utils'
import BadgeCard from '../../app/components/BadgeCard.vue'
import type { Badge } from '~/types/Badge'

// I componenti contano sugli auto-import di Nuxt, che qui non ci sono
vi.stubGlobal('computed', computed)

const badge: Badge = {
  id: 'badge-crab',
  levelId: 'sum-1',
  emoji: '🦀',
  nameKey: 'badges.crab.name',
  descKey: 'badges.crab.desc'
}

const iconStub = { template: '<i :data-icon="name" />', props: ['name'] }

/** Monta il componente con $t che restituisce la chiave, cosi' le asserzioni sono leggibili */
const mountCard = (unlocked: boolean) => mount(BadgeCard, {
  props: { badge, unlocked },
  global: {
    mocks: { $t: (key: string, params?: Record<string, unknown>) => params ? `${key}:${JSON.stringify(params)}` : key },
    // `Icon` viene risolto come NuxtIcon, che senza runtime Nuxt non ha template
    stubs: {
      Icon: iconStub,
      NuxtIcon: iconStub
    }
  }
})

describe('BadgeCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should show the animal and its name when the badge is earned', () => {
    const wrapper = mountCard(true)

    // Conquistato: l'emoji e il nome del Guardiano
    expect(wrapper.text()).toContain('🦀')
    expect(wrapper.text()).toContain('badges.crab.name')
    expect(wrapper.text()).toContain('badges.crab.desc')
  })

  it('should hide the animal behind a lock when not earned', () => {
    const wrapper = mountCard(false)

    // Bloccato: nessuna emoji, nome mascherato, lucchetto al suo posto
    expect(wrapper.text()).not.toContain('🦀')
    expect(wrapper.text()).toContain('???')
    expect(wrapper.find('[data-icon="mdi:lock"]').exists()).toBe(true)
  })

  it('should tell which level unlocks it when not earned', () => {
    const wrapper = mountCard(false)

    // Il suggerimento nomina il livello da completare, non l'id tecnico
    expect(wrapper.text()).toContain('badges.lockedHint')
    expect(wrapper.text()).toContain('levels.sum1')
  })

  it('should mark the locked state on the card', () => {
    expect(mountCard(false).classes()).toContain('is-locked')
    expect(mountCard(true).classes()).not.toContain('is-locked')
  })

  it('should expose a stable selector for tests', () => {
    // La bacheca e la modale contano su questo attributo
    expect(mountCard(true).attributes('data-cy')).toBe('badge-badge-crab')
  })
})
