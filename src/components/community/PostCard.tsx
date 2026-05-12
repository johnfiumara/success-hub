"use client"

import { useState, useTransition } from "react"
import { Heart, MessageCircle, Trash2, ChevronRight } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { toggleCommunityLike, deleteCommunityPost } from "@/actions/community"

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
  post: Post
  currentUserId?: string
}

export function PostCard({ post, currentUserId }: Props) {
  const [likeCount, setLikeCount] = useState(post._count.likes)
  const [liked, setLiked] = useState(post.likes.length > 0)
  const [isPending, startTransition] = useTransition()

  const isAuthor = currentUserId === post.author.id
  const initials = (post.author.name ?? "U").substring(0, 2).toUpperCase()

  const handleLike = () => {
    startTransition(async () => {
      // Optimistic update
      setLiked((prev) => !prev)
      setLikeCount((prev) => (liked ? prev - 1 : prev + 1))
      try {
        await toggleCommunityLike(post.id)
      } catch {
        // Revert on error
        setLiked((prev) => !prev)
        setLikeCount((prev) => (liked ? prev + 1 : prev - 1))
      }
    })
  }

  const handleDelete = () => {
    startTransition(async () => {
      await deleteCommunityPost(post.id)
    })
  }

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-glass rounded-2xl p-6 group hover:shadow-lg transition-all duration-200">
      {/* Author Row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-sm flex-shrink-0">
            {initials}
          </div>
          <div>
            <p className="text-sm font-semibold text-dark">{post.author.name ?? "Unknown"}</p>
            <p className="text-xs text-gray-400">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
        {isAuthor && (
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="opacity-0 group-hover:opacity-100 p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
            title="Delete post"
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>

      {/* Content */}
      <Link href={`/community/${post.id}`} className="block group/link">
        <h3 className="text-lg font-bold text-dark group-hover/link:text-violet-600 transition-colors mb-2 leading-snug">
          {post.title}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{post.content}</p>
      </Link>

      {/* Footer */}
      <div className="flex items-center gap-4 mt-5 pt-4 border-t border-gray-100">
        <button
          onClick={handleLike}
          disabled={isPending}
          className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
            liked ? "text-rose-500" : "text-gray-400 hover:text-rose-400"
          }`}
        >
          <Heart size={16} className={liked ? "fill-rose-500" : ""} />
          <span>{likeCount}</span>
        </button>
        <Link
          href={`/community/${post.id}`}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-violet-500 transition-colors"
        >
          <MessageCircle size={16} />
          <span>{post._count.comments}</span>
        </Link>
        <Link
          href={`/community/${post.id}`}
          className="ml-auto flex items-center gap-1 text-xs text-gray-400 hover:text-violet-500 transition-colors"
        >
          Read more <ChevronRight size={13} />
        </Link>
      </div>
    </div>
  )
}
