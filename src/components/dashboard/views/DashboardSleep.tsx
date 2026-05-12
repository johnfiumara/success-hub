"use client"

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Moon, ArrowLeft } from 'lucide-react'
import { SleepTracker } from '@/components/sleep/Tracker'
import { getSleepLogs } from '@/actions/sleep'

export default function DashboardSleep() {
  const router = useRouter()
  const [logs, setLogs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchLogs() {
      try {
        const data = await getSleepLogs(30)
        setLogs(data)
      } catch (error) {
        console.error('Failed to fetch sleep logs:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchLogs()
  }, [])

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 text-gray hover:text-sage-dark transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-50">
            <Moon size={20} className="text-indigo-500" />
          </div>
          <h1 className="heading-1 text-dark">Sleep Tracker</h1>
        </div>
      </div>
      <p className="body text-gray -mt-4 ml-14">Monitor sleep patterns and quality</p>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <SleepTracker logs={logs} />
      )}
    </motion.div>
  )
}

