"use client"

import { type SectionId } from "./VisualEditorShell"
import { SectionWrapper } from "./SectionWrapper"
import { Check, Quote, Flame, ArrowRight } from "lucide-react"
import Link from "next/link"

interface SitePreviewProps {
  settings: Record<string, string>
  testimonials: any[]
  team: any[]
  pricing: any[]
  posts: any[]
  selectedSection: SectionId
  onSectionClick: (section: SectionId) => void
}

export function SitePreview({ settings, testimonials, team, pricing, posts, selectedSection, onSectionClick }: SitePreviewProps) {
  const siteName = settings.site_name || "Success Hub"
  const heroHeadline = settings.hero_headline || "Transform Your Work-Life Balance"
  const heroSub = settings.hero_subheadline || "The all-in-one wellness platform for high-performers."
  const heroCtaText = settings.hero_cta_text || "Get Started Free"

  return (
    <div className="font-sans text-dark antialiased">
      {/* ── Nav ── */}
      <nav className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-sage flex items-center justify-center">
            <Flame size={14} className="text-white" />
          </div>
          <span className="font-bold text-dark">{siteName}</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <a href="#" className="hover:text-dark transition-colors">Features</a>
          <a href="#" className="hover:text-dark transition-colors">Pricing</a>
          <a href="#" className="hover:text-dark transition-colors">Blog</a>
          <button className="bg-sage text-white text-xs font-semibold px-4 py-2 rounded-lg">{heroCtaText}</button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <SectionWrapper id="hero" selected={selectedSection === "hero"} onClick={() => onSectionClick("hero")} label="Hero Section">
        <div
          className="min-h-[520px] flex flex-col items-center justify-center text-center px-8 py-20"
          style={{ background: "linear-gradient(160deg, #F0F4E8 0%, #fff 50%, #EEF2FF 100%)" }}
        >
          <span className="inline-flex items-center gap-2 bg-sage/10 text-sage text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            ✦ Your wellness journey starts here
          </span>
          <h1 className="text-5xl font-black text-dark leading-[1.05] tracking-tight max-w-3xl">
            {heroHeadline}
          </h1>
          <p className="text-xl text-gray-500 mt-6 max-w-2xl leading-relaxed">{heroSub}</p>
          <div className="flex items-center gap-4 mt-10">
            <button className="bg-sage hover:bg-sage-dark text-white font-semibold px-8 py-4 rounded-xl text-lg transition-colors shadow-lg shadow-sage/25">
              {heroCtaText}
            </button>
            <button className="flex items-center gap-2 text-gray-600 font-medium hover:text-dark transition-colors">
              See how it works <ArrowRight size={16} />
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-4">No credit card required • Free 14-day trial</p>
        </div>
      </SectionWrapper>

      {/* ── Stats ── */}
      <SectionWrapper id="stats" selected={selectedSection === "stats"} onClick={() => onSectionClick("stats")} label="Stats Bar">
        <div className="border-y border-gray-100 bg-gray-50 px-8 py-10">
          <div className="grid grid-cols-4 gap-6 max-w-4xl mx-auto text-center">
            {[
              { value: settings.stat_1_value || "12k+", label: settings.stat_1_label || "Active Users" },
              { value: settings.stat_2_value || "98%", label: settings.stat_2_label || "Satisfaction Rate" },
              { value: settings.stat_3_value || "4.9★", label: settings.stat_3_label || "App Rating" },
              { value: settings.stat_4_value || "30+", label: settings.stat_4_label || "Features" },
            ].map(stat => (
              <div key={stat.label}>
                <p className="text-3xl font-black text-dark">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* ── Testimonials ── */}
      <SectionWrapper id="testimonials" selected={selectedSection === "testimonials"} onClick={() => onSectionClick("testimonials")} label="Testimonials">
        <div className="px-8 py-16 bg-white">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-sage font-semibold mb-3">What our members say</p>
            <h2 className="text-3xl font-black text-dark">Real transformations, real results</h2>
          </div>
          {testimonials.length === 0 ? (
            <div className="text-center py-10 text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">
              <Quote size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No testimonials yet — add some in the Testimonials manager</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {testimonials.filter(t => t.published).map(t => (
                <div key={t.id} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <div className="text-3xl text-sage/30 font-black mb-3">"</div>
                  <p className="text-gray-700 text-sm leading-relaxed italic mb-5">"{t.content}"</p>
                  <div className="flex items-center gap-3">
                    {t.image
                      ? <img src={t.image} alt={t.name} className="w-9 h-9 rounded-full object-cover" />
                      : <div className="w-9 h-9 rounded-full bg-sage/20 flex items-center justify-center text-sage font-bold text-sm">{t.name[0]}</div>
                    }
                    <div>
                      <p className="font-semibold text-dark text-sm">{t.name}</p>
                      {t.role && <p className="text-xs text-gray-400">{t.role}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SectionWrapper>

      {/* ── Team ── */}
      <SectionWrapper id="team" selected={selectedSection === "team"} onClick={() => onSectionClick("team")} label="Team">
        <div className="px-8 py-16 bg-gray-50">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-sage font-semibold mb-3">The people behind it</p>
            <h2 className="text-3xl font-black text-dark">Meet our team</h2>
          </div>
          {team.length === 0 ? (
            <div className="text-center py-10 text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl bg-white">
              <p className="text-sm">No team members yet — add some in the Team manager</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {team.map(m => (
                <div key={m.id} className="text-center">
                  {m.image
                    ? <img src={m.image} alt={m.name} className="w-20 h-20 rounded-2xl object-cover mx-auto mb-4" />
                    : <div className="w-20 h-20 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl mx-auto mb-4">{m.name[0]}</div>
                  }
                  <p className="font-bold text-dark text-sm">{m.name}</p>
                  <p className="text-xs text-violet-600 font-medium mt-0.5">{m.role}</p>
                  {m.bio && <p className="text-xs text-gray-500 mt-2 line-clamp-2">{m.bio}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </SectionWrapper>

      {/* ── Pricing ── */}
      <SectionWrapper id="pricing" selected={selectedSection === "pricing"} onClick={() => onSectionClick("pricing")} label="Pricing">
        <div className="px-8 py-16 bg-white">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-sage font-semibold mb-3">Simple, transparent</p>
            <h2 className="text-3xl font-black text-dark">Choose your plan</h2>
          </div>
          {pricing.length === 0 ? (
            <div className="text-center py-10 text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">
              <p className="text-sm">No pricing plans yet — add some in the Pricing manager</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {pricing.map(plan => (
                <div key={plan.id} className={`rounded-2xl p-6 border-2 flex flex-col ${plan.isPopular ? "border-violet-500 bg-violet-50 relative" : "border-gray-200 bg-gray-50"}`}>
                  {plan.isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-violet-600 text-white text-xs font-bold px-3 py-1 rounded-full">Most Popular</span>
                    </div>
                  )}
                  <p className="font-black text-dark text-xl">{plan.name}</p>
                  <div className="my-4">
                    <span className="text-4xl font-black text-dark">${plan.price}</span>
                    <span className="text-gray-400 text-sm">/{plan.interval}</span>
                  </div>
                  <ul className="space-y-2 flex-1 mb-6">
                    {plan.features.map((f: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <Check size={14} className="text-violet-500 shrink-0 mt-0.5" /> {f}
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-3 rounded-xl font-semibold text-sm ${plan.isPopular ? "bg-violet-600 text-white" : "bg-white text-dark border border-gray-200"}`}>
                    Get started
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </SectionWrapper>

      {/* ── Blog ── */}
      <SectionWrapper id="blog" selected={selectedSection === "blog"} onClick={() => onSectionClick("blog")} label="Blog">
        <div className="px-8 py-16 bg-gray-50">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-sage font-semibold mb-3">Resources & insights</p>
            <h2 className="text-3xl font-black text-dark">From the blog</h2>
          </div>
          {posts.filter((p: any) => p.status === "PUBLISHED").length === 0 ? (
            <div className="text-center py-10 text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl bg-white">
              <p className="text-sm">No published posts yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {posts.filter((p: any) => p.status === "PUBLISHED").slice(0, 3).map((post: any) => (
                <div key={post.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                  {post.coverImage && <img src={post.coverImage} alt={post.title} className="w-full h-40 object-cover" />}
                  <div className="p-5">
                    <p className="font-bold text-dark leading-snug">{post.title}</p>
                    {post.excerpt && <p className="text-sm text-gray-500 mt-2 line-clamp-2">{post.excerpt}</p>}
                    <span className="inline-flex items-center gap-1 text-xs text-violet-600 font-semibold mt-4">
                      Read more <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SectionWrapper>

      {/* ── Footer ── */}
      <footer className="bg-dark px-8 py-10 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-md bg-sage flex items-center justify-center"><Flame size={12} className="text-white" /></div>
          <span className="font-bold text-white">{siteName}</span>
        </div>
        <p className="text-gray-500 text-sm">{settings.site_tagline || "Your transformation starts here"}</p>
      </footer>
    </div>
  )
}
