"use client"

import { useState, useCallback, useTransition } from "react"
import { SitePreview } from "./SitePreview"
import { AppPagePreview } from "./AppPagePreview"
import { EditorPanel } from "./EditorPanel"
import { Monitor, Tablet, Smartphone, Save, X, Globe, LayoutDashboard, Apple, CheckSquare, Moon, Video, Users, ChevronRight } from "lucide-react"
import { bulkUpsertSiteSettings } from "@/actions/cms"

export type SectionId = "hero" | "stats" | "testimonials" | "team" | "pricing" | "blog" | null

type PageView = "landing" | "dashboard" | "tasks" | "nutrition" | "sleep" | "community" | "meetings"

const SITE_PAGES: { id: PageView; label: string; icon: any; group: "marketing" | "app" }[] = [
  { id: "landing", label: "Landing Page", icon: Globe, group: "marketing" },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, group: "app" },
  { id: "tasks", label: "Tasks & Habits", icon: CheckSquare, group: "app" },
  { id: "nutrition", label: "Nutrition", icon: Apple, group: "app" },
  { id: "sleep", label: "Sleep", icon: Moon, group: "app" },
  { id: "community", label: "Community", icon: Users, group: "app" },
  { id: "meetings", label: "Meetings", icon: Video, group: "app" },
]

const VIEWPORTS = [
  { id: "desktop" as const, icon: Monitor, label: "Desktop", width: "100%" },
  { id: "tablet" as const, icon: Tablet, label: "Tablet", width: "768px" },
  { id: "mobile" as const, icon: Smartphone, label: "Mobile", width: "390px" },
]

interface Props {
  initialSettings: Record<string, string>
  initialTestimonials: any[]
  initialTeam: any[]
  initialPricing: any[]
  initialPosts: any[]
}

export function VisualEditorShell({ initialSettings, initialTestimonials, initialTeam, initialPricing, initialPosts }: Props) {
  const [isPending, startTransition] = useTransition()
  const [selectedSection, setSelectedSection] = useState<SectionId>(null)
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [activePage, setActivePage] = useState<PageView>("landing")
  const [savedBanner, setSavedBanner] = useState(false)
  const [navOpen, setNavOpen] = useState(true)

  const [settings, setSettings] = useState<Record<string, string>>(initialSettings)
  const [testimonials, setTestimonials] = useState<any[]>(initialTestimonials)
  const [team, setTeam] = useState<any[]>(initialTeam)
  const [pricing, setPricing] = useState<any[]>(initialPricing)

  const handleSectionClick = useCallback((section: SectionId) => {
    setSelectedSection(prev => prev === section ? null : section)
  }, [])

  const handleSaveAll = () => {
    startTransition(async () => {
      await bulkUpsertSiteSettings(settings)
      setSavedBanner(true)
      setTimeout(() => setSavedBanner(false), 2500)
    })
  }

  const vp = VIEWPORTS.find(v => v.id === viewport)!
  const marketingPages = SITE_PAGES.filter(p => p.group === "marketing")
  const appPages = SITE_PAGES.filter(p => p.group === "app")

  return (
    <div className="flex flex-col h-full -m-8 bg-gray-100">
      {/* ── Top toolbar ── */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 bg-white/95 backdrop-blur shrink-0 z-20 shadow-sm">
        <div className="flex items-center gap-1">
          <button onClick={() => setNavOpen(n => !n)} className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors mr-1" title="Toggle page list">
            <LayoutDashboard size={18} />
          </button>
          <div className="h-5 w-px bg-gray-200 mr-1" />
          {VIEWPORTS.map(({ id, icon: Icon, label }) => (
            <button key={id} onClick={() => setViewport(id)} title={label}
              className={`p-2 rounded-lg transition-colors ${viewport === id ? "bg-violet-100 text-violet-700" : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"}`}>
              <Icon size={18} />
            </button>
          ))}
          <div className="h-5 w-px bg-gray-200 mx-2" />
          <span className="text-xs text-gray-400 font-mono hidden sm:block">{vp.width}</span>
        </div>

        <div className="flex items-center gap-1 text-sm text-gray-400">
          <span className="hidden sm:block">{SITE_PAGES.find(p => p.id === activePage)?.label}</span>
          <ChevronRight size={14} />
          {selectedSection && <span className="text-violet-600 font-medium capitalize">{selectedSection} section</span>}
        </div>

        <div className="flex items-center gap-3">
          {selectedSection && (
            <button onClick={() => setSelectedSection(null)} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <X size={14} /> Close
            </button>
          )}
          {savedBanner && <span className="text-xs text-green-600 font-semibold animate-in fade-in">✓ Saved!</span>}
          <button onClick={handleSaveAll} disabled={isPending}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-60">
            <Save size={15} /> {isPending ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* ── Left page navigator ── */}
        {navOpen && (
          <div className="w-48 shrink-0 bg-white border-r border-gray-200 overflow-y-auto">
            <div className="p-3">
              <p className="text-xs uppercase text-gray-400 font-semibold tracking-wider px-2 mb-2">Marketing</p>
              {marketingPages.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => { setActivePage(id); setSelectedSection(null) }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-colors text-left ${activePage === id ? "bg-violet-50 text-violet-700 font-semibold" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}>
                  <Icon size={15} /> {label}
                </button>
              ))}

              <div className="my-3 border-t border-gray-100" />
              <p className="text-xs uppercase text-gray-400 font-semibold tracking-wider px-2 mb-2">App Pages</p>
              {appPages.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => { setActivePage(id); setSelectedSection(null) }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-colors text-left ${activePage === id ? "bg-violet-50 text-violet-700 font-semibold" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}>
                  <Icon size={15} /> {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Preview area ── */}
        <div className="flex-1 overflow-auto p-6 flex justify-center">
          <div className="bg-white shadow-2xl rounded-xl overflow-hidden transition-all duration-300 relative"
            style={{ width: vp.width, maxWidth: "100%", minHeight: "600px" }}>
            {activePage === "landing" ? (
              <SitePreview
                settings={settings}
                testimonials={testimonials}
                team={team}
                pricing={pricing}
                posts={initialPosts}
                selectedSection={selectedSection}
                onSectionClick={handleSectionClick}
              />
            ) : (
              <AppPagePreview page={activePage} />
            )}
          </div>
        </div>

        {/* ── Right editor panel ── */}
        {selectedSection && activePage === "landing" && (
          <div className="w-80 shrink-0 bg-white border-l border-gray-200 overflow-y-auto shadow-xl animate-in slide-in-from-right duration-200">
            <EditorPanel
              section={selectedSection}
              settings={settings}
              setSettings={setSettings}
              testimonials={testimonials}
              setTestimonials={setTestimonials}
              team={team}
              setTeam={setTeam}
              pricing={pricing}
              setPricing={setPricing}
              onClose={() => setSelectedSection(null)}
            />
          </div>
        )}
      </div>
    </div>
  )
}
