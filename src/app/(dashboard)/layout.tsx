import { Sidebar } from "@/components/dashboard/Sidebar"
import { getCurrentUser } from "@/actions/auth"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const context = await getCurrentUser()
  if (!context) {
    redirect("/login")
  }
  
  if (!context.user.onboarded) {
    redirect("/onboarding")
  }

  return (
    <div className="flex h-screen bg-cream overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  )
}
