import confetti from 'canvas-confetti'

export const useConfetti = () => {
  // Celebrazione per completamento sessione - esplosione di coriandoli!
  const celebrate = () => {
    const duration = 3000 // 3 secondi
    const animationEnd = Date.now() + duration
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 9999,
      colors: ['#5DADE2', '#FAD7A0', '#A9DFBF', '#F8C471', '#BB8FCE'] // Colori app
    }

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min
    }

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      // Esplosioni da sinistra e destra
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      })
    }, 250)
  }

  // Mini celebrazione per risposta corretta
  const miniCelebration = () => {
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#A9DFBF', '#7DCEA0', '#1E8449'], // Verde
      zIndex: 9999
    })
  }

  // Effetto stelline che cadono
  const starfall = () => {
    const defaults = {
      spread: 360,
      ticks: 100,
      gravity: 0.5,
      decay: 0.94,
      startVelocity: 30,
      colors: ['#FFD700', '#FFA500', '#FFE135'], // Oro/arancione per stelle
      zIndex: 9999
    }

    const shoot = () => {
      confetti({
        ...defaults,
        particleCount: 20,
        scalar: 1.2,
        shapes: ['star']
      })

      confetti({
        ...defaults,
        particleCount: 10,
        scalar: 0.75,
        shapes: ['circle']
      })
    }

    setTimeout(shoot, 0)
    setTimeout(shoot, 100)
    setTimeout(shoot, 200)
  }

  return {
    celebrate,
    miniCelebration,
    starfall
  }
}
