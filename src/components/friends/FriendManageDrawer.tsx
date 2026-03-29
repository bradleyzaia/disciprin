import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { Drawer } from "@/components/ui/Drawer"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { motion, AnimatePresence } from "framer-motion"
import { Search, UserPlus, UserMinus, Check, X } from "lucide-react"

interface FriendManageDrawerProps {
  isOpen: boolean
  onClose: () => void
}

type Tab = "search" | "requests" | "friends"

export function FriendManageDrawer({ isOpen, onClose }: FriendManageDrawerProps) {
  const [tab, setTab] = useState<Tab>("search")
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <Drawer isOpen={isOpen} onClose={onClose} side="right">
      <div className="flex flex-col h-full max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-dark-theme-border shrink-0">
          <span className="text-[9px] tracking-[0.3em] text-grayscale50 uppercase">Manage Friends</span>
          <button onClick={onClose} className="text-grayscale50 hover:text-dark-theme-text transition-colors">
            <X className="size-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-dark-theme-border shrink-0">
          {(["search", "requests", "friends"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-3 text-[10px] tracking-[0.2em] uppercase transition-colors ${
                tab === t ? "text-green border-b border-green -mb-px" : "text-grayscale50 hover:text-dark-theme-text"
              }`}
            >
              {t === "search" ? "Find" : t === "requests" ? "Requests" : "Friends"}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {tab === "search" && (
              <SearchTab key="search" searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            )}
            {tab === "requests" && <RequestsTab key="requests" />}
            {tab === "friends" && <FriendsListTab key="friends" />}
          </AnimatePresence>
        </div>
      </div>
    </Drawer>
  )
}

/* ─── Search Tab ──────────────────────────────────────────────── */

function SearchTab({ searchQuery, setSearchQuery }: { searchQuery: string; setSearchQuery: (q: string) => void }) {
  const results = useQuery(
    api.friends.searchUsers.default,
    searchQuery.length >= 2 ? { query: searchQuery } : "skip"
  )
  const sendRequest = useMutation(api.friends.mutations.sendFriendRequest)
  const [sending, setSending] = useState<string | null>(null)

  const handleSend = async (clerkId: string) => {
    setSending(clerkId)
    try {
      await sendRequest({ friendClerkId: clerkId })
    } catch {
      // handled silently
    }
    setSending(null)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-6"
    >
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-grayscale50" />
        <Input
          placeholder="Search by name or @handle"
          value={searchQuery}
          onChange={(e) => setSearchQuery((e.target as HTMLInputElement).value)}
          className="pl-10"
        />
      </div>

      {searchQuery.length < 2 && (
        <p className="text-[11px] text-grayscale50 text-center py-8">
          Type at least 2 characters to search
        </p>
      )}

      {results && results.length === 0 && searchQuery.length >= 2 && (
        <p className="text-[11px] text-grayscale50 text-center py-8">
          No users found for "@{searchQuery}"
        </p>
      )}

      {results &&
        results.map((user) => (
          <div
            key={user.clerkId}
            className="flex items-center justify-between py-3 border-b border-dark-theme-border last:border-0"
          >
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.15em]">{user.name}</div>
              <div className="text-[9px] text-grayscale50">@{user.handle}</div>
            </div>
            {user.friendStatus === "accepted" ? (
              <span className="text-[9px] text-green tracking-[0.2em] uppercase">Friends</span>
            ) : user.friendStatus === "pending" ? (
              <span className="text-[9px] text-yellow tracking-[0.2em] uppercase">Pending</span>
            ) : (
              <Button
                size="sm"
                variant="outline"
                icon={UserPlus}
                alwaysShowIcon
                onClick={() => handleSend(user.clerkId)}
                disabled={sending === user.clerkId}
              >
                Add
              </Button>
            )}
          </div>
        ))}
    </motion.div>
  )
}

/* ─── Requests Tab ────────────────────────────────────────────── */

function RequestsTab() {
  const pending = useQuery(api.friends.getPendingRequests.default)
  const accept = useMutation(api.friends.mutations.acceptFriendRequest)
  const reject = useMutation(api.friends.mutations.rejectFriendRequest)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-6"
    >
      {pending === undefined && (
        <p className="text-[11px] text-grayscale50 text-center py-8 animate-pulse">Loading…</p>
      )}

      {pending && pending.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[11px] text-grayscale50 mb-1">No pending requests</p>
          <p className="text-[9px] text-grayscale25">When someone adds you, they'll appear here</p>
        </div>
      )}

      {pending &&
        pending.map((req) => (
          <div
            key={req.clerkId}
            className="flex items-center justify-between py-3 border-b border-dark-theme-border last:border-0"
          >
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.15em]">{req.name}</div>
              <div className="text-[9px] text-grayscale50">{req.handle}</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => accept({ friendClerkId: req.clerkId })}
                className="p-2 border border-dark-theme-border text-green hover:bg-white/5 transition-colors"
              >
                <Check className="size-3.5" />
              </button>
              <button
                onClick={() => reject({ friendClerkId: req.clerkId })}
                className="p-2 border border-dark-theme-border text-red hover:bg-white/5 transition-colors"
              >
                <X className="size-3.5" />
              </button>
            </div>
          </div>
        ))}
    </motion.div>
  )
}

/* ─── Friends List Tab ────────────────────────────────────────── */

function FriendsListTab() {
  const friends = useQuery(api.friends.getFriends.default)
  const removeFriend = useMutation(api.friends.mutations.removeFriend)
  const [confirming, setConfirming] = useState<string | null>(null)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-6"
    >
      {friends === undefined && (
        <p className="text-[11px] text-grayscale50 text-center py-8 animate-pulse">Loading…</p>
      )}

      {friends && friends.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[11px] text-grayscale50 mb-1">No friends yet</p>
          <p className="text-[9px] text-grayscale25">Search for people by their @handle to add them</p>
        </div>
      )}

      {friends &&
        friends.map((f) =>
          f ? (
            <div
              key={f.clerkId}
              className="flex items-center justify-between py-3 border-b border-dark-theme-border last:border-0"
            >
              <div>
                <div className="font-mono text-xs uppercase tracking-[0.15em]">{f.name}</div>
                <div className="text-[9px] text-grayscale50">{f.handle}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-green font-bold">{f.completionPct}%</span>
                {confirming === f.clerkId ? (
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        removeFriend({ friendClerkId: f.clerkId })
                        setConfirming(null)
                      }}
                      className="text-[9px] text-red border border-dark-theme-border px-2 py-1 hover:bg-white/5 transition-colors"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setConfirming(null)}
                      className="text-[9px] text-grayscale50 border border-dark-theme-border px-2 py-1 hover:bg-white/5 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirming(f.clerkId)}
                    className="p-2 text-grayscale50 hover:text-red transition-colors"
                  >
                    <UserMinus className="size-3.5" />
                  </button>
                )}
              </div>
            </div>
          ) : null
        )}
    </motion.div>
  )
}
