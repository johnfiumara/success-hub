import { getAudit } from "@/actions/audit"
import { redirect } from "next/navigation"
import DashboardAudit from "@/components/dashboard/views/DashboardAudit"

export const metadata = { title: "Audit | Success Hub" }

export default async function AuditPage() {
  const context = await getAudit()
  if (!context) {
    redirect("/audit-onboarding")
  }

  return <DashboardAudit />
}
