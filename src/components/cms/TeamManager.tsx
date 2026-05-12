"use client"

import { useState, useTransition } from "react"
import { createTeamMember, updateTeamMember, deleteTeamMember } from "@/actions/cms"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Users, Edit2, Check, X } from "lucide-react"

export function TeamManager({ members: initial }: { members: any[] }) {
  const [isPending, startTransition] = useTransition()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [form, setForm] = useState({ name: "", role: "", bio: "", image: "" })

  const reset = () => { setForm({ name: "", role: "", bio: "", image: "" }); setShowNew(false); setEditingId(null) }

  const handleCreate = () => startTransition(async () => {
    await createTeamMember({ name: form.name, role: form.role, bio: form.bio || undefined, image: form.image || undefined })
    reset()
  })

  const handleUpdate = (id: string) => startTransition(async () => {
    await updateTeamMember(id, { name: form.name, role: form.role, bio: form.bio || undefined, image: form.image || undefined })
    reset()
  })

  const handleDelete = (id: string) => {
    if (!confirm("Remove this team member?")) return
    startTransition(async () => { await deleteTeamMember(id) })
  }

  const startEdit = (m: any) => {
    setEditingId(m.id); setForm({ name: m.name, role: m.role, bio: m.bio ?? "", image: m.image ?? "" }); setShowNew(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark">Team Members</h1>
          <p className="text-gray-500 text-sm mt-0.5">{initial.length} member{initial.length !== 1 ? "s" : ""}</p>
        </div>
        <Button onClick={() => { setShowNew(true); setEditingId(null); reset() }} className="bg-violet-600 hover:bg-violet-700 text-white gap-2">
          <Plus size={16} /> Add Member
        </Button>
      </div>

      {showNew && (
        <div className="bg-white/80 backdrop-blur-xl border border-violet-200 shadow-glass rounded-2xl p-6 space-y-4">
          <p className="font-semibold text-dark">New Team Member</p>
          <MemberForm form={form} setForm={setForm} />
          <div className="flex gap-2 pt-2">
            <Button onClick={handleCreate} disabled={isPending || !form.name || !form.role} className="bg-violet-600 hover:bg-violet-700 text-white gap-2"><Check size={16} /> Save</Button>
            <Button variant="outline" onClick={reset}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {initial.length === 0 && !showNew && (
          <div className="col-span-full bg-white/80 backdrop-blur-xl border border-white/60 shadow-glass rounded-2xl p-12 text-center">
            <Users size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No team members yet</p>
          </div>
        )}
        {initial.map(m => (
          <div key={m.id} className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-glass rounded-2xl p-5 group">
            {editingId === m.id ? (
              <div className="space-y-4">
                <MemberForm form={form} setForm={setForm} />
                <div className="flex gap-2">
                  <Button onClick={() => handleUpdate(m.id)} disabled={isPending} className="bg-violet-600 hover:bg-violet-700 text-white gap-2"><Check size={16} /> Save</Button>
                  <Button variant="outline" onClick={reset}><X size={16} /></Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-start justify-between mb-3">
                  {m.image
                    ? <img src={m.image} alt={m.name} className="w-14 h-14 rounded-full object-cover" />
                    : <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">{m.name[0]}</div>
                  }
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-violet-600" onClick={() => startEdit(m)}><Edit2 size={13} /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-red-500" onClick={() => handleDelete(m.id)}><Trash2 size={13} /></Button>
                  </div>
                </div>
                <p className="font-semibold text-dark">{m.name}</p>
                <p className="text-sm text-violet-600 font-medium">{m.role}</p>
                {m.bio && <p className="text-sm text-gray-500 mt-2 line-clamp-3">{m.bio}</p>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function MemberForm({ form, setForm }: { form: any; setForm: any }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2"><Label>Name *</Label><Input value={form.name} onChange={e => setForm((p: any) => ({ ...p, name: e.target.value }))} placeholder="Jane Doe" /></div>
      <div className="space-y-2"><Label>Role *</Label><Input value={form.role} onChange={e => setForm((p: any) => ({ ...p, role: e.target.value }))} placeholder="Product Designer" /></div>
      <div className="col-span-2 space-y-2"><Label>Bio</Label><textarea value={form.bio} onChange={e => setForm((p: any) => ({ ...p, bio: e.target.value }))} rows={2} placeholder="Short bio…" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring" /></div>
      <div className="col-span-2 space-y-2"><Label>Image URL</Label><Input value={form.image} onChange={e => setForm((p: any) => ({ ...p, image: e.target.value }))} placeholder="https://…" /></div>
    </div>
  )
}
