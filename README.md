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
- **Feedback immediato** con animazioni e vibrazione
- **Sistema di stelline** - guadagna ⭐ per ogni risposta corretta
- **Tasto Aiuto** 🤔 per suggerimenti

### 🎨 Design & UX
- **Palette colori pastello** stile Bluey (azzurro, arancione, verde acqua)
- **Font Quicksand** - rotondo, leggibile e perfetto per bambini
- **Animazioni fluide** (bounce, pulse, celebrate)
- **Feedback tattile** con vibrazione su mobile
- **Mobile-first responsive** - ottimizzato per tablet e smartphone

### 💾 Persistenza Dati
- **localStorage** per salvare:
  - Stelline totali guadagnate
  - Nome dell'utente
  - Progressi nel tempo

### 🎯 Interfaccia Intuitiva
- **Header** con avatar 🎈, saluto personalizzato e contatore stelline
- **Display problema** con layout verticale chiaro
- **Calcolatrice** con tastierino 0-9 e display integrato
- **Footer** con progresso (pallini ●●●○○) e pulsanti navigazione 🏠 🎨 ⚙️

## 🛠️ Stack Tecnologico

- **[Nuxt 3](https://nuxt.com/)** - Framework Vue.js full-stack
- **[Vue 3](https://vuejs.org/)** - Composition API + TypeScript
- **[Nuxt UI](https://ui.nuxt.com/)** - Component library
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
│       └── main.css          # Stili globali + variabili colori
├── components/
│   ├── AppHeader.vue         # Header con nome utente e stelline
│   ├── Calculator.vue        # Tastierino numerico + display
│   ├── MathProblem.vue       # Visualizzazione problema matematico
│   └── ProgressBar.vue       # Footer con progresso e navigazione
├── composables/
│   ├── useExercises.ts       # Logica generazione esercizi e validazione
│   ├── useSettings.ts        # Gestione impostazioni utente
│   └── useStars.ts           # Sistema stelline + localStorage
├── pages/
│   └── index.vue             # Pagina principale
├── public/
│   └── .nojekyll             # File per GitHub Pages
├── app.vue                   # Root component
├── nuxt.config.ts            # Configurazione Nuxt
├── package.json
└── README.md
```

## 🎮 Come Funziona

1. **Avvia una sessione** - L'app genera 5 esercizi casuali di somma
2. **Risolvi i problemi** - Usa il tastierino per inserire la risposta
3. **Ottieni feedback** - ✅ Risposta corretta = +1 stellina + animazione
4. **Continua a giocare** - Completa tutti e 5 gli esercizi
5. **Ricomincia** - Inizia una nuova sessione per guadagnare più stelline!

### Feedback Interattivo

- ✅ **Risposta corretta**: Animazione celebrate, vibrazione [100, 50, 100]ms, +1 ⭐
- ❌ **Risposta sbagliata**: Vibrazione 200ms, messaggio "Riprova!", possibilità di ritentare
- 🤔 **Suggerimento**: Mostra metà della risposta corretta

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

# Deploy automatico su GitHub Pages
# Avviene automaticamente al push su branch main o claude/create-mategioco-app-XigRk
```

## 🎨 Palette Colori

Il design utilizza toni pastello ispirati allo show Bluey:

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
| Background Primary | `#EBF4F6` | Sfondo principale |
| Background Secondary | `#D6EAF8` | Gradients sfondo |

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
