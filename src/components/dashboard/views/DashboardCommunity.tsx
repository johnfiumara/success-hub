import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Users, ArrowLeft, Flame, Moon, Apple, CalendarDays, ChevronRight } from 'lucide-react'

export default function DashboardCommunity() {
  const router = useRouter()

  const links = [
    { label: 'Workout Planner', to: '/dashboard/workout', icon: Flame, color: 'coral' },
    { label: 'Sleep Tracker', to: '/dashboard/sleep', icon: Moon, color: 'lavender' },
    { label: 'Nutrition', to: '/dashboard/nutrition', icon: Apple, color: 'sage' },
    { label: 'Schedule', to: '/dashboard/schedule', icon: CalendarDays, color: 'gold' },
    { label: 'Community', to: '/dashboard/community', icon: Users, color: 'sky' },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 text-gray hover:text-sage-dark transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-sage/10">
            <Users size={20} className="text-sage" />
          </div>
          <h1 className="heading-1 text-dark">Community</h1>
        </div>
      </div>
      <p className="body text-gray -mt-4 ml-14">Connect with other members</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl p-6 bg-white/80 backdrop-blur-xl border border-white/60 shadow-glass">
          <h2 className="heading-4 text-dark mb-4">Coming Soon</h2>
          <p className="text-body text-gray">This section is being built. Check back soon for the full Community experience.</p>
        </div>
        <div className="rounded-2xl p-6 bg-white/80 backdrop-blur-xl border border-white/60 shadow-glass">
          <h3 className="heading-4 text-dark mb-4">Quick Links</h3>
          <div className="space-y-2">
            {links.map(link => (
              <button key={link.to} onClick={() => router.push(link.to)} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-sage/5 transition-colors text-left">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${link.color}/15`}>
                  <link.icon size={16} className={`text-${link.color}`} />
                </div>
                <span className="text-sm text-dark flex-1">{link.label}</span>
                <ChevronRight size={14} className="text-gray" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

