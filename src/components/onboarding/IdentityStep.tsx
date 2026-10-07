import { useEffect, useState } from "react"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"

interface IdentityStepProps {
    name: string
    handle: string
    onChange: (name: string) => void
    onHandleChange: (handle: string) => void
    handleAvailability?: { available: boolean; reason: string | null }
}

const HANDLE_REGEX = /^[a-z0-9][a-z0-9_]{1,18}[a-z0-9]$/

function suggestHandle(name: string): string {
    return name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9_]/g, "")
        .replace(/^_+|_+$/g, "")
        .slice(0, 20)
}

export const IdentityStep = ({ name, handle, onChange, onHandleChange, handleAvailability }: IdentityStepProps) => {
    const [handleTouched, setHandleTouched] = useState(Boolean(handle))

    // Auto-suggest handle from name when user hasn't manually edited
    useEffect(() => {
        if (!handleTouched && name) {
            const suggestedHandle = suggestHandle(name)
            if (handle !== suggestedHandle) {
                onHandleChange(suggestedHandle)
            }
        }
    }, [name, handle, handleTouched, onHandleChange])

    const handleError = handle.length === 0
        ? null
        : handle.length < 3
            ? "Minimum 3 characters"
            : !HANDLE_REGEX.test(handle)
                ? "Lowercase letters, numbers, and underscores only"
                : handleAvailability && !handleAvailability.available
                    ? handleAvailability.reason
                    : null

    const isValid = handle.length >= 3 && HANDLE_REGEX.test(handle) && handleAvailability?.available

    return (
        <div className="max-w-5xl w-full mx-auto space-y-12 relative z-10 px-4 md:px-0">
            <div className="space-y-8">
                <div className="space-y-4">
                    <Label htmlFor="name">patient name</Label>
                    <Input
                        id="name"
                        placeholder="your name"
                        value={name}
                        onChange={(e) => onChange(e.target.value.toUpperCase())}
                        autoFocus
                        className="h-16 text-lg border-dark-theme-border focus-visible:ring-black bg-background/50 backdrop-blur-sm"
                    />
                </div>
                <div className="space-y-4">
                    <Label htmlFor="handle">handle</Label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-theme-text/50 text-lg">@</span>
                        <Input
                            id="handle"
                            placeholder="your_handle"
                            value={handle}
                            onChange={(e) => {
                                const val = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "")
                                onHandleChange(val)
                                setHandleTouched(true)
                            }}
                            maxLength={20}
                            className="h-16 text-lg border-dark-theme-border focus-visible:ring-black bg-background/50 backdrop-blur-sm pl-9"
                        />
                    </div>
                    {handleError && (
                        <p className="text-red-500 text-xs uppercase">{handleError}</p>
                    )}
                    {!handleError && isValid && (
                        <p className="text-green text-xs uppercase">Handle available</p>
                    )}
                    <p className="text-dark-theme-text/40 text-[10px] uppercase">
                        3-20 characters · letters, numbers, underscores
                    </p>
                </div>
            </div>
        </div>
    )
}
