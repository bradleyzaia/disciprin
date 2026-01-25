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
    const { showToast } = useToast()

    const [name, setName] = useState("")
    const [timezone, setTimezone] = useState("UTC")
    const [isDirty, setIsDirty] = useState(false)

    useEffect(() => {
        if (user) {
            setName(user.name || "")
            setTimezone(user.timezone || "UTC")
        }
    }, [user])

    const handleSaveProfile = async () => {
        try {
            await updateUser({
                name,
                timezone,
            })
            setIsDirty(false)
            showToast("SUCCESS", "Profile updated")
        } catch (e) {
            console.error(e)
            showToast("ERROR", "Failed to update profile")
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


    if (!user) return null // Or skeleton

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
