"use client"

import { formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function ActivityFeed({ activities }: { activities: any[] }) {
  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-glass rounded-2xl p-6">
      <h3 className="heading-4 text-dark mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.length === 0 && (
          <p className="text-gray-500 text-sm italic">No recent activity.</p>
        )}
        {activities.map(activity => (
          <div key={activity.id} className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={activity.user.image} />
              <AvatarFallback className="bg-sage/20 text-sage-dark text-xs">
                {activity.user.name?.substring(0, 2).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <p className="text-sm text-dark">
                <span className="font-medium">{activity.user.name}</span> {activity.description}
              </p>
              <p className="text-xs text-gray-400">
                {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
