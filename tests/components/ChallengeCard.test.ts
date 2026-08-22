import { describe, it, expect, vi } from 'vitest'
import { computed } from 'vue'
import { mount } from '@vue/test-utils'
import ChallengeCard from '../../app/components/ChallengeCard.vue'
import { mockSumLevel, mockSubLevel } from '../fixtures/levels'
import type { LevelConfig } from '~/types/Level'

vi.stubGlobal('computed', computed)

const iconStub = { template: '<i :data-icon="name" />', props: ['name'] }

const mountCard = (level: LevelConfig, currentStars: number) => mount(ChallengeCard, {
  props: { level, currentStars },
  global: {
    mocks: { $t: (key: string, params?: Record<string, unknown>) => params ? `${key}:${JSON.stringify(params)}` : key },
    stubs: {
      Icon: iconStub,
      NuxtIcon: iconStub,
      LevelProgress: { template: '<div class="level-progress-stub">{{ level }}|{{ current }}/{{ total }}</div>', props: ['level', 'current', 'total'] }
    }
  }
})

describe('ChallengeCard', () => {

  it('should show the level name and the world it belongs to', () => {
    const wrapper = mountCard(mockSumLevel, 0)

    // Titolo: il livello. Sottotitolo: il Mondo, non un testo fisso
    expect(wrapper.text()).toContain('levels.sum1')
    expect(wrapper.text()).toContain('worlds.sum')
  })

  it('should use the icon of the world', () => {
    // Sottrazioni: icona del suo Mondo, non quella delle somme
    expect(mountCard(mockSubLevel, 0).find('[data-icon="mdi:minus-circle"]').exists()).toBe(true)
  })

  it('should pass the real threshold to the progress bar', () => {
    const wrapper = mountCard(mockSumLevel, 3)

    // Prima qui c'era un 100 scritto a mano: ora arriva dalla configurazione del livello
    expect(wrapper.find('.level-progress-stub').text()).toBe('1|3/8')
  })

  it('should count how many stars are still missing', () => {
    const wrapper = mountCard(mockSumLevel, 3)

    expect(wrapper.text()).toContain('home.starsNeeded:{"count":5}')
  })

  it('should never show a negative number of missing stars', () => {
    // Rigiocando un livello completato si superano le stelline della soglia
    const wrapper = mountCard(mockSumLevel, 12)

    expect(wrapper.text()).toContain('home.starsNeeded:{"count":0}')
  })

  it('should number the level within its world', () => {
    // sub-1 e' il primo del suo Mondo, anche se e' il quinto del percorso
    expect(mountCard(mockSubLevel, 0).find('.level-progress-stub').text()).toBe('1|0/8')
  })
})
