import { mkdir, writeFile } from 'node:fs/promises'
import { test, expect, type Page } from '@playwright/test'

/**
 * Ogni schermata su ogni iPhone: confronto pixel con la baseline versionata in
 * `docs/screenshots/`, piu' le verifiche di adattamento che una foto non puo' fare da sola.
 *
 * Perche' due esecuzioni diano lo stesso risultato, lo stato e' fissato prima del
 * caricamento: progressione salvata, tema, lingua, e `Math.random` sostituito da un
 * generatore deterministico (gli esercizi sono casuali per natura).
 *
 * Le baseline sono anche la galleria e la fonte del report: un solo insieme di immagini,
 * tre usi. Le misure raccolte qui finiscono in `measurements.json` dentro la cartella del
 * dispositivo, cosi' il report non riporta numeri scritti a mano.
 */

/** Progressione fissa: mostra insieme livello completato, livello corrente e bloccati */
const PROGRESSION = {
  levelStars: { 'sum-1': 25, 'sum-2': 11 },
  badges: { 'badge-crab': '2026-08-22T10:00:00.000Z' },
  legacyStars: 0
}

const SCREENS = [
  { slug: 'home', path: '/', mustFit: true },
  { slug: 'game', path: '/game', mustFit: true },
  // Mappa e bacheca sono liste di sedici elementi: scorrono per costruzione
  { slug: 'map', path: '/map', mustFit: false },
  { slug: 'badges', path: '/badges', mustFit: false }
] as const

const seed = (theme: 'light' | 'dark') => `
  localStorage.setItem('mategioco-progression', ${JSON.stringify(JSON.stringify(PROGRESSION))});
  localStorage.setItem('mategioco-settings', ${JSON.stringify(JSON.stringify({ userName: 'Chiara' }))});
  localStorage.setItem('nuxt-color-mode', '${theme}');

  let seed = 42;
  Math.random = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
`

/** Attende che i font siano pronti e che le icone caricate in asincrono si siano assestate */
const settle = async (page: Page) => {
  await page.evaluate(() => document.fonts.ready)

  let previous = -1
  for (let attempt = 0; attempt < 25; attempt++) {
    const count = await page.locator('svg').count()
    if (count === previous && count > 0) return
    previous = count
    await page.waitForTimeout(150)
  }
}

/**
 * Misura cio' che si vuole poter affermare: quanto contenuto resta fuori dallo schermo,
 * quanto respiro ha la card sopra la barra, quanto sono alti i tasti del tastierino.
 */
const measure = (page: Page) => page.evaluate(() => {
  const rect = (selector: string) => document.querySelector(selector)?.getBoundingClientRect() ?? null
  const main = document.querySelector('main')!
  const gamePage = document.querySelector('.game-page')
  const nav = rect('.bottom-nav')
  const card = rect('.challenge-card')
  const key = rect('button.number-btn')

  return {
    width: window.innerWidth,
    viewport: window.innerHeight,
    overflow: (main.scrollHeight - main.clientHeight)
      + (gamePage ? gamePage.scrollHeight - gamePage.clientHeight : 0),
    cardGap: card && nav ? Math.round(nav.top - card.bottom) : null,
    keyHeight: key ? Math.round(key.height) : null
  }
})

for (const screen of SCREENS) {
  test(`${screen.slug} corrisponde alla baseline`, async ({ page }) => {
    await page.addInitScript(seed('light'))
    await page.goto(screen.path)
    await settle(page)

    await expect(page).toHaveScreenshot(`${screen.slug}.png`)
  })

  test(`${screen.slug} in tema scuro corrisponde alla baseline`, async ({ page }) => {
    await page.addInitScript(seed('dark'))
    await page.goto(screen.path)
    await settle(page)

    await expect(page).toHaveScreenshot(`${screen.slug}-dark.png`)
  })
}

test('adattamento allo schermo', async ({ page }, testInfo) => {
  await page.addInitScript(seed('light'))

  const metrics: Record<string, unknown>[] = []

  for (const screen of SCREENS) {
    await page.goto(screen.path)
    await settle(page)

    const m = await measure(page)
    metrics.push({ screen: screen.slug, ...m })

    if (screen.mustFit) {
      // Home e sessione di gioco le usa un bambino di 4 anni, che non sa di poter
      // scorrere: se il contenuto esce dallo schermo, per lui non esiste
      expect(m.overflow, `${screen.slug} non sta in schermo`).toBe(0)
    }

    if (screen.slug === 'game') {
      // 44px e' la soglia sotto la quale un dito piccolo non centra il tasto: il
      // tastierino puo' restringersi con lo schermo, non sotto questa altezza
      expect(m.keyHeight, 'tasti troppo bassi').toBeGreaterThanOrEqual(44)
      await expect(page.getByRole('button', { name: /OK/ })).toBeInViewport()
    }
  }

  // Le misure vivono accanto alle immagini che descrivono
  const dir = `docs/screenshots/${testInfo.project.name}`
  await mkdir(dir, { recursive: true })
  await writeFile(`${dir}/measurements.json`, JSON.stringify(metrics, null, 2) + '\n', 'utf-8')
})
