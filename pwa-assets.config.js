import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config'

export default defineConfig({
  preset: {
    ...minimal2023Preset,
    // Aggiungi configurazioni iOS e Android specifiche
    apple: {
      sizes: [180, 167, 152, 144, 120],
      padding: 0.1
    },
    maskable: {
      sizes: [512, 192],
      padding: 0.1,
      resizeOptions: {
        background: '#5DADE2'
      }
    },
    transparent: {
      sizes: [512, 192, 144, 96, 72, 48],
      favicons: [[48, 'favicon.ico']]
    }
  },
  images: ['public/icon-1024x1024.svg']
})
