import { type FriendData } from "@/lib/mock-friends"
import { FriendCard } from "./FriendCard"

interface CrewScrollProps {
  friends: FriendData[]
  onFriendClick?: (id: string) => void
}

export function CrewScroll({ friends, onFriendClick }: CrewScrollProps) {
  return (
    <div className="border-t border-dark-theme-border py-6">
      <p className="px-6 pb-4 text-[9px] tracking-[0.3em] text-grayscale50">Your Crew</p>
      <div className="flex gap-px overflow-x-auto px-6 scrollbar-hide snap-x snap-mandatory">
        {friends.map((f, i) => (
          <FriendCard
            key={f.id}
            friend={f}
            index={i}
            onClick={() => onFriendClick?.(f.id)}
          />
        ))}
      </div>
    </div>
  )
}
