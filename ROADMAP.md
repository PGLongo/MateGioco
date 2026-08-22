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
- Percorso a livelli: tre Mondi (somme, sottrazioni, sfida mista) per nove livelli, con
  difficoltà crescente (entro 10, 20, 50, 100) e sblocco a 8 stelline per livello.
- Mappa dei livelli raggiungibile dal footer: completati, corrente, chiusi con il requisito.
- Bacheca dei badge: un Guardiano per livello completato, con modale di festeggiamento a
  fine sessione.
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

## Fase 4 - Espansioni 🚀

Moltiplicazioni (tabelline) e divisioni senza resto, come nuovi Mondi. Il motore della Fase
1 è progettato per accoglierli senza riscritture: `OperationType` prevede già `*` e `/`.

## Difetti noti

Verificati nel browser il 2026-08-22 (Chrome 151). Quelli chiusi lo stesso giorno restano
elencati perche' dicono cosa e' stato guardato, non solo cosa manca.

**Risolti**

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

**Aperti**

- **I pulsanti "Mappa" e "Trofei" del footer non navigano**: `NavigationButton` non ha
  `@click`. Le destinazioni arrivano con le Fasi 1 e 2, non prima.
- **Il dark mode non e' raggiungibile.** `main.css` ha le regole `.dark`, ma
  `nuxt.config.ts` imposta `colorMode.preference: 'light'` con `fallback: 'light'` e nessun
  componente monta un interruttore: ne' automatico ne' manuale. Il README lo prometteva come
  funzionalita' attiva; oggi va deciso se passare a `preference: 'system'` (cambia l'aspetto
  a molti utenti) o esporre un interruttore.
- **Il nome utente di default resta "Amico" anche in inglese**: e' un dato salvato in
  `localStorage`, non una stringa di interfaccia, quindi non passa da i18n.

## Debito tecnico che condiziona la roadmap

Non sono feature, ma pesano su tutto quello che sta sopra:

- **Nessun test automatico.** La logica di progressione (sblocchi, stelline per livello,
  tentativi) è esattamente il tipo di codice che si rompe in silenzio. Prima della Fase 1
  va deciso se introdurre Vitest: è una scelta aperta, non ancora fatta. I due difetti
  chiusi il 2026-08-22 (tastierino, contatore) sono la prova del costo: nessuno dei due
  veniva intercettato da lint o build, solo da una prova nel browser.
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
| Soglia di sblocco | **8 stelline per livello**, campo della `LevelConfig`: serve più di una partita per avanzare |
| Regola dei 3 tentativi | **Non implementata**: meccanica punitiva su utenti di 4 anni, e il sistema di livelli non ne ha bisogno |
| Suite di test | **Vitest, subito**, sulla logica pura (motore, sessione, progressione) |

Restano aperte due cose che la Fase 1 ha fatto emergere:

- **Due verità parallele sulle stelline**: l'header somma tutto, la progressione conta per
  livello, e nessuno dei due deriva dall'altro. Oggi coincidono.
- **Nessun test sui componenti**: la logica (motore, sessione, progressione, badge) è
  coperta da 45 test; mappa, bacheca e modale sono verificate solo a mano nel browser. È il
  buco che ha fatto passare due difetti già corretti.

## Storico

| Fase | Esito |
|---|---|
| Fase 3 - Badge, i Guardiani dei Numeri | Completata il 2026-08-22, su `develop` |
| Fase 1 - Motore a livelli e progressione | Completata il 2026-08-22, rilasciata in **1.8.0** |
| Fase 2 - Mappa dei livelli | Completata il 2026-08-22, rilasciata in **1.8.0** |
| Redesign home page e footer in stile Bluey | Completata, release 1.7.0 (PR #10) |
| Generazione icone e favicon PWA | Completata, release 1.6.0 |
