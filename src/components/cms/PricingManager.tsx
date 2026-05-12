"use client"

import { useState, useTransition } from "react"
import { createPricingPlan, updatePricingPlan, deletePricingPlan } from "@/actions/cms"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, DollarSign, Edit2, Check, X, Star } from "lucide-react"

export function PricingManager({ plans: initial }: { plans: any[] }) {
  const [isPending, startTransition] = useTransition()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [form, setForm] = useState({ name: "", price: "0", interval: "month", featuresRaw: "", highlighted: false })

  const reset = () => { setForm({ name: "", price: "0", interval: "month", featuresRaw: "", highlighted: false }); setShowNew(false); setEditingId(null) }
  const parseFeatures = (raw: string) => raw.split("\n").map(f => f.trim()).filter(Boolean)

  const handleCreate = () => startTransition(async () => {
    await createPricingPlan({ name: form.name, price: parseFloat(form.price) || 0, interval: form.interval, features: parseFeatures(form.featuresRaw), highlighted: form.highlighted })
    reset()
  })

  const handleUpdate = (id: string) => startTransition(async () => {
    await updatePricingPlan(id, { name: form.name, price: parseFloat(form.price) || 0, interval: form.interval, features: parseFeatures(form.featuresRaw), highlighted: form.highlighted })
    reset()
  })

  const handleDelete = (id: string) => {
    if (!confirm("Delete this plan?")) return
    startTransition(async () => { await deletePricingPlan(id) })
  }

  const startEdit = (p: any) => {
    setEditingId(p.id)
    setForm({ name: p.name, price: String(p.price), interval: p.interval, featuresRaw: p.features.join("\n"), highlighted: p.highlighted })
    setShowNew(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark">Pricing Plans</h1>
          <p className="text-gray-500 text-sm mt-0.5">{initial.length} plan{initial.length !== 1 ? "s" : ""}</p>
        </div>
        <Button onClick={() => { setShowNew(true); setEditingId(null); reset() }} className="bg-violet-600 hover:bg-violet-700 text-white gap-2">
          <Plus size={16} /> Add Plan
        </Button>
      </div>

      {showNew && (
        <div className="bg-white/80 backdrop-blur-xl border border-violet-200 shadow-glass rounded-2xl p-6 space-y-4">
          <p className="font-semibold text-dark">New Plan</p>
          <PlanForm form={form} setForm={setForm} />
          <div className="flex gap-2 pt-2">
            <Button onClick={handleCreate} disabled={isPending || !form.name} className="bg-violet-600 hover:bg-violet-700 text-white gap-2"><Check size={16} /> Save</Button>
            <Button variant="outline" onClick={reset}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {initial.length === 0 && !showNew && (
          <div className="col-span-full bg-white/80 backdrop-blur-xl border border-white/60 shadow-glass rounded-2xl p-12 text-center">
            <DollarSign size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No pricing plans yet</p>
          </div>
        )}
        {initial.map(plan => (
          <div key={plan.id} className={`bg-white/80 backdrop-blur-xl border shadow-glass rounded-2xl p-6 group ${plan.highlighted ? "border-violet-300 ring-2 ring-violet-200" : "border-white/60"}`}>
            {editingId === plan.id ? (
              <div className="space-y-4">
                <PlanForm form={form} setForm={setForm} />
                <div className="flex gap-2">
                  <Button onClick={() => handleUpdate(plan.id)} disabled={isPending} className="bg-violet-600 hover:bg-violet-700 text-white gap-2"><Check size={16} /> Save</Button>
                  <Button variant="outline" onClick={reset}><X size={16} /></Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    {plan.highlighted && <span className="inline-flex items-center gap-1 bg-violet-100 text-violet-700 text-xs font-medium px-2 py-0.5 rounded-full mb-2"><Star size={10} /> Popular</span>}
                    <p className="font-bold text-dark text-lg">{plan.name}</p>
                    <p className="text-3xl font-bold text-dark mt-1">${plan.price}<span className="text-sm font-normal text-gray-400">/{plan.interval}</span></p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-violet-600" onClick={() => startEdit(plan)}><Edit2 size={13} /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-red-500" onClick={() => handleDelete(plan.id)}><Trash2 size={13} /></Button>
                  </div>
                </div>
                <ul className="space-y-1 mt-4">
                  {plan.features.map((f: string, i: number) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <Check size={13} className="text-violet-500 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function PlanForm({ form, setForm }: { form: any; setForm: any }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2"><Label>Plan Name *</Label><Input value={form.name} onChange={e => setForm((p: any) => ({ ...p, name: e.target.value }))} placeholder="Pro" /></div>
      <div className="space-y-2"><Label>Price ($)</Label><Input type="number" value={form.price} onChange={e => setForm((p: any) => ({ ...p, price: e.target.value }))} placeholder="29" /></div>
      <div className="space-y-2">
        <Label>Billing Interval</Label>
        <select value={form.interval} onChange={e => setForm((p: any) => ({ ...p, interval: e.target.value }))} className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="month">Monthly</option>
          <option value="year">Yearly</option>
          <option value="one-time">One-time</option>
        </select>
      </div>
      <div className="space-y-2 flex items-end">
        <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
          <input type="checkbox" checked={form.highlighted} onChange={e => setForm((p: any) => ({ ...p, highlighted: e.target.checked }))} className="accent-violet-600" />
          <span className="font-medium text-gray-700">Mark as popular</span>
        </label>
      </div>
      <div className="col-span-2 space-y-2">
        <Label>Features <span className="text-gray-400 font-normal">(one per line)</span></Label>
        <textarea value={form.featuresRaw} onChange={e => setForm((p: any) => ({ ...p, featuresRaw: e.target.value }))} rows={5} placeholder={"Unlimited projects\nPriority support\nCustom domain"} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-ring" />
      </div>
    </div>
  )
}
