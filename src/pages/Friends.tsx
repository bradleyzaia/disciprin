import { useState, useMemo } from "react"
import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import { MasterGrid, GridRow, GridCell } from "@/components/layout/grid"
import { Navbar } from "@/components/layout/Navbar"
import { Ticker } from "@/components/friends/Ticker"
import { HeroCounter } from "@/components/friends/HeroCounter"
import { CrewScroll } from "@/components/friends/CrewScroll"
import { LiveFeed } from "@/components/friends/LiveFeed"
import { FriendManageDrawer } from "@/components/friends/FriendManageDrawer"
import { FriendProfileModal } from "@/components/friends/FriendProfileModal"
import { MOCK_FRIENDS, MOCK_LIVE_UPDATES, getCrewAverage, type FriendData, type LiveUpdate } from "@/lib/mock-friends"
import { UserPlus } from "lucide-react"
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

  // Map real data to FriendData shape, fallback to mock if no friends
  const friends: FriendData[] = useMemo(() => {
    if (!hasFriends) return MOCK_FRIENDS
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
    if (!hasFriends || !rawFeed || rawFeed.length === 0) return MOCK_LIVE_UPDATES
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
    if (!hasFriends || !crewStats) return getCrewAverage(MOCK_FRIENDS)
    return crewStats.crewAvg
  }, [crewStats, hasFriends])

  const today = new Date()
  const weekLabel = `Week of ${today.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`

  const bottomStats = useMemo(() => {
    if (!hasFriends || !crewStats) {
      return [
        { label: "Crew Avg", value: `${getCrewAverage(MOCK_FRIENDS)}%`, color: "green" as const },
        { label: "Top Streak", value: "16W", color: "green" as const },
        { label: "Total Entries", value: "1279" },
        { label: "Active", value: `${MOCK_FRIENDS.filter((f) => f.completionPct > 0).length}/${MOCK_FRIENDS.length}` },
      ]
    }
    return [
      { label: "Crew Avg", value: `${crewStats.crewAvg}%`, color: "green" as const },
      { label: "Top Streak", value: `${crewStats.topStreak}W`, color: "green" as const },
      { label: "Total Entries", value: String(crewStats.totalEntries) },
      { label: "Active", value: `${crewStats.activeCount}/${crewStats.totalCount}` },
    ]
  }, [crewStats, hasFriends])

  return (
    <MasterGrid>
      <Navbar />

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

      {/* Add friends button */}
      <GridRow flex="pass">
        <GridCell className="flex-1 !p-0">
          <div className="border-t border-dark-theme-border px-6 py-3 flex items-center justify-between">
            <span className="text-[9px] tracking-[0.3em] text-grayscale50 uppercase">
              {hasFriends ? `${friends.length} friends` : "Demo data — add friends to see real stats"}
            </span>
            <Button
              size="sm"
              variant="outline"
              icon={UserPlus}
              alwaysShowIcon
              onClick={() => setManageOpen(true)}
            >
              Manage
            </Button>
          </div>
        </GridCell>
      </GridRow>

      {/* Crew horizontal scroll cards */}
      <GridRow flex="pass">
        <GridCell className="flex-1 !p-0 overflow-hidden">
          <CrewScroll friends={friends} onFriendClick={(id) => setSelectedFriendId(id)} />
        </GridCell>
      </GridRow>

      {/* Live feed */}
      <GridRow flex="pass">
        <GridCell className="flex-1 !p-0 overflow-hidden">
          <LiveFeed updates={liveUpdates} />
        </GridCell>
      </GridRow>

      {/* Bottom ticker — stats marquee */}
      <GridRow flex="pass">
        <GridCell className="flex-1 !p-0 overflow-hidden">
          <Ticker friends={friends} stats={bottomStats} reverse />
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
