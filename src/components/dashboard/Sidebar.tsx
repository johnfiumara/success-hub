import Link from "next/link"
import { Home, CheckSquare, Settings, LogOut, Flame, Apple } from "lucide-react"
import { getCurrentUser, logout } from "@/app/actions/auth"

export async function Sidebar() {
  const context = await getCurrentUser()
  if (!context) return null
  const { user, workspaceId } = context

  // Fetch workspace details for display
  const prisma = (await import("@/lib/prisma")).default
  const workspace = await prisma.workspace.findUnique({ where: { id: workspaceId } })


  return (
    <div className="w-64 bg-white/80 backdrop-blur-xl border-r border-white/60 shadow-glass flex flex-col h-full">
      <div className="p-6 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-sage flex items-center justify-center text-white">
          <Flame size={18} />
        </div>
        <span className="font-bold text-dark text-lg">Success Hub</span>
      </div>

      <div className="px-4 py-2">
        <div className="text-xs uppercase text-gray-400 font-semibold mb-2 px-2">Workspace</div>
        <div className="px-2 py-1.5 text-sm font-medium text-dark bg-gray-50 rounded-md truncate">
          {workspace?.name || 'Personal Workspace'}
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        <Link href="/" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-600 hover:text-sage-dark hover:bg-sage/10 transition-colors">
          <Home size={18} /> Overview
        </Link>
        <Link href="/nutrition" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-600 hover:text-sage-dark hover:bg-sage/10 transition-colors">
          <Apple size={18} /> Nutrition
        </Link>
        <Link href="/tasks" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-sage-dark bg-sage/10 transition-colors">
          <CheckSquare size={18} /> Tasks & Habits
        </Link>
        <Link href="/settings" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-600 hover:text-sage-dark hover:bg-sage/10 transition-colors">
          <Settings size={18} /> Settings
        </Link>
      </nav>

      <div className="p-4 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-sage/20 flex items-center justify-center text-sage-dark font-medium text-sm">
            {user?.name?.substring(0, 2).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-dark truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <form action={logout}>
          <button type="submit" className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50">
            <LogOut size={16} />
          </button>
        </form>
      </div>
    </div>
  )
}
