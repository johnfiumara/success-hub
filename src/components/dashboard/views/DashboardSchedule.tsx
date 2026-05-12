"use client"

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { CalendarDays, ArrowLeft } from 'lucide-react'
import { MeetingList } from '@/components/meetings/MeetingList'
import { getMeetings } from '@/app/actions/meetings'

export default function DashboardSchedule({ workspaceId }: { workspaceId: string }) {
  const router = useRouter()
  const [meetings, setMeetings] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchMeetings() {
      try {
        const res = await getMeetings(workspaceId)
        if (res.success) {
          setMeetings(res.meetings || [])
        }
      } catch (error) {
        console.error('Failed to fetch meetings:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchMeetings()
  }, [workspaceId])

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.push('/')} className="flex items-center gap-2 text-gray hover:text-sage-dark transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gold/10">
            <CalendarDays size={20} className="text-gold" />
          </div>
          <h1 className="heading-1 text-dark">Schedule</h1>
        </div>
      </div>
      <p className="body text-gray -mt-4 ml-14">Manage your co-working schedule and meetings</p>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
        </div>
      ) : (
        <MeetingList workspaceId={workspaceId} initialMeetings={meetings} />
      )}
    </motion.div>
  )
}
