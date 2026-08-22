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

- Node.js >= 20 (la CI usa 20.x), npm
- Nuxt 4.2 (`future.compatibilityVersion: 4`, `srcDir` implicito `app/`), Vue 3.5,
  TypeScript 5.6
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
├── pages/                  index.vue (home), game.vue (sessione di esercizi)
├── components/             componenti Vue, auto-import, PascalCase
├── composables/            logica di business: useExercises, useStars, useSettings,
│                           useSound, useVibration, useConfetti
├── types/                  dichiarazioni .d.ts per props/emit dei componenti
└── assets/css/main.css     design system: CSS custom properties su :root, nessuna
                            direttiva Tailwind
i18n/locales/               it-IT.json (default) e en-US.json
public/                     icone PWA e favicon generate da icon-1024x1024.svg
docs/plans/                 design doc di feature non ancora implementate (livelli, badge)
implementation_plans/       piani di implementazione storici
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
npm run generate       # build statica SSG, output in .output/public
npm run preview        # anteprima locale della build
npm run generate-assets # rigenera icone PWA da public/icon-1024x1024.svg
```

**Non esiste una suite di test in questo repository**: nessun Vitest, nessun Playwright,
nessuna cartella `tests/`. Ogni modifica va verificata a mano nel browser. Se ti viene
chiesto di scrivere test, la scelta dello stack e' una decisione aperta: proponila, non
darla per fatta.

## Convenzioni di codice

- Composition API con `<script setup lang="ts">` in ogni componente e pagina (l'unica
  eccezione e' `app/app.vue`).
- La logica di business sta nei composable in `app/composables/`; i componenti restano su
  UI e binding.
- TypeScript tipizzato in modo esplicito: interfacce per props, emit e strutture dati,
  `any` da evitare. I tipi condivisi dei componenti stanno in `app/types/*.d.ts`.
- Persistenza: solo `localStorage`, una chiave per dominio, con prefisso `mategioco-`
  (`mategioco-stars`, `mategioco-settings`). Letture e scritture sempre in `try/catch`.
- Stile: CSS scoped nel componente per il layout locale, variabili CSS di
  `app/assets/css/main.css` per colori, ombre e raggi. Non introdurre valori esadecimali
  nuovi nei componenti: aggiungi la custom property al design system.
- Testi visibili all'utente: chiave in `i18n/locales/it-IT.json` **e** in `en-US.json`,
  usata con `$t()` nel template o `t()` da `useI18n()` nello script. Alcune stringhe piu'
  vecchie sono ancora hardcoded nei template (per esempio in `app/pages/index.vue`): non
  prenderle come modello, il verso e' l'estrazione a chiave.
- Preferisci moduli Nuxt ufficiali (`@nuxt/*`) e utility esistenti a implementazioni
  custom.
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

1. `npm run lint` deve chiudere con **zero errori**. Restano 3 warning preesistenti
   (`vue/attributes-order`, `vue/html-self-closing`) risolvibili con `npm run lint:fix`:
   non introdurne di nuovi.
2. `npm run generate` deve completare senza errori: e' lo stesso comando che la CI usa per
   il deploy.
3. Verifica a mano nel browser il flusso toccato (`npm run dev`), su viewport mobile: il
   target sono tablet e smartphone usati da bambini.
4. Se hai aggiunto testo visibile, controlla che la chiave esista in **entrambi** i file di
   `i18n/locales/`.
5. Se hai toccato path di asset o routing, verifica anche la build di produzione con
   `npm run preview`, dove `baseURL` diventa `/MateGioco/`.

## Sicurezza

- Non committare segreti, chiavi o file `.env*` (sono gitignored). L'app non ha backend ne'
  credenziali: se una modifica introduce una chiave API, e' un cambiamento di architettura
  da discutere prima.
- L'app e' destinata a bambini: nessuna raccolta di dati personali, nessun analytics,
  nessuna richiesta di rete verso terzi oltre al font Google caricato in `nuxt.config.ts`.
  Non aggiungerne senza una decisione esplicita.
