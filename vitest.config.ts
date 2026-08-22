import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    // Logica pura e composable: serve solo un DOM per localStorage, non l'ambiente Nuxt
    // completo (piu' lento e qui inutile)
    environment: 'happy-dom',
    include: ['tests/**/*.test.ts'],
    globals: true
  }
})
