"use client"

import { useState } from "react"
import { Users, Plus, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PostCard } from "./PostCard"
import { CreatePostModal } from "./CreatePostModal"

type Post = {
  id: string
  title: string
  content: string
  createdAt: Date | string
  author: { id: string; name: string | null; image: string | null }
  _count: { comments: number; likes: number }
  likes: { id: string }[]
}

interface Props {
  initialPosts: Post[]
}

export function CommunityFeed({ initialPosts }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark tracking-tight flex items-center gap-2">
            <Users size={28} className="text-violet-500" />
            Community
          </h1>
          <p className="text-gray-500 mt-1">Share ideas, celebrate wins, and support each other.</p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-violet-600 hover:bg-violet-700 text-white rounded-full px-5 shadow-md shadow-violet-200 transition-all hover:scale-105"
        >
          <Plus size={16} className="mr-2" /> New Post
        </Button>
      </div>

      {/* Feed */}
      {initialPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center">
            <Sparkles size={28} className="text-violet-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-dark">No posts yet</h2>
            <p className="text-sm text-gray-500 mt-1">
              Be the first to share something with the community!
            </p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            variant="outline"
            className="rounded-full border-violet-200 text-violet-600 hover:bg-violet-50"
          >
            <Plus size={15} className="mr-1.5" /> Create the first post
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {initialPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      <CreatePostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
