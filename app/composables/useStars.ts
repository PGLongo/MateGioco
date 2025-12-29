import { ref, watch } from 'vue'

const STORAGE_KEY = 'mategioco-stars'

export const useStars = () => {
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

  // Aggiungi stelline
  const addStars = (amount: number = 1) => {
    totalStars.value += amount
    saveStars()
  }

  // Reset stelline (per testing)
  const resetStars = () => {
    totalStars.value = 0
    saveStars()
  }

  // Watch per auto-save
  watch(totalStars, saveStars)

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
