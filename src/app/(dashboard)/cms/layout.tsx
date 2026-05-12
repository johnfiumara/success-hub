import { getCurrentUser } from "@/actions/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { CmsNavigation } from "@/components/cms/CmsNavigation"

export default async function CmsLayout({ children }: { children: React.ReactNode }) {
  const context = await getCurrentUser()
  if (!context) redirect("/login")

  const membership = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId: context.workspaceId, userId: context.user.id } }
  })

  if (!membership || membership.role !== "OWNER") redirect("/")

  return (
    <div className="flex gap-6 h-full">
      <CmsNavigation />
      <div className="flex-1 min-w-0 overflow-y-auto">
        {children}
      </div>
    </div>
  )
}
