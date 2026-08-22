# Come contribuire a MateGioco

Questa guida copre il workflow: come si nominano i branch, come si scrivono i commit, come
si apre una PR e come una modifica arriva davvero in produzione. Il punto meno ovvio del
progetto e' l'ultimo: **il deploy non parte da un merge, parte da un tag.**

Per il setup iniziale (clone, `npm install`, dev server, build) e per i comandi di lint fai
riferimento al [README](README.md#-guida-allo-sviluppo): qui si da' per scontato che il
progetto sia gia' installato e funzionante in locale.

## Prerequisiti

- Node.js >= 20 e npm (la CI usa Node 20.x: se sviluppi su una versione piu' recente,
  verifica la build con `npm run generate` prima di aprire la PR).
- Nessun database, nessun servizio esterno, nessuna variabile d'ambiente da configurare:
  l'applicazione e' interamente client-side.

## Workflow e branch

- Il branch base e' **`develop`**. `main` esiste per i rilasci: non ci si sviluppa sopra.
- Parti sempre da `develop` aggiornato e crea un branch `type/descrizione`, minuscolo e con
  trattini:

  ```bash
  git switch develop
  git pull
  git switch -c feature/nome-della-feature
  ```

- Tipi in uso nel repository: `feature/`, `bugfix/`, `chore/`, `docs/`, `refactor/`.
- Niente commit diretti su `develop` o `main`.

## Commit

Segui [Conventional Commits 1.0.0](https://www.conventionalcommits.org/): il CHANGELOG e il
numero di versione sono generati dai messaggi di commit, quindi un type sbagliato produce
una release sbagliata.

Il **subject del commit si scrive in inglese**, all'imperativo e senza punto finale, come
tutto lo storico del progetto (commenti e documentazione restano in italiano):

```
feat(game): add completed sessions counter
fix(pwa): correct icon baseURL in production
docs: align folder structure in README
```

- Type disponibili e come finiscono nel CHANGELOG: vedi [`.versionrc.json`](.versionrc.json).
  `feat`, `fix`, `docs` e `perf` sono visibili; `style`, `refactor`, `test`, `build`, `ci` e
  `chore` sono nascosti ma contano per il calcolo della versione.
- Un cambiamento logico per commit: piu' facile da rivedere e da annullare.
- Nessuna attribuzione ad agenti AI nei messaggi di commit.

## Prima di aprire la PR

1. Passa lint e test e verifica la build: comandi nella sezione
   [Test e Lint](README.md#-test-e-lint) del README.
2. Prova a mano il flusso che hai toccato su viewport mobile: gli utenti finali sono bambini
   che usano tablet e smartphone, e i test automatici coprono la logica, non le pagine.
3. Se hai aggiunto testo visibile all'utente, controlla che la chiave esista in **entrambi**
   i file di `i18n/locales/`.

## Pull request

- Apri la PR verso **`develop`**, mai verso `main`.
- La descrizione dice **cosa cambia per chi usa l'app** e come l'hai verificato. Se la
  modifica e' visiva, allega uno screenshot: e' la parte piu' difficile da valutare
  leggendo il diff.
- Se la modifica avanza una fase della [ROADMAP](ROADMAP.md), dillo nella descrizione: e'
  il posto dove si vede se il progetto si sta muovendo nell'ordine previsto.

## Release e deploy

Il sito pubblico e' aggiornato **solo** dal workflow
[`deploy.yml`](.github/workflows/deploy.yml), che scatta sui tag `v*.*.*` (o manualmente da
GitHub con *workflow_dispatch*). Mergiare su `develop` non pubblica niente.

I tag li crea `standard-version` a partire dai commit: la procedura e i comandi sono nella
sezione [Release Management](README.md#-release-management) del README. Non creare tag a
mano, altrimenti versione, CHANGELOG e tag divergono.
