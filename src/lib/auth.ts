import { SignJWT, jwtVerify, type JWTPayload } from 'jose'
import { cookies } from 'next/headers'

const secretKey = process.env.JWT_SECRET || 'my-super-secret-jwt-key-2026'
const key = new TextEncoder().encode(secretKey)

export interface SessionPayload extends JWTPayload {
  userId: string
  workspaceId?: string
  email?: string
  name?: string
}

export async function encrypt(payload: SessionPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(key)
}

export async function decrypt(input: string): Promise<SessionPayload> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  })
  return payload as SessionPayload
}

export async function getAuthSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value
  if (!token) return null

  try {
    const payload = await decrypt(token)
    return {
      user: {
        id: payload.userId,
        email: payload.email,
        name: payload.name,
      },
      workspaceId: payload.workspaceId
    }
  } catch {
    return null
  }
}
