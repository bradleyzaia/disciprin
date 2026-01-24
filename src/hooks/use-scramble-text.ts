import { useState, useEffect, useRef } from "react"

export function useScrambleText(text: string, duration: number = 0.2, symbols: string = "!@#$%^&*-+", delay: number = 0, trigger: any = null) {
    const [scrambled, setScrambled] = useState(text)
    const isFirstRender = useRef(true)

    useEffect(() => {
        if (!text) return

        let timeoutId: ReturnType<typeof setTimeout>
        let intervalId: ReturnType<typeof setInterval>

        const startAnimation = () => {
            const steps = Math.floor(duration * 60) // 60fps
            let currentStep = 0

            intervalId = setInterval(() => {
                currentStep++
                const progress = currentStep / steps

                if (progress >= 1) {
                    setScrambled(text)
                    clearInterval(intervalId)
                    return
                }

                const revealIndex = Math.floor(progress * text.length)

                const nextScrambled = text
                    .split("")
                    .map((char, index) => {
                        if (char === " ") return " "
                        if (index < revealIndex) {
                            return text[index]
                        }
                        return symbols[Math.floor(Math.random() * symbols.length)]
                    })
                    .join("")

                setScrambled(nextScrambled)
            }, 1000 / 60)
        }

        const actualDelay = isFirstRender.current ? delay : 0

        if (actualDelay > 0) {
            timeoutId = setTimeout(startAnimation, actualDelay)
        } else {
            startAnimation()
        }

        isFirstRender.current = false

        return () => {
            clearTimeout(timeoutId)
            clearInterval(intervalId)
        }
    }, [text, duration, symbols, delay, trigger])

    return scrambled
}


