import { useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { motion, AnimatePresence } from "framer-motion"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import { WeekDots } from "./WeekDots"
import { getCompletionTier } from "@/lib/mock-friends"
import { grid } from "@/styles/tokens"

interface FriendProfileModalProps {
  friendClerkId: string
  onClose: () => void
}

const PCT_COLORS = {
  green: "text-green",
  yellow: "text-yellow",
  pink: "text-red",
} as const

const CATEGORY_LABELS: Record<string, string> = {
  PHYSICAL: "Physical",
  MENTAL: "Mental",
  EMOTIONAL: "Emotional",
  SPIRITUAL: "Spiritual",
  SOCIAL: "Social",
  OTHER: "Other",
}

export function FriendProfileModal({ friendClerkId, onClose }: FriendProfileModalProps) {
  const profile = useQuery(api.friends.getFriendProfile.default, { friendClerkId })

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-40 cursor-pointer backdrop-blur-[2px]"
        style={{
          backgroundImage: grid.pattern,
          backgroundSize: grid.patternSize,
          opacity: grid.patternOpacity,
        }}
      />
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
        className="fixed bottom-0 left-0 right-0 max-h-[85vh] bg-black border-t border-dark-theme-border z-50 flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-dark-theme-border shrink-0">
          <span className="text-[9px] tracking-[0.3em] text-grayscale50 uppercase">Friend Profile</span>
          <button onClick={onClose} className="text-grayscale50 hover:text-dark-theme-text transition-colors">
            <X className="size-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {profile === undefined && (
            <div className="flex items-center justify-center py-20">
              <span className="text-[11px] text-grayscale50 animate-pulse">Loading profile…</span>
            </div>
          )}

          {profile === null && (
            <div className="flex items-center justify-center py-20">
              <span className="text-[11px] text-grayscale50">Profile not available</span>
            </div>
          )}

          {profile && <ProfileContent profile={profile} />}
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  )
}

interface ProfileData {
  clerkId: string
  name: string
  handle: string
  pills: {
    name: string
    category: string
    currentStreak: number
    longestStreak: number
    completionPct: number
    frequencyPerWeek: number
    completedThisWeek: number
  }[]
  weekDots: ("done" | "miss" | "pending")[]
  stats: {
    totalEntries: number
    longestStreak: number
    currentStreak: number
    weeklyCompletionPct: number
    activePills: number
  }
  friendSince: number
}

function ProfileContent({ profile }: { profile: ProfileData }) {
  const tier = getCompletionTier(profile.stats.weeklyCompletionPct)

  return (
    <div className="p-6">
      {/* Name + handle + big completion % */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-normal tracking-wider">{profile.name}</h2>
          <p className="text-[9px] text-grayscale50 mt-0.5">{profile.handle}</p>
        </div>
        <div className={`text-[48px] font-normal leading-none ${PCT_COLORS[tier]}`}>
          {profile.stats.weeklyCompletionPct}%
        </div>
      </div>

      {/* Week dots */}
      <div className="mb-6">
        <p className="text-[9px] tracking-[0.3em] text-grayscale50 mb-3 uppercase">This Week</p>
        <WeekDots dots={profile.weekDots as ("done" | "miss" | "pending")[]} color={tier} />
        <div className="flex justify-between mt-1">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <span key={i} className="text-[8px] text-grayscale25 w-2 text-center">{d}</span>
          ))}
        </div>
      </div>

      {/* Overall stats */}
      <div className="grid grid-cols-2 gap-px mb-6">
        {[
          { label: "Total Entries", value: String(profile.stats.totalEntries) },
          { label: "Active Pills", value: String(profile.stats.activePills) },
          { label: "Longest Streak", value: `${profile.stats.longestStreak}W` },
          { label: "Current Streak", value: `${profile.stats.currentStreak}W` },
        ].map((stat) => (
          <div
            key={stat.label}
            className="border border-dark-theme-border p-4"
          >
            <p className="text-[9px] tracking-[0.2em] text-grayscale50 uppercase mb-1">{stat.label}</p>
            <p className="text-lg font-normal text-green">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Pills */}
      <div>
        <p className="text-[9px] tracking-[0.3em] text-grayscale50 mb-4 uppercase">Pills</p>
        {profile.pills.length === 0 && (
          <p className="text-[11px] text-grayscale50 text-center py-6">No visible pills</p>
        )}
        {profile.pills.map((pill) => {
          const pillTier = getCompletionTier(pill.completionPct)
          return (
            <motion.div
              key={pill.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between py-3 border-b border-dark-theme-border last:border-0"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-normal tracking-wider">{pill.name}</span>
                  <span className="text-[8px] text-grayscale25 tracking-[0.15em] uppercase">
                    {CATEGORY_LABELS[pill.category] ?? pill.category}
                  </span>
                </div>
                <div className="text-[10px] text-grayscale50">
                  {pill.completedThisWeek}/{pill.frequencyPerWeek} this week · {pill.currentStreak}W streak
                </div>
              </div>
              <div className={`text-lg font-normal ${PCT_COLORS[pillTier]}`}>
                {pill.completionPct}%
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Friend since */}
      <p className="text-[9px] text-grayscale25 text-center mt-8 mb-4">
        Friends since {new Date(profile.friendSince).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
      </p>
    </div>
  )
}
