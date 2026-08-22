# 🗺️ Roadmap

Dove è MateGioco oggi e in che ordine si costruisce quello che manca. Aggiornata al
**2026-08-22**, versione corrente **1.8.0** (Fasi 1 e 2 rilasciate; la Fase 3 e' su
`develop` e attende il prossimo tag: il deploy parte da lì).

Questo documento dice *cosa* e *in che ordine*. I piani implementativi con gli step
eseguibili vivono in `.plans/` e **non sono versionati** (sono stato di lavoro locale):
`001-level-system.md`, `002-badges-system.md`, `003-home-page-redesign.md`.

## Dove siamo oggi

Funziona ed è in produzione:

- Home page in stile Bluey: `ChallengeCard` con barra di progresso, contatore stelline,
  pulsante "Gioca ora", footer di navigazione.
- Percorso a livelli: cinque Mondi (somme, sottrazioni, tabelline, divisioni e due sfide
  miste) per sedici livelli, con difficoltà crescente (entro 10, 20, 50, 100) e sblocco a 25
  stelline per livello, cioè almeno cinque sessioni.
- Mappa dei livelli raggiungibile dal footer: completati, corrente, chiusi con il requisito.
- Bacheca dei badge: un Guardiano per ciascuno dei sedici livelli, con modale di
  festeggiamento a fine sessione.
- Tema chiaro e scuro, con interruttore nell'header e default che segue il dispositivo.
- Una sessione di gioco: **5 esercizi** generati sul livello raggiunto, o su quello scelto
  nella mappa fra quelli sbloccati.
- Feedback immediato: colori, suoni generati via Web Audio API, vibrazione, confetti.
- Tasto Aiuto che mostra metà della risposta.
- Stelline: contatore globale nell'header (`mategioco-stars`) **e** conteggio per livello
  (`mategioco-progression`), che è quello che governa gli sblocchi. Nessun limite di tentativi.
- Nome del giocatore su `localStorage` (`mategioco-settings`).
- PWA installabile e offline, dark mode, interfaccia it/en.

## Il divario colmato

L'interfaccia prometteva un sistema che il codice non aveva: `ChallengeCard` mostrava
"Mancano X stelle al prossimo livello!" con `totalNeeded` scritto a mano a 100, e i pulsanti
del footer non portavano da nessuna parte. Le Fasi 1 e 2 hanno reso vera quella promessa: la
card legge il livello corrente e la sua soglia reale, "Mappa" apre la mappa, "Trofei" resta
spento in attesa della Fase 3 invece di finto.

## Fase 1 - Motore a livelli ✅

Fatta. `app/config/levels.config.ts` descrive Mondi e Livelli come dati; `useMathEngine`
genera esercizi conformi a una `LevelConfig` (risultato entro il tetto, sottrazioni mai
negative); `useProgression` persiste le stelline per livello e calcola sblocchi e livello
corrente, con la catena stretta (un livello conta come completato solo se era davvero
giocabile). Coperta da 37 test Vitest.

## Fase 2 - Mappa dei livelli ✅

Fatta. `app/pages/map.vue` mostra i tre Mondi, i livelli completati con le stelline
ottenute, il livello corrente in evidenza e quelli chiusi con il requisito scritto. Da lì si
gioca un livello sbloccato qualsiasi (`/game?level=<id>`), e la query è validata: un livello
bloccato forzato dalla barra degli indirizzi ricade sul livello corrente.

## Fase 3 - Badge, i Guardiani dei Numeri ✅

Fatta. Nove badge, uno per livello, con l'arte affidata a un'emoji invece che a file SVG:
il design doc esprimeva ogni Guardiano come animale-emoji, l'app ne usa gia' nei feedback,
e un'emoji scala a qualsiasi dimensione senza asset binari in una PWA offline. La bacheca
(`/badges`, raggiungibile da "Trofei") mostra i conquistati con nome, descrizione e i
restanti in silhouette con il requisito. A fine sessione una modale festeggia i Guardiani
nuovi, con coriandoli e suono: e' anche il feedback di "Level Up" che mancava.

Sostituire le emoji con SVG piu' avanti non tocca ne' la logica ne' i componenti: cambia
un campo della configurazione.

## Fase 4 - Espansioni ✅

Fatta. Due Mondi nuovi, **Il Prato delle Tabelline** (moltiplicazioni entro 20, 50, 100) e
**Lo Stagno delle Divisioni** (divisioni sempre senza resto, entro 20, 50, 100), piu' un
livello finale, **la Sfida Suprema**, che mescola tutte e quattro le operazioni. Il percorso
passa da 9 a 16 livelli su 5 Mondi, con 16 Guardiani.

Le operazioni dei livelli-sfida sono un campo della configurazione (`mixedOperations`), non
un caso speciale sugli id dei Mondi: aggiungere un Mondo non richiede piu' di toccare il
motore. Le divisioni si costruiscono al contrario (divisore e quoziente prima, dividendo
come loro prodotto): e' l'unico modo di garantire che non ci sia mai resto. Il divisore
parte da 1 di proposito, perche' sapere che dividere per uno non cambia il numero fa parte
di quello che il livello insegna.

## Difetti noti

Verificati nel browser il 2026-08-22 (Chrome 151). Quelli chiusi lo stesso giorno restano
elencati perche' dicono cosa e' stato guardato, non solo cosa manca.

**Risolti**

- ~~Esercizi ripetuti nella stessa sessione~~: il motore sorteggiava un operando alla volta,
  cosi' il **30%** delle sessioni conteneva un doppione (fino a 4 ripetizioni su 5 domande) e
  `9 + 1` usciva l'**11%** delle volte contro il 2% che gli spetta. Ora lo spazio degli
  esercizi validi viene enumerato e campionato **senza ripetizioni** dentro la sessione.
- ~~Soglia di sblocco troppo bassa~~: da 8 a 25 stelline, cioe' almeno 5 sessioni per
  livello. I livelli superati con la soglia vecchia restano superati, perche' il badge gia'
  conquistato vale come soglia raggiunta: senza quella clausola un bambino si sarebbe
  ritrovato bloccati livelli che aveva finito.

- ~~Il tastierino numerico collassava a 0px di altezza sotto i ~500px di viewport~~
  (`.number-pad` era un figlio flex con `min-height: 0` e bottoni senza altezza minima):
  ora i bottoni hanno un pavimento di 44px, la griglia scala fino a quello e la pagina
  scrolla invece di ritagliare. Su telefono in portrait il comportamento e' identico a
  prima (nessuno scroll).
- ~~Il contatore delle stelline nell'header non si aggiornava~~ dopo una risposta corretta:
  `useStars` creava il `ref` dentro il composable, quindi header e pagina di gioco avevano
  copie separate e servivano un reload. Ora e' un singleton di modulo, come `useSettings`.
- ~~Lingua mista~~ (interfaccia in inglese con header e CTA in italiano): le stringhe
  hardcoded nei template sono state estratte in `i18n/locales/`, e titolo e description del
  documento seguono la lingua rilevata.
- ~~`<html>` senza attributo `lang`~~: l'HTML generato ora porta `lang="it"` e `app.vue` lo
  riallinea alla lingua rilevata. In dev `@nuxt/hints` continua a segnalarlo, perche'
  valida lo shell prima dell'hydration: e' un falso positivo dell'ambiente di sviluppo.
- ~~`ProgressBar.vue` era dead code~~: rimosso insieme al tipo orfano e alle chiavi i18n
  `footer.*` che solo lui usava.

- ~~I pulsanti "Mappa" e "Trofei" del footer non navigavano~~: ora portano a mappa e
  bacheca, e `NavigationButton` resta spento quando una destinazione non esiste ancora.
- ~~Il dark mode non era raggiungibile~~: `colorMode.preference` e' passato a `'system'` e
  l'header ha un interruttore. Il tema scuro si fermava comunque a metà, perche' fondo,
  header e footer non usavano i token di sfondo: il fondo restava azzurro (#5BA8D6) e il
  footer bianco al 90%. Ora ci sono token **semantici** delle superfici (`--surface-app`,
  `--surface-header`, `--surface-nav`, `--card-border`, `--surface-overlay`) con una
  gerarchia di profondita' in scuro: fondo #22282D, header #2C3338, card #3A444B. Stessa
  cosa per il testo (`--text-strong`, `--text-muted`, `--text-accent`), che usava
  `--color-dark-navy` non ridefinito in scuro: titoli a **1.33:1** e footer a **1.15:1**,
  cioe' invisibili, ora rispettivamente 13.48:1 e 11.6:1.
- ~~Il nome di default restava "Amico" anche in inglese~~: il composable non impone piu' un
  default, e l'interfaccia usa `header.defaultName` (Amico / Buddy).
- ~~Due verità parallele sulle stelline~~: il totale dell'header e' ora derivato dalla somma
  delle stelline per livello. Le stelline guadagnate prima dei livelli vengono recuperate
  una volta sola dalla vecchia chiave `mategioco-stars` invece di essere perse.
- ~~`tailwind.config.ts` inerte~~ e ~~`LICENSE` mancante~~: rimosso il primo, aggiunto il
  secondo.

**Aperti**

- **Testo bianco su pastello nel tastierino**, in **entrambi** i temi: le cifre sono bianche
  su arancione (1.65:1 in chiaro, 2.26:1 in scuro) e il tasto OK bianco su verde (1.79:1).
  E' la scelta estetica "Bluey" originale, non una regressione, ma sotto il minimo di 3:1
  per il testo grande. Si chiude con un token (`--text-on-pastel` scuro invece di bianco):
  cambia l'aspetto della schermata principale, quindi e' una decisione di prodotto.

## Debito tecnico che condiziona la roadmap

Non sono feature, ma pesano su tutto quello che sta sopra:

- **La copertura si ferma alla logica.** 77 test Vitest coprono motore, sessione,
  progressione, badge e le invarianti della configurazione; le pagine no. I difetti trovati
  finora (tastierino collassato, contatore non condiviso, livello di sessione che scivolava)
  erano tutti invisibili a lint e build.
- **i18n da mantenere completo.** L'estrazione delle stringhe hardcoded e' stata chiusa il
  2026-08-22: ogni fase che aggiunge interfaccia deve aggiungere le chiavi in **entrambi** i
  file di `i18n/locales/`, altrimenti il debito si riapre da capo.
- **`tailwind.config.ts` inerte.** Definisce colori e font che non arrivano da nessuna
  parte: Tailwind 4 non legge i config legacy senza una direttiva `@config`. I colori veri
  sono le custom property in `app/assets/css/main.css`. Va rimosso o attivato prima di
  aggiungere componenti nuovi, o continuerà a sviare chi cerca la palette.
- **Manca il file `LICENSE`** dichiarato dal README.

## Decisioni prese

Le tre decisioni che bloccavano la Fase 1 sono state chiuse il 2026-08-22:

| Decisione | Esito |
|---|---|
| Esercizi per sessione | **5**, come già rilasciato: sta dentro la soglia di attenzione di un bambino di 4 anni |
| Soglia di sblocco | **25 stelline per livello** (era 8, alzata il 2026-08-22 su indicazione dell'utente): con 5 esercizi per sessione servono almeno 5 partite per avanzare |
| Regola dei 3 tentativi | **Non implementata**: meccanica punitiva su utenti di 4 anni, e il sistema di livelli non ne ha bisogno |
| Suite di test | **Vitest, subito**, sulla logica pura (motore, sessione, progressione) |

Restano aperte due cose che la Fase 1 ha fatto emergere:

- **Due verità parallele sulle stelline**: l'header somma tutto, la progressione conta per
  livello, e nessuno dei due deriva dall'altro. Oggi coincidono.
- **Test sui componenti solo parziali**: 77 test coprono la logica (motore, sessione,
  progressione, badge), le invarianti della configurazione e due componenti (`BadgeCard`,
  `ChallengeCard`). Le pagine — mappa, bacheca, gioco — restano verificate a mano nel
  browser: è il buco che aveva fatto passare il tastierino collassato e il livello di
  sessione che scivolava.
- **Nessun test end-to-end**: `nuxt:e2e` (Playwright) sarebbe il passo naturale, ora che
  Chrome è installato nell'ambiente di sviluppo.

## Storico

| Fase | Esito |
|---|---|
| Fase 4 - Tabelline, divisioni e Sfida Suprema | Completata il 2026-08-22, su `develop` |
| Fase 3 - Badge, i Guardiani dei Numeri | Completata il 2026-08-22, su `develop` |
| Fase 1 - Motore a livelli e progressione | Completata il 2026-08-22, rilasciata in **1.8.0** |
| Fase 2 - Mappa dei livelli | Completata il 2026-08-22, rilasciata in **1.8.0** |
| Redesign home page e footer in stile Bluey | Completata, release 1.7.0 (PR #10) |
| Generazione icone e favicon PWA | Completata, release 1.6.0 |
