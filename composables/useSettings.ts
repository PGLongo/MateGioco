import { ref, watch } from 'vue'

const STORAGE_KEY = 'mategioco-settings'

interface Settings {
  userName: string
}

const defaultSettings: Settings = {
  userName: 'Amico'
}

export const useSettings = () => {
  const settings = ref<Settings>({ ...defaultSettings })
  const isLoaded = ref(false)

  // Carica impostazioni da localStorage
  const loadSettings = () => {
    if (typeof window === 'undefined') return

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        settings.value = { ...defaultSettings, ...parsed }
      }
      isLoaded.value = true
    } catch (error) {
      console.error('Errore nel caricare le impostazioni:', error)
      isLoaded.value = true
    }
  }

  // Salva impostazioni in localStorage
  const saveSettings = () => {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings.value))
    } catch (error) {
      console.error('Errore nel salvare le impostazioni:', error)
    }
  }

  // Imposta nome utente
  const setUserName = (name: string) => {
    settings.value.userName = name.trim() || defaultSettings.userName
    saveSettings()
  }

  // Watch per auto-save
  watch(settings, saveSettings, { deep: true })

  // Carica all'inizializzazione
  if (typeof window !== 'undefined' && !isLoaded.value) {
    loadSettings()
  }

  return {
    settings,
    isLoaded,
    loadSettings,
    setUserName
  }
}
