"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Flame, Moon, Apple, CheckSquare, Heart, TrendingUp, ArrowRight } from "lucide-react"
import { ActivityFeed } from "./ActivityFeed"

interface OverviewStats {
  tasksCount: number
  completedTasks: number
  avgSleep: string
  calories: number
  workoutsThisWeek: number
  latestMood: string | number
}

export function OverviewDashboard({ stats, activities }: { stats: OverviewStats, activities: any[] }) {
  const cards = [
    {
      label: "Workouts",
      value: `${stats.workoutsThisWeek}`,
      sub: "This week",
      icon: Flame,
      color: "text-coral",
      bg: "bg-coral/10",
      href: "/workout"
    },
    {
      label: "Sleep Avg",
      value: `${stats.avgSleep}h`,
      sub: "Last 7 days",
      icon: Moon,
      color: "text-indigo-500",
      bg: "bg-indigo-50",
      href: "/sleep"
    },
    {
      label: "Calories",
      value: `${stats.calories}`,
      sub: "Today's total",
      icon: Apple,
      color: "text-sage",
      bg: "bg-sage/10",
      href: "/nutrition"
    },
    {
      label: "Tasks",
      value: `${stats.completedTasks}/${stats.tasksCount}`,
      sub: "Completed",
      icon: CheckSquare,
      color: "text-sky-500",
      bg: "bg-sky-50",
      href: "/tasks"
    }
  ]

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link 
              href={card.href}
              className="block p-6 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-glass hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${card.bg} ${card.color}`}>
                <card.icon size={24} />
              </div>
              <div className="text-2xl font-bold text-dark">{card.value}</div>
              <div className="text-sm font-medium text-gray-600">{card.label}</div>
              <div className="text-xs text-gray-400 mt-1">{card.sub}</div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Card */}
        <div className="lg:col-span-2 rounded-2xl p-6 bg-white/80 backdrop-blur-xl border border-white/60 shadow-glass">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-dark">Recent Progress</h2>
            <TrendingUp size={20} className="text-sage" />
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 font-medium">Daily Tasks</span>
                <span className="text-dark font-bold">{Math.round((stats.completedTasks / (stats.tasksCount || 1)) * 100)}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(stats.completedTasks / (stats.tasksCount || 1)) * 100}%` }}
                  className="h-full bg-sky-500 rounded-full"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 font-medium">Nutrition Goal</span>
                <span className="text-dark font-bold">{Math.min(100, Math.round((stats.calories / 2500) * 100))}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (stats.calories / 2500) * 100)}%` }}
                  className="h-full bg-sage rounded-full"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          {/* Wellness Quick Stats */}
          <div className="rounded-2xl p-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
            <h2 className="text-xl font-bold mb-4">Wellness Tip</h2>
            <p className="text-indigo-50 mb-6 leading-relaxed">
              "Consistency is key. Small daily wins lead to massive long-term transformations."
            </p>
            <div className="flex items-center gap-3 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <Heart size={20} className="text-pink-300" />
              <div>
                <div className="text-xs text-indigo-100 uppercase font-bold tracking-wider">Latest Mood</div>
                <div className="text-lg font-bold">{stats.latestMood}/10</div>
              </div>
            </div>
            <Link 
              href="/wellness" 
              className="mt-6 flex items-center justify-center gap-2 w-full py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-colors"
            >
              Update Wellness <ArrowRight size={18} />
            </Link>
          </div>

          <ActivityFeed activities={activities} />
        </div>
      </div>
    </div>
  )
}
