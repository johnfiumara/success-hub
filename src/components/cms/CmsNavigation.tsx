"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileText, Users, Star, DollarSign, Settings, LayoutDashboard, Wand2 } from "lucide-react"

const navItems = [
  { href: "/cms", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/cms/visual", label: "Visual Editor", icon: Wand2 },
  { href: "/cms/posts", label: "Blog Posts", icon: FileText },
  { href: "/cms/testimonials", label: "Testimonials", icon: Star },
  { href: "/cms/team", label: "Team", icon: Users },
  { href: "/cms/pricing", label: "Pricing", icon: DollarSign },
  { href: "/cms/settings", label: "Site Settings", icon: Settings },
]

export function CmsNavigation() {
  const pathname = usePathname()

  return (
    <div className="w-48 shrink-0">
      <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-glass rounded-2xl p-3 sticky top-0">
        <p className="text-xs uppercase text-gray-400 font-semibold px-3 mb-2 tracking-wider">CMS</p>
        <nav className="space-y-0.5">
          {navItems.map(({ href, label, icon: Icon, exact }) => {
            const isActive = exact ? pathname === href : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? "bg-violet-50 text-violet-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
