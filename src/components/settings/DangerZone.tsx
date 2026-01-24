import { useMutation } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { GridRow, GridCell } from "@/components/layout/grid"

export function DangerZone() {
    const deleteAccount = useMutation(api.users.deleteAccount)

    const handleDeleteAccount = async () => {
        if (window.confirm("Are you sure? This will delete all your data permanently.")) {
            if (window.confirm("Really sure? This cannot be undone.")) {
                try {
                    await deleteAccount({})
                    window.location.href = "/"
                } catch (e) {
                    console.error(e)
                    alert("Failed to delete account")
                }
            }
        }
    }

    return (
        <GridRow className="border-b-0 flex-grow">
            <GridCell span={12} className="p-16 border-r-0">
                <h3 className="text-red-500 mb-6 uppercase text-lg">Danger Zone</h3>
                <p className="text-muted-foreground mb-12 max-w-xl text-xs uppercase">
                    Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <div>
                    <button
                        onClick={handleDeleteAccount}
                        className="border border-red-500 text-red-500 px-12 py-6 hover:bg-red-500 hover:text-white transition-colors uppercase text-sm rounded-none font-mono"
                    >
                        Delete Account
                    </button>
                </div>
            </GridCell>
        </GridRow>
    )
}
