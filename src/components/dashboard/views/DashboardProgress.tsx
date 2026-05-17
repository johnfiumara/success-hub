"use client"

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { BarChart3, ArrowLeft, Flame, Moon, Apple, CalendarDays, Users, ChevronRight, TrendingUp } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts'

interface ProgressData {
  date: string
  calories: number
  sleepDuration: number
  tasksCompleted: number
}

interface DashboardProgressProps {
  initialData: ProgressData[]
}

export default function DashboardProgress({ initialData }: DashboardProgressProps) {
  const router = useRouter()

  const links = [
    { label: 'Workout Planner', to: '/dashboard/workout', icon: Flame, color: 'coral' },
    { label: 'Sleep Tracker', to: '/dashboard/sleep', icon: Moon, color: 'lavender' },
    { label: 'Nutrition', to: '/dashboard/nutrition', icon: Apple, color: 'sage' },
    { label: 'Schedule', to: '/dashboard/schedule', icon: CalendarDays, color: 'gold' },
    { label: 'Community', to: '/dashboard/community', icon: Users, color: 'sky' },
  ]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 backdrop-blur-md border border-white/60 shadow-glass p-3 rounded-xl">
          <p className="text-sm font-semibold text-dark mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: <span className="font-medium">{entry.value.toFixed(1)}</span>
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 text-gray hover:text-sage-dark transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-sage/10">
            <BarChart3 size={20} className="text-sage" />
          </div>
          <h1 className="heading-1 text-dark">Progress & Analytics</h1>
        </div>
      </div>
      <p className="body text-gray -mt-4 ml-14">Track your growth and consistency over the last 7 days.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Charts Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Sleep & Nutrition Trend */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="rounded-2xl p-6 bg-white/80 backdrop-blur-xl border border-white/60 shadow-glass"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="heading-4 text-dark flex items-center gap-2">
                <TrendingUp size={20} className="text-lavender" />
                Wellness Trends
              </h2>
            </div>
            
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={initialData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSleep" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#A8A4CE" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#A8A4CE" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9ABF80" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#9ABF80" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Area yAxisId="left" type="monotone" dataKey="sleepDuration" name="Sleep (Hours)" stroke="#A8A4CE" strokeWidth={3} fillOpacity={1} fill="url(#colorSleep)" />
                  <Area yAxisId="right" type="monotone" dataKey="calories" name="Calories (kcal)" stroke="#9ABF80" strokeWidth={3} fillOpacity={1} fill="url(#colorCalories)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Productivity / Tasks */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="rounded-2xl p-6 bg-white/80 backdrop-blur-xl border border-white/60 shadow-glass"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="heading-4 text-dark flex items-center gap-2">
                <CalendarDays size={20} className="text-gold" />
                Productivity (Tasks Completed)
              </h2>
            </div>
            
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={initialData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} allowDecimals={false} />
                  <Tooltip cursor={{ fill: 'rgba(243, 244, 246, 0.5)' }} content={<CustomTooltip />} />
                  <Bar dataKey="tasksCompleted" name="Tasks Done" fill="#E8C37D" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          {/* Quick Links */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="rounded-2xl p-6 bg-white/80 backdrop-blur-xl border border-white/60 shadow-glass"
          >
            <h3 className="heading-4 text-dark mb-4">Quick Links</h3>
            <div className="space-y-2">
              {links.map(link => (
                <button key={link.to} onClick={() => router.push(link.to)} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-sage/5 transition-colors text-left group">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${link.color}/15 group-hover:scale-110 transition-transform`}>
                    <link.icon size={16} className={`text-${link.color}`} />
                  </div>
                  <span className="text-sm font-medium text-dark flex-1">{link.label}</span>
                  <ChevronRight size={14} className="text-gray group-hover:translate-x-1 transition-transform" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Weekly Summary Widget */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
            className="rounded-2xl p-6 bg-gradient-to-br from-sage/20 to-sky/20 backdrop-blur-xl border border-white/60 shadow-glass"
          >
            <h3 className="heading-4 text-dark mb-2">Weekly Summary</h3>
            <p className="text-sm text-gray mb-4">You've been consistent. Keep up the great work!</p>
            
            <div className="space-y-4">
              <div className="bg-white/60 rounded-xl p-3 flex justify-between items-center">
                <span className="text-sm text-gray">Avg Sleep</span>
                <span className="font-semibold text-dark">
                  {initialData.length > 0 
                    ? (initialData.reduce((acc, d) => acc + d.sleepDuration, 0) / initialData.filter(d => d.sleepDuration > 0).length || 1).toFixed(1) 
                    : 0}h
                </span>
              </div>
              <div className="bg-white/60 rounded-xl p-3 flex justify-between items-center">
                <span className="text-sm text-gray">Total Tasks</span>
                <span className="font-semibold text-dark">
                  {initialData.reduce((acc, d) => acc + d.tasksCompleted, 0)}
                </span>
              </div>
              <div className="bg-white/60 rounded-xl p-3 flex justify-between items-center">
                <span className="text-sm text-gray">Avg Calories</span>
                <span className="font-semibold text-dark">
                  {initialData.length > 0 
                    ? Math.round(initialData.reduce((acc, d) => acc + d.calories, 0) / initialData.filter(d => d.calories > 0).length || 1) 
                    : 0} kcal
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
