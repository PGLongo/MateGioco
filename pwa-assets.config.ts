import { defineConfig } from '@vite-pwa/assets-generator/config'

export default defineConfig({
    images: ['public/icon-1024x1024.svg'],
    preset: {
        transparent: {
            sizes: [64, 192, 512],
            favicons: [
                [16, 'favicon-16x16.png'],
                [32, 'favicon-32x32.png'],
                [48, 'favicon.ico']
            ]
        },
        maskable: {
            sizes: [192, 512],
            padding: 0.1
        },
        apple: {
            sizes: [120, 152, 167, 180],
            padding: 0
        }
    }
})
