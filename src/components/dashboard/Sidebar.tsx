import Link from "next/link"
import { Home, CheckSquare, Settings, LogOut, Flame, Apple, Moon, Video, Users, LayoutDashboard } from "lucide-react"
import { getCurrentUser, logout } from "@/actions/auth"
import prisma from "@/lib/prisma"

export async function Sidebar() {
  const context = await getCurrentUser()
  if (!context) return null
  const { user, workspaceId } = context

  const workspace = await prisma.workspace.findUnique({ where: { id: workspaceId } })
  const membership = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId: user.id } }
  })
  const isOwner = membership?.role === "OWNER"

  return (
    <div className="w-64 bg-white/80 backdrop-blur-xl border-r border-white/60 shadow-glass flex flex-col h-full">
      <div className="p-6 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-sage flex items-center justify-center text-white">
          <Flame size={18} />
        </div>
        <span className="font-bold text-dark text-lg">Success Hub</span>
      </div>

      <div className="px-4 py-2">
        <div className="text-xs uppercase text-gray/50 font-semibold mb-2 px-2">Workspace</div>
        <div className="px-2 py-1.5 text-sm font-medium text-dark bg-cream-dark rounded-md truncate">
          {workspace?.name || "Personal Workspace"}
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        <NavItem href="/" exact icon={<Home size={18} />}>Overview</NavItem>
        <NavItem href="/nutrition" icon={<Apple size={18} />}>Nutrition</NavItem>
        <NavItem href="/tasks" icon={<CheckSquare size={18} />}>Tasks & Habits</NavItem>
        <NavItem href="/sleep" icon={<Moon size={18} />}>Sleep</NavItem>
        <NavItem href="/community" icon={<Users size={18} />}>Community</NavItem>
        <NavItem href="/meetings" icon={<Video size={18} />}>Meetings</NavItem>
        <NavItem href="/settings" icon={<Settings size={18} />}>Settings</NavItem>

        {isOwner && (
          <>
            <div className="px-3 pt-3 pb-1">
              <p className="text-xs uppercase text-gray/50 font-semibold tracking-wider">Admin</p>
            </div>
            <NavItem href="/cms" icon={<LayoutDashboard size={18} />}>CMS</NavItem>
          </>
        )}
      </nav>

      <div className="p-4 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-sage/20 flex items-center justify-center text-sage-dark font-medium text-sm">
            {user?.name?.substring(0, 2).toUpperCase() || "U"}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-dark truncate">{user?.name}</p>
            <p className="text-xs text-gray/70 truncate">{user?.email}</p>
          </div>
        </div>
        <form action={logout}>
          <button type="submit" className="p-2 text-gray/50 hover:text-coral transition-colors rounded-lg hover:bg-coral/10">
            <LogOut size={16} />
          </button>
        </form>
      </div>
    </div>
  )
}

function NavItem({ href, icon, children, exact }: { href: string; icon: React.ReactNode; children: React.ReactNode; exact?: boolean }) {
  return (
    <Link href={href} className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-gray hover:text-dark hover:bg-sage/10 transition-colors">
      {icon} {children}
    </Link>
  )
}
