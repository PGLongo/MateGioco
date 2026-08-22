# AGENTS.md

Istruzioni per agenti AI che lavorano su questo repository. Vale per l'intero progetto.

## Cos'e' questo progetto

`MateGioco`: **PWA educativa di matematica** per bambini in eta' prescolare (4+ anni),
costruita con **Nuxt 4** in modalita' SPA statica (`ssr: false` + `nuxt generate`) e
pubblicata su **GitHub Pages** sotto il path `/MateGioco/`. Stato attuale: home page con
carta della sfida e pulsante di avvio, una sessione di gioco da 5 somme casuali (numeri
1-10) con feedback visivo, suoni generati via Web Audio API, vibrazione, confetti e
contatore di stelline persistito in `localStorage`. Nessun backend, nessuna API, nessuna
autenticazione: tutto lo stato vive nel browser.

## Stack

- Node.js >= 22.19 (dichiarato in `engines`; la CI usa 22.x). Nuxt 4.5 non supporta Node 20:
  con la 20 la build muore con `TypeError: trustedFunctions.difference is not a function`
- Nuxt 4.5 (`future.compatibilityVersion: 4`, `srcDir` implicito `app/`), Vue 3.5,
  TypeScript 6, ESLint 10, Vite 8 (transitivo, da Nuxt)
- **TypeScript resta sulla linea 6**: la 7 non e' utilizzabile perche' `@typescript-eslint`
  dichiara `typescript >=4.8.4 <6.1.0` e con TS 7 il lint muore in `ts-api-utils`. Non
  alzarla finche' quella catena non supporta la 7.
- Moduli: `@nuxt/ui` 4 (porta con se' Tailwind CSS 4), `@vite-pwa/nuxt`,
  `@nuxtjs/color-mode`, `@nuxt/icon` (icon set `mdi`), `@nuxt/hints`, `@nuxtjs/i18n` 10,
  `@nuxt/eslint`
- `canvas-confetti` per gli effetti particellari
- `standard-version` per versionamento e CHANGELOG

## Struttura

```
app/                        srcDir di Nuxt 4
├── app.vue                 root component
├── layouts/default.vue     layout unico (header + contenuto + footer)
├── pages/                  index (home), game (sessione), map (livelli), badges (bacheca)
├── config/                 levels.config.ts e badges.config.ts: solo dati, nessuna logica
├── components/             componenti Vue, auto-import, PascalCase
├── composables/            logica di business: useMathEngine, useExercises, useProgression
│                           (livelli, stelline per livello, badge), useStars, useSettings,
│                           useSound, useVibration, useConfetti
├── types/                  dichiarazioni .d.ts per props/emit dei componenti
└── assets/css/main.css     design system: CSS custom properties su :root, nessuna
                            direttiva Tailwind
tests/                      Vitest: rispecchia app/, fixture in tests/fixtures/
i18n/locales/               it-IT.json (default) e en-US.json
public/                     icone PWA e favicon generate da icon-1024x1024.svg
ROADMAP.md                  stato attuale, fasi successive, decisioni aperte (versionato)
.plans/                     piani implementativi con gli step eseguibili (gitignored)
.github/workflows/deploy.yml build statica e deploy su GitHub Pages
nuxt.config.ts              moduli, i18n, PWA manifest, baseURL, head
```

Vincoli di configurazione da conoscere prima di toccare asset o routing:

- `app.baseURL` e i path delle icone in `nuxt.config.ts` sono condizionati a
  `process.env.NODE_ENV === 'production'` e diventano `/MateGioco/...`. Un path assoluto
  hardcoded in un componente funziona in `dev` e si rompe in produzione: usa sempre
  `useRuntimeConfig().app.baseURL` o path relativi.
- `ssr: false`: non esiste render lato server, ma il codice dei composable difende comunque
  l'accesso a `window`/`localStorage` con `typeof window === 'undefined'`. Mantieni questa
  guardia nel codice nuovo.
- `strategy: 'no_prefix'` per i18n: le route non hanno prefisso di lingua, la lingua si
  rileva dal browser e si memorizza nel cookie `i18n_redirected`.
- `colorMode.classSuffix: ''` con preferenza `light`: le varianti dark si scrivono come
  `.dark .selettore` in CSS, non con il suffisso `-mode`.

## Comandi

```bash
npm install            # setup (postinstall esegue nuxt prepare)
npm run dev            # dev server su http://localhost:3000
npm run lint           # lint (eslint .)
npm run lint:fix       # lint con correzione automatica
npm test               # suite Vitest (una passata)
npm run test:watch     # Vitest in watch
npm run generate       # build statica SSG, output in .output/public
npm run preview        # anteprima locale della build
npm run generate-assets # rigenera icone PWA da public/icon-1024x1024.svg
```

I test sono **Vitest** in `tests/`, che rispecchia la struttura di `app/`, con i file
`*.test.ts` e le fixture in `tests/fixtures/`. Coprono la logica pura (motore matematico,
sessione, progressione); **non** ci sono test sui componenti ne' end-to-end, quindi le
pagine si verificano ancora a mano nel browser. Le convenzioni sono nella skill `nuxt:unit`.

## Convenzioni di codice

- Composition API con `<script setup lang="ts">` in ogni componente e pagina, `app.vue`
  compreso.
- La logica di business sta nei composable in `app/composables/`; i componenti restano su
  UI e binding.
- TypeScript tipizzato in modo esplicito: interfacce per props, emit e strutture dati,
  `any` da evitare. I tipi condivisi dei componenti stanno in `app/types/*.d.ts`.
- Persistenza: solo `localStorage`, una chiave per dominio, con prefisso `mategioco-`
  (`mategioco-stars`, `mategioco-settings`, `mategioco-progression`). Letture e scritture sempre in `try/catch`.
- **Lo stato condiviso fra componenti va dichiarato a livello di modulo**, fuori dalla
  funzione del composable: un `ref` creato dentro il composable dà a ogni chiamante una
  copia separata. `useStars` e `useSettings` sono i due esempi da seguire; era il difetto
  per cui l'header non vedeva le stelline guadagnate nella pagina di gioco.
- Stile: CSS scoped nel componente per il layout locale, variabili CSS di
  `app/assets/css/main.css` per colori, ombre e raggi. Non introdurre valori esadecimali
  nuovi nei componenti: aggiungi la custom property al design system.
- Testi visibili all'utente: chiave in `i18n/locales/it-IT.json` **e** in `en-US.json`,
  usata con `$t()` nel template o `t()` da `useI18n()` nello script. Alcune stringhe piu'
  vecchie sono ancora hardcoded nei template (per esempio in `app/pages/index.vue`): non
  prenderle come modello, il verso e' l'estrazione a chiave.
- Preferisci moduli Nuxt ufficiali (`@nuxt/*`) e utility esistenti a implementazioni
  custom.
- Prima di progettare una feature, leggi `ROADMAP.md` e il piano corrispondente in
  `.plans/`: buona parte di quello che sembra mancante e' gia' progettato, con vincoli e
  decisioni aperte che e' meglio non riaprire da zero.
- Commenti e documentazione in italiano, termini tecnici in inglese senza italianizzarli.

## Git

- Conventional Commits 1.0.0. Tipi in uso: `feat`, `fix`, `docs`, `style`, `refactor`,
  `perf`, `test`, `build`, `ci`, `chore`. Le sezioni del CHANGELOG sono mappate in
  `.versionrc.json`: la qualita' del changelog dipende da type e descrizione del commit.
- Commit atomici (un cambiamento logico per commit).
- Il subject del commit e' in **inglese**, all'imperativo, senza punto finale e di norma
  senza body (coerente con tutto lo storico). Commenti e documentazione restano in italiano.
- Branch base: `develop`. Nomina i branch `type/descrizione` in minuscolo con trattini
  (`feature/`, `bugfix/`, `chore/`, `docs/`). Mai commit diretti su `develop` o `main`.
- **Mai** trailer `Co-authored-by` ne' attribuzioni ad agenti AI nei messaggi di commit.
- Release e deploy: `npm run release` (standard-version) crea il commit
  `chore(release): X.Y.Z` e il tag `vX.Y.Z`; il push del tag (`git push --follow-tags`)
  fa scattare `deploy.yml`, che e' l'unico modo in cui il sito va in produzione. Non
  creare tag a mano.

## Verifica prima di consegnare

1. `npm run lint` deve chiudere **pulito**: zero errori e zero warning, che e' lo stato
   attuale del repository. Se ne compaiono, `npm run lint:fix` ne risolve la maggior parte.
2. `npm test` deve essere verde: la logica di livelli e progressione e' coperta, e una
   modifica che la rompe si vede qui prima che nel browser.
3. `npm run generate` deve completare senza errori: e' lo stesso comando che la CI usa per
   il deploy.
4. Verifica a mano nel browser il flusso toccato (`npm run dev`), su viewport mobile: il
   target sono tablet e smartphone usati da bambini.
5. Se hai aggiunto testo visibile, controlla che la chiave esista in **entrambi** i file di
   `i18n/locales/`.
6. Se hai toccato path di asset o routing, verifica anche la build di produzione con
   `npm run preview`, dove `baseURL` diventa `/MateGioco/`.

## Sicurezza

- Non committare segreti, chiavi o file `.env*` (sono gitignored). L'app non ha backend ne'
  credenziali: se una modifica introduce una chiave API, e' un cambiamento di architettura
  da discutere prima.
- L'app e' destinata a bambini: nessuna raccolta di dati personali, nessun analytics,
  nessuna richiesta di rete verso terzi oltre al font Google caricato in `nuxt.config.ts`.
  Non aggiungerne senza una decisione esplicita.
