"use client"

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Apple, ArrowLeft } from 'lucide-react'
import { NutritionDashboard } from '@/components/nutrition/Tracker'
import { getDailyNutrition, getUserSettings } from '@/actions/nutrition'

export default function DashboardNutrition() {
  const router = useRouter()
  const [logs, setLogs] = useState<any[]>([])
  const [settings, setSettings] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [nutritionData, userSettings] = await Promise.all([
          getDailyNutrition(new Date()),
          getUserSettings()
        ])
        setLogs(nutritionData)
        setSettings(userSettings)
      } catch (error) {
        console.error('Failed to fetch nutrition data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 text-gray hover:text-sage-dark transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-sage/10">
            <Apple size={20} className="text-sage" />
          </div>
          <h1 className="heading-1 text-dark">Nutrition Tracker</h1>
        </div>
      </div>
      <p className="body text-gray -mt-4 ml-14">Track meals and nutrition goals</p>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage"></div>
        </div>
      ) : (
        <NutritionDashboard logs={logs} settings={settings} />
      )}
    </motion.div>
  )
}

