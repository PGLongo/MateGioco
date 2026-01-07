# Design Doc: Sistema di Badge e Ricompense (RFC-002)

| Status | Data Creazione | Autore |
| :--- | :--- | :--- |
| **DRAFT** | 2025-12-30 | Antigravity / User |

## 1. Obiettivo (Goal) 🎯
Introdurre un sistema di gratificazione visiva ("Badge") che premi il giocatore al completamento di ogni singolo livello di ogni Mondo.
L'obiettivo è aumentare la ritenzione e dare un senso di "collezione" ai progressi matematici.

## 2. Concetto: I Guardiani dei Numeri 🐾
Per mantenere lo stile giocoso e "Bluey", ogni Badge rappresenterà un animaletto o un elemento naturale che viene "liberato" o "incontrato" completando il livello.

### Stile Visivo
- **Flat & Colorful**: Colori vivaci, bordi morbidi, stile cartoon/vettoriale.
- **Progressione Visiva**: I badge dei livelli più difficili (es. 100) devono sembrare più epici o complessi di quelli iniziali (es. 10).

## 3. Elenco Badge per Mondo 🏅

### 🟢 Mondo 1: L'Isola delle Somme
*Tema: Animali Tropicali e Marini*

| Livello Config ID | Livello Desc | Badge (Idea) | Nome Badge |
| :--- | :--- | :--- | :--- |
| `sum-1` | Somme 10 | 🦀 Granchietto | "Il Granchio Conta-Dita" |
| `sum-2` | Somme 20 | 🐢 Tartaruga | "Guscio Numerico" |
| `sum-3` | Somme 50 | 🦜 Pappagallo | "Volo del 50" |
| `sum-4` | Somme 100 | 🐬 Delfino | "Re dell'Oceano" |

### 🟠 Mondo 2: La Valle delle Sottrazioni
*Tema: Animali del Bosco*

| Livello Config ID | Livello Desc | Badge (Idea) | Nome Badge |
| :--- | :--- | :--- | :--- |
| `sub-1` | Sottr. 10 | 🐿️ Scoiattolo | "Ladro di Nocciole" |
| `sub-2` | Sottr. 20 | 🦉 Gufo | "Saggezza Notturna" |
| `sub-3` | Sottr. 50 | 🦊 Volpe | "Furbizia Sottrattiva" |
| `sub-4` | Sottr. 100 | 🐻 Orso | "Forza della Foresta" |

### 🟣 Mondo 3: La Grande Sfida
*Tema: Leggendario*

| Livello Config ID | Livello Desc | Badge (Idea) | Nome Badge |
| :--- | :--- | :--- | :--- |
| `mix-1` | Mix 100 | 🦁 Leone d'Oro | "Maestro dei Numeri" |

## 4. Specifiche Tecniche 🛠️

### Data Model Esteso
Ogni livello definito in `levels.config.ts` avrà un riferimento al suo badge, oppure avremo una config separata `badges.config.ts`.

```typescript
export interface Badge {
  id: string;          // es. "badge-crab"
  levelId: string;     // es. "sum-1"
  name: string;        // es. "Il Granchio Conta-Dita"
  description: string; // "Hai completato le somme entro il 10!"
  assetPath: string;   // path immagine (es. "/assets/badges/crab.svg")
  unlockedAt?: Date;   // Se presente nello stato utente
}
```

### Assets Pipeline
- Creazione di icone SVG/PNG per ogni animale.
- I file saranno salvati in `public/assets/badges/`.

## 5. User Interface (UI) 🖼️

### 1. La Bacheca (Trophy Room)
Una nuova rotta `/badges` o modale accessibile dalla Home.
- Mostra una **Griglia** di tutti i badge possibili.
- **Stato Bloccato**: Silhouette grigia + Lucchetto.
- **Stato Sbloccato**: Icona a colori + Nome + Data.
- Hover/Tap per vedere i dettagli ("Completa il Livello X per sbloccare").

### 2. Animazione di Vittoria (Level Up)
Quando l'utente raggiunge le stelle necessarie per superare un livello:
1.  Schermata di fine partita classica.
2.  **Overlay Speciale**: "Nuovo Badge Sbloccato!".
3.  Animazione dell'animale che appare con coriandoli.
4.  Pulsante "Vai alla Bacheca" o "Prossimo Livello".

## 6. Roadmap di Implementazione 📅

### Fase 1: Configurazione & Assets
- [ ] Definire la lista finale dei badge in `badges.config.ts`.
- [ ] Generare/Reperire gli assets grafici (10 icone).

### Fase 2: Logica Backend (Locale)
- [ ] Aggiornare lo store `useProgression` per tracciare i badge sbloccati.
- [ ] Funzione `checkForNewBadges()` da chiamare a fine partita.

### Fase 3: UI Frontend
- [ ] Creare componente `BadgeCard.vue`.
- [ ] Creare pagina `BadgesView.vue`.
- [ ] Implementare "Level Up Modal" con animazione.
