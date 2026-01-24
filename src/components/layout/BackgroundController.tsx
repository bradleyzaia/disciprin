import { useLocation } from "react-router-dom"
import { EffectScene } from "@/components/effect-scene"

export function BackgroundController() {
    const location = useLocation()
    const path = location.pathname

    // Define paths where the ASCII background should be hidden
    const shouldHideBackground =

        path.startsWith("/dashboard")

    if (shouldHideBackground) {
        return null
    }

    return (
        <div className="fixed inset-0 -z-10 pointer-events-none">
            <EffectScene />
        </div>
    )
}
