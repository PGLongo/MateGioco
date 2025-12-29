// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-12-28',

  devtools: { enabled: true },

  modules: ['@nuxt/ui', '@vite-pwa/nuxt'],

  ui: {
    fonts: false
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'MateGioco - Impara la Matematica',
      short_name: 'MateGioco',
      description: 'App educativa di matematica per bambini di 4 anni',
      theme_color: '#5DADE2',
      background_color: '#E8F8F5',
      display: 'standalone',
      orientation: 'portrait',
      lang: 'it',
      icons: [
        {
          src: '/icon-192x192.svg',
          sizes: '192x192',
          type: 'image/svg+xml',
          purpose: 'any'
        },
        {
          src: '/icon-512x512.svg',
          sizes: '512x512',
          type: 'image/svg+xml',
          purpose: 'any'
        },
        {
          src: '/icon-192x192-maskable.svg',
          sizes: '192x192',
          type: 'image/svg+xml',
          purpose: 'maskable'
        },
        {
          src: '/icon-512x512-maskable.svg',
          sizes: '512x512',
          type: 'image/svg+xml',
          purpose: 'maskable'
        }
      ]
    },
    workbox: {
      navigateFallback: undefined,
      globPatterns: ['**/*.{js,css,html,png,svg,ico}']
    },
    client: {
      installPrompt: true
    },
    devOptions: {
      enabled: true,
      type: 'module'
    }
  },

  ssr: false,

  app: {
    baseURL: process.env.NODE_ENV === 'production' ? '/MateGioco/' : '/',
    head: {
      title: 'MateGioco - Impara la Matematica!',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' },
        { name: 'description', content: 'App educativa di matematica per bambini' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap' }
      ]
    }
  },

  css: ['~/assets/css/main.css']
})
