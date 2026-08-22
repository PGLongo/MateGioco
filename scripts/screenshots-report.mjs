/**
 * Costruisce un report visivo autonomo dalla galleria: un unico file HTML con gli
 * screenshot incorporati (data URI) e le misure raccolte durante la cattura.
 *
 * Uso: `npm run screenshots:report` (richiede una galleria gia' generata).
 *
 * Serve a **guardare** e a **mandare**: la galleria in `docs/screenshots/index.html` e' un
 * file che va aperto dal repository, questo e' un file solo, apribile da telefono e
 * pubblicabile. Le misure non sono scritte a mano: arrivano da `measurements.json`, prodotto
 * dallo stesso script che scatta gli screenshot, quindi non possono divergere da cio' che
 * si vede nelle immagini.
 */

import { readFile, writeFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'

const GALLERY_DIR = 'docs/screenshots'
const OUT_FILE = process.env.REPORT_OUT ?? 'docs/screenshots/report.html'

const APP_VERSION = JSON.parse(await readFile('package.json', 'utf-8')).version

const dataUri = async (path) => `data:image/png;base64,${(await readFile(path)).toString('base64')}`

/** Le tre cose che la galleria ha intercettato, con i numeri prima e dopo */
const FINDINGS = [
  {
    title: 'La card finiva sotto la barra',
    where: 'Home, iPhone SE',
    before: 'sforava di 55px',
    after: 'dentro, 8px di respiro',
    body: 'Il layout azzerava il padding inferiore su tutte le larghezze mobile, quindi la card toccava la barra di navigazione e la sua ombra veniva ritagliata. Su iPhone SE non ci stava del tutto.'
  },
  {
    title: 'La calcolatrice chiedeva scroll',
    where: 'Sessione di gioco, iPhone SE',
    before: '89px di scroll',
    after: 'nessuno scroll',
    body: 'Sotto i 720pt di altezza si comprimono i costi verticali fissi: cerchio dell’icona, spaziature, header e barra. I tasti restano sopra i 44px, che e’ la soglia per il dito di un bambino.'
  },
  {
    title: 'Non si tornava alla home',
    where: 'Mappa e bacheca',
    before: 'solo il tasto del browser',
    after: 'voce "Casa" nella barra',
    body: 'Il pulsante "Indietro" e’ passato dalla pagina alla barra in alto, dove lo si cerca su mobile, e la barra in basso ha ora tre voci con la pagina corrente evidenziata.'
  }
]

const LIMITS = [
  ['Orientamento orizzontale', 'L’app dichiara <code>orientation: portrait</code> nel manifest PWA.'],
  ['Modali', 'Fine sessione e nuovo Guardiano richiedono di giocare una partita intera.'],
  ['Densita’ dei pixel', 'Catture a 1x, in punti CSS: servono a valutare il layout, non la resa dei font su retina.']
]

const esc = (text) => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const verdict = (screen, scroll) => {
  if (scroll === 0) return { label: 'in schermo', tone: 'good' }
  if (screen === 'map' || screen === 'badges') return { label: `scorre ${scroll}px`, tone: 'neutral' }
  return { label: `scroll ${scroll}px`, tone: 'warn' }
}

const build = async () => {
  const data = JSON.parse(await readFile(join(GALLERY_DIR, 'measurements.json'), 'utf-8'))
  const devices = [...data.devices].sort((a, b) => a.height - b.height)
  const { screens, metrics } = data

  const metricFor = (device, screen) => metrics.find(m => m.device === device && m.screen === screen)

  // Immagini: si incorporano per avere un file solo, apribile e inviabile senza il repository
  const images = {}
  for (const device of devices) {
    const files = await readdir(join(GALLERY_DIR, device.slug))
    for (const file of files) {
      images[`${device.slug}/${file}`] = await dataUri(join(GALLERY_DIR, device.slug, file))
    }
  }

  const reference = devices.find(d => d.reference) ?? devices[0]

  const shotFigure = (device, screen, dark = false) => {
    const key = `${device.slug}/${screen.slug}${dark ? '-dark' : ''}.png`
    if (!images[key]) return ''
    const m = metricFor(device.slug, screen.slug)
    const v = m ? verdict(screen.slug, m.scroll) : null

    return `
        <figure class="shot">
          <img src="${images[key]}" width="${device.width}" height="${device.height}"
               alt="${esc(screen.label)} su ${esc(device.label)}" loading="lazy">
          <figcaption>
            <span class="shot-name">${esc(device.label)}</span>
            <span class="shot-size">${device.width}&times;${device.height}</span>
            ${v ? `<span class="chip chip-${v.tone}">${esc(v.label)}</span>` : ''}
          </figcaption>
        </figure>`
  }

  const html = `<title>MateGioco su iPhone</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&display=swap">
<style>
  :root {
    --ink: #1B2430;
    --ink-soft: #55636F;
    --paper: #F2F5F8;
    --surface: #FFFFFF;
    --line: #D8E0E8;
    --accent: #2E7FB0;
    --good: #3F7C2C;
    --good-bg: #E7F2E1;
    --warn: #B3591A;
    --warn-bg: #FBEADD;
    --neutral-bg: #E8EDF2;
    --shadow: 0 1px 2px rgba(27, 36, 48, .06), 0 8px 24px -12px rgba(27, 36, 48, .18);
    --shot-scale: .58;
    --display: "Bricolage Grotesque", "Trebuchet MS", sans-serif;
    --body: "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    --mono: "IBM Plex Mono", ui-monospace, "SF Mono", Menlo, monospace;
  }

  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) {
      --ink: #E6EDF3;
      --ink-soft: #9EAEBC;
      --paper: #14181D;
      --surface: #1D232A;
      --line: #2C343D;
      --accent: #7FC4E8;
      --good: #96CE79;
      --good-bg: #1F2C1C;
      --warn: #E0A264;
      --warn-bg: #2E2318;
      --neutral-bg: #232B33;
      --shadow: 0 1px 2px rgba(0, 0, 0, .4), 0 10px 28px -14px rgba(0, 0, 0, .7);
    }
  }

  :root[data-theme="dark"] {
    --ink: #E6EDF3;
    --ink-soft: #9EAEBC;
    --paper: #14181D;
    --surface: #1D232A;
    --line: #2C343D;
    --accent: #7FC4E8;
    --good: #96CE79;
    --good-bg: #1F2C1C;
    --warn: #E0A264;
    --warn-bg: #2E2318;
    --neutral-bg: #232B33;
    --shadow: 0 1px 2px rgba(0, 0, 0, .4), 0 10px 28px -14px rgba(0, 0, 0, .7);
  }

  * { box-sizing: border-box; }

  body {
    margin: 0;
    background: var(--paper);
    color: var(--ink);
    font-family: var(--body);
    font-size: 16px;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  .wrap {
    max-width: 1180px;
    margin: 0 auto;
    padding: 0 24px 96px;
  }

  /* Intestazione */
  .masthead {
    padding: 56px 0 32px;
    border-bottom: 1px solid var(--line);
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .eyebrow {
    font-family: var(--mono);
    font-size: .74rem;
    font-weight: 500;
    letter-spacing: .14em;
    text-transform: uppercase;
    color: var(--accent);
  }

  h1 {
    font-family: var(--display);
    font-weight: 700;
    font-size: clamp(2.1rem, 5vw, 3.1rem);
    line-height: 1.05;
    letter-spacing: -.02em;
    margin: 0;
    text-wrap: balance;
  }

  .standfirst {
    max-width: 62ch;
    color: var(--ink-soft);
    margin: 0;
  }

  .facts {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 28px;
    font-family: var(--mono);
    font-size: .82rem;
    color: var(--ink-soft);
    font-variant-numeric: tabular-nums;
  }

  .facts b { color: var(--ink); font-weight: 500; }

  /* Sezioni */
  section { padding-top: 56px; }

  h2 {
    font-family: var(--display);
    font-weight: 600;
    font-size: 1.45rem;
    letter-spacing: -.01em;
    margin: 0 0 6px;
    text-wrap: balance;
  }

  .lede { color: var(--ink-soft); margin: 0 0 24px; max-width: 68ch; }

  code {
    font-family: var(--mono);
    font-size: .86em;
    background: var(--neutral-bg);
    padding: .1em .35em;
    border-radius: 4px;
  }

  /* Tabella di verifica */
  .table-scroll { overflow-x: auto; border: 1px solid var(--line); border-radius: 12px; background: var(--surface); }

  table { border-collapse: collapse; width: 100%; font-size: .9rem; }

  th, td {
    text-align: left;
    padding: 11px 16px;
    border-bottom: 1px solid var(--line);
    white-space: nowrap;
  }

  thead th {
    font-family: var(--mono);
    font-size: .72rem;
    letter-spacing: .1em;
    text-transform: uppercase;
    color: var(--ink-soft);
    font-weight: 500;
  }

  tbody tr:last-child td { border-bottom: 0; }

  td.device b { font-weight: 600; }
  td.device span { display: block; color: var(--ink-soft); font-size: .8rem; }
  td.num { font-family: var(--mono); font-variant-numeric: tabular-nums; color: var(--ink-soft); }

  .chip {
    display: inline-block;
    font-family: var(--mono);
    font-size: .72rem;
    padding: .18em .55em;
    border-radius: 5px;
    background: var(--neutral-bg);
    color: var(--ink-soft);
    white-space: nowrap;
  }

  .chip-good { background: var(--good-bg); color: var(--good); }
  .chip-warn { background: var(--warn-bg); color: var(--warn); }

  /* Controllo della scala */
  .controls { display: flex; align-items: center; gap: 10px; margin: 0 0 20px; flex-wrap: wrap; }
  .controls span { font-family: var(--mono); font-size: .74rem; letter-spacing: .1em; text-transform: uppercase; color: var(--ink-soft); }

  .controls button {
    font-family: var(--mono);
    font-size: .8rem;
    color: var(--ink);
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: 999px;
    padding: 5px 13px;
    cursor: pointer;
  }

  .controls button[aria-pressed="true"] { border-color: var(--accent); color: var(--accent); }
  .controls button:focus-visible, a:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

  /* Rotaia dei dispositivi */
  .rail {
    display: flex;
    gap: 22px;
    overflow-x: auto;
    padding: 4px 0 18px;
    scroll-snap-type: x proximity;
  }

  .shot { margin: 0; flex: 0 0 auto; scroll-snap-align: start; }

  .shot img {
    display: block;
    width: calc(var(--w, 390px) * var(--shot-scale));
    height: auto;
    border: 1px solid var(--line);
    border-radius: 20px;
    box-shadow: var(--shadow);
    background: var(--surface);
  }

  figcaption { display: flex; flex-direction: column; gap: 3px; margin-top: 10px; }
  .shot-name { font-weight: 600; font-size: .88rem; }
  .shot-size { font-family: var(--mono); font-size: .74rem; color: var(--ink-soft); font-variant-numeric: tabular-nums; }
  figcaption .chip { align-self: flex-start; }

  /* Reperti */
  .findings { display: grid; gap: 18px; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }

  .finding {
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: 14px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .finding h3 { font-family: var(--display); font-weight: 600; font-size: 1.05rem; margin: 0; }
  .finding .where { font-family: var(--mono); font-size: .74rem; letter-spacing: .08em; text-transform: uppercase; color: var(--ink-soft); }
  .finding p { margin: 0; font-size: .92rem; color: var(--ink-soft); }

  .delta { display: flex; align-items: center; gap: 10px; font-family: var(--mono); font-size: .8rem; flex-wrap: wrap; }
  .delta .arrow { color: var(--ink-soft); }

  /* Limiti */
  .limits { display: grid; gap: 12px; margin: 0; }
  .limits div { display: grid; grid-template-columns: minmax(150px, 220px) 1fr; gap: 4px 20px; padding-bottom: 12px; border-bottom: 1px solid var(--line); }
  .limits dt { font-weight: 600; font-size: .92rem; }
  .limits dd { margin: 0; color: var(--ink-soft); font-size: .92rem; }

  footer {
    margin-top: 64px;
    padding-top: 24px;
    border-top: 1px solid var(--line);
    color: var(--ink-soft);
    font-size: .88rem;
  }

  a { color: var(--accent); }

  @media (max-width: 620px) {
    .limits div { grid-template-columns: 1fr; }
    :root { --shot-scale: .5; }
  }

  @media (prefers-reduced-motion: reduce) {
    * { transition: none !important; animation: none !important; }
  }
</style>

<div class="wrap">
  <header class="masthead">
    <p class="eyebrow">Report visivo &middot; 22 agosto 2026</p>
    <h1>MateGioco su ogni iPhone</h1>
    <p class="standfirst">Ogni schermata dell&rsquo;app, catturata dalla build statica su nove
    risoluzioni iPhone. Le misure accanto a ciascuna immagine sono prese sulla stessa pagina
    fotografata: dicono se il contenuto sta in schermo senza scroll.</p>
    <div class="facts">
      <span>versione <b>${APP_VERSION}</b></span>
      <span>dispositivi <b>${devices.length}</b></span>
      <span>schermate <b>${screens.length}</b></span>
      <span>catture <b>${Object.keys(images).length}</b></span>
    </div>
  </header>

  <section>
    <h2>Verifica</h2>
    <p class="lede">Home e sessione di gioco devono stare interamente in schermo: sono le due
    schermate che un bambino usa senza sapere di poter scorrere. Mappa e bacheca sono liste
    (sedici livelli, sedici Guardiani) e scorrono per costruzione.</p>
    <div class="table-scroll">
      <table>
        <thead>
          <tr>
            <th>Dispositivo</th>
            <th>Punti</th>
            ${screens.map(s => `<th>${esc(s.label)}</th>`).join('\n            ')}
            <th>Tasti</th>
          </tr>
        </thead>
        <tbody>
          ${devices.map(d => `<tr>
            <td class="device"><b>${esc(d.label)}</b><span>${esc(d.note)}</span></td>
            <td class="num">${d.width}&times;${d.height}</td>
            ${screens.map(s => {
              const m = metricFor(d.slug, s.slug)
              const v = m ? verdict(s.slug, m.scroll) : null
              return `<td>${v ? `<span class="chip chip-${v.tone}">${esc(v.label)}</span>` : '&mdash;'}</td>`
            }).join('\n            ')}
            <td class="num">${metricFor(d.slug, 'game')?.keyHeight ?? '&mdash;'}px</td>
          </tr>`).join('\n          ')}
        </tbody>
      </table>
    </div>
  </section>

  <div class="controls" role="group" aria-label="Scala delle immagini">
    <span>Scala</span>
    <button type="button" data-scale="0.45">45%</button>
    <button type="button" data-scale="0.58" aria-pressed="true">58%</button>
    <button type="button" data-scale="1">100%</button>
  </div>

  ${screens.map(screen => `<section>
    <h2>${esc(screen.label)}</h2>
    <p class="lede"><code>${esc(screen.path)}</code></p>
    <div class="rail">${devices.map(d => shotFigure(d, screen)).join('')}
    </div>
  </section>`).join('\n  ')}

  <section>
    <h2>Tema scuro</h2>
    <p class="lede">Catturato su ${esc(reference.label)}, il dispositivo di riferimento. Il
    tema scuro ridefinisce le superfici, non solo i colori del testo: fondo
    <code>#22282D</code>, barra <code>#2C3338</code>, card <code>#3A444B</code>, cosi&rsquo; le
    card si staccano dal fondo invece di galleggiare.</p>
    <div class="rail">${screens.map(s => shotFigure(reference, s, true)).join('')}
    </div>
  </section>

  <section>
    <h2>Cosa ha intercettato la galleria</h2>
    <p class="lede">Tre difetti trovati guardando le immagini, non giocando: nessuno dei tre
    veniva segnalato da lint, test o build.</p>
    <div class="findings">
      ${FINDINGS.map(f => `<article class="finding">
        <p class="where">${esc(f.where)}</p>
        <h3>${esc(f.title)}</h3>
        <div class="delta">
          <span class="chip chip-warn">${esc(f.before)}</span>
          <span class="arrow">&rarr;</span>
          <span class="chip chip-good">${esc(f.after)}</span>
        </div>
        <p>${f.body}</p>
      </article>`).join('\n      ')}
    </div>
  </section>

  <section>
    <h2>Cosa il report non copre</h2>
    <dl class="limits">
      ${LIMITS.map(([term, def]) => `<div><dt>${esc(term)}</dt><dd>${def}</dd></div>`).join('\n      ')}
    </dl>
  </section>

  <footer>
    <p>Generato da <code>npm run screenshots</code> e <code>npm run screenshots:report</code>.
    Gli screenshot sono riproducibili: due esecuzioni di fila producono file identici, perche&rsquo;
    progressione, lingua, tema, numeri casuali e animazioni sono fissati e si fotografa la build
    statica invece del dev server. Un diff nella galleria e&rsquo; quindi un cambiamento visivo vero.</p>
  </footer>
</div>

<script>
  // Larghezza reale del dispositivo, per far scalare le immagini in proporzione
  for (const img of document.querySelectorAll('.shot img')) {
    img.style.setProperty('--w', img.getAttribute('width') + 'px')
  }

  const buttons = document.querySelectorAll('.controls button')
  for (const button of buttons) {
    button.addEventListener('click', () => {
      document.documentElement.style.setProperty('--shot-scale', button.dataset.scale)
      for (const other of buttons) other.setAttribute('aria-pressed', String(other === button))
    })
  }
</script>
`

  await writeFile(OUT_FILE, html, 'utf-8')
  const size = Buffer.byteLength(html) / 1024 / 1024
  console.log(`Report in ${OUT_FILE} (${size.toFixed(1)} MB, ${Object.keys(images).length} immagini incorporate)`)
}

await build()
