import { NextResponse } from "next/server"

function allowedOrigins(): string[] {
  const raw = process.env.MARKETING_ORIGINS ?? "http://localhost:5173"
  return raw.split(",").map((s) => s.trim()).filter(Boolean)
}

export function pickOrigin(request: Request): string | null {
  const origin = request.headers.get("origin")
  if (!origin) return null
  return allowedOrigins().includes(origin) ? origin : null
}

export function corsHeaders(origin: string | null): HeadersInit {
  if (!origin) return {}
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  }
}

export function preflight(request: Request): NextResponse {
  const origin = pickOrigin(request)
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) })
}

export function withCors(request: Request, body: unknown, init: ResponseInit = {}): NextResponse {
  const origin = pickOrigin(request)
  return NextResponse.json(body, {
    ...init,
    headers: { ...(init.headers ?? {}), ...corsHeaders(origin) },
  })
}
