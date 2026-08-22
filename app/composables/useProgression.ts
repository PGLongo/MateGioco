import { ref, computed, watch } from 'vue'
import type { LevelConfig } from '~/types/Level'
import type { Badge } from '~/types/Badge'
import { LEVELS, FIRST_LEVEL_ID, getLevel } from '~/config/levels.config'
import { BADGES, getBadgeForLevel } from '~/config/badges.config'

const STORAGE_KEY = 'mategioco-progression'

interface ProgressionState {
  /** Stelline accumulate per livello: { 'sum-1': 12, 'sub-1': 5 } */
  levelStars: Record<string, number>
  /** Badge conquistati, con la data di sblocco: { 'badge-crab': '2026-08-22T...' } */
  badges: Record<string, string>
}

const defaultState = (): ProgressionState => ({ levelStars: {}, badges: {} })

// Stato globale condiviso (singleton), come useStars e useSettings: mappa dei livelli,
// header e pagina di gioco devono vedere la stessa progressione senza ricaricare
const state = ref<ProgressionState>(defaultState())
const isLoaded = ref(false)

const loadProgression = () => {
  if (typeof window === 'undefined') return

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      state.value = { ...defaultState(), ...parsed }
    }
    isLoaded.value = true
  } catch (error) {
    console.error('Errore nel caricare la progressione:', error)
    state.value = defaultState()
    isLoaded.value = true
  }
}

const saveProgression = () => {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.value))
  } catch (error) {
    console.error('Errore nel salvare la progressione:', error)
  }
}

// Watch per auto-save, registrato una sola volta
if (typeof window !== 'undefined') {
  watch(state, saveProgression, { deep: true })
}

export const useProgression = () => {

  /** Stelline guadagnate su un livello */
  const starsOn = (levelId: string): number => state.value.levelStars[levelId] ?? 0

  /**
   * Un livello e' completato quando ha raggiunto la sua soglia di stelline **e** era
   * davvero giocabile: senza il secondo vincolo, stelline salvate su un livello mai
   * sbloccato (dati manomessi, configurazione cambiata) aprirebbero la catena a valle.
   */
  const isCompleted = (levelId: string): boolean => {
    const level = getLevel(levelId)
    if (!level) return false
    if (starsOn(levelId) < level.starsToUnlock) return false

    return !level.unlockReq || isCompleted(level.unlockReq)
  }

  /**
   * Un livello e' giocabile se non ha requisiti (il primo del percorso) oppure se il
   * livello richiesto e' stato completato.
   */
  const isUnlocked = (levelId: string): boolean => {
    const level = getLevel(levelId)
    if (!level) return false
    if (!level.unlockReq) return true

    return isCompleted(level.unlockReq)
  }

  /** Accredita stelline sul livello giocato */
  const addStarsTo = (levelId: string, amount: number = 1) => {
    if (amount <= 0) return

    state.value.levelStars = {
      ...state.value.levelStars,
      [levelId]: starsOn(levelId) + amount
    }
  }

  /** Quante stelline mancano per sbloccare il livello successivo */
  const starsToNextLevel = (levelId: string): number => {
    const level = getLevel(levelId)
    if (!level) return 0

    return Math.max(0, level.starsToUnlock - starsOn(levelId))
  }

  /**
   * Il livello su cui il bambino sta lavorando: il primo sbloccato e non ancora
   * completato, seguendo l'ordine del percorso. Se ha completato tutto, resta sull'ultimo
   * livello sbloccato, cosi' puo' continuare a giocarlo.
   */
  const currentLevel = computed<LevelConfig>(() => {
    const inProgress = LEVELS.find(level => isUnlocked(level.id) && !isCompleted(level.id))
    if (inProgress) return inProgress

    const unlocked = LEVELS.filter(level => isUnlocked(level.id))
    return unlocked[unlocked.length - 1] ?? getLevel(FIRST_LEVEL_ID)!
  })

  /** Livelli giocabili adesso */
  const unlockedLevels = computed<LevelConfig[]>(() =>
    LEVELS.filter(level => isUnlocked(level.id))
  )

  /** Livelli portati a termine */
  const completedLevels = computed<LevelConfig[]>(() =>
    LEVELS.filter(level => isCompleted(level.id))
  )

  /** Badge conquistato? */
  const isBadgeUnlocked = (badgeId: string): boolean => badgeId in state.value.badges

  /** Data di sblocco di un badge, se conquistato */
  const badgeUnlockedAt = (badgeId: string): string | undefined => state.value.badges[badgeId]

  /**
   * Registra i badge dei livelli completati che non sono ancora stati conquistati e
   * restituisce **solo quelli nuovi**, cosi' che chi chiama possa festeggiarli una volta
   * sola. Chiamata a fine sessione: chiamarla due volte di seguito non produce doppioni.
   */
  const checkForNewBadges = (): Badge[] => {
    const earned = BADGES.filter(badge => isCompleted(badge.levelId) && !isBadgeUnlocked(badge.id))
    if (earned.length === 0) return []

    const now = new Date().toISOString()
    state.value.badges = {
      ...state.value.badges,
      ...Object.fromEntries(earned.map(badge => [badge.id, now]))
    }

    return earned
  }

  /** Badge conquistati, nell'ordine del percorso */
  const unlockedBadges = computed<Badge[]>(() =>
    BADGES.filter(badge => isBadgeUnlocked(badge.id))
  )

  /** Il badge in gioco sul livello corrente, se esiste */
  const badgeForLevel = (levelId: string): Badge | undefined => getBadgeForLevel(levelId)

  const resetProgression = () => {
    state.value = defaultState()
  }

  // Carica all'inizializzazione
  if (typeof window !== 'undefined' && !isLoaded.value) {
    loadProgression()
  }

  return {
    // State
    isLoaded,
    currentLevel,
    unlockedLevels,
    completedLevels,

    unlockedBadges,

    // Query
    starsOn,
    isCompleted,
    isUnlocked,
    starsToNextLevel,
    isBadgeUnlocked,
    badgeUnlockedAt,
    badgeForLevel,

    // Mutations
    addStarsTo,
    checkForNewBadges,
    loadProgression,
    resetProgression
  }
}
