import { getLeads } from "@/actions/cms"
import { getCurrentUser } from "@/actions/auth"
import { redirect } from "next/navigation"
import { LeadsManager } from "@/components/cms/LeadsManager"

export const metadata = { title: "Leads | CMS | Success Hub" }

export default async function LeadsPage() {
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

  const leads = await getLeads()

  return <LeadsManager leads={leads} />
}
