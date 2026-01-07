# Design Doc: Sistema di Livelli e Progressione (RFC-001)

| Status | Data Creazione | Ultima Modifica | Autore |
| :--- | :--- | :--- | :--- |
| **DRAFT** | 2025-12-29 | 2025-12-29 | Antigravity / User |

## 1. Obiettivo (Goal) 🎯
Trasformare "MateGioco" da un semplice generatore casuale di operazioni a un **percorso educativo strutturato**.
Il sistema deve guidare il bambino attraverso una progressione di difficoltà crescente, premiando l'impegno e sbloccando nuove sfide solo quando le competenze precedenti sono consolidate.

## 2. Glossario (Terminology) 📖
*   **Mondo (World)**: Rappresenta il *tipo* di operazione matematica (es. Mondo delle Somme, Valle delle Sottrazioni).
*   **Livello (Level)**: Rappresenta la *difficoltà* numerica all'interno di un Mondo (es. Somme entro il 10, Somme entro il 20).
*   **Sessione (Session)**: Una serie di 10 domande che il bambino deve completare.
*   **Stella (Star)**: La valuta di gioco guadagnata rispondendo correttamente.
*   **Sblocco (Unlock)**: L'azione che rende accessibile un livello successivo dopo aver superato i requisiti (es. completare il livello precedente con almeno 80% di precisione).

## 3. Percorso di Progressione (The Map) 🗺️

Il gioco sarà diviso in Mondi sequenziali.

### 🟢 Mondo 1: L'Isola delle Somme (+)
*   **Livello 1**: Somme con risultato max **10**. (Intro)
    *   *Esempio*: $2 + 3$, $5 + 4$.
*   **Livello 2**: Somme con risultato max **20**. (Primi riporti)
    *   *Esempio*: $8 + 7$, $12 + 5$.
*   **Livello 3**: Somme con risultato max **50**. (Consolidamento)
    *   *Esempio*: $23 + 15$.
*   **Livello 4**: Somme con risultato max **100**. (Maestria)
    *   *Esempio*: $45 + 32$.

### 🟠 Mondo 2: La Valle delle Sottrazioni (-)
*Requisito sblocco: Completare Livello 2 o 3 delle Somme.*
*   **Livello 1**: Sottrazioni entro il **10**.
*   **Livello 2**: Sottrazioni entro il **20**.
*   **Livello 3**: Sottrazioni entro il **50**.
*   **Livello 4**: Sottrazioni entro il **100**.
*   *Vincolo*: Risultato sempre $\ge 0$.

### � Mondo 3: La Grande Sfida (Mixed)
*Requisito sblocco: Completare Mondo 1 e 2.*
*   **Livello Finale**: Mix casuale di Somme e Sottrazioni entro il 100.
*   *Obiettivo*: Verificare la flessibilità mentale (cambiare operazione al volo).

### �🔵 Mondi Futuri (Espansioni)
*   **Moltiplicazioni** (Tabelline)
*   **Divisioni** (Senza resto)

## 4. User Experience (UX) 🎮

### Flusso di Gioco
1.  **Dashboard Livelli**: All'avvio, l'utente vede una mappa o lista di livelli.
    *   I livelli superati hanno una spunta ✅ o stelle (⭐⭐⭐).
    *   Il livello attuale è evidenziato "Play".
    *   I livelli futuri sono lucchettati 🔒.
2.  **Partita**: L'utente gioca una sessione (es. 10 domande) alla difficoltà selezionata.
3.  **Risultato & Progressione**:
    *   Ogni risposta corretta vale **1 Stella** ⭐.
    *   **Regola dei 3 Tentativi**: La stella si ottiene *solo* se si risponde correttamente entro 3 tentativi. Altrimenti si può proseguire ma senza guadagnare la stella per quella domanda.
    *   **Sblocco Livelli**: Per passare al livello successivo, bisogna accumulare un totale di **15 Stelle** *specifiche per quel livello*.
    *   *Nota*: Poiché una partita è di 10 domande, serve giocare almeno 2 volte per avanzare (incentiva la ripetizione).

### Gamification
*   **Stelle**: Accumulate globalmente (Header).
*   **Trofei**: Badge speciali per traguardi (es. "Matematico Veloce", "100 risposte esatte").

## 5. Specifiche Tecniche (Tech Spec) 🛠️

### Data Model (Types)
```typescript
type OperationType = '+' | '-' | '*' | '/';

interface LevelConfig {
  id: string;
  worldId: string;
  name: string;       // es. "Somme facili"
  operation: OperationType;
  maxNumber: number;  // es. 10, 20, 100
  minNumber: number;  // es. 0
  unlockReq?: string; // ID del livello precedente richiesto
}

interface UserProgress {
  unlockedLevels: string[]; // IDs ["sum-1", "sum-2"]
  levelScores: Record<string, number>; // { "sum-1": 12, "sub-1": 5 } (Stelle accumulate PER LIVELLO)
  totalStars: number; // Somma globale per estetica
}
```

### State Management
Utilizzeremo `composables/useProgression.ts` con persistenza su `localStorage` per salvare i progressi tra le sessioni.

### Math Engine Refactor
Creazione di `composables/useMathEngine.ts` che accetta una `LevelConfig` e genera operazioni conformi ai vincoli (es. gestire `a - b` assicurando `a >= b`).

## 6. Roadmap di Implementazione 📅

### Fase 1: Engine & Configurazione
- [ ] Creare i file di definizione dei Livelli (`levels.config.ts`).
- [ ] Rifattorizzare la logica di generazione numeri estraendola dai componenti.
- [ ] Implementare `useMathEngine` che genera domande basate sulla config.

### Fase 2: Stato & Persistenza
- [ ] Implementare `useProgression` per salvare/caricare i dati.
- [ ] Gestire la logica di sblocco livelli.

### Fase 3: UI Dashboard
- [ ] Creare la vista "Mappa dei Livelli" (nuova Homepage o Modalità).
- [ ] Aggiungere feedback visivo "Level Up".
- [ ] Integrare il tutto nella UI esistente "Bluey style".
