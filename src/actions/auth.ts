"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { encrypt, decrypt } from "@/lib/auth"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"

const isProduction = process.env.NODE_ENV === "production"

export async function login(prevState: any, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: { workspaces: { include: { workspace: true } } },
  })

  if (!user || !user.passwordHash) {
    return { error: "Invalid credentials" }
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash)

  if (!isValidPassword) {
    return { error: "Invalid credentials" }
  }

  const defaultWorkspaceId = user.workspaces[0]?.workspaceId

  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
  const session = await encrypt({ userId: user.id, workspaceId: defaultWorkspaceId, expires })

  const cookieStore = await cookies()
  cookieStore.set("session", session, {
    expires,
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
  })

  redirect("/tasks")
}

export async function signup(prevState: any, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("name") as string

  if (!email || !password || !name) {
    return { error: "All fields are required" }
  }

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    return { error: "User already exists" }
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
      workspaces: {
        create: {
          role: "OWNER",
          workspace: {
            create: {
              name: "Personal Workspace",
              description: "My private workspace",
            },
          },
        },
      },
    },
    include: { workspaces: true },
  })

  const defaultWorkspaceId = user.workspaces[0].workspaceId

  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
  const session = await encrypt({ userId: user.id, workspaceId: defaultWorkspaceId, expires })

  const cookieStore = await cookies()
  cookieStore.set("session", session, {
    expires,
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
  })

  redirect("/tasks")
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
  redirect("/login")
}

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const session = cookieStore.get("session")?.value
  if (!session) return null

  try {
    const parsed = await decrypt(session)
    const user = await prisma.user.findUnique({ where: { id: parsed.userId } })
    if (!user) return null
    return { user, workspaceId: parsed.workspaceId }
  } catch {
    return null
  }
}
