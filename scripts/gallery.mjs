/**
 * Costruisce la galleria sfogliabile (`docs/screenshots/index.html`) dalle immagini che i
 * test visivi hanno prodotto, e unisce le misure dei singoli dispositivi in un solo file.
 *
 * Uso: `npm run gallery` (dopo `npm run visual` o `npm run visual:update`).
 *
 * Non apre nessun browser: le immagini sono le baseline dei test, quindi cio' che si sfoglia
 * e' esattamente cio' che il confronto pixel considera corretto. Un secondo giro di catture
 * avrebbe potuto divergere, e sarebbe stato il modo piu' rapido di rendere la galleria una
 * bugia.
 */

import { readFile, writeFile, readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'

const DIR = 'docs/screenshots'

const SCREENS = [
  { slug: 'home', label: 'Home', path: '/' },
  { slug: 'game', label: 'Sessione di gioco', path: '/game' },
  { slug: 'map', label: 'Mappa dei livelli', path: '/map' },
  { slug: 'badges', label: 'Bacheca dei Guardiani', path: '/badges' }
]

/** I dispositivi sono le cartelle che i progetti Playwright hanno creato */
const readDevices = async () => {
  const entries = await readdir(DIR)
  const devices = []

  for (const name of entries) {
    if (!(await stat(join(DIR, name))).isDirectory()) continue

    let metrics = []
    try {
      metrics = JSON.parse(await readFile(join(DIR, name, 'measurements.json'), 'utf-8'))
    } catch {
      // un dispositivo puo' avere le immagini senza le misure, se i test sono stati filtrati
    }

    devices.push({
      slug: name,
      label: name.replace(/-/g, ' ').replace(/\biphone\b/i, 'iPhone').replace(/\b3rd gen\b/, '(3ª gen)'),
      height: metrics[0]?.viewport ?? 0,
      metrics
    })
  }

  // Ordinati per altezza del viewport: e' la variabile che decide se una schermata ci sta
  return devices.sort((a, b) => a.height - b.height)
}

const build = async () => {
  const devices = await readDevices()

  const metricOf = (device, screen) => device.metrics.find(m => m.screen === screen)

  const verdict = (screen, m) => {
    if (!m) return { label: '—', tone: 'neutral' }
    if (m.overflow === 0) return { label: 'in schermo', tone: 'good' }
    if (screen === 'map' || screen === 'badges') return { label: `scorre ${m.overflow}px`, tone: 'neutral' }
    return { label: `scroll ${m.overflow}px`, tone: 'warn' }
  }

  const html = `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>MateGioco - Galleria schermate</title>
<style>
  :root {
    color-scheme: light dark;
    --paper: #F2F5F8; --surface: #FFF; --ink: #1B2430; --muted: #55636F; --line: #D8E0E8;
    --good: #3F7C2C; --good-bg: #E7F2E1; --warn: #B3591A; --warn-bg: #FBEADD; --chip: #E8EDF2;
    --scale: .55;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --paper: #14181D; --surface: #1D232A; --ink: #E6EDF3; --muted: #9EAEBC; --line: #2C343D;
      --good: #96CE79; --good-bg: #1F2C1C; --warn: #E0A264; --warn-bg: #2E2318; --chip: #232B33;
    }
  }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--paper); color: var(--ink);
    font: 15px/1.55 -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif; }
  header { padding: 28px 24px 20px; border-bottom: 1px solid var(--line); background: var(--surface); }
  h1 { margin: 0 0 6px; font-size: 1.25rem; }
  .meta { color: var(--muted); font-size: .86rem; max-width: 70ch; }
  .controls { display: flex; gap: 8px; align-items: center; margin-top: 14px; }
  .controls span { font-size: .78rem; text-transform: uppercase; letter-spacing: .1em; color: var(--muted); }
  button { font: inherit; font-size: .82rem; padding: 4px 12px; border-radius: 999px;
    border: 1px solid var(--line); background: var(--surface); color: var(--ink); cursor: pointer; }
  button[aria-pressed="true"] { border-color: currentcolor; font-weight: 600; }
  main { padding: 24px; display: flex; flex-direction: column; gap: 36px; }
  h2 { font-size: 1.05rem; margin: 0 0 2px; }
  .path { font-family: ui-monospace, Menlo, monospace; font-size: .8rem; color: var(--muted); margin: 0 0 14px; }
  .rail { display: flex; gap: 18px; overflow-x: auto; padding-bottom: 8px; }
  figure { margin: 0; flex: 0 0 auto; }
  figure img { display: block; border: 1px solid var(--line); border-radius: 18px; background: var(--surface); }
  figcaption { margin-top: 8px; font-size: .78rem; color: var(--muted); display: flex; flex-direction: column; gap: 3px; }
  figcaption b { color: var(--ink); font-size: .84rem; font-weight: 600; }
  .chip { align-self: flex-start; font-family: ui-monospace, Menlo, monospace; font-size: .72rem;
    padding: .15em .5em; border-radius: 5px; background: var(--chip); color: var(--muted); }
  .chip.good { background: var(--good-bg); color: var(--good); }
  .chip.warn { background: var(--warn-bg); color: var(--warn); }
</style>
</head>
<body>
<header>
  <h1>MateGioco - Galleria schermate</h1>
  <p class="meta">Le immagini sono le baseline dei test visivi: quello che vedi qui e' quello
  che <code>npm run visual</code> considera corretto. Rigenerala con <code>npm run
  visual:update</code> e poi <code>npm run gallery</code>. Le etichette accanto a ogni
  dispositivo vengono dalle misure prese durante i test.</p>
  <div class="controls">
    <span>Scala</span>
    <button type="button" data-scale="0.4">40%</button>
    <button type="button" data-scale="0.55" aria-pressed="true">55%</button>
    <button type="button" data-scale="1">100%</button>
  </div>
</header>
<main>
${SCREENS.map(screen => `  <section>
    <h2>${screen.label}</h2>
    <p class="path">${screen.path}</p>
    <div class="rail">
${devices.map(device => {
  const m = metricOf(device, screen.slug)
  const v = verdict(screen.slug, m)
  return `      <figure>
        <img src="${device.slug}/${screen.slug}.png" alt="${screen.label} su ${device.label}" loading="lazy" data-shot>
        <figcaption><b>${device.label}</b>${m ? `viewport ${m.viewport}pt` : ''}<span class="chip ${v.tone}">${v.label}</span></figcaption>
      </figure>`
}).join('\n')}
    </div>
  </section>`).join('\n')}

  <section>
    <h2>Tema scuro</h2>
    <p class="path">stesse schermate, tema scuro</p>
    <div class="rail">
${devices.flatMap(device => SCREENS.map(screen => `      <figure>
        <img src="${device.slug}/${screen.slug}-dark.png" alt="${screen.label} in tema scuro su ${device.label}" loading="lazy" data-shot>
        <figcaption><b>${screen.label}</b>${device.label}</figcaption>
      </figure>`)).join('\n')}
    </div>
  </section>
</main>
<script>
  const applica = (scala) => {
    for (const img of document.querySelectorAll('[data-shot]')) {
      if (!img.dataset.w && img.naturalWidth) img.dataset.w = img.naturalWidth
      const base = Number(img.dataset.w || 390)
      img.style.width = (base * scala) + 'px'
      img.style.height = 'auto'
    }
  }

  const bottoni = document.querySelectorAll('.controls button')
  for (const b of bottoni) {
    b.addEventListener('click', () => {
      for (const other of bottoni) other.setAttribute('aria-pressed', String(other === b))
      applica(Number(b.dataset.scale))
    })
  }

  addEventListener('load', () => applica(0.55))
</script>
</body>
</html>
`

  await writeFile(join(DIR, 'index.html'), html, 'utf-8')

  // Misure unite, per il report autonomo
  await writeFile(
    join(DIR, 'measurements.json'),
    JSON.stringify({ screens: SCREENS, devices: devices.map(({ slug, label, height, metrics }) => ({ slug, label, height, metrics })) }, null, 2) + '\n',
    'utf-8'
  )

  console.log(`Galleria in ${DIR}/index.html — ${devices.length} dispositivi, ${SCREENS.length} schermate`)
}

await build()
