import { defineConfig, devices } from '@playwright/test'

/**
 * Test visivi: ogni schermata su ogni iPhone, confrontata con la baseline versionata.
 *
 * E' l'equivalente web di `fastlane snapshot`: la matrice di dispositivi arriva dai preset
 * di Playwright (mantenuti a monte, aggiornati a ogni modello nuovo), il confronto e' pixel
 * per pixel contro le immagini in `docs/screenshots/`, e `npm run visual:report` apre il
 * report locale con le differenze evidenziate.
 *
 * Il motore e' **WebKit**, non Chrome: e' quello che gli iPhone eseguono davvero, quindi
 * font, flexbox e arrotondamenti vengono resi come li vedrebbe un bambino su Safari. E' la
 * ragione per cui i preset dichiarano `defaultBrowserType: 'webkit'`, e per cui non si
 * forza il canale Chrome.
 *
 * I preset usano il **viewport reale di Safari**, non l'altezza dello schermo: su iPhone 16
 * sono 393x659 e non 393x852, perche' le barre del browser occupano il resto. E' la misura
 * che conta per sapere se una schermata sta davvero in schermo.
 */

/** Modelli scelti per coprire lo spettro reale, dal piu' stretto al piu' ampio */
const DEVICE_PRESETS = [
  'iPhone SE (3rd gen)',
  'iPhone 13 Mini',
  'iPhone 12',
  'iPhone 16',
  'iPhone 16 Pro',
  'iPhone 11',
  'iPhone 14 Plus',
  'iPhone 16 Pro Max'
] as const

/** `iPhone SE (3rd gen)` -> `iphone-se-3rd-gen`: il nome diventa la cartella delle baseline */
const slug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export default defineConfig({
  testDir: './tests/visual',
  // Le baseline sono la galleria: un solo insieme di immagini serve da riferimento per il
  // confronto, da catalogo sfogliabile e da fonte per il report
  snapshotPathTemplate: 'docs/screenshots/{projectName}/{arg}{ext}',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }], ['list']],

  use: {
    baseURL: 'http://localhost:4173/MateGioco/',
    locale: 'it-IT',
    timezoneId: 'Europe/Rome'
  },

  expect: {
    toHaveScreenshot: {
      // Le emoji e l'antialiasing possono variare di un pelo fra ambienti: una soglia
      // minima evita fallimenti falsi senza mascherare un cambiamento di layout
      maxDiffPixelRatio: 0.01,
      animations: 'disabled',
      caret: 'hide'
    }
  },

  projects: DEVICE_PRESETS.map(name => ({
    name: slug(name),
    use: { ...devices[name] }
  })),

  // Si fotografa la build statica, non il dev server: ordine di caricamento deterministico
  // e nessun overlay di sviluppo sopra l'interfaccia
  webServer: {
    command: 'node scripts/serve-build.mjs',
    url: 'http://localhost:4173/MateGioco/',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000
  }
})
