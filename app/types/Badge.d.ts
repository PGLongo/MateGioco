export interface Badge {
  /** Identificatore stabile, salvato nella progressione */
  id: string
  /** Livello che sbloccando si conquista il badge */
  levelId: string
  /** L'arte del badge: un'emoji, ingrandita dai componenti */
  emoji: string
  /** Chiave i18n del nome ("Il Granchio Conta-Dita") */
  nameKey: string
  /** Chiave i18n della descrizione mostrata nella bacheca */
  descKey: string
}
