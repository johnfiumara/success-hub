"use client"

import { useState, useTransition } from "react"
import { createTestimonial, updateTestimonial, deleteTestimonial } from "@/actions/cms"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Star, Edit2, Check, X } from "lucide-react"

export function TestimonialsManager({ testimonials: initial }: { testimonials: any[] }) {
  const [isPending, startTransition] = useTransition()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [form, setForm] = useState({ name: "", role: "", content: "", image: "" })

  const reset = () => { setForm({ name: "", role: "", content: "", image: "" }); setShowNew(false); setEditingId(null) }

  const handleCreate = () => startTransition(async () => {
    await createTestimonial({ name: form.name, role: form.role, content: form.content, image: form.image || undefined })
    reset()
  })

  const handleUpdate = (id: string) => startTransition(async () => {
    await updateTestimonial(id, { name: form.name, role: form.role, content: form.content, image: form.image || undefined })
    reset()
  })

  const handleDelete = (id: string) => {
    if (!confirm("Delete this testimonial?")) return
    startTransition(async () => { await deleteTestimonial(id) })
  }

  const startEdit = (t: any) => {
    setEditingId(t.id)
    setForm({ name: t.name, role: t.role ?? "", content: t.content, image: t.image ?? "" })
    setShowNew(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark">Testimonials</h1>
          <p className="text-gray-500 text-sm mt-0.5">{initial.length} testimonial{initial.length !== 1 ? "s" : ""}</p>
        </div>
        <Button onClick={() => { setShowNew(true); setEditingId(null); reset() }} className="bg-violet-600 hover:bg-violet-700 text-white gap-2">
          <Plus size={16} /> Add Testimonial
        </Button>
      </div>

      {showNew && (
        <div className="bg-white/80 backdrop-blur-xl border border-violet-200 shadow-glass rounded-2xl p-6 space-y-4">
          <p className="font-semibold text-dark">New Testimonial</p>
          <TestimonialForm form={form} setForm={setForm} />
          <div className="flex gap-2 pt-2">
            <Button onClick={handleCreate} disabled={isPending || !form.name || !form.content} className="bg-violet-600 hover:bg-violet-700 text-white gap-2"><Check size={16} /> Save</Button>
            <Button variant="outline" onClick={reset}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {initial.length === 0 && !showNew && (
          <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-glass rounded-2xl p-12 text-center">
            <Star size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No testimonials yet</p>
          </div>
        )}
        {initial.map(t => (
          <div key={t.id} className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-glass rounded-2xl p-6 group">
            {editingId === t.id ? (
              <div className="space-y-4">
                <TestimonialForm form={form} setForm={setForm} />
                <div className="flex gap-2">
                  <Button onClick={() => handleUpdate(t.id)} disabled={isPending} className="bg-violet-600 hover:bg-violet-700 text-white gap-2"><Check size={16} /> Save</Button>
                  <Button variant="outline" onClick={reset}><X size={16} /></Button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-4">
                {t.image && <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover shrink-0" />}
                {!t.image && <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-bold text-lg shrink-0">{t.name[0]}</div>}
                <div className="flex-1">
                  <p className="text-gray-700 italic">"{t.content}"</p>
                  <p className="font-semibold text-dark mt-2">{t.name}</p>
                  {t.role && <p className="text-sm text-gray-500">{t.role}</p>}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-violet-600" onClick={() => startEdit(t)}><Edit2 size={15} /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500" onClick={() => handleDelete(t.id)}><Trash2 size={15} /></Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function TestimonialForm({ form, setForm }: { form: any; setForm: any }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2"><Label>Author *</Label><Input value={form.name} onChange={e => setForm((p: any) => ({ ...p, name: e.target.value }))} placeholder="Jane Doe" /></div>
      <div className="space-y-2"><Label>Role</Label><Input value={form.role} onChange={e => setForm((p: any) => ({ ...p, role: e.target.value }))} placeholder="CEO, Acme Inc." /></div>
      <div className="col-span-2 space-y-2"><Label>Quote *</Label><textarea value={form.content} onChange={e => setForm((p: any) => ({ ...p, content: e.target.value }))} rows={3} placeholder="Their testimonial…" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring" /></div>
      <div className="col-span-2 space-y-2"><Label>Image URL</Label><Input value={form.image} onChange={e => setForm((p: any) => ({ ...p, image: e.target.value }))} placeholder="https://…" /></div>
    </div>
  )
}
