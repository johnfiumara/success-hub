"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"
import { getCurrentUser } from "./auth"

// Helper: verify the current user is an OWNER of their workspace
async function requireOwner() {
  const context = await getCurrentUser()
  if (!context) throw new Error("Unauthorized")

  if (!context.workspaceId) throw new Error("Unauthorized: No workspace selected")

  const membership = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId: context.workspaceId, userId: context.user.id } }
  })
  if (!membership || membership.role !== "OWNER") throw new Error("Forbidden: owner access required")

  return context
}

// ─── Slug helper ────────────────────────────────────────────────────────────
export async function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

// ─── Posts ───────────────────────────────────────────────────────────────────
export async function getPosts() {
  await requireOwner()
  return prisma.post.findMany({ orderBy: { createdAt: "desc" }, include: { author: { select: { name: true } } } })
}

export async function getPost(id: string) {
  await requireOwner()
  return prisma.post.findUnique({ where: { id }, include: { author: { select: { name: true } } } })
}

export async function createPost(data: { title: string; slug: string; body: string; excerpt?: string; coverImage?: string; status: string }) {
  const ctx = await requireOwner()
  const post = await prisma.post.create({
    data: { ...data, authorId: ctx.user.id }
  })
  revalidatePath("/cms/posts")
  return post
}

export async function updatePost(id: string, data: { title?: string; slug?: string; body?: string; excerpt?: string; coverImage?: string; status?: string }) {
  await requireOwner()
  const post = await prisma.post.update({ where: { id }, data })
  revalidatePath("/cms/posts")
  revalidatePath(`/cms/posts/${id}`)
  return post
}

export async function deletePost(id: string) {
  await requireOwner()
  await prisma.post.delete({ where: { id } })
  revalidatePath("/cms/posts")
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
export async function getTestimonials() {
  await requireOwner()
  return prisma.testimonial.findMany({ orderBy: { createdAt: "asc" } })
}

export async function createTestimonial(data: { name: string; role: string; company?: string; content: string; image?: string; rating?: number; published?: boolean }) {
  await requireOwner()
  const t = await prisma.testimonial.create({ data })
  revalidatePath("/cms/testimonials")
  return t
}

export async function updateTestimonial(id: string, data: { name?: string; role?: string; company?: string; content?: string; image?: string; rating?: number; published?: boolean }) {
  await requireOwner()
  const t = await prisma.testimonial.update({ where: { id }, data })
  revalidatePath("/cms/testimonials")
  return t
}

export async function deleteTestimonial(id: string) {
  await requireOwner()
  await prisma.testimonial.delete({ where: { id } })
  revalidatePath("/cms/testimonials")
}

// ─── Team Members ─────────────────────────────────────────────────────────────
export async function getTeamMembers() {
  await requireOwner()
  return prisma.teamMember.findMany({ orderBy: { order: "asc" } })
}

export async function createTeamMember(data: { name: string; role: string; bio?: string; image?: string; order?: number }) {
  await requireOwner()
  const m = await prisma.teamMember.create({ data })
  revalidatePath("/cms/team")
  return m
}

export async function updateTeamMember(id: string, data: { name?: string; role?: string; bio?: string; image?: string; order?: number }) {
  await requireOwner()
  const m = await prisma.teamMember.update({ where: { id }, data })
  revalidatePath("/cms/team")
  return m
}

export async function deleteTeamMember(id: string) {
  await requireOwner()
  await prisma.teamMember.delete({ where: { id } })
  revalidatePath("/cms/team")
}

// ─── Pricing Plans ────────────────────────────────────────────────────────────
export async function getPricingPlans() {
  await requireOwner()
  return prisma.pricingPlan.findMany({ orderBy: { createdAt: "asc" } })
}

export async function createPricingPlan(data: { name: string; price: string; interval: string; features: string[]; description?: string; isPopular?: boolean }) {
  await requireOwner()
  const p = await prisma.pricingPlan.create({ data })
  revalidatePath("/cms/pricing")
  return p
}

export async function updatePricingPlan(id: string, data: { name?: string; price?: string; interval?: string; features?: string[]; description?: string; isPopular?: boolean }) {
  await requireOwner()
  const p = await prisma.pricingPlan.update({ where: { id }, data })
  revalidatePath("/cms/pricing")
  return p
}

export async function deletePricingPlan(id: string) {
  await requireOwner()
  await prisma.pricingPlan.delete({ where: { id } })
  revalidatePath("/cms/pricing")
}

// ─── Site Settings ─────────────────────────────────────────────────────────────
export async function getSiteSettings() {
  const context = await getCurrentUser()
  if (!context) return {} // Allow public access to settings if needed for landing page

  const settings = await prisma.siteSetting.findMany()
  return Object.fromEntries(settings.map(s => [s.key, s.value]))
}

export async function upsertSiteSetting(key: string, value: string) {
  await requireOwner()
  await prisma.siteSetting.upsert({ where: { key }, update: { value }, create: { key, value } })
  revalidatePath("/cms/settings")
  revalidatePath("/") // Revalidate home for settings changes
}

export async function bulkUpsertSiteSettings(settings: Record<string, string>) {
  await requireOwner()
  await Promise.all(
    Object.entries(settings).map(([key, value]) =>
      prisma.siteSetting.upsert({ where: { key }, update: { value }, create: { key, value } })
    )
  )
  revalidatePath("/cms/settings")
  revalidatePath("/")
}

// ─── Leads ────────────────────────────────────────────────────────────────────
export async function getLeads() {
  await requireOwner()
  return prisma.lead.findMany({ orderBy: { createdAt: "desc" } })
}

export async function deleteLead(id: string) {
  await requireOwner()
  await prisma.lead.delete({ where: { id } })
  revalidatePath("/cms/leads")
}

export async function convertLead(id: string) {
  await requireOwner()
  await prisma.lead.update({ where: { id }, data: { consumedAt: new Date() } })
  revalidatePath("/cms/leads")
}
