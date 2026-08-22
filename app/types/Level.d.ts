export type OperationType = '+' | '-' | '*' | '/'

export interface LevelConfig {
  /** Identificatore stabile, usato come chiave nella progressione salvata */
  id: string
  /** Mondo a cui il livello appartiene: il tipo di operazione */
  worldId: string
  /** Chiave i18n del nome del livello */
  nameKey: string
  operation: OperationType
  /** Estremo inferiore degli operandi */
  minNumber: number
  /** Estremo superiore del risultato: e' il risultato a non dover sforare, non gli operandi */
  maxNumber: number
  /** Stelline necessarie su questo livello per sbloccare il successivo */
  starsToUnlock: number
  /** Livello che deve essere completato prima di poter giocare questo; assente sul primo */
  unlockReq?: string
  /**
   * Operazioni fra cui pescare a ogni esercizio, per i livelli-sfida. Quando c'e', vince
   * su `operation`: e' cosi' che un livello misto alterna piu' operazioni senza che il
   * motore debba conoscere gli id dei Mondi.
   */
  mixedOperations?: OperationType[]
}

export interface WorldConfig {
  id: string
  /** Chiave i18n del nome del mondo */
  nameKey: string
  operation: OperationType
  /** Icona mdi mostrata nella mappa */
  icon: string
}
