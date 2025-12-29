export const useSound = () => {
  // Audio context per generare suoni sintetici
  let audioContext: AudioContext | null = null

  const initAudioContext = () => {
    if (!audioContext && typeof window !== 'undefined') {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return audioContext
  }

  // Suono di successo (arpeggio ascendente felice)
  const playSuccess = () => {
    const ctx = initAudioContext()
    if (!ctx) return

    const now = ctx.currentTime
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    // Arpeggio felice: C5 -> E5 -> G5
    oscillator.frequency.setValueAtTime(523.25, now) // C5
    oscillator.frequency.setValueAtTime(659.25, now + 0.1) // E5
    oscillator.frequency.setValueAtTime(783.99, now + 0.2) // G5

    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(0.3, now)
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4)

    oscillator.start(now)
    oscillator.stop(now + 0.4)
  }

  // Suono di errore (nota discendente)
  const playError = () => {
    const ctx = initAudioContext()
    if (!ctx) return

    const now = ctx.currentTime
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    // Nota discendente triste
    oscillator.frequency.setValueAtTime(400, now) // G4
    oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.3) // Scende

    oscillator.type = 'triangle'

    gainNode.gain.setValueAtTime(0.2, now)
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3)

    oscillator.start(now)
    oscillator.stop(now + 0.3)
  }

  // Suono per click/tap (opzionale)
  const playClick = () => {
    const ctx = initAudioContext()
    if (!ctx) return

    const now = ctx.currentTime
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.frequency.setValueAtTime(800, now)
    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(0.1, now)
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05)

    oscillator.start(now)
    oscillator.stop(now + 0.05)
  }

  // Suono di celebrazione per completamento sessione (fanfara!)
  const playCelebration = () => {
    const ctx = initAudioContext()
    if (!ctx) return

    const now = ctx.currentTime

    // Prima nota - C5
    playNote(ctx, 523.25, now, 0.15, 0.3)
    // Seconda nota - E5
    playNote(ctx, 659.25, now + 0.15, 0.15, 0.3)
    // Terza nota - G5
    playNote(ctx, 783.99, now + 0.3, 0.15, 0.3)
    // Quarta nota - C6 (ottava superiore - climax!)
    playNote(ctx, 1046.50, now + 0.45, 0.3, 0.4)

    // Accordo finale trionfale
    playNote(ctx, 523.25, now + 0.8, 0.5, 0.2) // C5
    playNote(ctx, 659.25, now + 0.8, 0.5, 0.2) // E5
    playNote(ctx, 783.99, now + 0.8, 0.5, 0.2) // G5
  }

  // Helper per suonare una nota
  const playNote = (ctx: AudioContext, frequency: number, startTime: number, duration: number, volume: number) => {
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.frequency.setValueAtTime(frequency, startTime)
    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(volume, startTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration)

    oscillator.start(startTime)
    oscillator.stop(startTime + duration)
  }

  return {
    playSuccess,
    playError,
    playClick,
    playCelebration
  }
}
