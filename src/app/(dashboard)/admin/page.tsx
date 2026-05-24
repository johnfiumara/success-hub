import { getCurrentUser } from "@/actions/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Users, Settings, BarChart3, FileText } from "lucide-react"

export const metadata = { title: "Admin | Success Hub" }

export default async function AdminPage() {
  const context = await getCurrentUser()
  if (!context) redirect("/login")

  // Check if user is owner
  const prisma = (await import("@/lib/prisma")).default
  const membership = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId: context.workspaceId!, userId: context.user.id } }
  })
  
  if (!membership || membership.role !== "OWNER") {
    redirect("/")
  }

  const adminFeatures = [
    {
      title: "User Management",
      description: "Manage workspace members and their permissions",
      href: "/admin/users",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      title: "Content Management",
      description: "Edit blog posts, testimonials, pricing, and team",
      href: "/cms",
      icon: FileText,
      color: "text-violet-600",
      bg: "bg-violet-50"
    },
    {
      title: "Site Settings",
      description: "Configure global site information and metadata",
      href: "/cms/settings",
      icon: Settings,
      color: "text-gray-600",
      bg: "bg-gray-50"
    },
    {
      title: "Analytics",
      description: "View workspace activity and metrics",
      href: "/admin/analytics",
      icon: BarChart3,
      color: "text-green-600",
      bg: "bg-green-50"
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-dark tracking-tight">Admin Panel</h1>
        <p className="text-gray-500 mt-1">Manage your workspace, users, and content.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {adminFeatures.map(({ title, description, href, icon: Icon, color, bg }) => (
          <Link
            key={href}
            href={href}
            className="group bg-white/80 backdrop-blur-xl border border-white/60 shadow-glass rounded-2xl p-6 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center mb-4`}>
              <Icon size={24} className={color} />
            </div>
            <h3 className="font-semibold text-dark text-lg">{title}</h3>
            <p className="text-gray-500 text-sm mt-1">{description}</p>
            <div className="mt-4 flex items-center text-sm font-medium text-sage group-hover:text-sage-dark transition-colors">
              Manage →
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
