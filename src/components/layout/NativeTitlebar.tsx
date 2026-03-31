import { useEffect, useState } from "react"

export function NativeTitlebar() {
    const [isTauri, setIsTauri] = useState(false)

    useEffect(() => {
        setIsTauri(typeof window !== "undefined" && "__TAURI__" in window)
    }, [])

    if (!isTauri) return null

    return (
        <div
            data-tauri-drag-region
            className="fixed top-0 left-0 right-0 z-[9999] h-11 flex items-center select-none bg-black/80 backdrop-blur-md border-b border-white/5"
        >
            <span
                data-tauri-drag-region
                className="font-mono text-[11px] uppercase tracking-widest text-zinc-400 pl-[78px] pt-px"
            >
                disciprin
            </span>
        </div>
    )
}

/** Hook to check if running in Tauri */
export function useIsTauri() {
    const [isTauri, setIsTauri] = useState(false)
    useEffect(() => {
        setIsTauri(typeof window !== "undefined" && "__TAURI__" in window)
    }, [])
    return isTauri
}
