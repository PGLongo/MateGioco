# Schermate: test visivi, galleria, report

Le immagini in questa cartella sono le **baseline dei test visivi**: `npm run visual` le
confronta pixel per pixel con la resa attuale dell'app e falliscono se qualcosa cambia.
Sono anche il catalogo da sfogliare e la fonte del report. Un solo insieme di immagini, tre
usi: così quello che si guarda è per definizione quello che il confronto considera corretto.

## Comandi

| Comando | Cosa fa |
|---|---|
| `npm run visual` | Esegue i test: confronto pixel su ogni schermata e dispositivo, più le verifiche di adattamento. Fallisce se l'interfaccia è cambiata. |
| `npm run visual:update` | Riscrive le baseline. Da usare **dopo** aver verificato che il cambiamento è voluto. |
| `npm run visual:report` | Apre il report locale di Playwright, con le differenze evidenziate (atteso / effettivo / diff). |
| `npm run gallery` | Ricostruisce `index.html`, la galleria sfogliabile, dalle immagini presenti. |
| `npm run gallery:report` | Costruisce `report.html`: un file solo, con immagini e misure incorporate, apribile da telefono e condivisibile. Non versionato. |

## Perché WebKit e non Chrome

I preset iPhone di Playwright dichiarano `defaultBrowserType: 'webkit'`, e non è un
dettaglio: gli iPhone eseguono Safari, quindi font, flexbox e arrotondamenti si vedono come
li vedrebbe un bambino solo rendendo con WebKit.

## Il viewport, non lo schermo

I preset usano l'altezza **utile** del browser, non quella del telefono: su iPhone 16 sono
393×659 e non 393×852, perché le barre di Safari occupano il resto. È una differenza di
circa 190 punti, e misurare sullo schermo intero dà una risposta ottimistica alla domanda
"ci sta senza scroll?".

Nota: installata come PWA (`display: standalone` nel manifest) l'app riavrebbe l'altezza
intera. I test verificano il caso peggiore, cioè Safari.

## Cosa verificano i test, oltre alle immagini

Un confronto pixel dice *se* qualcosa è cambiato, non *se va bene*. Perciò ogni dispositivo
ha anche un test di adattamento che asserisce:

- **home e sessione di gioco stanno in schermo senza scroll** — le usa un bambino di 4 anni,
  che non sa di poter scorrere: quello che esce dallo schermo per lui non esiste;
- **i tasti del tastierino restano alti almeno 44px** — sotto quella soglia un dito piccolo
  non li centra;
- **il tasto OK è nel viewport** — senza quello la sessione non si chiude.

Mappa e bacheca scorrono per costruzione: sono liste di sedici elementi.

Le stesse misure finiscono in `measurements.json` di ogni dispositivo, e da lì nella tabella
del report: nessun numero è scritto a mano.

## Riproducibilità

Perché un diff sulle immagini significhi qualcosa, due esecuzioni di fila devono produrre lo
stesso risultato. Le fonti di variabilità sono neutralizzate così:

| Fonte | Come |
|---|---|
| Esercizi casuali | `Math.random` sostituito da un generatore deterministico |
| Progressione salvata | `localStorage` popolato con uno stato fisso (livello 1 completato, livello 2 a 11/25) |
| Lingua e tema | forzati; il tema scuro ha le sue baseline separate |
| Animazioni | disabilitate da Playwright (`animations: 'disabled'`) |
| Icone caricate in asincrono | si attende che il numero di SVG sia stabile |
| Ordine di caricamento dei moduli | si serve la build statica, non il dev server |

## Cosa non è coperto

- **Modali**: fine sessione e nuovo Guardiano richiedono di giocare una partita intera.
- **Orientamento orizzontale**: il manifest PWA dichiara `orientation: portrait`.
- **Interazione**: i test guardano, non giocano. Un vero end-to-end (segnato in ROADMAP) è il
  passo successivo, e l'infrastruttura ora c'è.
