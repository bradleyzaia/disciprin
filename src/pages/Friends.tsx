import { useState, useMemo } from "react"
import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import { MasterGrid, GridRow, GridCell } from "@/components/layout/grid"
import { Navbar } from "@/components/layout/Navbar"
import { Ticker } from "@/components/friends/Ticker"
import { HeroCounter } from "@/components/friends/HeroCounter"
import { FriendColumns } from "@/components/friends/FriendColumns"
import { LiveFeed } from "@/components/friends/LiveFeed"
import { FriendManageDrawer } from "@/components/friends/FriendManageDrawer"
import { FriendProfileModal } from "@/components/friends/FriendProfileModal"
import { type FriendData, type LiveUpdate } from "@/lib/mock-friends"
import { UserPlus, Users } from "lucide-react"
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

  const bottomStats = useMemo(() => {
    if (!hasFriends || !crewStats) return []
    return [
      { label: "Crew Avg", value: `${crewStats.crewAvg}%`, color: "green" as const },
      { label: "Top Streak", value: `${crewStats.topStreak}W`, color: "green" as const },
      { label: "Total Entries", value: String(crewStats.totalEntries) },
      { label: "Active", value: `${crewStats.activeCount}/${crewStats.totalCount}` },
    ]
  }, [crewStats, hasFriends])

  // Empty state
  if (!isLoading && !hasFriends) {
    return (
      <MasterGrid>
        <Navbar />
        <GridRow flex="pass">
          <GridCell className="flex-1 !p-0">
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center gap-6 bg-grayscale0">
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

      {/* Top ticker — friend completion marquee */}
      <GridRow flex="pass">
        <GridCell className="flex-1 !p-0 overflow-hidden">
          {isLoading ? (
            <div className="border-b border-dark-theme-border py-2.5 bg-grayscale0">
              <div className="flex items-center justify-center">
                <span className="text-[10px] tracking-[0.15em] text-grayscale50 animate-pulse">Loading crew…</span>
              </div>
            </div>
          ) : (
            <Ticker friends={friends} />
          )}
        </GridCell>
      </GridRow>

      {/* Hero counter */}
      <GridRow flex="pass">
        <GridCell className="flex-1 !p-0">
          <HeroCounter value={crewAvg} label="Crew Average" sublabel={weekLabel} />
        </GridCell>
      </GridRow>

      {/* Friends count + manage */}
      <GridRow flex="pass">
        <GridCell className="flex-1 !p-0">
          <div className="border-t border-dark-theme-border px-6 py-3 flex items-center justify-between">
            <span className="text-[9px] tracking-[0.3em] text-grayscale50 uppercase">
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

      {/* Live feed */}
      <GridRow flex="pass">
        <GridCell className="flex-1 !p-0 overflow-hidden">
          <LiveFeed updates={liveUpdates} />
        </GridCell>
      </GridRow>

      {/* Bottom ticker — stats marquee */}
      {bottomStats.length > 0 && (
        <GridRow flex="pass">
          <GridCell className="flex-1 !p-0 overflow-hidden">
            <Ticker friends={friends} stats={bottomStats} reverse />
          </GridCell>
        </GridRow>
      )}

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
