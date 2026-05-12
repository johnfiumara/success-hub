"use client"

import { useState, useTransition, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createPost, updatePost } from "@/actions/cms"
import { ArrowLeft, Save, Globe, FileText, Eye, SplitSquareVertical } from "lucide-react"
import Link from "next/link"
import { marked } from "marked"

// Slug helper (pure client-side, no server action needed)
function generateSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-")
}

interface PostEditorProps {
  post?: { id: string; title: string; slug: string; body: string; excerpt?: string | null; coverImage?: string | null; status: string }
}

type EditorMode = "write" | "preview" | "split"

export function PostEditor({ post }: PostEditorProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [title, setTitle] = useState(post?.title ?? "")
  const [slug, setSlug] = useState(post?.slug ?? "")
  const [body, setBody] = useState(post?.body ?? "")
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "")
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? "")
  const [status, setStatus] = useState(post?.status ?? "DRAFT")
  const [mode, setMode] = useState<EditorMode>("split")
  const [renderedHtml, setRenderedHtml] = useState("")

  useEffect(() => {
    setRenderedHtml(marked.parse(body, { async: false }) as string)
  }, [body])

  const handleTitleChange = (v: string) => {
    setTitle(v)
    if (!post) setSlug(generateSlug(v))
  }

  const handleSave = (targetStatus?: string) => {
    const finalStatus = targetStatus ?? status
    startTransition(async () => {
      const data = { title, slug, body, excerpt: excerpt || undefined, coverImage: coverImage || undefined, status: finalStatus }
      if (post) await updatePost(post.id, data)
      else await createPost(data)
      router.push("/cms/posts")
    })
  }

  return (
    <div className="flex flex-col h-full space-y-0 -m-8">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white/95 backdrop-blur shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/cms/posts" className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-dark">{post ? "Edit Post" : "New Post"}</h1>
            <p className="text-xs text-gray-400">{slug ? `/blog/${slug}` : "Draft"}</p>
          </div>
        </div>

        {/* Mode switcher */}
        <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-0.5">
          {([["write", FileText, "Write"], ["split", SplitSquareVertical, "Split"], ["preview", Eye, "Preview"]] as const).map(([m, Icon, label]) => (
            <button key={m} onClick={() => setMode(m)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${mode === m ? "bg-white text-dark shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              <Icon size={13} /> {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={isPending} onClick={() => handleSave("DRAFT")} className="gap-1.5 text-xs">
            <FileText size={13} /> Save Draft
          </Button>
          <Button size="sm" disabled={isPending} onClick={() => handleSave("PUBLISHED")} className="bg-violet-600 hover:bg-violet-700 text-white gap-1.5 text-xs">
            <Globe size={13} /> {status === "PUBLISHED" ? "Update" : "Publish"}
          </Button>
        </div>
      </div>

      {/* Meta row */}
      <div className="px-6 py-3 bg-white border-b border-gray-100 flex items-center gap-4 shrink-0">
        <div className="flex-1">
          <input value={title} onChange={e => handleTitleChange(e.target.value)} placeholder="Post title…"
            className="w-full text-xl font-bold text-dark bg-transparent border-0 outline-none placeholder:text-gray-300" />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-gray-400">/blog/</span>
          <input value={slug} onChange={e => setSlug(e.target.value)} placeholder="my-post-slug"
            className="text-xs font-mono text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:ring-2 focus:ring-violet-300 w-44" />
          {["DRAFT", "PUBLISHED"].map(s => (
            <button key={s} onClick={() => setStatus(s)}
              className={`text-xs px-2.5 py-1.5 rounded-lg font-medium border transition-colors ${status === s ? (s === "PUBLISHED" ? "border-green-400 bg-green-50 text-green-700" : "border-violet-300 bg-violet-50 text-violet-700") : "border-gray-200 text-gray-400 hover:border-gray-300"}`}>
              {s === "DRAFT" ? "📝 Draft" : "🌐 Published"}
            </button>
          ))}
        </div>
      </div>

      {/* Editor + Preview */}
      <div className="flex flex-1 min-h-0 bg-gray-50">
        {/* Write pane */}
        {(mode === "write" || mode === "split") && (
          <div className={`flex flex-col ${mode === "split" ? "w-1/2 border-r border-gray-200" : "w-full"}`}>
            <div className="px-4 py-2 border-b border-gray-100 bg-white flex items-center gap-2">
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Markdown</span>
            </div>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder={"# Start writing…\n\nUse **bold**, *italic*, and [links](https://…)"}
              className="flex-1 w-full resize-none p-6 font-mono text-sm text-gray-800 bg-white focus:outline-none leading-relaxed"
            />
          </div>
        )}

        {/* Preview pane */}
        {(mode === "preview" || mode === "split") && (
          <div className={`flex flex-col ${mode === "split" ? "w-1/2" : "w-full"}`}>
            <div className="px-4 py-2 border-b border-gray-100 bg-white flex items-center gap-2">
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Preview</span>
            </div>
            <div className="flex-1 overflow-auto bg-white p-8">
              {/* Post article preview */}
              {coverImage && (
                <div className="aspect-video w-full rounded-2xl overflow-hidden mb-8 bg-gray-100">
                  <img src={coverImage} alt="Cover" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = "none")} />
                </div>
              )}
              {title && <h1 className="text-4xl font-black text-dark leading-tight mb-4">{title}</h1>}
              {excerpt && <p className="text-lg text-gray-500 mb-8 leading-relaxed border-l-4 border-sage/30 pl-4 italic">{excerpt}</p>}
              <div
                className="prose prose-lg max-w-none text-gray-700
                  prose-headings:font-black prose-headings:text-dark
                  prose-a:text-violet-600 prose-a:no-underline hover:prose-a:underline
                  prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                  prose-blockquote:border-l-sage prose-blockquote:text-gray-500
                  prose-img:rounded-xl"
                dangerouslySetInnerHTML={{ __html: renderedHtml || "<p class='text-gray-300 italic'>Start writing in the editor to see a preview…</p>" }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Bottom meta */}
      <div className="flex items-center gap-6 px-6 py-3 bg-white border-t border-gray-100 shrink-0">
        <div className="flex items-center gap-2 flex-1">
          <Label className="text-xs shrink-0 text-gray-500">Excerpt</Label>
          <input value={excerpt} onChange={e => setExcerpt(e.target.value)} placeholder="Brief summary for listings…"
            className="flex-1 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-violet-300" />
        </div>
        <div className="flex items-center gap-2">
          <Label className="text-xs shrink-0 text-gray-500">Cover Image</Label>
          <input value={coverImage} onChange={e => setCoverImage(e.target.value)} placeholder="https://…"
            className="w-56 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-violet-300" />
        </div>
      </div>
    </div>
  )
}
