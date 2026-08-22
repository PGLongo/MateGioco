# Galleria delle schermate

Screenshot di ogni schermata di MateGioco su ogni risoluzione iPhone in circolazione.
Apri **`index.html`** in un browser per sfogliarli: c'è un selettore di tema e uno di scala,
e le schermate sono affiancate per dispositivo.

## Rigenerare

```bash
npm run screenshots
```

Fa la build statica, la serve su `http://localhost:4173/MateGioco/` e cattura tutto. Non
modificare i file a mano: sono generati.

## Perché sono versionati

Servono a vedere in una PR **cosa cambia visivamente**, non solo nel codice: un diff su un
PNG dice più di venti righe di CSS. Perché funzioni, gli screenshot devono essere
riproducibili, cioè due esecuzioni di fila devono produrre file identici. Lo script ottiene
questa proprietà così:

| Fonte di variabilità | Come è neutralizzata |
|---|---|
| Esercizi casuali | `Math.random` sostituito da un generatore deterministico |
| Progressione salvata | `localStorage` popolato con uno stato fisso (livello 1 completato, livello 2 a 11/25) |
| Lingua e tema | forzati (italiano; chiaro, più scuro sul dispositivo di riferimento) |
| Animazioni (pulse, bounce) | congelate via CSS, altrimenti si fotografa un fotogramma casuale |
| Icone caricate in modo asincrono | si attende che il numero di SVG sia stabile |
| Badge dei DevTools col tempo di caricamento | assente, perché si fotografa la build e non il dev server |

Se una rigenerazione produce un diff, quel diff è un cambiamento vero dell'interfaccia.

## A cosa è servita, in concreto

La prima versione della galleria ha fatto vedere subito due difetti che nessun test
intercettava: la card della home tagliata dalla barra di navigazione su iPhone SE, e
l'assenza di un pulsante per tornare alla home. Entrambi corretti, e la galleria
rigenerata li mostra risolti su tutte le risoluzioni.

## Cosa non è coperto

- **Orientamento orizzontale**: l'app dichiara `orientation: portrait` nel manifest PWA.
  Il layout in landscape è comunque stato corretto (vedi ROADMAP, difetti risolti).
- **Modali**: la modale di fine sessione e quella del Guardiano nuovo richiedono di giocare
  una partita intera, quindi non sono catturate.
- **Densità di pixel**: gli screenshot sono a 1x (punti CSS), per tenere leggero il
  repository. Servono a valutare il layout, non la resa dei font su schermo retina.
