# 🎈 MateGioco

![Version](https://img.shields.io/github/package-json/v/PGLongo/MateGioco)
[![Deploy](https://github.com/PGLongo/MateGioco/actions/workflows/deploy.yml/badge.svg)](https://github.com/PGLongo/MateGioco/actions/workflows/deploy.yml)
![License](https://img.shields.io/github/license/PGLongo/MateGioco)
![Nuxt](https://img.shields.io/badge/Nuxt-4-00C58E?logo=nuxt.js)
![Vue](https://img.shields.io/badge/Vue.js-3-4FC08D?logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)

**App educativa di matematica per bambini di 4 anni** - Impara le operazioni matematiche giocando!

## 🌐 Demo Live

**[➡️ Prova l'app qui!](https://pglongo.github.io/MateGioco/)**

---

## 📖 Descrizione

**MateGioco** è un'applicazione web interattiva progettata per aiutare i bambini in età prescolare (4+ anni) ad avvicinarsi alla matematica in modo divertente e senza stress. 

Con un design accattivante ispirato allo stile del cartone animato _Bluey_, l'app offre un ambiente sicuro e stimolante dove i bambini possono esercitarsi con le somme, ricevendo feedback immediati e gratificazioni visive e sonore per ogni progresso.

## ✨ Features Principali

### 🧮 Sistema Esercizi
- **Sessioni intelligenti**: 5 esercizi per sessione con somme casuali (numeri 1-10).
- **Feedback visivo immediato**:
  - 🟢 **Verde**: Risposta corretta (+ Celebrazione!)
  - 🔴 **Rosso**: Risposta errata (Riprova!)
  - 🟠 **Arancione**: Notifiche di sistema
- **Gamification**: Sistema di stelline ⭐ per gratificare l'impegno.
- **Supporto all'apprendimento**: Tasto Aiuto 🤔 e visualizzazione della risposta corretta.

### 🎨 Design & UX
- **Stile "Bluey"**: Palette colori pastello (azzurro, arancione, verde acqua, rosa).
- **Dark Mode** 🌙: Modalità notturna automatica o manuale, perfetta per la sera.
- **Tipografia**: Font _Quicksand_ per la massima leggibilità.
- **Micro-interazioni**: Animazioni fluide (bounce, pulse, shake) per un'esperienza tattile.
- **Mobile-First**: Ottimizzata per dita piccole su tablet e smartphone.
- **Accessibilità**: Feedback tattile (vibrazione) e testi ad alto contrasto.

### 🎵 Esperienza Multimodale
- **Audio Procedurale**: Suoni generati in tempo reale (Web Audio API) per successi ed errori.
- **Animazioni Festive**: Esplosioni di coriandoli (confetti) 🎉 per celebrare i traguardi.

### 💾 Tecnologia PWA
- **Installabile**: Funziona come un'app nativa su iOS e Android.
- **Offline-First**: Gioca anche senza connessione internet.
- **Persistenza**: Salva progressi e preferenze localmente.

## 🛠️ Stack Tecnologico

Il progetto è costruito con tecnologie web modernissime:

- **[Nuxt 3](https://nuxt.com/)** - Il Framework Vue.js per eccellenza.
- **[Vue 3](https://vuejs.org/)** - Composition API & Script Setup.
- **[TypeScript](https://www.typescriptlang.org/)** - Per un codice robusto e sicuro.
- **[Tailwind / CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)** - Stili personalizzati con variabili CSS moderne.
- **[Vite PWA](https://vite-pwa-org.netlify.app/)** - Per le funzionalità Progressive Web App.
- **[Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)** - Per gli effetti particellari.
- **[GitHub Actions](https://github.com/features/actions)** - Automazione di build e deploy.

## 📂 Struttura Progetto

```bash
MateGioco/
├── .github/workflows/   # CI/CD Pipelines
├── assets/css/          # Design System e variabili CSS
├── components/          # Componenti Vue riutilizzabili
├── composables/         # Logica di business (Hooks)
├── pages/               # Routing dell'applicazione
├── public/              # Assets statici e icone PWA
├── types/               # Definizioni TypeScript condivise
├── app.vue              # Root Component
├── nuxt.config.ts       # Configurazione framework
└── package.json         # Dipendenze e script
```

## 🚀 Guida allo Sviluppo

### Prerequisiti
- **Node.js**: v20.x o superiore
- **npm** o **yarn**

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

### Build & Produzione

```bash
# Build statico (SSG)
npm run generate

# Anteprima locale della build
npm run preview
```

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

## 📄 Licenza

Distribuito sotto licenza **MIT**. Vedi il file `LICENSE` per maggiori informazioni.

## 🤝 Contributi

Siamo aperti a contributi! Sentiti libero di aprire una **Issue** o una **Pull Request**.

1. Forka il progetto
2. Crea il tuo branch (`git checkout -b feature/AmazingFeature`)
3. Committa le tue modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Pusha sul branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## 👨‍💻 Autore

**PGLongo**

---
*Fatto con ❤️ ed un po' di 🪄 magia codice.*
