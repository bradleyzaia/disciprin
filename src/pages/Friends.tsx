import { useState, useMemo } from "react"
import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import { MasterGrid, GridRow, GridCell } from "@/components/layout/grid"
import { Navbar } from "@/components/layout/Navbar"
import { HeroCounter } from "@/components/friends/HeroCounter"
import { FriendColumns } from "@/components/friends/FriendColumns"
import { LiveFeed } from "@/components/friends/LiveFeed"
import { FriendManageDrawer } from "@/components/friends/FriendManageDrawer"
import { FriendProfileModal } from "@/components/friends/FriendProfileModal"
import { type FriendData, type LiveUpdate } from "@/lib/mock-friends"
import { UserPlus, Users } from "lucide-react"
import { Quote } from "@/components/Quote"
import { Button } from "@/components/ui/Button"

export function Friends() {
  const [manageOpen, setManageOpen] = useState(false)
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null)

  // Real data queries
  const rawFriends = useQuery(api.friends.getFriends.default)
  const rawFeed = useQuery(api.friends.getFriendFeed.default)
  const crewStats = useQuery(api.friends.getCrewStats.default)

  const isLoading = rawFriends === undefined || rawFeed === undefined || crewStats === undefined
  const hasFriends = rawFriends && rawFriends.length > 0

  // Map real data to FriendData shape — no mock fallback
  const friends: FriendData[] = useMemo(() => {
    if (!hasFriends) return []
    return (rawFriends ?? []).map((f) => ({
      id: f!.clerkId,
      name: f!.name,
      handle: f!.handle,
      completionPct: f!.completionPct,
      streakWeeks: f!.streakWeeks,
      primaryHabit: f!.primaryHabit,
      weekDots: f!.weekDots as FriendData["weekDots"],
    }))
  }, [rawFriends, hasFriends])

  const liveUpdates: LiveUpdate[] = useMemo(() => {
    if (!hasFriends || !rawFeed || rawFeed.length === 0) return []
    return rawFeed.map((f) => ({
      id: f.id,
      name: f.name,
      action: f.action,
      highlight: f.highlight,
      highlightColor: f.highlightColor,
      timeAgo: f.timeAgo,
    }))
  }, [rawFeed, hasFriends])

  const crewAvg = useMemo(() => {
    if (!hasFriends || !crewStats) return 0
    return crewStats.crewAvg
  }, [crewStats, hasFriends])

  const today = new Date()
  const weekLabel = `Week of ${today.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`

  // Empty state
  if (!isLoading && !hasFriends) {
    return (
      <MasterGrid>
        <Navbar />
        <GridRow flex="pass">
          <GridCell className="flex-1 !p-0">
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center gap-6 bg-black/80">
              <div className="w-16 h-16 border border-grayscale25 flex items-center justify-center">
                <Users className="w-7 h-7 text-grayscale50" />
              </div>
              <div>
                <h2 className="text-sm font-semibold tracking-[0.15em] uppercase text-grayscale100 mb-2">
                  No friends yet
                </h2>
                <p className="text-[11px] text-grayscale50 leading-relaxed max-w-[280px]">
                  Add friends by their @handle to see their progress, streaks, and weekly stats right here.
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                icon={UserPlus}
                alwaysShowIcon
                onClick={() => setManageOpen(true)}
              >
                Add Friends
              </Button>
            </div>
          </GridCell>
        </GridRow>
        <FriendManageDrawer isOpen={manageOpen} onClose={() => setManageOpen(false)} />
      </MasterGrid>
    )
  }

  return (
    <MasterGrid>
      <Navbar />

      {/* Friend columns — today's tasks per friend */}
      <GridRow flex="pass">
        <GridCell className="flex-1 !p-0 overflow-hidden">
          <FriendColumns />
        </GridCell>
      </GridRow>

      {/* Crew Average + Live Feed + Manage — single row, three columns */}
      <GridRow flex="pass">
        <GridCell className="!p-0" style={{ width: '25%' }}>
          <HeroCounter value={crewAvg} label="Crew Average" sublabel={weekLabel} />
        </GridCell>
        <GridCell className="flex-1 !p-0 overflow-hidden" style={{ minHeight: '200px', maxHeight: '360px' }}>
          <LiveFeed updates={liveUpdates} />
        </GridCell>
        <GridCell className="!p-0 flex flex-col items-center justify-center bg-black/80" style={{ width: '15%' }}>
          <div className="flex flex-col items-center gap-3 p-4">
            <span className="text-[9px] tracking-[0.3em] text-grayscale50 uppercase font-mono">
              {friends.length} friend{friends.length !== 1 ? "s" : ""}
            </span>
            <Button
              size="sm"
              variant="outline"
              icon={Users}
              alwaysShowIcon
              onClick={() => setManageOpen(true)}
            >
              Manage
            </Button>
          </div>
        </GridCell>
      </GridRow>

      {/* Inspiration quote */}
      <GridRow>
        <GridCell span={12} className="p-0">
          <Quote />
        </GridCell>
      </GridRow>

      {/* Friend manage drawer */}
      <FriendManageDrawer isOpen={manageOpen} onClose={() => setManageOpen(false)} />

      {/* Friend profile modal */}
      {selectedFriendId && (
        <FriendProfileModal
          friendClerkId={selectedFriendId}
          onClose={() => setSelectedFriendId(null)}
        />
      )}
    </MasterGrid>
  )
}
