import { NextRequest } from "next/server"
import { getTestimonials } from "@/actions/cms"
import { preflight, withCors } from "@/lib/cors"

export function OPTIONS(request: NextRequest) {
  return preflight(request)
}

export async function GET(request: NextRequest) {
  const all = await getTestimonials()
  const published = all.filter((t) => t.published)
  return withCors(request, { testimonials: published })
}
