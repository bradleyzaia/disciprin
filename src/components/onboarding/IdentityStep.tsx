import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { CameraAsciiFeed } from "@/components/camera-ascii-feed"

interface IdentityStepProps {
    name: string
    onChange: (name: string) => void
}

export const IdentityStep = ({ name, onChange }: IdentityStepProps) => {
    return (
        <>
            <div className="absolute inset-0 z-0 bg-white" />
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none mix-blend-multiply invert">
                <CameraAsciiFeed className="w-full h-full" />
            </div>

            <div className="max-w-5xl w-full mx-auto space-y-12 relative z-10">
                <div className="space-y-8">
                    <div className="space-y-4">
                        <Label htmlFor="name">patient name</Label>
                        <Input
                            id="name"
                            placeholder="your name"
                            value={name}
                            onChange={(e) => onChange(e.target.value.toUpperCase())}
                            autoFocus
                            className="h-16 text-lg border-black/50 focus-visible:ring-black bg-background/50 backdrop-blur-sm"
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
