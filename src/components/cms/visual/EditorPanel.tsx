"use client"

import { type SectionId } from "./VisualEditorShell"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { X, Plus, Trash2, Check, ExternalLink, ArrowRight } from "lucide-react"
import { useState, useTransition } from "react"
import Link from "next/link"
import { createTestimonial, updateTestimonial, deleteTestimonial, createTeamMember, updateTeamMember, deleteTeamMember, createPricingPlan, updatePricingPlan, deletePricingPlan } from "@/actions/cms"

interface EditorPanelProps {
  section: SectionId
  settings: Record<string, string>
  setSettings: (s: Record<string, string>) => void
  testimonials: any[]
  setTestimonials: (t: any[]) => void
  team: any[]
  setTeam: (t: any[]) => void
  pricing: any[]
  setPricing: (p: any[]) => void
  onClose: () => void
}

export function EditorPanel({ section, settings, setSettings, testimonials, setTestimonials, team, setTeam, pricing, setPricing, onClose }: EditorPanelProps) {
  const set = (key: string, value: string) => setSettings({ ...settings, [key]: value })

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
        <p className="font-semibold text-dark text-sm capitalize">{section?.replace("-", " ")} Settings</p>
        <button onClick={onClose} className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {section === "hero" && <HeroPanel settings={settings} set={set} />}
        {section === "stats" && <StatsPanel settings={settings} set={set} />}
        {section === "testimonials" && <TestimonialsPanel testimonials={testimonials} setTestimonials={setTestimonials} />}
        {section === "team" && <TeamPanel team={team} setTeam={setTeam} />}
        {section === "pricing" && <PricingPanel pricing={pricing} setPricing={setPricing} />}
        {section === "blog" && <BlogPanel />}
      </div>
    </div>
  )
}

// ── Hero Panel ────────────────────────────────────────────────────────────────
function HeroPanel({ settings, set }: { settings: Record<string, string>; set: (k: string, v: string) => void }) {
  return (
    <div className="space-y-4">
      <Field label="Headline">
        <textarea value={settings.hero_headline || ""} onChange={e => set("hero_headline", e.target.value)} rows={2} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring" />
      </Field>
      <Field label="Subheadline">
        <textarea value={settings.hero_subheadline || ""} onChange={e => set("hero_subheadline", e.target.value)} rows={3} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring" />
      </Field>
      <Field label="CTA Button Text">
        <Input value={settings.hero_cta_text || ""} onChange={e => set("hero_cta_text", e.target.value)} placeholder="Get Started Free" />
      </Field>
      <Field label="CTA Link">
        <Input value={settings.hero_cta_link || ""} onChange={e => set("hero_cta_link", e.target.value)} placeholder="/signup" />
      </Field>
      <div className="pt-2 border-t border-gray-100">
        <p className="text-xs text-gray-400 mb-3 font-medium uppercase tracking-wider">Site Identity</p>
        <Field label="Site Name">
          <Input value={settings.site_name || ""} onChange={e => set("site_name", e.target.value)} placeholder="Success Hub" />
        </Field>
        <Field label="Tagline">
          <Input value={settings.site_tagline || ""} onChange={e => set("site_tagline", e.target.value)} placeholder="Your transformation starts here" />
        </Field>
      </div>
    </div>
  )
}

// ── Stats Panel ───────────────────────────────────────────────────────────────
function StatsPanel({ settings, set }: { settings: Record<string, string>; set: (k: string, v: string) => void }) {
  const stats = [
    { valueKey: "stat_1_value", labelKey: "stat_1_label", defaultValue: "12k+", defaultLabel: "Active Users" },
    { valueKey: "stat_2_value", labelKey: "stat_2_label", defaultValue: "98%", defaultLabel: "Satisfaction Rate" },
    { valueKey: "stat_3_value", labelKey: "stat_3_label", defaultValue: "4.9★", defaultLabel: "App Rating" },
    { valueKey: "stat_4_value", labelKey: "stat_4_label", defaultValue: "30+", defaultLabel: "Features" },
  ]

  return (
    <div className="space-y-5">
      {stats.map((stat, i) => (
        <div key={i} className="p-3 bg-gray-50 rounded-xl space-y-2">
          <p className="text-xs font-semibold text-gray-500">Stat {i + 1}</p>
          <Field label="Value">
            <Input value={settings[stat.valueKey] || stat.defaultValue} onChange={e => set(stat.valueKey, e.target.value)} placeholder={stat.defaultValue} className="text-sm" />
          </Field>
          <Field label="Label">
            <Input value={settings[stat.labelKey] || stat.defaultLabel} onChange={e => set(stat.labelKey, e.target.value)} placeholder={stat.defaultLabel} className="text-sm" />
          </Field>
        </div>
      ))}
    </div>
  )
}

// ── Testimonials Panel ────────────────────────────────────────────────────────
function TestimonialsPanel({ testimonials, setTestimonials }: { testimonials: any[]; setTestimonials: (t: any[]) => void }) {
  const [isPending, startTransition] = useTransition()
  const [adding, setAdding] = useState(false)
  const [newForm, setNewForm] = useState({ name: "", role: "", content: "", image: "" })

  const handleCreate = () => startTransition(async () => {
    const t = await createTestimonial({ name: newForm.name, role: newForm.role || undefined, content: newForm.content, image: newForm.image || undefined })
    setTestimonials([...testimonials, t])
    setAdding(false)
    setNewForm({ name: "", role: "", content: "", image: "" })
  })

  const handleDelete = (id: string) => startTransition(async () => {
    await deleteTestimonial(id)
    setTestimonials(testimonials.filter(t => t.id !== id))
  })

  const handleToggle = (id: string, published: boolean) => startTransition(async () => {
    await updateTestimonial(id, { published })
    setTestimonials(testimonials.map(t => t.id === id ? { ...t, published } : t))
  })

  return (
    <div className="space-y-3">
      {testimonials.map(t => (
        <div key={t.id} className="flex items-start gap-2 p-3 rounded-xl border border-gray-100 bg-gray-50 group">
          <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-bold text-sm shrink-0">{t.name[0]}</div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-dark truncate">{t.name}</p>
            <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">"{t.content}"</p>
            <button onClick={() => handleToggle(t.id, !t.published)} className={`text-xs mt-1.5 font-medium ${t.published ? "text-green-600" : "text-gray-400"}`}>
              {t.published ? "● Published" : "○ Hidden"}
            </button>
          </div>
          <button onClick={() => handleDelete(t.id)} className="opacity-0 group-hover:opacity-100 p-1 text-gray-300 hover:text-red-400 transition-all shrink-0">
            <Trash2 size={13} />
          </button>
        </div>
      ))}

      {adding ? (
        <div className="p-3 border border-violet-200 rounded-xl bg-violet-50 space-y-2">
          <Field label="Author"><Input value={newForm.name} onChange={e => setNewForm(p => ({ ...p, name: e.target.value }))} placeholder="Jane Doe" className="text-sm" /></Field>
          <Field label="Role"><Input value={newForm.role} onChange={e => setNewForm(p => ({ ...p, role: e.target.value }))} placeholder="Product Manager" className="text-sm" /></Field>
          <Field label="Quote"><textarea value={newForm.content} onChange={e => setNewForm(p => ({ ...p, content: e.target.value }))} rows={2} placeholder="Their testimonial…" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs resize-none focus:outline-none focus:ring-2 focus:ring-ring" /></Field>
          <div className="flex gap-2 pt-1">
            <Button size="sm" onClick={handleCreate} disabled={isPending || !newForm.name || !newForm.content} className="bg-violet-600 hover:bg-violet-700 text-white h-8 text-xs">Save</Button>
            <Button size="sm" variant="ghost" onClick={() => setAdding(false)} className="h-8 text-xs">Cancel</Button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-xs text-gray-400 hover:text-violet-600 hover:border-violet-300 transition-colors">
          <Plus size={14} /> Add Testimonial
        </button>
      )}

      <div className="pt-2 border-t border-gray-100">
        <Link href="/cms/testimonials" target="_blank" className="flex items-center gap-1.5 text-xs text-violet-600 hover:underline font-medium">
          <ExternalLink size={12} /> Full testimonials manager
        </Link>
      </div>
    </div>
  )
}

// ── Team Panel ────────────────────────────────────────────────────────────────
function TeamPanel({ team, setTeam }: { team: any[]; setTeam: (t: any[]) => void }) {
  const [isPending, startTransition] = useTransition()
  const [adding, setAdding] = useState(false)
  const [newForm, setNewForm] = useState({ name: "", role: "", bio: "", image: "" })

  const handleCreate = () => startTransition(async () => {
    const m = await createTeamMember({ name: newForm.name, role: newForm.role, bio: newForm.bio || undefined, image: newForm.image || undefined })
    setTeam([...team, m])
    setAdding(false)
    setNewForm({ name: "", role: "", bio: "", image: "" })
  })

  const handleDelete = (id: string) => startTransition(async () => {
    await deleteTeamMember(id)
    setTeam(team.filter(m => m.id !== id))
  })

  return (
    <div className="space-y-3">
      {team.map(m => (
        <div key={m.id} className="flex items-center gap-2 p-3 rounded-xl border border-gray-100 bg-gray-50 group">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">{m.name[0]}</div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-dark">{m.name}</p>
            <p className="text-xs text-violet-600">{m.role}</p>
          </div>
          <button onClick={() => handleDelete(m.id)} className="opacity-0 group-hover:opacity-100 p-1 text-gray-300 hover:text-red-400 transition-all">
            <Trash2 size={13} />
          </button>
        </div>
      ))}
      {adding ? (
        <div className="p-3 border border-violet-200 rounded-xl bg-violet-50 space-y-2">
          <Field label="Name"><Input value={newForm.name} onChange={e => setNewForm(p => ({ ...p, name: e.target.value }))} placeholder="Jane Doe" className="text-sm" /></Field>
          <Field label="Role"><Input value={newForm.role} onChange={e => setNewForm(p => ({ ...p, role: e.target.value }))} placeholder="Designer" className="text-sm" /></Field>
          <div className="flex gap-2 pt-1">
            <Button size="sm" onClick={handleCreate} disabled={isPending || !newForm.name || !newForm.role} className="bg-violet-600 hover:bg-violet-700 text-white h-8 text-xs">Save</Button>
            <Button size="sm" variant="ghost" onClick={() => setAdding(false)} className="h-8 text-xs">Cancel</Button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-xs text-gray-400 hover:text-violet-600 hover:border-violet-300 transition-colors">
          <Plus size={14} /> Add Member
        </button>
      )}
      <div className="pt-2 border-t border-gray-100">
        <Link href="/cms/team" target="_blank" className="flex items-center gap-1.5 text-xs text-violet-600 hover:underline font-medium">
          <ExternalLink size={12} /> Full team manager
        </Link>
      </div>
    </div>
  )
}

// ── Pricing Panel ─────────────────────────────────────────────────────────────
function PricingPanel({ pricing, setPricing }: { pricing: any[]; setPricing: (p: any[]) => void }) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = (id: string) => startTransition(async () => {
    await deletePricingPlan(id)
    setPricing(pricing.filter(p => p.id !== id))
  })

  const handleToggleHighlight = (id: string, isPopular: boolean) => startTransition(async () => {
    await updatePricingPlan(id, { isPopular })
    setPricing(pricing.map(p => p.id === id ? { ...p, isPopular } : p))
  })

  return (
    <div className="space-y-3">
      {pricing.map(plan => (
        <div key={plan.id} className={`p-3 rounded-xl border group ${plan.isPopular ? "border-violet-200 bg-violet-50" : "border-gray-100 bg-gray-50"}`}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-bold text-dark">{plan.name}</p>
            <div className="flex items-center gap-1">
              <button onClick={() => handleToggleHighlight(plan.id, !plan.isPopular)} title="Toggle popular" className={`text-xs px-2 py-0.5 rounded-full font-medium transition-colors ${plan.isPopular ? "bg-violet-600 text-white" : "bg-gray-200 text-gray-500 hover:bg-violet-100 hover:text-violet-600"}`}>
                {plan.isPopular ? "★ Popular" : "☆ Popular"}
              </button>
              <button onClick={() => handleDelete(plan.id)} className="opacity-0 group-hover:opacity-100 p-1 text-gray-300 hover:text-red-400 transition-all">
                <Trash2 size={13} />
              </button>
            </div>
          </div>
          <p className="text-lg font-black text-dark">${plan.price}<span className="text-xs font-normal text-gray-400">/{plan.interval}</span></p>
          <p className="text-xs text-gray-500 mt-1">{plan.features.length} features</p>
        </div>
      ))}
      <div className="pt-2 border-t border-gray-100">
        <Link href="/cms/pricing" target="_blank" className="flex items-center gap-1.5 text-xs text-violet-600 hover:underline font-medium">
          <ExternalLink size={12} /> Full pricing manager
        </Link>
      </div>
    </div>
  )
}

// ── Blog Panel ────────────────────────────────────────────────────────────────
function BlogPanel() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 leading-relaxed">Blog posts are managed in the full post editor with Markdown support and live preview.</p>
      <Link href="/cms/posts" target="_blank">
        <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white gap-2 mt-2">
          <ExternalLink size={15} /> Open Post Editor
        </Button>
      </Link>
      <Link href="/cms/posts/new" target="_blank">
        <Button variant="outline" className="w-full gap-2">
          <Plus size={15} /> New Post
        </Button>
      </Link>
    </div>
  )
}

// ── Shared Field ──────────────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-gray-500 font-medium">{label}</Label>
      {children}
    </div>
  )
}
