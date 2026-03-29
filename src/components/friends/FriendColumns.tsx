import { useState, useMemo } from "react"
import { useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { format, addDays, subDays, isSameDay } from "date-fns"
import { ChevronLeft, ChevronRight, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrambleText } from "@/components/ui/scramble-text"
import { SFX, playSFX } from "@/lib/sfx"
import { grid, duration } from "@/styles/tokens"

export function FriendColumns() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const dateStr = format(currentDate, "yyyy-MM-dd")
  const isToday = isSameDay(currentDate, new Date())

  const friendsTasks = useQuery(api.friends.getFriendsTodayTasks.default, { date: dateStr })

  if (friendsTasks === undefined) {
    return (
      <div className="border-b border-dark-theme-border bg-black/80 py-8">
        <div className="flex items-center justify-center">
          <span className="text-[10px] tracking-[0.15em] text-dark-theme-text animate-pulse font-mono">
            <ScrambleText text="Loading crew…" />
          </span>
        </div>
      </div>
    )
  }

  if (!friendsTasks || friendsTasks.length === 0) return null

  return (
    <div className="border-b border-dark-theme-border bg-black/80 font-mono text-xs">
      {/* Day switcher row — full width */}
      <div className="flex h-10 border-b border-dark-theme-border">
        <button
          onMouseDown={() => playSFX(SFX.ENTER)}
          onClick={() => setCurrentDate(subDays(currentDate, 1))}
          className="w-10 flex items-center justify-center hover:text-green transition-colors border-r border-dark-theme-border"
        >
          <ChevronLeft className="size-4" />
        </button>
        <button
          onMouseDown={() => playSFX(SFX.ENTER)}
          onClick={() => setCurrentDate(new Date())}
          className={cn(
            "flex-1 flex items-center justify-center hover:text-green transition-colors uppercase text-[10px]",
            isToday ? "text-dark-theme-text/30" : "text-dark-theme-text"
          )}
        >
          <ScrambleText text={format(currentDate, "EEE, MMM d")} />
        </button>
        <button
          onMouseDown={() => playSFX(SFX.ENTER)}
          onClick={() => setCurrentDate(addDays(currentDate, 1))}
          className="w-10 flex items-center justify-center hover:text-green transition-colors border-l border-dark-theme-border"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      {/* Friend columns: each friend = header + pill rows */}
      <div className="overflow-x-auto">
      <div className="grid"
        style={{
          gridTemplateColumns: `repeat(${friendsTasks.length}, minmax(240px, 1fr))`,
          minWidth: friendsTasks.length > 3 ? `${friendsTasks.length * 240}px` : undefined,
        }}
      >
        {friendsTasks.map((friend) => (
          <div key={friend!.clerkId} className="border-r border-dark-theme-border last:border-r-0 flex flex-col">
            {/* Friend header */}
            <div className="border-b border-dark-theme-border px-4 py-3 flex items-center justify-between">
              <div className="min-w-0">
                <div className="font-medium truncate">
                  <ScrambleText text={friend!.isMe ? `${friend!.name} (You)` : friend!.name} />
                </div>
                <div className="text-[10px] text-dark-theme-text/50">
                  <ScrambleText text={friend!.handle ?? ""} />
                </div>
              </div>
              <div className={cn(
                "text-lg font-bold tabular-nums",
                friend!.completionPct >= 80 ? "text-green" :
                friend!.completionPct >= 40 ? "text-yellow" : "text-red"
              )}>
                <ScrambleText text={`${friend!.completionPct}%`} />
              </div>
            </div>

            {/* Pill rows — mirrors dashboard CalendarGrid layout */}
            {friend!.tasks.length === 0 ? (
              <div className="px-4 py-6 text-dark-theme-text/30 text-center">
                <ScrambleText text="No pills configured." />
              </div>
            ) : (
              friend!.tasks.map((task) => {
                const percentage = task.targetValue > 0
                  ? Math.min(100, Math.round((task.value / task.targetValue) * 100))
                  : (task.completed ? 100 : 0)

                return (
                  <div
                    key={task.id}
                    className="grid border-b border-dark-theme-border last:border-b-0 min-h-14"
                    style={{ gridTemplateColumns: "1fr minmax(64px, 80px)" }}
                  >
                    {/* Pill name column */}
                    <div className="px-4 border-r border-dark-theme-border flex items-center">
                      <div className="min-w-0">
                        <div className="font-medium truncate">
                          <ScrambleText text={task.name} />
                        </div>
                        <div className="text-[10px] text-dark-theme-text/50 flex flex-col leading-relaxed">
                          <div>
                            <ScrambleText
                              text={
                                task.measurementType === "boolean"
                                  ? "PASS/FAIL"
                                  : `${task.targetValue}${task.unit ? ` ${task.unit}` : ""}`
                              }
                            />
                            {task.measurementType !== "boolean" && (
                              <ScrambleText text=" / DAY" className="text-grayscale75" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Completion cell — mirrors CalendarDayCell */}
                    <div className="flex items-center justify-center relative group">
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-25 transition-opacity pointer-events-none z-0"
                        style={{
                          backgroundImage: grid.pattern,
                          backgroundSize: grid.patternSize,
                          transitionDuration: `${duration.moderate}ms`,
                        }}
                      />
                      <div className="relative z-10 w-full h-full flex items-center justify-center">
                        {task.completed ? (
                          <>
                            <ScrambleText
                              className="absolute top-2 right-2 text-xs leading-none text-green scale-75 origin-top-right"
                              text={task.measurementType === "boolean" ? "PASS" : `${percentage}%`}
                              scrambleOnMount={false}
                            />
                            <div className="w-8 h-4 rounded-full border border-dark-theme-border bg-green rotate-315 transform origin-center flex items-center justify-center">
                              <Check className="w-3 h-3 rotate-45 text-black" />
                            </div>
                          </>
                        ) : task.value > 0 ? (
                          <>
                            <ScrambleText
                              className="absolute top-2 right-2 text-xs leading-none text-dark-theme-text/50 scale-75 origin-top-right"
                              text={`${percentage}%`}
                              scrambleOnMount={false}
                            />
                            <div className="w-6 h-3 rounded-full border border-dark-theme-border bg-transparent rotate-315 transform origin-center overflow-hidden relative">
                              <div
                                className={cn(
                                  "h-full transition-all duration-300 ease-out",
                                  percentage < 50 ? "bg-red" : "bg-yellow"
                                )}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <ScrambleText
                              className="absolute top-2 right-2 text-xs leading-none text-dark-theme-text/50 scale-75 origin-top-right"
                              text={task.measurementType === "boolean" ? "FAIL" : "0%"}
                              scrambleOnMount={false}
                            />
                            <div className="w-6 h-3 rounded-full border border-dark-theme-border bg-transparent rotate-315 transform origin-center overflow-hidden relative">
                              <div className="h-full bg-red" style={{ width: "0%" }} />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        ))}
      </div>
      </div>
    </div>
  )
}
