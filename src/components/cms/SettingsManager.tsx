"use client"

import { useState, useTransition } from "react"
import { upsertSiteSetting, bulkUpsertSiteSettings } from "@/actions/cms"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Check, X, Settings } from "lucide-react"

export function SettingsManager({ settings: initial }: { settings: Record<string, string> }) {
  const [isPending, startTransition] = useTransition()
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState({
    companyName: initial.companyName || "",
    tagline: initial.tagline || "",
    contactEmail: initial.contactEmail || "",
    supportEmail: initial.supportEmail || "",
    phone: initial.phone || "",
    address: initial.address || "",
    socialTwitter: initial.socialTwitter || "",
    socialLinkedin: initial.socialLinkedin || "",
  })

  const handleSave = () => startTransition(async () => {
    await bulkUpsertSiteSettings(form)
    setIsEditing(false)
  })

  const handleReset = () => {
    setForm({
      companyName: initial.companyName || "",
      tagline: initial.tagline || "",
      contactEmail: initial.contactEmail || "",
      supportEmail: initial.supportEmail || "",
      phone: initial.phone || "",
      address: initial.address || "",
      socialTwitter: initial.socialTwitter || "",
      socialLinkedin: initial.socialLinkedin || "",
    })
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark">Site Settings</h1>
          <p className="text-gray-500 text-sm mt-0.5">Configure global site information</p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} className="bg-gray-600 hover:bg-gray-700 text-white gap-2">
            <Settings size={16} /> Edit Settings
          </Button>
        )}
      </div>

      <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-glass rounded-2xl p-6 space-y-6">
        {isEditing ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={form.companyName}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                  placeholder="Success Hub"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  placeholder="Work less, live more"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={form.contactEmail}
                  onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                  placeholder="contact@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supportEmail">Support Email</Label>
                <Input
                  id="supportEmail"
                  type="email"
                  value={form.supportEmail}
                  onChange={(e) => setForm({ ...form, supportEmail: e.target.value })}
                  placeholder="support@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="socialTwitter">Twitter Handle</Label>
                <Input
                  id="socialTwitter"
                  value={form.socialTwitter}
                  onChange={(e) => setForm({ ...form, socialTwitter: e.target.value })}
                  placeholder="@successhub"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="socialLinkedin">LinkedIn URL</Label>
                <Input
                  id="socialLinkedin"
                  value={form.socialLinkedin}
                  onChange={(e) => setForm({ ...form, socialLinkedin: e.target.value })}
                  placeholder="https://linkedin.com/company/successhub"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="123 Main Street, City, State 12345"
                rows={3}
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSave} disabled={isPending} className="bg-gray-600 hover:bg-gray-700 text-white gap-2">
                <Check size={16} /> Save Settings
              </Button>
              <Button variant="outline" onClick={handleReset}>
                <X size={16} /> Cancel
              </Button>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SettingRow label="Company Name" value={form.companyName} />
            <SettingRow label="Tagline" value={form.tagline} />
            <SettingRow label="Contact Email" value={form.contactEmail} />
            <SettingRow label="Support Email" value={form.supportEmail} />
            <SettingRow label="Phone" value={form.phone} />
            <SettingRow label="Twitter" value={form.socialTwitter} />
            <SettingRow label="LinkedIn" value={form.socialLinkedin} />
            <div className="md:col-span-2">
              <SettingRow label="Address" value={form.address} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className="text-dark mt-1">{value || <span className="text-gray-400 italic">Not set</span>}</p>
    </div>
  )
}
