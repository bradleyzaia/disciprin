import { useEffect, useRef, useState } from "react"

interface UseFitTextOptions {
    maxFontSize?: number // in px
    minFontSize?: number // in px
    resolution?: number // step size for adjustment
}

export function useFitText({
    maxFontSize = 100,
    minFontSize = 12,
}: UseFitTextOptions = {}) {
    const containerRef = useRef<HTMLDivElement>(null)
    const textRef = useRef<HTMLSpanElement>(null)
    const [fontSize, setFontSize] = useState(maxFontSize)

    useEffect(() => {
        const container = containerRef.current
        const text = textRef.current

        if (!container || !text) return

        const resizeObserver = new ResizeObserver(() => {
            adjustFontSize()
        })

        resizeObserver.observe(container)
        adjustFontSize()

        return () => resizeObserver.disconnect()

        function adjustFontSize() {
            if (!container || !text) return

            const availableWidth = container.clientWidth
            // Start bit larger to avoid edge cases
            let low = minFontSize
            let high = maxFontSize
            let best = minFontSize

            // Binary search for the best fit
            while (low <= high) {
                const mid = Math.floor((low + high) / 2)
                text.style.fontSize = `${mid}px`

                // Check if text fits
                // We use scrollWidth vs clientWidth. 
                // Important: text element should be inline-block or fit-content to measure its natural width at that font size
                if (text.scrollWidth <= availableWidth) {
                    best = mid
                    low = mid + 1
                } else {
                    high = mid - 1
                }
            }

            setFontSize(best)
            // Apply final style to ensure rendering matches
            text.style.fontSize = `${best}px`
        }
    }, [maxFontSize, minFontSize])

    return { fontSize, textRef, containerRef }
}
