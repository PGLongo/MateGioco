/**
 * Genera la galleria di screenshot di MateGioco: ogni schermata su ogni risoluzione
 * iPhone, piu' la galleria HTML per sfogliarle.
 *
 * Uso: `npm run screenshots` (fa la build e serve da se' l'output statico).
 *
 * Gli screenshot sono versionati, quindi devono essere **riproducibili**: uno screenshot
 * che cambia a ogni esecuzione riempie la storia di git di rumore e rende inutile il
 * confronto fra due versioni. Per questo lo script:
 * - fotografa la **build statica** (`.output/public`) e non il dev server, che carica i
 *   moduli in ordine variabile e faceva uscire un esercizio diverso a ogni esecuzione,
 *   oltre a sovrapporre il badge dei DevTools con il tempo di caricamento in millisecondi;
 * - fissa la progressione salvata, il tema e la lingua;
 * - sostituisce `Math.random` con un generatore deterministico;
 * - congela le animazioni, che venivano fotografate a metà ciclo.
 *
 * La build usa `baseURL: '/MateGioco/'`, quindi il server statico monta l'output su quel
 * prefisso: e' esattamente il percorso di GitHub Pages.
 */

import { createServer } from 'node:http'
import { readFile, mkdir, writeFile, rm } from 'node:fs/promises'
import { join, extname } from 'node:path'
import { chromium } from 'playwright-core'

const PORT = Number(process.env.SCREENSHOT_PORT ?? 4173)
const BASE_PATH = '/MateGioco'
const BASE_URL = process.env.SCREENSHOT_BASE_URL ?? `http://localhost:${PORT}${BASE_PATH}`
const BUILD_DIR = '.output/public'
const OUT_DIR = 'docs/screenshots'

/** Risoluzioni logiche (punti CSS) degli iPhone in circolazione, in verticale */
const DEVICES = [
  { slug: 'iphone-se', label: 'iPhone SE', note: 'SE 2/3, 6, 7, 8', width: 375, height: 667 },
  { slug: 'iphone-13-mini', label: 'iPhone 13 mini', note: 'X, XS, 11 Pro, 12/13 mini', width: 375, height: 812 },
  { slug: 'iphone-14', label: 'iPhone 14', note: '12, 13, 14', width: 390, height: 844 },
  { slug: 'iphone-16', label: 'iPhone 16', note: '14 Pro, 15, 16', width: 393, height: 852, reference: true },
  { slug: 'iphone-16-pro', label: 'iPhone 16 Pro', note: '16 Pro', width: 402, height: 874 },
  { slug: 'iphone-11', label: 'iPhone 11', note: 'XR, XS Max, 11', width: 414, height: 896 },
  { slug: 'iphone-14-plus', label: 'iPhone 14 Plus', note: '12/13 Pro Max, 14 Plus', width: 428, height: 926 },
  { slug: 'iphone-15-pro-max', label: 'iPhone 15 Pro Max', note: '15 Pro Max, 16 Plus', width: 430, height: 932 },
  { slug: 'iphone-16-pro-max', label: 'iPhone 16 Pro Max', note: '16 Pro Max', width: 440, height: 956 }
]

/** Le schermate che vale la pena guardare, con lo stato che le rende significative */
const SCREENS = [
  { slug: 'home', label: 'Home', path: '/' },
  { slug: 'game', label: 'Sessione di gioco', path: '/game' },
  { slug: 'map', label: 'Mappa dei livelli', path: '/map' },
  { slug: 'badges', label: 'Bacheca dei Guardiani', path: '/badges' }
]

/**
 * Progressione fissa: due Mondi aperti, il primo livello completato con il suo Guardiano,
 * il secondo a metà. Mostra tutti gli stati dell'interfaccia (completato, corrente,
 * bloccato) in un colpo solo.
 */
const PROGRESSION = {
  levelStars: { 'sum-1': 25, 'sum-2': 11 },
  badges: { 'badge-crab': '2026-08-22T10:00:00.000Z' },
  legacyStars: 0
}

const SETTINGS = { userName: 'Chiara' }

/**
 * Animazioni congelate: il pulse del pulsante e il bounce del titolo venivano fotografati
 * a un punto diverso del ciclo a ogni esecuzione. Fermarle rende lo screenshot
 * riproducibile, e mostra il layout invece di un fotogramma sfocato.
 */
const FREEZE_ANIMATIONS = `
  *, *::before, *::after {
    animation: none !important;
    transition: none !important;
  }
`

const seedScript = (theme) => `
  // Progressione e preferenze fisse
  localStorage.setItem('mategioco-progression', ${JSON.stringify(JSON.stringify(PROGRESSION))});
  localStorage.setItem('mategioco-settings', ${JSON.stringify(JSON.stringify(SETTINGS))});
  localStorage.setItem('nuxt-color-mode', '${theme}');
  localStorage.setItem('i18n_redirected', 'it');

  // Generatore deterministico: gli esercizi mostrati non cambiano fra due esecuzioni
  let seed = 42;
  Math.random = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
`

/**
 * Attende che la pagina sia davvero ferma: i font caricati e il numero di icone SVG
 * stabile. Le icone di `@nuxt/icon` arrivano in modo asincrono, e con un semplice timeout
 * capitava di fotografare la mappa con un'icona ancora mancante: due esecuzioni, due file
 * diversi.
 */
const waitUntilSettled = async (page) => {
  await page.evaluate(() => document.fonts.ready)

  let previous = -1
  for (let attempt = 0; attempt < 25; attempt++) {
    const count = await page.locator('svg').count()
    if (count === previous && count > 0) return
    previous = count
    await page.waitForTimeout(150)
  }
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8'
}

/** Serve `.output/public` sotto il prefisso della baseURL di produzione */
const startStaticServer = () => new Promise((resolve, reject) => {
  const server = createServer(async (req, res) => {
    try {
      let path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
      if (path.startsWith(BASE_PATH)) path = path.slice(BASE_PATH.length)
      if (path === '' || path.endsWith('/')) path += 'index.html'
      if (!extname(path)) path += '/index.html'

      const body = await readFile(join(BUILD_DIR, path))
      res.writeHead(200, { 'content-type': MIME[extname(path)] ?? 'application/octet-stream' })
      res.end(body)
    } catch {
      res.writeHead(404, { 'content-type': 'text/plain' })
      res.end('not found')
    }
  })

  server.on('error', reject)
  server.listen(PORT, () => resolve(server))
})

const galleryHtml = (shots) => {
  const byScreen = SCREENS.map(screen => ({
    ...screen,
    devices: DEVICES.map(device => ({
      ...device,
      light: shots.find(s => s.screen === screen.slug && s.device === device.slug && s.theme === 'light')?.file,
      dark: shots.find(s => s.screen === screen.slug && s.device === device.slug && s.theme === 'dark')?.file
    }))
  }))

  return `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>MateGioco - Galleria schermate</title>
<style>
  :root { color-scheme: light dark; --bg: #f4f6f8; --panel: #fff; --ink: #1f2933; --muted: #6b7785; --line: #e1e6ea; --accent: #4F9BCC; }
  @media (prefers-color-scheme: dark) {
    :root { --bg: #1b1f23; --panel: #24292e; --ink: #e8eef4; --muted: #9aa5b1; --line: #333a41; }
  }
  * { box-sizing: border-box; }
  body { margin: 0; font: 15px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif; background: var(--bg); color: var(--ink); }
  header { padding: 20px 24px; border-bottom: 1px solid var(--line); background: var(--panel); position: sticky; top: 0; z-index: 10; }
  h1 { margin: 0 0 4px; font-size: 1.2rem; }
  .meta { color: var(--muted); font-size: .85rem; }
  .controls { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; margin-top: 12px; }
  .controls label { font-size: .85rem; color: var(--muted); }
  select, button { font: inherit; padding: 6px 10px; border-radius: 8px; border: 1px solid var(--line); background: var(--panel); color: var(--ink); cursor: pointer; }
  main { padding: 24px; display: flex; flex-direction: column; gap: 40px; }
  section h2 { font-size: 1.05rem; margin: 0 0 4px; }
  section .hint { color: var(--muted); font-size: .85rem; margin: 0 0 16px; }
  .row { display: flex; gap: 20px; overflow-x: auto; padding-bottom: 8px; }
  figure { margin: 0; flex: 0 0 auto; }
  figure img { display: block; border: 1px solid var(--line); border-radius: 18px; background: var(--panel); max-width: none; }
  figcaption { margin-top: 8px; font-size: .8rem; color: var(--muted); text-align: center; }
  figcaption strong { display: block; color: var(--ink); font-size: .85rem; }
  .zoom-50 figure img { transform-origin: top left; }
</style>
</head>
<body>
<header>
  <h1>MateGioco - Galleria schermate</h1>
  <div class="meta">Generata da <code>npm run screenshots</code>. Non modificare a mano: rigenerala.</div>
  <div class="controls">
    <label>Tema
      <select id="tema">
        <option value="light">chiaro</option>
        <option value="dark">scuro (solo dispositivo di riferimento)</option>
      </select>
    </label>
    <label>Scala
      <select id="scala">
        <option value="1">100%</option>
        <option value="0.6" selected>60%</option>
        <option value="0.4">40%</option>
      </select>
    </label>
  </div>
</header>
<main>
${byScreen.map(screen => `  <section data-screen="${screen.slug}">
    <h2>${screen.label}</h2>
    <p class="hint"><code>${screen.path}</code></p>
    <div class="row">
${screen.devices.map(d => `      <figure data-theme-light="${d.light ?? ''}" data-theme-dark="${d.dark ?? ''}">
        <img src="${d.light}" width="${d.width}" height="${d.height}" alt="${screen.label} su ${d.label}" loading="lazy">
        <figcaption><strong>${d.label}</strong>${d.width}x${d.height}<br>${d.note}</figcaption>
      </figure>`).join('\n')}
    </div>
  </section>`).join('\n')}
</main>
<script>
  const tema = document.getElementById('tema')
  const scala = document.getElementById('scala')

  const applica = () => {
    const t = tema.value
    const s = Number(scala.value)
    for (const fig of document.querySelectorAll('figure')) {
      const src = fig.dataset['theme' + t.charAt(0).toUpperCase() + t.slice(1)]
      const img = fig.querySelector('img')
      // in tema scuro esiste solo il dispositivo di riferimento: gli altri restano chiari
      img.src = src || fig.dataset.themeLight
      img.style.width = (img.getAttribute('width') * s) + 'px'
      img.style.height = 'auto'
    }
  }

  tema.addEventListener('change', applica)
  scala.addEventListener('change', applica)
  applica()
</script>
</body>
</html>
`
}

const run = async () => {
  const server = await startStaticServer()
  console.log(`Build statica servita su ${BASE_URL}`)

  const shots = []
  let browser

  try {
    browser = await chromium.launch({ channel: 'chrome' })

    await rm(OUT_DIR, { recursive: true, force: true })

    for (const device of DEVICES) {
      const themes = device.reference ? ['light', 'dark'] : ['light']

      for (const theme of themes) {
        const context = await browser.newContext({
          viewport: { width: device.width, height: device.height },
          deviceScaleFactor: 1,
          isMobile: true,
          hasTouch: true,
          locale: 'it-IT'
        })
        await context.addInitScript(seedScript(theme))
        const page = await context.newPage()
        await page.addStyleTag({ content: FREEZE_ANIMATIONS }).catch(() => {})

        for (const screen of SCREENS) {
          await page.goto(`${BASE_URL}${screen.path}`, { waitUntil: 'networkidle' })

          await page.addStyleTag({ content: FREEZE_ANIMATIONS })
          await waitUntilSettled(page)

          const dir = join(OUT_DIR, device.slug)
          await mkdir(dir, { recursive: true })
          const name = theme === 'dark' ? `${screen.slug}-dark.png` : `${screen.slug}.png`
          await page.screenshot({ path: join(dir, name) })

          shots.push({ device: device.slug, screen: screen.slug, theme, file: `${device.slug}/${name}` })
          console.log(`  ${device.slug}/${name}`)
        }

        await context.close()
      }
    }

    await writeFile(join(OUT_DIR, 'index.html'), galleryHtml(shots), 'utf-8')
    console.log(`\n${shots.length} screenshot in ${OUT_DIR}/`)
    console.log(`Apri ${OUT_DIR}/index.html per sfogliarli.`)
  } finally {
    if (browser) await browser.close()
    server.close()
  }
}

await run()
