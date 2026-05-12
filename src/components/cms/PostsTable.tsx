"use client"

import { useState, useTransition } from "react"
import { deletePost } from "@/actions/cms"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Edit2, Trash2, Globe, FileText, ExternalLink } from "lucide-react"
import { format } from "date-fns"

export function PostsTable({ posts }: { posts: any[] }) {
  const [isPending, startTransition] = useTransition()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = (id: string) => {
    if (!confirm("Delete this post? This cannot be undone.")) return
    setDeletingId(id)
    startTransition(async () => {
      await deletePost(id)
      setDeletingId(null)
    })
  }

  if (posts.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-glass rounded-2xl p-12 text-center">
        <FileText size={40} className="mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500 font-medium">No posts yet</p>
        <p className="text-gray-400 text-sm mt-1">Create your first post to get started.</p>
      </div>
    )
  }

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-glass rounded-2xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left px-6 py-4 font-semibold text-gray-500">Title</th>
            <th className="text-left px-4 py-4 font-semibold text-gray-500">Author</th>
            <th className="text-left px-4 py-4 font-semibold text-gray-500">Status</th>
            <th className="text-left px-4 py-4 font-semibold text-gray-500">Date</th>
            <th className="px-4 py-4"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {posts.map(post => (
            <tr key={post.id} className="hover:bg-gray-50/50 transition-colors group">
              <td className="px-6 py-4">
                <div>
                  <p className="font-medium text-dark group-hover:text-violet-600 transition-colors">{post.title}</p>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">/blog/{post.slug}</p>
                </div>
              </td>
              <td className="px-4 py-4 text-gray-600">{post.author?.name ?? "—"}</td>
              <td className="px-4 py-4">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${post.status === "PUBLISHED" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                  {post.status === "PUBLISHED" ? <Globe size={10} /> : <FileText size={10} />}
                  {post.status === "PUBLISHED" ? "Published" : "Draft"}
                </span>
              </td>
              <td className="px-4 py-4 text-gray-500">{format(new Date(post.updatedAt), "MMM d, yyyy")}</td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                  <Link href={`/cms/posts/${post.id}`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-violet-600">
                      <Edit2 size={15} />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500"
                    disabled={isPending && deletingId === post.id}
                    onClick={() => handleDelete(post.id)}>
                    <Trash2 size={15} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
