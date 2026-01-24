import { Select } from "@/components/ui/Select"
import { Label } from "@/components/ui/Label"
import { ScrambleText } from "@/components/ui/ScrambleText"
import { AsciiEarthMap } from "@/components/ascii-earth-map"

interface SynchronizationStepProps {
    timezone: string
    onChange: (timezone: string) => void
}

export const SynchronizationStep = ({ timezone, onChange }: SynchronizationStepProps) => {
    const timezones = [
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

    return (
        <>
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <AsciiEarthMap timezone={timezone} className="w-full h-full" />
            </div>

            <div className="max-w-5xl w-full mx-auto space-y-12 relative z-10">
                <div className="space-y-8">
                    <div>
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select
                            id="timezone"
                            value={timezone}
                            onChange={onChange}
                            className="h-16 text-lg border-black/50 focus-visible:ring-black"
                            options={timezones}
                        />
                        <div className="p-4 border border-black/10 bg-black/5 text-xs text-muted-foreground">
                            <ScrambleText text="AUTOMATICALLY DETECTED FROM BROWSER ENVIRONMENT" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
