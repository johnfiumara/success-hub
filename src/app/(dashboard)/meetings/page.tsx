import { getCurrentUser } from "@/actions/auth"
import { redirect } from "next/navigation"
import { getMeetings } from "@/app/actions/meetings"
import { MeetingList } from "@/components/meetings/MeetingList"

export const metadata = {
  title: "Video Meetings | Success Hub",
}

export default async function MeetingsPage() {
  const context = await getCurrentUser()
  if (!context || !context.workspaceId) redirect("/dashboard")

  const res = await getMeetings(context.workspaceId)

  return (
    <div className="flex flex-col h-full gap-6">
      <div>
        <h1 className="text-3xl font-bold text-dark tracking-tight">Video Meetings</h1>
        <p className="text-gray-500 mt-1">Connect with your team in real-time with high-quality video calls.</p>
      </div>

      <MeetingList 
        workspaceId={context.workspaceId} 
        initialMeetings={(res.success ? (res.meetings || []) : []) as any} 
      />
    </div>
  )
}
