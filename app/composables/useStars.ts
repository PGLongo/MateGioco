import { ref, watch } from 'vue'

const STORAGE_KEY = 'mategioco-stars'

// Stato globale condiviso (singleton), come in useSettings: header e pagina di gioco
// devono leggere lo stesso contatore. Con il ref creato dentro il composable ogni
// chiamante otteneva la propria copia, e la stellina guadagnata non compariva
// nell'header fino al ricaricamento della pagina.
const totalStars = ref(0)
const isLoaded = ref(false)

// Carica stelline da localStorage
const loadStars = () => {
  if (typeof window === 'undefined') return

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      totalStars.value = parseInt(stored, 10) || 0
    }
    isLoaded.value = true
  } catch (error) {
    console.error('Errore nel caricare le stelline:', error)
    isLoaded.value = true
  }
}

// Salva stelline in localStorage
const saveStars = () => {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEY, totalStars.value.toString())
  } catch (error) {
    console.error('Errore nel salvare le stelline:', error)
  }
}

// Watch per auto-save (registrato una sola volta, non a ogni chiamata del composable)
if (typeof window !== 'undefined') {
  watch(totalStars, saveStars)
}

export const useStars = () => {

  // Aggiungi stelline
  const addStars = (amount: number = 1) => {
    totalStars.value += amount
  }

  // Reset stelline (per testing)
  const resetStars = () => {
    totalStars.value = 0
  }

  // Carica all'inizializzazione
  if (typeof window !== 'undefined' && !isLoaded.value) {
    loadStars()
  }

  return {
    totalStars,
    isLoaded,
    loadStars,
    addStars,
    resetStars
  }
}
