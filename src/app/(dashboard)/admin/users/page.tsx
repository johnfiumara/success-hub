import { getWorkspaceUsers } from "@/actions/admin"
import { getCurrentUser } from "@/actions/auth"
import { redirect } from "next/navigation"
import { UserManagementManager } from "@/components/admin/UserManagementManager"

export const metadata = { title: "User Management | Admin | Success Hub" }

export default async function UserManagementPage() {
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

  const users = await getWorkspaceUsers(context.workspaceId!)

  return <UserManagementManager users={users} />
}
