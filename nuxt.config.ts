// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-12-28',

  devtools: { enabled: true },

  modules: ['@nuxt/ui'],

  ui: {
    fonts: false
  },

  ssr: false,

  app: {
    baseURL: process.env.NODE_ENV === 'production' ? '/MateGioco/' : '/',
    head: {
      title: 'MateGioco - Impara la Matematica!',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
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
