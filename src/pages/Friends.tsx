import { useMemo } from "react"
import { MasterGrid, GridRow, GridCell } from "@/components/layout/grid"
import { Navbar } from "@/components/layout/Navbar"
import { Ticker } from "@/components/friends/Ticker"
import { HeroCounter } from "@/components/friends/HeroCounter"
import { CrewScroll } from "@/components/friends/CrewScroll"
import { LiveFeed } from "@/components/friends/LiveFeed"
import { MOCK_FRIENDS, MOCK_LIVE_UPDATES, getCrewAverage } from "@/lib/mock-friends"

export function Friends() {
  const friends = MOCK_FRIENDS
  const liveUpdates = MOCK_LIVE_UPDATES
  const crewAvg = useMemo(() => getCrewAverage(friends), [friends])

  const today = new Date()
  const weekLabel = `Week of ${today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`

  const bottomStats = [
    { label: 'Crew Avg', value: `${crewAvg}%`, color: 'green' as const },
    { label: 'Top Streak', value: '16W', color: 'green' as const },
    { label: 'Total Entries', value: '1279' },
    { label: 'Active', value: `${friends.filter(f => f.completionPct > 0).length}/${friends.length}` },
  ]

  return (
    <MasterGrid>
      <Navbar />

      {/* Top ticker — friend completion marquee */}
      <GridRow flex="pass">
        <GridCell className="flex-1 !p-0 overflow-hidden">
          <Ticker friends={friends} />
        </GridCell>
      </GridRow>

      {/* Hero counter */}
      <GridRow flex="pass">
        <GridCell className="flex-1 !p-0">
          <HeroCounter value={crewAvg} label="Crew Average" sublabel={weekLabel} />
        </GridCell>
      </GridRow>

      {/* Crew horizontal scroll cards */}
      <GridRow flex="pass">
        <GridCell className="flex-1 !p-0 overflow-hidden">
          <CrewScroll friends={friends} />
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
    </MasterGrid>
  )
}
