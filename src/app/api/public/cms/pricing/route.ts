import { NextRequest } from "next/server"
import { getPricingPlans } from "@/actions/cms"
import { preflight, withCors } from "@/lib/cors"

export function OPTIONS(request: NextRequest) {
  return preflight(request)
}

export async function GET(request: NextRequest) {
  const plans = await getPricingPlans()
  return withCors(request, { plans })
}
