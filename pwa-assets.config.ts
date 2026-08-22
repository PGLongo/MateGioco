import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config'

export default defineConfig({
    preset: {
        ...minimal2023Preset,
        // Aggiungi configurazioni iOS e Android specifiche
        apple: {
            sizes: [180, 167, 152, 144, 120],
            padding: 0.1,
            resizeOptions: {
                // iOS non ammette trasparenza nelle icone: senza uno sfondo esplicito
                // comporrebbe su nero
                background: '#FFF9F0'
            }
        },
        maskable: {
            sizes: [512, 192],
            padding: 0.1,
            resizeOptions: {
                // Crema, non l'azzurro dell'app: il corpo della calcolatrice e' #78CBE8, e
                // su uno sfondo dello stesso colore la sua sagoma spariva, lasciando schermo
                // e faccia a galleggiare nel vuoto
                background: '#FFF9F0'
            }
        },
        transparent: {
            sizes: [512, 192, 144, 96, 72, 48],
            favicons: [[48, 'favicon.ico']]
        }
    },
    images: ['public/icon-1024x1024.svg']
})
