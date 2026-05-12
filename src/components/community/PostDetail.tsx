"use client"

import { useState, useTransition, useRef, useEffect } from "react"
import { ArrowLeft, Heart, MessageCircle, Trash2, Send, Loader2 } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow, format } from "date-fns"
import { Button } from "@/components/ui/button"
import { toggleCommunityLike, deleteCommunityPost, createCommunityComment, deleteCommunityComment } from "@/actions/community"
import { useRouter } from "next/navigation"

type Author = { id: string; name: string | null; image: string | null }
type Comment = { id: string; content: string; createdAt: Date | string; author: Author }
type Post = {
  id: string
  title: string
  content: string
  createdAt: Date | string
  author: Author
  _count: { likes: number }
  likes: { id: string }[]
  comments: Comment[]
}

interface Props {
  post: Post
}

function Avatar({ name, size = "md" }: { name: string | null; size?: "sm" | "md" }) {
  const initials = (name ?? "U").substring(0, 2).toUpperCase()
  const sizeClass = size === "sm" ? "w-7 h-7 text-xs" : "w-10 h-10 text-sm"
  return (
    <div className={`${sizeClass} rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold flex-shrink-0`}>
      {initials}
    </div>
  )
}

export function PostDetail({ post }: Props) {
  const router = useRouter()
  const [likeCount, setLikeCount] = useState(post._count.likes)
  const [liked, setLiked] = useState(post.likes.length > 0)
  const [comment, setComment] = useState("")
  const [commentError, setCommentError] = useState("")
  const [isPendingLike, startLikeTransition] = useTransition()
  const [isPendingComment, startCommentTransition] = useTransition()
  const [isPendingDelete, startDeleteTransition] = useTransition()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleLike = () => {
    startLikeTransition(async () => {
      setLiked((p) => !p)
      setLikeCount((p) => (liked ? p - 1 : p + 1))
      try {
        await toggleCommunityLike(post.id)
      } catch {
        setLiked((p) => !p)
        setLikeCount((p) => (liked ? p + 1 : p - 1))
      }
    })
  }

  const handleDeletePost = () => {
    startDeleteTransition(async () => {
      await deleteCommunityPost(post.id)
      router.push("/community")
    })
  }

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return
    setCommentError("")
    startCommentTransition(async () => {
      try {
        await createCommunityComment(post.id, comment.trim())
        setComment("")
      } catch (err: any) {
        setCommentError(err.message || "Failed to post comment")
      }
    })
  }

  const handleDeleteComment = (commentId: string) => {
    startCommentTransition(async () => {
      await deleteCommunityComment(commentId)
    })
  }

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current
    if (ta) {
      ta.style.height = "auto"
      ta.style.height = ta.scrollHeight + "px"
    }
  }, [comment])

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link
        href="/community"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-violet-600 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Community
      </Link>

      {/* Post Card */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-glass rounded-3xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Avatar name={post.author.name} />
            <div>
              <p className="text-sm font-semibold text-dark">{post.author.name ?? "Unknown"}</p>
              <p className="text-xs text-gray-400">
                {format(new Date(post.createdAt), "MMM d, yyyy")} ·{" "}
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
          <button
            onClick={handleDeletePost}
            disabled={isPendingDelete}
            className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
            title="Delete post"
          >
            {isPendingDelete ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
          </button>
        </div>

        <h1 className="text-2xl font-bold text-dark mb-4 leading-tight">{post.title}</h1>
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{post.content}</p>

        {/* Like / Comment count */}
        <div className="flex items-center gap-5 mt-8 pt-6 border-t border-gray-100">
          <button
            onClick={handleLike}
            disabled={isPendingLike}
            className={`flex items-center gap-2 text-sm font-medium transition-all hover:scale-105 ${
              liked ? "text-rose-500" : "text-gray-400 hover:text-rose-400"
            }`}
          >
            <Heart size={18} className={liked ? "fill-rose-500" : ""} />
            <span>{likeCount} {likeCount === 1 ? "like" : "likes"}</span>
          </button>
          <span className="flex items-center gap-2 text-sm text-gray-400">
            <MessageCircle size={18} />
            {post.comments.length} {post.comments.length === 1 ? "comment" : "comments"}
          </span>
        </div>
      </div>

      {/* Comment Form */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-glass rounded-3xl p-6">
        <h2 className="text-base font-bold text-dark mb-4">Leave a comment</h2>
        <form onSubmit={handleSubmitComment} className="space-y-3">
          <textarea
            ref={textareaRef}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts…"
            rows={2}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent text-dark placeholder:text-gray-400 transition resize-none text-sm"
          />
          {commentError && (
            <p className="text-xs text-red-500">{commentError}</p>
          )}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isPendingComment || !comment.trim()}
              className="rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm"
            >
              {isPendingComment ? (
                <><Loader2 size={14} className="mr-1.5 animate-spin" /> Posting…</>
              ) : (
                <><Send size={14} className="mr-1.5" /> Post Comment</>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Comments List */}
      <div className="space-y-3">
        {post.comments.length === 0 ? (
          <div className="text-center py-10 text-sm text-gray-400 italic">
            No comments yet. Be the first to respond!
          </div>
        ) : (
          post.comments.map((c) => (
            <div
              key={c.id}
              className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-glass rounded-2xl p-5 flex gap-4 group"
            >
              <Avatar name={c.author.name} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-sm font-semibold text-dark">{c.author.name ?? "Unknown"}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
                    </p>
                    <button
                      onClick={() => handleDeleteComment(c.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                      title="Delete comment"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{c.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
