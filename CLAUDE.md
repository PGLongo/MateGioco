# MateGioco

PWA educativa di matematica per bambini di 4+ anni: Nuxt 4 in SPA statica, nessun backend,
tutto lo stato nel browser. **Non** e' un'applicazione con API, database o utenti: se una
richiesta sembra implicarlo, e' un cambiamento di architettura da discutere prima di
scrivere codice.

Le istruzioni comuni a tutti gli agenti (stack, struttura, comandi, convenzioni, git,
verifica) stanno in AGENTS.md e sono importate qui sotto: e' quella la fonte unica, questo
file contiene solo il delta specifico di Claude Code.

@AGENTS.md

## Comandi principali

- dev: `npm run dev`
- build di produzione (SSG): `npm run generate`
- lint: `npm run lint`
- test: **non esistono** (vedi AGENTS.md)

## Skill da usare su questo repository

- `nuxt:fe` per componenti, pagine, layout e composable: fissa le convenzioni di codice del
  team. Non standardizza gli script npm, che restano quelli del `package.json`.
- `nuxt:unit` e `nuxt:e2e` solo se si decide di introdurre una suite di test: oggi il
  repository non ne ha, e la scelta va posta all'utente prima di impalcare Vitest o
  Playwright.
- `git:branch-create`, `git:commit-create`, `git:pr-create` per il workflow git: la base dei
  branch e' `develop`.
- `functional:adr` quando una modifica comporta una scelta tecnica non ovvia.
- `functional:md-docs` per mantenere questi quattro file di governance.

## Convenzioni non ovvie

- **Il deploy passa solo dai tag.** `deploy.yml` scatta su `v*.*.*` (o manualmente da
  workflow_dispatch): un merge su `develop` non pubblica nulla. Non proporre "ho fatto il
  deploy" dopo un merge.
- **`tailwind.config.ts` in root e' probabilmente inerte.** Tailwind 4 arriva
  transitivamente da `@nuxt/ui` e si configura via CSS (`@theme`), non da file di config
  legacy, che verrebbe letto solo con una direttiva `@config` in `main.css` (assente). I
  colori veri sono le custom property in `app/assets/css/main.css`: modifica quelle. Il file
  di config resta nel repo, non riusarlo come fonte di verita' senza prima verificare che
  venga davvero caricato.
- **Due cartelle di piani**: `docs/plans/` (design doc di feature non implementate: sistema
  di livelli, badge) e `implementation_plans/` (piani storici). Prima di progettare una
  feature nuova, controlla se un design doc esiste gia': `docs/plans/001-level-system.md`
  descrive un sistema di progressione che il codice attuale non implementa. Non trattare
  quei documenti come descrizione dello stato del codice.
- **README e codice hanno divergito in passato** (versione di Nuxt, font, albero delle
  cartelle). Quando descrivi il progetto, leggi `nuxt.config.ts` e `package.json`, non il
  README.
- `.cursorrules` contiene le stesse regole di stack, tipizzazione e git presenti in
  AGENTS.md, in inglese e per un altro tool. Se aggiorni una convenzione, aggiornala in
  AGENTS.md e valuta se allineare anche quel file, per non farli divergere.

## Manutenzione della documentazione

`README.md` e' la porta d'ingresso (cos'e' il progetto, setup, comandi);
`CONTRIBUTING.md` copre workflow, commit e release. Il dettaglio tecnico, quando servira',
va in `docs/` e si linka dal README, non si incolla nei file di governance.

**Regola**: se una modifica cambia stack, struttura delle cartelle, comandi o flusso di
release, aggiorna AGENTS.md (e il README dove serve) nella stessa PR. Un comando sbagliato
in questi file e' peggio che assente, perche' chi arriva si fida.
