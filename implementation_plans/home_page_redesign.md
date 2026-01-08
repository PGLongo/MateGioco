# Piano di Implementazione: Redesign Home Page "MateGioco"

Questo documento descrive i passaggi per creare la nuova Home Page accogliente e gioiosa per MateGioco, basata su un design ispirato a "Bluey".

## 1. Configurazione e Stile (Aesthetics)
Il primo passo è assicurarsi che i fondamenti del design (colori, font) siano configurati correttamente.

### 1.1 Font
*   **Obiettivo**: Cambiare il font da "Quicksand" a "Fredoka" (o "Nunito") per un aspetto più rotondo e amichevole.
*   **Azione**: Aggiornare `nuxt.config.ts` per includere il font da Google Fonts.
*   **Azione**: Aggiornare `app/assets/css/main.css` o la configurazione Tailwind per usare il nuovo font.

### 1.2 Colori (Palette)
*   **Obiettivo**: Implementare la palette pastello definita.
*   **Azione**: Aggiornare `tailwind.config.ts` (da creare se non esiste) per estendere il tema con i colori specifici:
    *   `sky-blue`: `#78CBE8`
    *   `bingo-orange`: `#F9C05E` / `#FF9F1C`
    *   `soft-green`: `#88C941`
    *   `dark-navy`: `#2A3C55`
    *   `card-white`: `#FFFFFF`
*   **Nota**: Assicurarsi che le ombre e gli angoli arrotondati (`rounded-3xl`) siano disponibili come classi di utility.

## 2. Layout (Layout & Components)
Creeremo un layout persistente per la Top Bar e la Bottom Bar.

### 2.1 File Layout (`app/layouts/default.vue`)
*   **Struttura**:
    *   `div` principale con sfondo `sky-blue` (`bg-[#78CBE8]`).
    *   **Header (Top Bar)**:
        *   Allineamento Flex (Space Between).
        *   **Sinistra**: "Ciao, Campione!" 👋 (testo `dark-navy`).
        *   **Destra**: Componente `StarCounter` (Icona Stella + Numero).
    *   **Main Content**: Slot centrale (`<slot />`) con padding adeguato.
    *   **Footer (Bottom Bar)**:
        *   Icone semplici per navigazione ("Mappa", "Trofei").
        *   Posizionato in basso (`fixed bottom-0` o sticky).

### 2.2 Componente App (`app/app.vue`)
*   **Azione**: Avvolgere `<NuxtPage />` con `<NuxtLayout>`.

## 3. Home Page (`app/pages/index.vue`)
Implementazione del contenuto principale (Hero Section).

### 3.1 Hero Section
*   **Card "Next Challenge"**:
    *   Container bianco con angoli arrotondati (`rounded-3xl`) e ombra soffice.
    *   **Contenuto**:
        *   Illustrazione/Icona del "Mondo" corrente.
        *   Titolo: "Livello [X]: [Titolo Livello]".
        *   Barra di Progresso: Visuale "chunky" (spessa e rotonda), indicante le stelle ottenute/totali.
        *   Label: "Mancano X stelle al prossimo livello!".
    *   **CTA Principale**:
        *   Bottone "GIOCA ORA ▶️".
        *   Stile: Pill-shaped, arancione vibrante, animazione pulsante.

## 4. Componenti UI
Componenti riutilizzabili da creare o aggiornare.

*   `StarCounter.vue`: Visualizza il totale stelle.
*   `LevelProgress.vue`: La barra di progresso personalizzata.
*   `NavigationButton.vue`: Per i bottoni del footer.

## 5. Esecuzione
1.  Setup Config (Font/Colori).
2.  Creazione Layout e integrazione in `app.vue`.
3.  Implementazione Page `index.vue`.
4.  Refine & Polish (Animazioni, spaziature).
