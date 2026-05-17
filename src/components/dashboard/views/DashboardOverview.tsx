import { Flame, Moon, Apple, CalendarDays, Users, Target } from 'lucide-react'
import { getDashboardStats } from '@/actions/dashboard'
import Link from 'next/link'

export default async function DashboardOverview() {
  const statsData = await getDashboardStats();

  const stats = [
    { label: 'Workouts This Week', value: statsData.workouts, icon: Flame, colorClass: 'bg-coral/15 text-coral', sub: 'Goal: 5', to: '/dashboard/workout' },
    { label: 'Avg Sleep', value: statsData.avgSleep, icon: Moon, colorClass: 'bg-lavender/15 text-lavender', sub: 'Goal: 8h', to: '/dashboard/sleep' },
    { label: 'Meals Logged', value: statsData.meals, icon: Apple, colorClass: 'bg-sage/15 text-sage', sub: 'This week', to: '/dashboard/nutrition' },
    { label: 'Co-Work Sessions', value: statsData.sessions, icon: CalendarDays, colorClass: 'bg-gold/15 text-gold', sub: 'This week', to: '/dashboard/schedule' },
  ]

  const quickActions = [
    { label: 'Log Workout', to: '/dashboard/workout', icon: Flame, colorClass: 'bg-coral/15 text-coral' },
    { label: 'Track Sleep', to: '/dashboard/sleep', icon: Moon, colorClass: 'bg-lavender/15 text-lavender' },
    { label: 'Log Meal', to: '/dashboard/nutrition', icon: Apple, colorClass: 'bg-sage/15 text-sage' },
    { label: 'Join Co-Work', to: '/dashboard/schedule', icon: CalendarDays, colorClass: 'bg-gold/15 text-gold' },
    { label: 'Community', to: '/dashboard/community', icon: Users, colorClass: 'bg-sky/15 text-sky' },
    { label: 'Settings', to: '/dashboard/settings', icon: Target, colorClass: 'bg-gray/15 text-gray' },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="heading-1 text-dark">Dashboard Overview</h1>
        <p className="body text-gray mt-1">Your work-life balance at a glance</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <Link 
            href={s.to}
            key={i} 
            className="rounded-2xl p-6 bg-white/80 backdrop-blur-xl border border-white/60 shadow-glass text-left hover:-translate-y-1 transition-all group"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${s.colorClass}`}>
              <s.icon size={24} />
            </div>
            <p className="text-3xl font-bold text-dark mb-1">{s.value}</p>
            <p className="text-sm font-medium text-gray">{s.label}</p>
            <p className="text-xs text-gray-light mt-1">{s.sub}</p>
          </Link>
        ))}
      </div>

      <div className="rounded-3xl p-8 bg-white/80 backdrop-blur-xl border border-white/60 shadow-glass">
        <h2 className="heading-4 text-dark mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map(a => (
            <Link 
              href={a.to}
              key={a.to} 
              className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-gray-50/50 hover:bg-sage/5 transition-all border border-transparent hover:border-sage/10 group"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${a.colorClass}`}>
                <a.icon size={24} />
              </div>
              <span className="text-xs font-bold text-dark uppercase tracking-wider">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
