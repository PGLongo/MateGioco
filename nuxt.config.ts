// https://nuxt.com/docs/api/configuration/nuxt-config
const isDev = process.env.NODE_ENV !== 'production'
const baseURL = isDev ? '/' : '/MateGioco/'

export default defineNuxtConfig({
  compatibilityDate: '2024-12-28',

  devtools: { enabled: true },

  modules: ['@nuxt/ui', '@vite-pwa/nuxt', '@nuxtjs/color-mode', '@nuxt/icon'],

  icon: {
    serverBundle: {
      collections: ['mdi']
    }
  },

  ui: {
    fonts: false
  },

  colorMode: {
    classSuffix: '',
    preference: 'light',
    fallback: 'light'
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
          src: process.env.NODE_ENV === 'production' ? '/MateGioco/pwa-512x512.png' : '/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: process.env.NODE_ENV === 'production' ? '/MateGioco/pwa-192x192.png' : '/pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: process.env.NODE_ENV === 'production' ? '/MateGioco/pwa-144x144.png' : '/pwa-144x144.png',
          sizes: '144x144',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: process.env.NODE_ENV === 'production' ? '/MateGioco/pwa-96x96.png' : '/pwa-96x96.png',
          sizes: '96x96',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: process.env.NODE_ENV === 'production' ? '/MateGioco/pwa-72x72.png' : '/pwa-72x72.png',
          sizes: '72x72',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: process.env.NODE_ENV === 'production' ? '/MateGioco/pwa-48x48.png' : '/pwa-48x48.png',
          sizes: '48x48',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: process.env.NODE_ENV === 'production' ? '/MateGioco/maskable-icon-512x512.png' : '/maskable-icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        },
        {
          src: process.env.NODE_ENV === 'production' ? '/MateGioco/maskable-icon-192x192.png' : '/maskable-icon-192x192.png',
          sizes: '192x192',
          type: 'image/png',
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
        { rel: 'icon', href: process.env.NODE_ENV === 'production' ? '/MateGioco/favicon.ico' : '/favicon.ico', sizes: 'any' },
        { rel: 'icon', type: 'image/svg+xml', href: process.env.NODE_ENV === 'production' ? '/MateGioco/icon-1024x1024.svg' : '/icon-1024x1024.svg' },
        { rel: 'apple-touch-icon', href: process.env.NODE_ENV === 'production' ? '/MateGioco/apple-touch-icon-180x180.png' : '/apple-touch-icon-180x180.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap' }
      ]
    }
  },

  css: ['~/assets/css/main.css']
})
