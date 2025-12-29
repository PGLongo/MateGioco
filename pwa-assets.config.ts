import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config'

export default defineConfig({
    preset: minimal2023Preset,
    images: ['public/icon-1024x1024.svg']
})
