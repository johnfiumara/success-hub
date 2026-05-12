"use client"

import { Apple, CheckSquare, Moon, Video, Users, LayoutDashboard, Flame, ExternalLink, TrendingUp, Target, Calendar, BarChart3, Plus } from "lucide-react"
import Link from "next/link"

type AppPage = "dashboard" | "tasks" | "nutrition" | "sleep" | "community" | "meetings"

const PAGE_META: Record<AppPage, { label: string; path: string; color: string }> = {
  dashboard: { label: "Dashboard Overview", path: "/", color: "text-sage" },
  tasks: { label: "Tasks & Habits", path: "/tasks", color: "text-blue-600" },
  nutrition: { label: "Nutrition Tracker", path: "/nutrition", color: "text-green-600" },
  sleep: { label: "Sleep Tracker", path: "/sleep", color: "text-indigo-600" },
  community: { label: "Community", path: "/community", color: "text-coral" },
  meetings: { label: "Meetings", path: "/meetings", color: "text-amber-600" },
}

export function AppPagePreview({ page }: { page: AppPage }) {
  const meta = PAGE_META[page]

  return (
    <div className="flex h-full min-h-[600px] font-sans text-sm antialiased bg-[#F9F6F0]">
      {/* Mini sidebar */}
      <div className="w-14 bg-white border-r border-gray-100 flex flex-col items-center py-4 gap-3 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-sage flex items-center justify-center mb-2">
          <Flame size={14} className="text-white" />
        </div>
        {[
          { icon: LayoutDashboard, active: page === "dashboard" },
          { icon: CheckSquare, active: page === "tasks" },
          { icon: Apple, active: page === "nutrition" },
          { icon: Moon, active: page === "sleep" },
          { icon: Users, active: page === "community" },
          { icon: Video, active: page === "meetings" },
        ].map(({ icon: Icon, active }, i) => (
          <div key={i} className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${active ? "bg-sage/10 text-sage" : "text-gray-300"}`}>
            <Icon size={17} />
          </div>
        ))}
      </div>

      {/* Page content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className={`text-2xl font-bold ${meta.color}`}>{meta.label}</h1>
            <p className="text-gray-400 text-xs mt-0.5">Live at <code className="bg-gray-100 px-1 rounded">{meta.path}</code></p>
          </div>
          <Link href={meta.path} target="_blank" className="flex items-center gap-1.5 text-xs text-violet-600 hover:underline font-medium bg-violet-50 px-3 py-1.5 rounded-lg border border-violet-100">
            <ExternalLink size={12} /> Open Live
          </Link>
        </div>

        {page === "dashboard" && <DashboardMockup />}
        {page === "tasks" && <TasksMockup />}
        {page === "nutrition" && <NutritionMockup />}
        {page === "sleep" && <SleepMockup />}
        {page === "community" && <CommunityMockup />}
        {page === "meetings" && <MeetingsMockup />}
      </div>
    </div>
  )
}

function DashboardMockup() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Tasks Done", value: "12", icon: CheckSquare, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Calories", value: "1,840", icon: Apple, color: "text-green-500", bg: "bg-green-50" },
          { label: "Sleep Avg", value: "7.2h", icon: Moon, color: "text-indigo-500", bg: "bg-indigo-50" },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className={`w-9 h-9 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
              <card.icon size={18} className={card.color} />
            </div>
            <p className="text-2xl font-black text-dark">{card.value}</p>
            <p className="text-xs text-gray-400 mt-1">{card.label}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <p className="font-bold text-dark">Activity Feed</p>
          <span className="text-xs text-gray-400">Today</span>
        </div>
        {["Completed morning workout", "Logged breakfast (520 kcal)", "Marked 3 tasks done", "Sleep logged — 7.5h"].map(a => (
          <div key={a} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
            <div className="w-2 h-2 rounded-full bg-sage shrink-0" />
            <p className="text-sm text-gray-600">{a}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function TasksMockup() {
  const cols = [
    { label: "To Do", color: "bg-gray-100", tasks: ["Review goals", "Schedule check-in", "Update profile"] },
    { label: "In Progress", color: "bg-blue-50", tasks: ["Morning routine", "Weekly review"] },
    { label: "Done", color: "bg-green-50", tasks: ["Workout logged", "Meal prep"] },
  ]
  return (
    <div className="grid grid-cols-3 gap-4">
      {cols.map(col => (
        <div key={col.label} className={`${col.color} rounded-2xl p-4`}>
          <div className="flex items-center justify-between mb-3">
            <p className="font-bold text-dark text-sm">{col.label}</p>
            <span className="text-xs text-gray-400 bg-white px-2 py-0.5 rounded-full">{col.tasks.length}</span>
          </div>
          <div className="space-y-2">
            {col.tasks.map(t => (
              <div key={t} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 text-xs text-gray-700">{t}</div>
            ))}
          </div>
          <button className="w-full mt-3 flex items-center justify-center gap-1 text-xs text-gray-400 hover:text-gray-600 py-2 rounded-xl border-2 border-dashed border-gray-200 transition-colors">
            <Plus size={12} /> Add task
          </button>
        </div>
      ))}
    </div>
  )
}

function NutritionMockup() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Calories", val: "1,840", max: "2,000", pct: 92, color: "bg-orange-400" },
          { label: "Protein", val: "142g", max: "150g", pct: 95, color: "bg-blue-400" },
          { label: "Carbs", val: "180g", max: "200g", pct: 90, color: "bg-green-400" },
          { label: "Fat", val: "52g", max: "65g", pct: 80, color: "bg-yellow-400" },
        ].map(n => (
          <div key={n.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-400 mb-2">{n.label}</p>
            <p className="text-xl font-black text-dark">{n.val}</p>
            <p className="text-xs text-gray-300">of {n.max}</p>
            <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className={`${n.color} h-full rounded-full`} style={{ width: `${n.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <p className="font-bold text-dark mb-3">Today's Meals</p>
        {["Breakfast · Oatmeal + berries · 420 kcal", "Lunch · Grilled chicken salad · 580 kcal", "Dinner · Salmon + veggies · 640 kcal"].map(m => (
          <div key={m} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0 text-sm text-gray-600">{m}</div>
        ))}
      </div>
    </div>
  )
}

function SleepMockup() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const heights = [75, 85, 65, 90, 80, 95, 88]
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {[{ label: "Avg Duration", val: "7.4h" }, { label: "Avg Quality", val: "Good" }, { label: "Logs This Week", val: "6" }].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
            <p className="text-2xl font-black text-dark">{s.val}</p>
            <p className="text-xs text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <p className="font-bold text-dark mb-4">Sleep Quality — Last 7 Days</p>
        <div className="flex items-end gap-3 h-28">
          {days.map((d, i) => (
            <div key={d} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full bg-indigo-100 rounded-t-lg" style={{ height: `${heights[i]}%` }}>
                <div className="w-full bg-indigo-500 rounded-t-lg" style={{ height: "100%" }} />
              </div>
              <span className="text-xs text-gray-400">{d}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CommunityMockup() {
  return (
    <div className="space-y-4">
      {["Morning Routine Challenge 🌅", "What's your go-to healthy snack?", "30-Day No Sugar Update — Week 2"].map(post => (
        <div key={post} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-sage/20 flex items-center justify-center text-sage font-bold text-sm">A</div>
            <div>
              <p className="text-sm font-semibold text-dark">Community Member</p>
              <p className="text-xs text-gray-400">2 hours ago</p>
            </div>
          </div>
          <p className="text-sm text-gray-700">{post}</p>
          <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
            <span>❤️ 24 likes</span>
            <span>💬 8 comments</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function MeetingsMockup() {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <p className="font-bold text-dark mb-4">Upcoming Meetings</p>
        {[
          { title: "Weekly Check-in", host: "You", status: "WAITING", color: "bg-amber-100 text-amber-700" },
          { title: "Team Wellness Call", host: "Sarah", status: "ACTIVE", color: "bg-green-100 text-green-700" },
        ].map(m => (
          <div key={m.title} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
            <div>
              <p className="font-semibold text-dark text-sm">{m.title}</p>
              <p className="text-xs text-gray-400">Hosted by {m.host}</p>
            </div>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${m.color}`}>{m.status}</span>
          </div>
        ))}
      </div>
      <button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3.5 rounded-2xl text-sm transition-colors flex items-center justify-center gap-2">
        <Video size={16} /> Start New Meeting
      </button>
    </div>
  )
}
