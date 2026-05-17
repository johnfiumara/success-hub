"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface NavItemProps {
  href: string
  icon: React.ReactNode
  children: React.ReactNode
  exact?: boolean
}

export function NavItem({ href, icon, children, exact }: NavItemProps) {
  const pathname = usePathname()
  
  const isActive = exact 
    ? pathname === href 
    : pathname.startsWith(href) && (href !== "/" || pathname === "/")

  return (
    <Link 
      href={href} 
      className={cn(
        "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group",
        isActive 
          ? "bg-sage text-white shadow-md shadow-sage/20" 
          : "text-gray hover:text-dark hover:bg-sage/10"
      )}
    >
      <span className={cn(
        "transition-colors",
        isActive ? "text-white" : "text-gray/70 group-hover:text-sage"
      )}>
        {icon}
      </span>
      <span>{children}</span>
      {isActive && (
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
      )}
    </Link>
  )
}
