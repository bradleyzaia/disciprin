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

                <p className="text-red mb-4 max-w-xl text-xs uppercase">
                    i want to return to mediocrity. For now.
                </p>
                <div>
                    <button
                        onClick={handleDeleteAccount}
                        className="border border-red text-red px-12 py-6 hover:bg-red hover:text-dark-theme-text transition-colors uppercase text-sm rounded-none font-mono"
                    >
                        Delete Account
                    </button>
                </div>
            </GridCell>
        </GridRow>
    )
}
