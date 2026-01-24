import { useState, useEffect } from "react"

export function useScrambleText(text: string, duration: number = 0.2, symbols: string = "!@#$%^&*-+", delay: number = 0) {
    const [scrambled, setScrambled] = useState(text)

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

        if (delay > 0) {
            // Initial state should be fully scrambled or empty? 
            // Usually valid scramble starts immediately or waits.
            // If we wait, maybe we should show nothing or full scramble?
            // Existing logic started immediately.
            // If delay is passed, we probably want to wait before starting the transition from scrambled to clear?
            // Or maybe it is intro animation?
            // Let's assume it waits to start the 'unscramble' process (if that's what it does).
            // Actually the current logic *reveals* the text. `revealIndex` goes from 0 to length.
            // So initially it should be fully scrambled? 
            // But `useState(text)` sets it to `text` initially.
            // Wait, existing code `const [scrambled, setScrambled] = useState(text)`?
            // If it starts with `text`, then it is already revealed?
            // The effect runs and sets it to scrambled then reveals it?

            // Let's look at the loop:
            // `currentStep` starts at 0. `progress` starts near 0.
            // `revealIndex` starts near 0.
            // `nextScrambled` will be mostly symbols.
            // So yes, it scrambles immediately upon effect.

            // So `delay` should probably delay the *start* of the effect?
            // If I delay, it will stay as `text` (clean) for `delay` ms, then sudden scramble and reveal?
            // OR should it start scrambled and wait to reveal?

            // "Input Intro Animation" / "Staggered Animations".
            // Likely we want it to be invisible or scrambled, then reveal.

            // If I initialize `useState(text)`, it renders text.
            // Then effect runs. 
            // If I delay, it stays text.

            // If I want it to *appear* later, maybe the parent handles opacity.
            // But if `ScrambleText` is used for "intro", maybe it should start scrambled?

            // Let's stick to simple delay of the animation start.

            timeoutId = setTimeout(startAnimation, delay)
        } else {
            startAnimation()
        }

        return () => {
            clearTimeout(timeoutId)
            clearInterval(intervalId)
        }
    }, [text, duration, symbols, delay])

    return scrambled
}

