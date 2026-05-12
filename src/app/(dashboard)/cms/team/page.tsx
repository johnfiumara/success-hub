import { getTeamMembers } from "@/actions/cms"
import { TeamManager } from "@/components/cms/TeamManager"
export const metadata = { title: "Team | CMS | Success Hub" }
export default async function TeamPage() {
  const members = await getTeamMembers()
  return <TeamManager members={members} />
}
