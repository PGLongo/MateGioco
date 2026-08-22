# 🎈 MateGioco

![Version](https://img.shields.io/github/package-json/v/PGLongo/MateGioco)
[![Deploy](https://github.com/PGLongo/MateGioco/actions/workflows/deploy.yml/badge.svg)](https://github.com/PGLongo/MateGioco/actions/workflows/deploy.yml)
![License](https://img.shields.io/github/license/PGLongo/MateGioco)
![Nuxt](https://img.shields.io/badge/Nuxt-4-00C58E?logo=nuxt.js)
![Vue](https://img.shields.io/badge/Vue.js-3-4FC08D?logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript)

**App educativa di matematica per bambini di 4 anni** - Impara le operazioni matematiche giocando!

## 🌐 Demo Live

**[➡️ Prova l'app qui!](https://pglongo.github.io/MateGioco/)**

---

## 📖 Descrizione

**MateGioco** è un'applicazione web interattiva progettata per aiutare i bambini in età prescolare (4+ anni) ad avvicinarsi alla matematica in modo divertente e senza stress. 

Con un design accattivante ispirato allo stile del cartone animato _Bluey_, l'app offre un ambiente sicuro e stimolante dove i bambini possono esercitarsi con le somme, ricevendo feedback immediati e gratificazioni visive e sonore per ogni progresso.

## ✨ Features Principali

### 🧮 Sistema Esercizi
- **Percorso a livelli**: cinque Mondi (somme, sottrazioni, tabelline, divisioni e le sfide miste)
  per sedici livelli di difficoltà crescente (entro 10, 20, 50, 100), con sblocco a 25 stelline per
  livello: almeno cinque sessioni a testa. Le divisioni sono sempre senza resto, le sottrazioni mai
  negative.
- **Mappa dei livelli** 🗺️: livelli completati, livello corrente e livelli ancora chiusi, con il requisito per sbloccarli.
- **Sessioni brevi e sempre diverse**: 5 esercizi per sessione, generati sul livello raggiunto e
  mai ripetuti dentro la stessa partita.
- **Feedback visivo immediato**:
  - 🟢 **Verde**: Risposta corretta (+ Celebrazione!)
  - 🔴 **Rosso**: Risposta errata (Riprova!)
  - 🟠 **Arancione**: Notifiche di sistema
- **Gamification**: Stelline ⭐ contate per livello, oltre al totale mostrato nell'header.
- **I Guardiani dei Numeri** 🏅: sedici badge collezionabili, uno per livello, con bacheca dedicata e festeggiamento a fine sessione.
- **Supporto all'apprendimento**: Tasto Aiuto 🤔 e visualizzazione della risposta corretta.

### 🎨 Design & UX
- **Stile "Bluey"**: Palette colori pastello (azzurro, arancione, verde acqua, rosa).
- **Dark Mode** 🌙: Tema scuro con interruttore nell'header; al primo avvio segue l'impostazione del dispositivo.
- **Tipografia**: Font _Fredoka_ per la massima leggibilità.
- **Micro-interazioni**: Animazioni fluide (bounce, pulse, shake) per un'esperienza tattile.
- **Mobile-First**: Ottimizzata per dita piccole su tablet e smartphone.
- **Accessibilità**: Feedback tattile (vibrazione) e testi ad alto contrasto.
- **Multilingua** 🌍: Interfaccia in italiano (default) e inglese, con rilevamento automatico della lingua del browser.

### 🎵 Esperienza Multimodale
- **Audio Procedurale**: Suoni generati in tempo reale (Web Audio API) per successi ed errori.
- **Animazioni Festive**: Esplosioni di coriandoli (confetti) 🎉 per celebrare i traguardi.

### 💾 Tecnologia PWA
- **Installabile**: Funziona come un'app nativa su iOS e Android.
- **Offline-First**: Gioca anche senza connessione internet.
- **Persistenza**: Salva progressi e preferenze localmente.

## 🛠️ Stack Tecnologico

Il progetto è costruito con tecnologie web modernissime:

- **[Nuxt 4](https://nuxt.com/)** - Il Framework Vue.js per eccellenza (modalità SPA statica, `ssr: false`).
- **[Vue 3](https://vuejs.org/)** - Composition API & Script Setup.
- **[TypeScript](https://www.typescriptlang.org/)** - Per un codice robusto e sicuro.
- **[Nuxt UI 4](https://ui.nuxt.com/)** - Componenti e utility (porta con sé Tailwind CSS 4).
- **CSS custom properties** - Il design system vive in `app/assets/css/main.css`.
- **[Vite PWA](https://vite-pwa-org.netlify.app/)** - Per le funzionalità Progressive Web App.
- **[Nuxt i18n](https://i18n.nuxtjs.org/)** - Localizzazione italiano/inglese.
- **[Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)** - Per gli effetti particellari.
- **[GitHub Actions](https://github.com/features/actions)** - Automazione di build e deploy.

## 📂 Struttura Progetto

```bash
MateGioco/
├── app/                    # srcDir di Nuxt 4
│   ├── app.vue             # Root component
│   ├── layouts/            # Layout dell'applicazione
│   ├── pages/              # Routing (index, game, map, badges)
│   ├── config/             # Configurazione di Mondi, Livelli e Badge
│   ├── components/         # Componenti Vue riutilizzabili
│   ├── composables/        # Logica di business (useExercises, useStars, ...)
│   ├── types/              # Definizioni TypeScript condivise
│   └── assets/css/         # Design System e variabili CSS
├── tests/                  # Test Vitest (rispecchia app/)
├── i18n/locales/           # Traduzioni it-IT e en-US
├── public/                 # Assets statici e icone PWA
├── .github/workflows/      # CI/CD Pipelines
├── ROADMAP.md              # Dove va il progetto e in che ordine
├── nuxt.config.ts          # Configurazione framework
└── package.json            # Dipendenze e script
```

## 🚀 Guida allo Sviluppo

### Prerequisiti
- **Node.js**: v22.19 o superiore (richiesto da Nuxt 4.5: `engines` in `package.json`)
- **npm**

### Setup Locale

```bash
# 1. Clona il repository
git clone https://github.com/PGLongo/MateGioco.git
cd MateGioco

# 2. Installa le dipendenze
npm install

# 3. Avvia il server di sviluppo
npm run dev
```

L'applicazione sarà disponibile su `http://localhost:3000`.

### Gestione Assets (PWA)

Per rigenerare le icone e la favicon a partire dal file sorgente `public/icon-1024x1024.svg`:

```bash
# Genera tutte le icone (PWA, iOS, Favicon)
npm run generate-assets
```
Questo comando utilizza `@vite-pwa/assets-generator` e la configurazione in `pwa-assets.config.ts`.

### Build & Produzione

```bash
# Build statico (SSG)
npm run generate

# Anteprima locale della build
npm run preview
```

## ✅ Test e Lint

```bash
# Suite di test (Vitest)
npm test

# Test in watch durante lo sviluppo
npm run test:watch

# Lint del codice
npm run lint

# Lint con correzione automatica
npm run lint:fix
```

I test sono **Vitest** in `tests/`, che rispecchia la struttura di `app/`, e coprono la
logica pura: motore matematico, sessione di esercizi e progressione fra i livelli. Non ci
sono ancora test sui componenti né end-to-end, quindi le pagine si verificano a mano nel
browser con `npm run dev`, preferibilmente su viewport mobile.

Il lint è configurato dal modulo `@nuxt/eslint` (`eslint.config.mjs`). Usa sempre gli script
npm, non `eslint` direttamente: il comando resta stabile anche se la configurazione cambia.

La verifica minima prima di una PR è `npm run lint`, `npm test` e `npm run generate`,
che è lo stesso comando usato dalla CI per il deploy.

## 🏷️ Release Management

Il progetto utilizza **[Standard Version](https://github.com/conventional-changelog/standard-version)** per il versionamento semantico e la gestione automatica del changelog.

```bash
# Rilascio di una nuova versione (es. patch)
npm run release          # Automatico
npm run release:patch    # Forzato patch
npm run release:minor    # Forzato minor
npm run release:major    # Forzato major

# Push della nuova versione e deploy
git push --follow-tags
```

## 📚 Documentazione

| Documento | Contenuto |
|-----------|-----------|
| [CONTRIBUTING.md](CONTRIBUTING.md) | Workflow, branch, commit, PR e come una modifica arriva in produzione. |
| [AGENTS.md](AGENTS.md) | Istruzioni per gli agenti AI: stack, struttura, convenzioni, verifica. |
| [CLAUDE.md](CLAUDE.md) | Delta specifico di Claude Code (importa AGENTS.md). |
| [CHANGELOG.md](CHANGELOG.md) | Storico delle release, generato da `standard-version`. |
| [ROADMAP.md](ROADMAP.md) | Stato attuale, fasi successive, debito tecnico e decisioni aperte. |

## 📄 Licenza

Distribuito sotto licenza **MIT**. Vedi [LICENSE](LICENSE).

## 🤝 Contributi

Siamo aperti a contributi! Apri una **Issue** per proporre una modifica, oppure una **Pull
Request** verso `develop`.

Workflow, convenzioni di branch e commit, e procedura di release sono in
[CONTRIBUTING.md](CONTRIBUTING.md).

## 👨‍💻 Autore

**PGLongo**

---
*Fatto con ❤️ ed un po' di 🪄 magia codice.*
