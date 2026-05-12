// @ts-nocheck
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router'
import { Flame, Moon, Apple, CalendarDays, Users, Target } from 'lucide-react'

export default function DashboardOverview() {
  const navigate = useNavigate()
  const [stats] = useState([
    { label: 'Workouts This Week', value: '5', icon: Flame, colorClass: 'bg-coral/15 text-coral', sub: 'Goal: 5', to: '/dashboard/workout' },
    { label: 'Avg Sleep', value: '7.5h', icon: Moon, colorClass: 'bg-lavender/15 text-lavender', sub: 'Goal: 8h', to: '/dashboard/sleep' },
    { label: 'Meals Logged', value: '21', icon: Apple, colorClass: 'bg-sage/15 text-sage', sub: 'This week', to: '/dashboard/nutrition' },
    { label: 'Co-Work Sessions', value: '4', icon: CalendarDays, colorClass: 'bg-gold/15 text-gold', sub: 'This week', to: '/dashboard/schedule' },
  ])

  const quickActions = [
    { label: 'Log Workout', to: '/dashboard/workout', icon: Flame, colorClass: 'bg-coral/15 text-coral' },
    { label: 'Track Sleep', to: '/dashboard/sleep', icon: Moon, colorClass: 'bg-lavender/15 text-lavender' },
    { label: 'Log Meal', to: '/dashboard/nutrition', icon: Apple, colorClass: 'bg-sage/15 text-sage' },
    { label: 'Join Co-Work', to: '/dashboard/schedule', icon: CalendarDays, colorClass: 'bg-gold/15 text-gold' },
    { label: 'Community', to: '/dashboard/community', icon: Users, colorClass: 'bg-sky/15 text-sky' },
    { label: 'Settings', to: '/dashboard/settings', icon: Target, colorClass: 'bg-gray/15 text-gray' },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
      <div>
        <h1 className="heading-1 text-dark">Dashboard Overview</h1>
        <p className="body text-gray mt-1">Your work-life balance at a glance</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.button key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} onClick={() => navigate(s.to)} className="rounded-2xl p-5 bg-white/80 backdrop-blur-xl border border-white/60 shadow-glass text-left hover:-translate-y-1 transition-all">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.colorClass}`}>
              <s.icon size={20} />
            </div>
            <p className="text-2xl font-bold text-dark">{s.value}</p>
            <p className="text-sm text-gray">{s.label}</p>
            <p className="text-xs text-gray-light">{s.sub}</p>
          </motion.button>
        ))}
      </div>

      <div className="rounded-2xl p-6 bg-white/80 backdrop-blur-xl border border-white/60 shadow-glass">
        <h2 className="heading-4 text-dark mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {quickActions.map(a => (
            <button key={a.to} onClick={() => navigate(a.to)} className="flex items-center gap-3 p-4 rounded-xl hover:bg-sage/5 transition-colors border border-transparent hover:border-sage/10">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${a.colorClass}`}>
                <a.icon size={20} />
              </div>
              <span className="text-sm text-dark font-medium">{a.label}</span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

