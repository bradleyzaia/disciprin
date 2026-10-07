/**
 * Mock data for the Friend Progress feature.
 * Replace with real Convex queries once backend tables exist.
 */

export interface FriendData {
  id: string
  name: string
  handle: string
  completionPct: number
  streakWeeks: number
  primaryHabit: string
  weekDots: ('done' | 'miss' | 'pending')[] // 7 days, Mon–Sun
}

export interface LiveUpdate {
  id: string
  name: string
  action: string
  highlight: string
  highlightColor: 'green' | 'pink' | 'yellow'
  timeAgo: string
}

export const MOCK_FRIENDS: FriendData[] = [
  {
    id: '1', name: 'Anna', handle: '@anna', completionPct: 100, streakWeeks: 16,
    primaryHabit: 'Running',
    weekDots: ['done', 'done', 'done', 'done', 'done', 'done', 'done'],
  },
  {
    id: '2', name: 'Kyle', handle: '@kyle', completionPct: 92, streakWeeks: 12,
    primaryHabit: 'Meditation',
    weekDots: ['done', 'done', 'done', 'done', 'done', 'done', 'done'],
  },
  {
    id: 'you', name: 'You', handle: '@you', completionPct: 88, streakWeeks: 8,
    primaryHabit: 'Meditation',
    weekDots: ['done', 'done', 'miss', 'done', 'done', 'done', 'done'],
  },
  {
    id: '3', name: 'Mia', handle: '@mia', completionPct: 85, streakWeeks: 6,
    primaryHabit: 'Yoga',
    weekDots: ['done', 'done', 'done', 'done', 'miss', 'done', 'done'],
  },
  {
    id: '4', name: 'Bradley', handle: '@brad', completionPct: 71, streakWeeks: 3,
    primaryHabit: 'Workout',
    weekDots: ['done', 'done', 'miss', 'done', 'done', 'miss', 'done'],
  },
  {
    id: '5', name: 'Sam', handle: '@samwise', completionPct: 43, streakWeeks: 1,
    primaryHabit: 'Stretching',
    weekDots: ['done', 'miss', 'miss', 'done', 'miss', 'done', 'miss'],
  },
]

export const MOCK_LIVE_UPDATES: LiveUpdate[] = [
  { id: '1', name: 'Anna', action: 'completed Running', highlight: '✓', highlightColor: 'green', timeAgo: '2h ago' },
  { id: '2', name: 'Kyle', action: 'hit', highlight: '12-week milestone', highlightColor: 'green', timeAgo: '5h ago' },
  { id: '3', name: 'You', action: 'logged Journaling', highlight: '✓', highlightColor: 'green', timeAgo: '6h ago' },
  { id: '4', name: 'Mia', action: 'completed Yoga', highlight: '✓', highlightColor: 'green', timeAgo: '1d ago' },
  { id: '5', name: 'Bradley', action: 'resumed Workout streak', highlight: '↑', highlightColor: 'yellow', timeAgo: '1d ago' },
  { id: '6', name: 'Sam', action: 'missed Stretching', highlight: '✗', highlightColor: 'pink', timeAgo: '2d ago' },
  { id: '7', name: 'Anna', action: 'reached', highlight: '400 entries', highlightColor: 'green', timeAgo: '2d ago' },
  { id: '8', name: 'Kyle', action: 'completed Meditation', highlight: '✓', highlightColor: 'green', timeAgo: '3d ago' },
]

export function getCrewAverage(friends: FriendData[]): number {
  return Math.round(friends.reduce((sum, f) => sum + f.completionPct, 0) / friends.length)
}

export function getCompletionTier(pct: number): 'green' | 'yellow' | 'pink' {
  if (pct >= 90) return 'green'
  if (pct >= 60) return 'yellow'
  return 'pink'
}
