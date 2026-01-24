import React, { createContext, useContext, useRef } from "react"

interface StaggerContextType {
    register: () => number
}

const StaggerContext = createContext<StaggerContextType | undefined>(undefined)

export function StaggerProvider({ children }: { children: React.ReactNode }) {
    const countRef = useRef(0)
    // We intentionally don't force re-renders when count changes, just providing IDs
    // But we want to reset on navigation.

    // Note: react-router-dom might not be available at main.tsx level if Provider is outside Router.
    // However, usually Router is inside App. 
    // To be safe, we'll try to use a simple mechanism: 
    // If we are inside a router, useLocation will work. If not, it might throw or return undefined.
    // Let's assume StaggerProvider is used inside App's layout or we make it robust.

    // Simple version: Reset count on every render? No, that breaks strict mode or re-renders.
    // Reset on mount? Yes.

    const register = () => {
        const id = countRef.current
        countRef.current += 1
        return id
    }

    return (
        <StaggerContext.Provider value={{ register }}>
            {children}
        </StaggerContext.Provider>
    )
}

// Separate component to handle route changes if needed, but for now simple increment is safer.
// If we want meaningful reset on route change, we need to be inside the Router.

export function useStagger() {
    const context = useContext(StaggerContext)
    if (!context) {
        // Fallback if no provider (e.g. tests), return constant 0
        return { delay: 0 }
    }

    // We get a stable unique ID for this component instance
    const idRef = useRef<number | null>(null)
    if (idRef.current === null) {
        idRef.current = context.register()
    }

    return { delay: idRef.current * 200 } // 200ms per index
}
