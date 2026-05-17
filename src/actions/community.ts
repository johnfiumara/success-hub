"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"
import { getCurrentUser } from "./auth"

async function getContext() {
  const context = await getCurrentUser()
  if (!context || !context.workspaceId) return null

  const member = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId: context.workspaceId, userId: context.user.id } }
  })

  return { ...context, workspaceId: context.workspaceId, role: member?.role ?? "MEMBER" }
}

export async function getCommunityPosts() {
  const context = await getContext()
  if (!context) return []

  return await prisma.communityPost.findMany({
    where: { workspaceId: context.workspaceId },
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: { id: true, name: true, image: true } },
      _count: { select: { comments: true, likes: true } },
      likes: { where: { userId: context.user.id }, select: { id: true } }
    }
  })
}

export async function getCommunityPost(postId: string) {
  const context = await getContext()
  if (!context) return null

  return await prisma.communityPost.findUnique({
    where: { id: postId, workspaceId: context.workspaceId },
    include: {
      author: { select: { id: true, name: true, image: true } },
      comments: {
        orderBy: { createdAt: 'asc' },
        include: {
          author: { select: { id: true, name: true, image: true } }
        }
      },
      _count: { select: { likes: true } },
      likes: { where: { userId: context.user.id }, select: { id: true } }
    }
  })
}

export async function createCommunityPost(data: { title: string; content: string }) {
  const context = await getContext()
  if (!context) throw new Error("Unauthorized")
  if (context.role === "GUEST") throw new Error("Guests cannot create posts")

  const post = await prisma.communityPost.create({
    data: {
      title: data.title,
      content: data.content,
      workspaceId: context.workspaceId,
      authorId: context.user.id,
    }
  })

  await prisma.activity.create({
    data: {
      type: 'COMMUNITY_POST_CREATED',
      description: `Posted "${post.title}"`,
      workspaceId: context.workspaceId,
      userId: context.user.id
    }
  })

  revalidatePath('/community')
  return post
}

export async function deleteCommunityPost(postId: string) {
  const context = await getContext()
  if (!context) throw new Error("Unauthorized")

  const post = await prisma.communityPost.findUnique({ where: { id: postId } })
  if (!post || post.workspaceId !== context.workspaceId) throw new Error("Not found")
  if (post.authorId !== context.user.id && context.role !== "ADMIN" && context.role !== "OWNER") {
    throw new Error("Unauthorized")
  }

  await prisma.communityPost.delete({ where: { id: postId } })
  revalidatePath('/community')
}

export async function createCommunityComment(postId: string, content: string) {
  const context = await getContext()
  if (!context) throw new Error("Unauthorized")
  if (context.role === "GUEST") throw new Error("Guests cannot comment")

  const comment = await prisma.communityComment.create({
    data: { content, postId, authorId: context.user.id }
  })

  revalidatePath(`/community/${postId}`)
  revalidatePath('/community')
  return comment
}

export async function deleteCommunityComment(commentId: string) {
  const context = await getContext()
  if (!context) throw new Error("Unauthorized")

  const comment = await prisma.communityComment.findUnique({
    where: { id: commentId },
    include: { post: true }
  })

  if (!comment || comment.post.workspaceId !== context.workspaceId) throw new Error("Not found")
  if (comment.authorId !== context.user.id && context.role !== "ADMIN" && context.role !== "OWNER") {
    throw new Error("Unauthorized")
  }

  await prisma.communityComment.delete({ where: { id: commentId } })
  revalidatePath(`/community/${comment.postId}`)
  revalidatePath('/community')
}

export async function toggleCommunityLike(postId: string) {
  const context = await getContext()
  if (!context) throw new Error("Unauthorized")
  if (context.role === "GUEST") throw new Error("Guests cannot like posts")

  const existingLike = await prisma.communityLike.findUnique({
    where: { postId_userId: { postId, userId: context.user.id } }
  })

  if (existingLike) {
    await prisma.communityLike.delete({ where: { id: existingLike.id } })
  } else {
    await prisma.communityLike.create({ data: { postId, userId: context.user.id } })
  }

  revalidatePath(`/community/${postId}`)
  revalidatePath('/community')
}
