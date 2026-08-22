// https://nuxt.com/docs/api/configuration/nuxt-config



export default defineNuxtConfig({
  compatibilityDate: '2024-12-29',

  future: {
    compatibilityVersion: 4
  },

  devtools: { enabled: true },

  modules: ['@nuxt/ui', '@vite-pwa/nuxt', '@nuxtjs/color-mode', '@nuxt/icon', '@nuxt/hints', '@nuxtjs/i18n', '@nuxt/eslint'],

  i18n: {
    locales: [
      {
        code: 'it',
        language: 'it-IT',
        file: 'it-IT.json',
        name: 'Italiano'
      },
      {
        code: 'en',
        language: 'en-US',
        file: 'en-US.json',
        name: 'English'
      }
    ],
    defaultLocale: 'it',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    }
  },

  ui: {
    fonts: false
  },

  colorMode: {
    classSuffix: '',
    // 'system' segue il dispositivo: prima era inchiodato a 'light' e le regole .dark di
    // main.css non venivano mai applicate. L'interruttore nell'header sovrascrive la scelta
    preference: 'system',
    fallback: 'light'
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'MateGioco - Impara la Matematica',
      short_name: 'MateGioco',
      description: 'App educativa di matematica per bambini di 4 anni',
      theme_color: '#78CBE8',
      background_color: '#FFF9F0',
      display: 'standalone',
      orientation: 'portrait',
      lang: 'it',
      icons: [
        {
          src: process.env.NODE_ENV === 'production' ? '/MateGioco/pwa-512x512.png?v=2' : '/pwa-512x512.png?v=2',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: process.env.NODE_ENV === 'production' ? '/MateGioco/pwa-192x192.png?v=2' : '/pwa-192x192.png?v=2',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: process.env.NODE_ENV === 'production' ? '/MateGioco/pwa-144x144.png?v=2' : '/pwa-144x144.png?v=2',
          sizes: '144x144',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: process.env.NODE_ENV === 'production' ? '/MateGioco/pwa-96x96.png?v=2' : '/pwa-96x96.png?v=2',
          sizes: '96x96',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: process.env.NODE_ENV === 'production' ? '/MateGioco/pwa-72x72.png?v=2' : '/pwa-72x72.png?v=2',
          sizes: '72x72',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: process.env.NODE_ENV === 'production' ? '/MateGioco/pwa-48x48.png?v=2' : '/pwa-48x48.png?v=2',
          sizes: '48x48',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: process.env.NODE_ENV === 'production' ? '/MateGioco/maskable-icon-512x512.png?v=2' : '/maskable-icon-512x512.png?v=2',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        },
        {
          src: process.env.NODE_ENV === 'production' ? '/MateGioco/maskable-icon-192x192.png?v=2' : '/maskable-icon-192x192.png?v=2',
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
      // Con ssr: false questo e' l'unico posto che finisce nell'HTML servito: l'attributo
      // lang deve esserci gia' qui (defaultLocale), poi app.vue lo riallinea alla lingua
      // effettivamente rilevata
      htmlAttrs: {
        lang: 'it'
      },
      title: 'MateGioco - Impara la Matematica!',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' },
        { name: 'description', content: 'App educativa di matematica per bambini' },
        { name: 'theme-color', content: '#78CBE8' }
      ],
      link: [
        { rel: 'icon', href: process.env.NODE_ENV === 'production' ? '/MateGioco/favicon.ico?v=2' : '/favicon.ico?v=2', sizes: 'any' },
        { rel: 'icon', type: 'image/svg+xml', href: process.env.NODE_ENV === 'production' ? '/MateGioco/icon-1024x1024.svg?v=2' : '/icon-1024x1024.svg?v=2' },
        { rel: 'apple-touch-icon', href: process.env.NODE_ENV === 'production' ? '/MateGioco/apple-touch-icon-180x180.png?v=2' : '/apple-touch-icon-180x180.png?v=2' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&display=swap' }

      ]
    }
  },

  css: ['~/assets/css/main.css']
})