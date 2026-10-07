import { useState, useEffect } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { GridRow, GridCell } from "@/components/layout/grid"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Button } from "@/components/ui/Button"
import { ScrambleText } from "@/components/ui/scramble-text"
import { useToast } from "@/lib/toast-context"

export function UserProfileEditor() {
    const user = useQuery(api.users.getUser)
    const updateUser = useMutation(api.users.updateUser)
    const updateHandle = useMutation(api.users.updateHandle)
    const { showToast } = useToast()

    const [name, setName] = useState("")
    const [timezone, setTimezone] = useState("UTC")
    const [handle, setHandle] = useState("")
    const [handleError, setHandleError] = useState<string | null>(null)
    const [isDirty, setIsDirty] = useState(false)
    const [isHandleDirty, setIsHandleDirty] = useState(false)

    const handleAvailability = useQuery(
        api.users.checkHandleAvailability,
        isHandleDirty && handle.length >= 3 ? { handle } : "skip"
    )

    useEffect(() => {
        if (user) {
            setName(user.name || "")
            setTimezone(user.timezone || "UTC")
            setHandle(user.handle || "")
        }
    }, [user])

    useEffect(() => {
        if (!isHandleDirty) {
            setHandleError(null)
            return
        }
        const regex = /^[a-z0-9][a-z0-9_]{1,18}[a-z0-9]$/
        if (handle.length > 0 && handle.length < 3) {
            setHandleError("Minimum 3 characters")
        } else if (handle.length > 20) {
            setHandleError("Maximum 20 characters")
        } else if (handle.length >= 3 && !regex.test(handle)) {
            setHandleError("Lowercase letters, numbers, and underscores only")
        } else if (handleAvailability && !handleAvailability.available) {
            setHandleError(handleAvailability.reason)
        } else {
            setHandleError(null)
        }
    }, [handle, handleAvailability, isHandleDirty])

    const handleSaveProfile = async () => {
        try {
            await updateUser({ name, timezone })

            if (isHandleDirty && handle && !handleError) {
                await updateHandle({ handle })
            }

            setIsDirty(false)
            setIsHandleDirty(false)
            showToast("SUCCESS", "Profile updated")
        } catch (e: any) {
            console.error(e)
            showToast("ERROR", e.message || "Failed to update profile")
        }
    }

    const TIMEZONE_OPTIONS = [
        "UTC",
        "America/New_York",
        "America/Los_Angeles",
        "Europe/London",
        "Europe/Berlin",
        "Asia/Tokyo",
        "Australia/Sydney",
        Intl.DateTimeFormat().resolvedOptions().timeZone,
    ]
        .filter((v, i, a) => a.indexOf(v) === i)
        .sort()
        .map((tz) => ({ label: tz.toUpperCase(), value: tz }))


    if (!user) return null

    return (
        <>
            <GridRow>
                <GridCell span={6} className="p-16 backdrop-blur-none bg-black/80">
                    <h3 className="mb-12 text-primary text-lg uppercase"><ScrambleText text="Profile" /></h3>
                    <div className="mb-8">
                        <label className="block text-xs mb-2 text-dark-theme-text uppercase"><ScrambleText text="Name" /></label>
                        <Input
                            value={name}
                            onChange={(e) => { setName(e.target.value); setIsDirty(true) }}
                        />
                    </div>
                    <div className="mb-8">
                        <label className="block text-xs mb-2 text-dark-theme-text uppercase"><ScrambleText text="Handle" /></label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-theme-text/50 text-sm">@</span>
                            <Input
                                value={handle}
                                onChange={(e) => {
                                    const val = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "")
                                    setHandle(val)
                                    setIsDirty(true)
                                    setIsHandleDirty(true)
                                }}
                                className="pl-7"
                                placeholder="your_handle"
                                maxLength={20}
                            />
                        </div>
                        {handleError && (
                            <p className="text-red-500 text-[10px] mt-1 uppercase">{handleError}</p>
                        )}
                        {isHandleDirty && !handleError && handle.length >= 3 && handleAvailability?.available && (
                            <p className="text-green text-[10px] mt-1 uppercase">Handle available</p>
                        )}
                    </div>
                    <div className="mb-0">
                        <label className="block text-xs mb-2 text-dark-theme-text uppercase"><ScrambleText text="Email Address" /></label>
                        <Input
                            value={user.email}
                            disabled
                            className="opacity-50 cursor-not-allowed"
                        />
                    </div>
                </GridCell>
                <GridCell span={6} className="p-16 border-r-0 backdrop-blur-none bg-black/80">
                    <h3 className="mb-12 text-primary text-lg uppercase"><ScrambleText text="Preferences" /></h3>
                    <div className="mb-8">
                        <label className="block text-xs mb-2 text-dark-theme-text uppercase"><ScrambleText text="Timezone" /></label>
                        <Select
                            value={timezone}
                            onChange={(val) => { setTimezone(val); setIsDirty(true) }}
                            options={TIMEZONE_OPTIONS}
                        />
                    </div>
                </GridCell>
            </GridRow>

            {isDirty && (
                <GridRow>
                    <GridCell span={12} className="p-0 border-r-0">
                        <Button
                            onClick={handleSaveProfile}
                            disabled={!!handleError}
                            className="w-full h-16 rounded-none text-lg hover:bg-white hover:text-black transition-colors uppercase border-none"
                        >
                            Save Changes
                        </Button>
                    </GridCell>
                </GridRow>
            )}
        </>
    )
}
