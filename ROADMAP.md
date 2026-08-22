# 🗺️ Roadmap

Dove è MateGioco oggi e in che ordine si costruisce quello che manca. Aggiornata al
**2026-08-22**, versione corrente **1.7.0**.

Questo documento dice *cosa* e *in che ordine*. I piani implementativi con gli step
eseguibili vivono in `.plans/` e **non sono versionati** (sono stato di lavoro locale):
`001-level-system.md`, `002-badges-system.md`, `003-home-page-redesign.md`.

## Dove siamo oggi

Funziona ed è in produzione:

- Home page in stile Bluey: `ChallengeCard` con barra di progresso, contatore stelline,
  pulsante "Gioca ora", footer di navigazione.
- Una sessione di gioco: **5 esercizi**, **solo somme**, addendi casuali da 1 a 10
  (`useExercises`). Nessun livello, nessuna difficoltà crescente.
- Feedback immediato: colori, suoni generati via Web Audio API, vibrazione, confetti.
- Tasto Aiuto che mostra metà della risposta.
- Stelline: **un unico contatore globale** su `localStorage` (`mategioco-stars`), +1 per
  risposta corretta, senza limite di tentativi.
- Nome del giocatore su `localStorage` (`mategioco-settings`).
- PWA installabile e offline, dark mode, interfaccia it/en.

## Il divario da colmare

L'interfaccia **promette già** un sistema che il codice non ha: `ChallengeCard` mostra
"Mancano X stelle al prossimo livello!" con `totalNeeded` scritto a mano a 100, e i pulsanti
"Mappa" e "Trofei" del footer non portano da nessuna parte. Il primo lavoro della roadmap
non è aggiungere una feature: è rendere vera una promessa già fatta all'utente.

## Fase 1 - Motore a livelli 🔢

**Blocca tutto il resto.** Senza una configurazione dei livelli e una progressione
persistita, né le sottrazioni né i badge hanno un posto dove esistere.

- Configurazione dichiarativa dei livelli (operazione, range numerico, requisito di sblocco)
  al posto dei numeri sparsi nel codice.
- Motore di generazione degli esercizi guidato dalla configurazione, con il vincolo
  risultato ≥ 0 per le sottrazioni.
- Progressione persistita: stelline **per livello** e livelli sbloccati, accanto al
  contatore globale che resta per l'estetica.
- Regola di sblocco e regola dei tentativi (il piano originale prevede 15 stelline per
  livello e stellina solo entro 3 tentativi: entrambe da confermare, vedi *Decisioni
  aperte*).

Percorso previsto: Mondo 1 (somme entro 10, 20, 50, 100) e Mondo 2 (sottrazioni entro 10,
20, 50, 100), più una sfida finale mista.

## Fase 2 - Mappa dei livelli 🗺️

Rende visibile la progressione: livelli superati con le stelline ottenute, livello corrente
in evidenza, livelli futuri con il lucchetto. È qui che `ChallengeCard` smette di mentire e
il pulsante del footer trova la sua destinazione.

## Fase 3 - Badge, i Guardiani dei Numeri 🏅

Un badge per ogni livello completato (animali tropicali per le somme, animali del bosco per
le sottrazioni, un leone d'oro per la sfida finale): bacheca dei badge, stato bloccato in
silhouette, animazione di sblocco a fine livello. **Dipende dalla Fase 1**: senza livelli
completabili non c'è niente da premiare.

## Fase 4 - Espansioni 🚀

Moltiplicazioni (tabelline) e divisioni senza resto, come nuovi Mondi. Il motore della Fase
1 è progettato per accoglierli senza riscritture: `OperationType` prevede già `*` e `/`.

## Difetti noti

Verificati nel browser il 2026-08-22 (Chrome 151, dev server), non intercettabili da lint o
build perche' con `ssr: false` non c'e' prerendering:

- **Il tastierino numerico collassa sui viewport bassi.** In `app/pages/game.vue` la
  `.number-pad` e' un figlio flex che si comprime invece di andare in overflow: a 700px di
  altezza e' alta 166px, a 560px scende a 26px (tasto OK a 20px, non centrabile da un dito
  di bambino), a 493px arriva a **0** e il gioco e' inutilizzabile. `main` non diventa
  scrollabile, quindi lo scroll non recupera: il contenuto viene schiacciato, non traboccato.
  Colpisce telefono in landscape, tablet piccoli e finestre desktop basse. Direzione della
  correzione: `min-height` sul tastierino e lasciare che `main` scrolli.
- **Lingua mista.** Con il browser in inglese la pagina di gioco mostra "What is?", "Help",
  "Delete" mentre header ("Ciao, Amico!") e CTA ("GIOCA ORA") restano in italiano, perche'
  quelle stringhe sono hardcoded nei template. Per un utente di 4 anni italiano e' un difetto
  di prodotto, non solo debito: va deciso se forzare `it` o completare l'estrazione i18n.
- **`<html>` senza attributo `lang`**, segnalato da `@nuxt/hints` in console. Problema di
  accessibilita' e di resa da parte degli screen reader.
- **`ProgressBar.vue` non e' montato da nessuna parte** (dead code), e con lui restano
  inutilizzate le chiavi i18n `footer.github`, `footer.theme`, `footer.settings`.
- **I pulsanti "Mappa" e "Trofei" del footer non navigano**: `NavigationButton` non ha
  `@click`. Le destinazioni arrivano con le Fasi 1 e 2.

## Debito tecnico che condiziona la roadmap

Non sono feature, ma pesano su tutto quello che sta sopra:

- **Nessun test automatico.** La logica di progressione (sblocchi, stelline per livello,
  tentativi) è esattamente il tipo di codice che si rompe in silenzio. Prima della Fase 1
  va deciso se introdurre Vitest: è una scelta aperta, non ancora fatta.
- **i18n applicato a metà.** Alcune stringhe sono ancora scritte nei template (per esempio
  "GIOCA ORA" in `app/pages/index.vue`). Ogni fase che aggiunge interfaccia dovrebbe
  chiudere il pezzo che tocca invece di allargare il debito.
- **`tailwind.config.ts` inerte.** Definisce colori e font che non arrivano da nessuna
  parte: Tailwind 4 non legge i config legacy senza una direttiva `@config`. I colori veri
  sono le custom property in `app/assets/css/main.css`. Va rimosso o attivato prima di
  aggiungere componenti nuovi, o continuerà a sviare chi cerca la palette.
- **Manca il file `LICENSE`** dichiarato dal README.

## Decisioni aperte

Da chiudere prima o durante la Fase 1, perché cambiano gli step a valle:

1. **Quanti esercizi per sessione.** Il codice ne fa 5, il piano originale ne prevede 10 con
   15 stelline per sbloccare il livello (quindi minimo 2 partite per avanzare). Cambiare la
   lunghezza della sessione tocca il ritmo di gioco per un bambino di 4 anni: è una scelta
   di prodotto, non tecnica.
2. **Regola dei 3 tentativi.** Introduce il concetto di "tentativo" che oggi non esiste:
   ogni risposta corretta vale una stellina, indipendentemente da quanti errori l'hanno
   preceduta.
3. **Suite di test sì o no**, e con quale runner.

## Storico

| Fase | Esito |
|---|---|
| Redesign home page e footer in stile Bluey | Completata, release 1.7.0 (PR #10) |
| Generazione icone e favicon PWA | Completata, release 1.6.0 |
