"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface NavLinkProps {
  href: string
  children: React.ReactNode
  exact?: boolean
}

export function NavLink({ href, children, exact = false }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = exact ? pathname === href : pathname === href || pathname.startsWith(href + "/")

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
        isActive
          ? "text-sage-dark bg-sage/10"
          : "text-gray-600 hover:text-sage-dark hover:bg-sage/10"
      )}
    >
      {children}
    </Link>
  )
}
