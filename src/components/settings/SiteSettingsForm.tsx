"use client"

import { useState, useTransition } from "react"
import { bulkUpsertSiteSettings } from "@/actions/cms"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save, CheckCircle2 } from "lucide-react"

const SETTING_GROUPS = [
  {
    label: "General",
    fields: [
      { key: "site_name", label: "Site Name", placeholder: "Success Hub" },
      { key: "site_tagline", label: "Tagline", placeholder: "Your transformation starts here" },
      { key: "site_url", label: "Site URL", placeholder: "https://successhub.com" },
      { key: "meta_description", label: "Meta Description", placeholder: "A brief description for search engines…", textarea: true },
    ]
  },
  {
    label: "Hero Section",
    fields: [
      { key: "hero_headline", label: "Headline", placeholder: "Transform Your Work-Life Balance" },
      { key: "hero_subheadline", label: "Subheadline", placeholder: "The all-in-one wellness platform…" },
      { key: "hero_cta_text", label: "CTA Button Text", placeholder: "Get Started Free" },
      { key: "hero_cta_link", label: "CTA Link", placeholder: "/signup" },
    ]
  },
  {
    label: "Social Links",
    fields: [
      { key: "social_twitter", label: "Twitter / X", placeholder: "https://twitter.com/…" },
      { key: "social_instagram", label: "Instagram", placeholder: "https://instagram.com/…" },
      { key: "social_linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/…" },
    ]
  },
]

export function SiteSettingsForm({ settings: initial }: { settings: Record<string, string> }) {
  const [values, setValues] = useState<Record<string, string>>(initial)
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  const handleChange = (key: string, value: string) => setValues(prev => ({ ...prev, [key]: value }))

  const handleSave = () => {
    startTransition(async () => {
      await bulkUpsertSiteSettings(values)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark">Site Settings</h1>
          <p className="text-gray-500 text-sm mt-0.5">Global configuration for your website</p>
        </div>
        <Button onClick={handleSave} disabled={isPending} className={`gap-2 transition-colors ${saved ? "bg-green-600 hover:bg-green-700" : "bg-violet-600 hover:bg-violet-700"} text-white`}>
          {saved ? <><CheckCircle2 size={16} /> Saved!</> : <><Save size={16} /> Save Settings</>}
        </Button>
      </div>

      <div className="space-y-5">
        {SETTING_GROUPS.map(group => (
          <div key={group.label} className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-glass rounded-2xl p-6">
            <h2 className="font-semibold text-dark mb-5 pb-3 border-b border-gray-100">{group.label}</h2>
            <div className="space-y-4">
              {group.fields.map(field => (
                <div key={field.key} className="space-y-1.5">
                  <Label className="text-sm">{field.label}</Label>
                  {field.textarea ? (
                    <textarea
                      value={values[field.key] ?? ""}
                      onChange={e => handleChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      rows={3}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  ) : (
                    <Input value={values[field.key] ?? ""} onChange={e => handleChange(field.key, e.target.value)} placeholder={field.placeholder} />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
