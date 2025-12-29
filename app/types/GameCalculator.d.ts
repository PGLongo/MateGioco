export interface GameCalculatorProps {
    disabled?: boolean
    userAnswer?: string
    feedbackState?: 'success' | 'error' | 'info' | null
    feedbackMessage?: string
}
