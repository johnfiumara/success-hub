"use client"

import { useState, useTransition } from "react"
import { Plus, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createCommunityPost } from "@/actions/community"

interface Props {
  isOpen: boolean
  onClose: () => void
}

export function CreatePostModal({ isOpen, onClose }: Props) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      setError("Please fill in both title and content.")
      return
    }
    setError("")
    startTransition(async () => {
      try {
        await createCommunityPost({ title: title.trim(), content: content.trim() })
        setTitle("")
        setContent("")
        onClose()
      } catch (err: any) {
        setError(err.message || "Failed to create post")
      }
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-white/60 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-dark">New Post</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent text-dark placeholder:text-gray-400 transition"
              maxLength={120}
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{title.length}/120</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts, tips, or questions with the community…"
              rows={5}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent text-dark placeholder:text-gray-400 transition resize-none"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-lg">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-xl border-gray-200"
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 rounded-xl bg-violet-600 hover:bg-violet-700 text-white"
            >
              {isPending ? (
                <><Loader2 size={16} className="mr-2 animate-spin" /> Posting…</>
              ) : (
                <><Plus size={16} className="mr-2" /> Post</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
