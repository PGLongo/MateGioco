export const useVibration = () => {
    /**
     * Esegue una vibrazione se il dispositivo lo supporta
     * @param pattern Pattern di vibrazione in ms (singolo numero o array)
     */
    const vibrate = (pattern: number | number[]) => {
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
            navigator.vibrate(pattern)
        }
    }

    return {
        vibrate
    }
}
