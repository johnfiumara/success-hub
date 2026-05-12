import { getCurrentUser } from "@/actions/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"

export default async function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const context = await getCurrentUser()
  if (!context) {
    redirect("/login")
  }
  
  // If already onboarded, redirect to dashboard
  const user = await prisma.user.findUnique({ where: { id: context.user.id } })
  if (user?.onboarded) {
    redirect("/")
  }

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-cream p-4">
      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-glass rounded-3xl p-8 md:p-12">
        {children}
      </div>
    </div>
  )
}
