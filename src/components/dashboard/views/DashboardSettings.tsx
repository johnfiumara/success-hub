import { getCurrentUser } from '@/actions/auth'
import { getUserSettings } from '@/actions/nutrition'
import { SettingsForm } from '../SettingsForm'
import { Settings, Flame, Moon, Apple, CalendarDays, Users, Target } from 'lucide-react'

import { EmailIntegrationForm } from '../EmailIntegrationForm'
import { getEmailIntegration } from '@/actions/email'

export default async function DashboardSettings() {
  const context = await getCurrentUser()
  const user = context?.user
  const settings = await getUserSettings()
  const emailIntegration = await getEmailIntegration()

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-sage/10 text-sage shadow-inner shadow-sage/5">
          <Settings size={24} />
        </div>
        <div>
          <h1 className="heading-1 text-dark">Settings</h1>
          <p className="text-body text-gray">Manage your account and goals</p>
        </div>
      </div>

      <div className="rounded-2xl p-8 bg-white/80 backdrop-blur-xl border border-white/60 shadow-glass mb-8 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-sage/5 rounded-full -mr-16 -mt-16 blur-2xl" />
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-20 h-20 rounded-3xl bg-sage-light flex items-center justify-center text-3xl font-bold text-sage shadow-lg shadow-sage/10">
            {user?.name?.[0] || 'U'}
          </div>
          <div>
            <h2 className="heading-3 text-dark mb-1">{user?.name}</h2>
            <p className="text-body text-gray font-medium">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-3 py-1 rounded-full bg-sage/10 text-sage text-xs font-bold uppercase tracking-wider">Premium Member</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SettingsForm initialSettings={settings} />
          <EmailIntegrationForm integration={emailIntegration} />
        </div>
        
        <div className="space-y-6">
          <div className="rounded-2xl p-6 bg-sage text-white shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Target size={20} />
              <h3 className="font-semibold">Goal Tracking</h3>
            </div>
            <p className="text-sm text-sage-light leading-relaxed">
              Your daily goals help Success Hub provide personalized recommendations and tracking.
            </p>
          </div>

          <div className="rounded-2xl p-6 bg-white/80 backdrop-blur-xl border border-white/60 shadow-glass">
            <h3 className="heading-4 text-dark mb-4">Quick Links</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-sage/5 transition-colors text-left">
                <div className="w-8 h-8 rounded-lg bg-coral/15 flex items-center justify-center">
                  <Flame size={16} className="text-coral" />
                </div>
                <span className="text-sm text-dark">Workout Planner</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-sage/5 transition-colors text-left">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <Moon size={16} className="text-indigo-500" />
                </div>
                <span className="text-sm text-dark">Sleep Tracker</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

