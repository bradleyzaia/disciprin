import { useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { motion } from "framer-motion"
import { Check, Minus } from "lucide-react"

const CATEGORY_COLORS: Record<string, string> = {
  PHYSICAL: "bg-green/15 text-green",
  MENTAL: "bg-blue-400/15 text-blue-400",
  SOCIAL: "bg-yellow/15 text-yellow",
  CREATIVE: "bg-purple-400/15 text-purple-400",
  OTHER: "bg-grayscale25/40 text-grayscale75",
}

export function FriendColumns() {
  const friendsTasks = useQuery(api.friends.getFriendsTodayTasks.default)

  if (friendsTasks === undefined) {
    return (
      <div className="border-b border-dark-theme-border bg-grayscale0 py-8">
        <div className="flex items-center justify-center">
          <span className="text-[10px] tracking-[0.15em] text-grayscale50 animate-pulse">
            Loading friends…
          </span>
        </div>
      </div>
    )
  }

  if (!friendsTasks || friendsTasks.length === 0) return null

  return (
    <div className="border-b border-dark-theme-border bg-grayscale0 overflow-x-auto scrollbar-hide">
      <div
        className="flex min-w-0"
        style={{ width: friendsTasks.length <= 3 ? "100%" : undefined }}
      >
        {friendsTasks.map((friend, i) => (
          <motion.div
            key={friend!.clerkId}
            className={`
              shrink-0 border-r border-dark-theme-border last:border-r-0
              flex flex-col
            `}
            style={{
              width: friendsTasks.length <= 3
                ? `${100 / friendsTasks.length}%`
                : "33.333%",
              minWidth: friendsTasks.length <= 3 ? undefined : "33.333%",
              maxWidth: "33.333%",
            }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.35 }}
          >
            {/* Friend header */}
            <div className="px-3 pt-3 pb-2 border-b border-dark-theme-border/50">
              <div className="flex items-baseline justify-between gap-1">
                <span className="text-[11px] font-bold tracking-wider truncate">
                  {friend!.name}
                </span>
                <span
                  className={`text-[11px] font-bold tabular-nums shrink-0 ${
                    friend!.completionPct >= 80
                      ? "text-green"
                      : friend!.completionPct >= 40
                        ? "text-yellow"
                        : "text-red"
                  }`}
                >
                  {friend!.completedCount}/{friend!.totalCount}
                </span>
              </div>
              <span className="text-[9px] text-grayscale50 tracking-wide">
                {friend!.handle}
              </span>
            </div>

            {/* Tasks list */}
            <div className="flex flex-col px-3 py-2 gap-1.5 flex-1">
              {friend!.tasks.length === 0 ? (
                <span className="text-[9px] text-grayscale50 italic py-2">
                  No tasks
                </span>
              ) : (
                friend!.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-1.5 min-h-[22px]"
                  >
                    {/* Completion indicator */}
                    <div
                      className={`w-3.5 h-3.5 shrink-0 flex items-center justify-center border ${
                        task.completed
                          ? "border-green bg-green/20"
                          : "border-grayscale25"
                      }`}
                    >
                      {task.completed ? (
                        <Check className="w-2.5 h-2.5 text-green" strokeWidth={3} />
                      ) : (
                        <Minus className="w-2 h-2 text-grayscale25" strokeWidth={2} />
                      )}
                    </div>
                    {/* Task name */}
                    <span
                      className={`text-[10px] leading-tight truncate ${
                        task.completed
                          ? "text-grayscale50 line-through"
                          : "text-grayscale75"
                      }`}
                    >
                      {task.name}
                    </span>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
