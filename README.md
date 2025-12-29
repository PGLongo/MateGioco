# 🎈 MateGioco

**App educativa di matematica per bambini di 4 anni** - Impara le operazioni matematiche giocando!

## 🌐 Demo Live

**[➡️ Prova l'app qui!](https://pglongo.github.io/MateGioco/)**

---

## 📖 Descrizione

MateGioco è un'applicazione web interattiva progettata per aiutare i bambini di 4 anni ad imparare le operazioni matematiche in modo divertente e coinvolgente. Con un design colorato ispirato allo stile di Bluey e feedback immediati, i bambini possono esercitarsi con le somme guadagnando stelline ad ogni risposta corretta!

## ✨ Features Principali

### 🧮 Sistema Esercizi
- **5 esercizi per sessione** con somme random (numeri da 1 a 10)
- **Feedback visivo integrato** - il display della calcolatrice cambia colore:
  - 🟢 Verde per risposte corrette
  - 🔴 Rosso per risposte sbagliate
  - 🟠 Arancione per notifiche di sistema
- **Sistema di stelline** - guadagna ⭐ per ogni risposta corretta
- **Tasto Aiuto** 🤔 per suggerimenti
- **Mostra risposta corretta** prima di passare all'esercizio successivo

### 🎨 Design & UX
- **Palette colori pastello** stile Bluey (azzurro, arancione, verde acqua, rosa/lavanda)
- **Dark Mode** 🌙 - modalità scura con palette ottimizzata per la sera
- **Font Quicksand** - rotondo, leggibile e perfetto per bambini
- **Animazioni fluide** (bounce, pulse, celebrate, shake)
- **Feedback tattile** con vibrazione su mobile
- **Mobile-first responsive** - ottimizzato per tablet e smartphone
- **Testo non selezionabile** - previene selezioni accidentali su touch screen

### 🎵 Feedback Audio & Visivo
- **Web Audio API** - suoni generati proceduralmente:
  - 🎼 Arpeggio C-E-G per successo
  - 📉 Tono discendente per errore
  - 🎺 Fanfara per completamento sessione
  - 🔊 Click per interazioni
- **Animazioni confetti** 🎉 - esplosioni colorate per celebrare:
  - Mini-celebrazione per ogni risposta corretta
  - Celebrazione completa (3 secondi) al completamento della sessione

### 💾 Persistenza Dati
- **localStorage** per salvare:
  - Stelline totali guadagnate
  - Nome dell'utente
  - Preferenza tema (light/dark)

### 🎯 Interfaccia Intuitiva
- **Header** con avatar 🎈, saluto personalizzato e contatore stelline
- **Display problema** con layout orizzontale compatto (es. "4 + 9 = ?")
- **Calcolatrice** con tastierino 0-9 e display integrato per feedback
- **Footer** con progresso (pallini ●●●○○) e pulsanti navigazione 🏠 🌙 ⚙️
- **Modali eleganti** per completamento sessione e impostazioni

### 📱 Progressive Web App (PWA)
- **Installabile** su dispositivi mobile e desktop
- **Icone ottimizzate** per iOS e Android:
  - Apple Touch Icons (120-180px)
  - Android PWA Icons (48-512px)
  - Maskable Icons per adaptive icons
- **Offline-ready** - funziona anche senza connessione
- **Manifest completo** con nome, descrizione e colori del tema

## 🛠️ Stack Tecnologico

- **[Nuxt 3](https://nuxt.com/)** - Framework Vue.js full-stack
- **[Vue 3](https://vuejs.org/)** - Composition API + TypeScript
- **[@nuxtjs/color-mode](https://color-mode.nuxtjs.org/)** - Dark mode support
- **[@vite-pwa/nuxt](https://vite-pwa-org.netlify.app/)** - PWA configuration
- **[canvas-confetti](https://www.npmjs.com/package/canvas-confetti)** - Confetti animations
- **Web Audio API** - Sound generation
- **TypeScript** - Type safety
- **GitHub Pages** - Hosting statico gratuito
- **GitHub Actions** - CI/CD automatico

## 📂 Struttura Progetto

```
MateGioco/
├── .github/
│   └── workflows/
│       └── deploy.yml         # GitHub Actions workflow
├── assets/
│   └── css/
│       └── main.css          # Stili globali + variabili colori (light/dark)
├── components/
│   ├── AppHeader.vue         # Header con nome utente e stelline
│   ├── Calculator.vue        # Tastierino numerico + display con feedback
│   ├── MathProblem.vue       # Visualizzazione problema matematico
│   └── ProgressBar.vue       # Footer con progresso e navigazione
├── composables/
│   ├── useConfetti.ts        # Animazioni confetti con canvas-confetti
│   ├── useExercises.ts       # Logica generazione esercizi e validazione
│   ├── useSettings.ts        # Gestione impostazioni utente
│   ├── useSound.ts           # Sistema audio con Web Audio API
│   └── useStars.ts           # Sistema stelline + localStorage
├── pages/
│   └── index.vue             # Pagina principale con modali
├── public/
│   ├── apple-touch-icon-*.png  # Icone iOS (120-180px)
│   ├── pwa-*.png                # Icone Android (48-512px)
│   ├── maskable-icon-*.png      # Maskable icons
│   ├── favicon.ico
│   ├── icon-1024x1024.svg       # Icona sorgente
│   └── .nojekyll                # File per GitHub Pages
├── app.vue                   # Root component
├── nuxt.config.ts            # Configurazione Nuxt + PWA + Color Mode
├── package.json
└── README.md
```

## 🎮 Come Funziona

1. **Avvia una sessione** - L'app genera 5 esercizi casuali di somma
2. **Risolvi i problemi** - Usa il tastierino per inserire la risposta
3. **Ottieni feedback** - ✅ Risposta corretta = +1 stellina + suono + confetti + animazione
4. **Continua a giocare** - Completa tutti e 5 gli esercizi
5. **Ricomincia** - Inizia una nuova sessione per guadagnare più stelline!

### Feedback Multimodale

- ✅ **Risposta corretta**:
  - Display verde con "🎉 Bravo!"
  - Suono di successo (arpeggio C-E-G)
  - Mini-celebrazione con confetti
  - Vibrazione [100, 50, 100, 50, 100]ms
  - Mostra la risposta corretta per 2.5s
  - +1 ⭐ guadagnata

- ❌ **Risposta sbagliata**:
  - Display rosso con "❌ Riprova!"
  - Suono di errore (tono discendente)
  - Vibrazione 300ms
  - Possibilità di ritentare

- 🤔 **Suggerimento**: Mostra metà della risposta corretta

- 🎊 **Completamento sessione**:
  - Modale celebrativo con totale stelline guadagnate
  - Fanfara di completamento
  - Celebrazione continua con confetti per 3 secondi
  - Pulsante per iniziare nuova sessione

## 🚀 Development

### Prerequisiti
- Node.js 20.x o superiore
- npm o yarn

### Setup Locale

```bash
# 1. Clone repository
git clone https://github.com/PGLongo/MateGioco.git
cd MateGioco

# 2. Installa dipendenze
npm install

# 3. Avvia dev server (con hot-reload)
npm run dev

# L'app sarà disponibile su http://localhost:3000
```

### Build & Deploy

```bash
# Build statico per produzione
npm run generate

# Preview del build locale
npm run preview
```

### 🏷️ Release e Deploy

Il deploy su GitHub Pages avviene automaticamente quando si crea un nuovo tag di versione.

```bash
# 1. Crea una release automatica (incrementa patch: 1.0.0 -> 1.0.1)
npm run release

# 2. Oppure specifica il tipo di release:
npm run release:patch  # 1.0.0 -> 1.0.1 (bug fixes)
npm run release:minor  # 1.0.0 -> 1.1.0 (new features)
npm run release:major  # 1.0.0 -> 2.0.0 (breaking changes)

# 3. Pusha il tag per triggerare il deploy
git push --follow-tags origin develop
```

**Standard-version automaticamente**:
- ✅ Analizza i commit conventional
- ✅ Incrementa la versione in package.json
- ✅ Genera/aggiorna CHANGELOG.md
- ✅ Crea un commit di release
- ✅ Crea un tag git (v1.0.0, v1.1.0, etc.)
- ✅ Deploy automatico su GitHub Pages al push del tag

## 🎨 Palette Colori

Il design utilizza toni pastello ispirati allo show Bluey, con supporto per modalità chiara e scura:

### Light Mode (Default)
| Colore | Hex | Uso |
|--------|-----|-----|
| Azzurro Primary | `#5DADE2` | Header, testi principali |
| Azzurro Light | `#7EC8E3` | Gradients, hover |
| Azzurro Lighter | `#AED6F1` | Backgrounds, display |
| Arancione Light | `#FAD7A0` | Bottoni calcolatrice |
| Arancione Medium | `#F8C471` | Gradients bottoni |
| Arancione Dark | `#D68910` | Testo bottoni, operatori |
| Verde Light | `#A9DFBF` | Bottone OK, successo |
| Verde Medium | `#7DCEA0` | Gradients verde |
| Verde Dark | `#1E8449` | Testo successo |
| Rosa Light | `#F8E7F5` | Pulsanti aiuto/cancella |
| Rosa Medium | `#E8DAEF` | Gradients rosa |
| Rosa Dark | `#BB8FCE` | Testo rosa |
| Background Primary | `#EBF4F6` | Sfondo principale |
| Background Secondary | `#D6EAF8` | Gradients sfondo |

### Dark Mode
| Colore | Hex | Uso |
|--------|-----|-----|
| Azzurro Primary | `#4A90E2` | Più vivace per dark mode |
| Arancione Light | `#FFB366` | Pulsanti più visibili |
| Verde Medium | `#52D98B` | Feedback successo |
| Rosa Medium | `#D8A8E8` | Pulsanti aiuto/cancella |
| Background Primary | `#2C3E50` | Sfondo scuro ma non troppo |
| Background Secondary | `#34495E` | Gradients scuri |
| Text Color | `#FAFAFA` | Testo chiaro ad alto contrasto |

## 📱 Responsive Design

L'app si adatta perfettamente a tutte le dimensioni:

- **Mobile** (< 600px): Layout verticale full-screen, font ottimizzati
- **Tablet/Desktop** (≥ 600px): Max-width 600px centrato, font più grandi

### Touch-Friendly
- Tutti i pulsanti hanno **min 44x44px** di area touch
- Animazioni ottimizzate per dispositivi mobile
- Supporto vibrazione per feedback tattile

## 🔧 Configurazione

### GitHub Pages

Il progetto è configurato per il deploy automatico su GitHub Pages:

- **baseURL**: `/MateGioco/` in produzione
- **SSR**: disabilitato (static generation)
- **Workflow**: `.github/workflows/deploy.yml`

### Personalizzazione

Per personalizzare l'app:

1. **Colori**: Modifica variabili CSS in `assets/css/main.css`
2. **Nome default**: Cambia in `composables/useSettings.ts`
3. **Numero esercizi**: Modifica `EXERCISES_PER_SESSION` in `composables/useExercises.ts`
4. **Range numeri**: Modifica `randomInt(1, 10)` in `useExercises.ts`

## 📄 Licenza

Questo progetto è open source e disponibile sotto licenza MIT.

## 🤝 Contributi

Contributi, issues e feature requests sono benvenuti!

## 👨‍💻 Autore

**PGLongo**

---

**Fatto con ❤️ per rendere l'apprendimento della matematica divertente!** 🎈⭐
