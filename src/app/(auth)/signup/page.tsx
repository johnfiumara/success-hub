import prisma from "@/lib/prisma"
import SignupForm from "./SignupForm"

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ lead?: string }>
}) {
  const { lead } = await searchParams

  let defaultEmail: string | undefined
  let defaultName: string | undefined
  let leadToken: string | null = null

  if (lead) {
    const leadRow = await prisma.lead.findUnique({ where: { token: lead } })
    if (leadRow && !leadRow.consumedAt) {
      defaultEmail = leadRow.email
      defaultName = leadRow.name ?? undefined
      leadToken = leadRow.token
    }
  }

  return (
    <SignupForm
      defaultEmail={defaultEmail}
      defaultName={defaultName}
      leadToken={leadToken}
    />
  )
}
