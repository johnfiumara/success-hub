import { NextRequest } from "next/server"
import { getTeamMembers } from "@/actions/cms"
import { preflight, withCors } from "@/lib/cors"

export function OPTIONS(request: NextRequest) {
  return preflight(request)
}

export async function GET(request: NextRequest) {
  const members = await getTeamMembers()
  return withCors(request, { team: members })
}
