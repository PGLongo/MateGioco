import type { Config } from 'tailwindcss'

export default <Config>{
    content: [
        './app/components/**/*.{js,vue,ts}',
        './app/layouts/**/*.vue',
        './app/pages/**/*.vue',
        './app/plugins/**/*.{js,ts}',
        './app/app.vue',
        './app/error.vue'
    ],
    theme: {
        extend: {
            colors: {
                'sky-blue': '#78CBE8',
                'bingo-orange': '#F9C05E',
                'soft-green': '#88C941',
                'dark-navy': '#2A3C55',
                'card-white': '#FFFFFF'
            },
            fontFamily: {
                sans: ['Fredoka', 'sans-serif']
            }
        }
    }
}
