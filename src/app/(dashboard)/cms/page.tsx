import { getPosts } from "@/actions/cms"
import { getTestimonials } from "@/actions/cms"
import { getTeamMembers } from "@/actions/cms"
import { getPricingPlans } from "@/actions/cms"
import Link from "next/link"
import { FileText, Star, Users, DollarSign, Settings, ArrowRight } from "lucide-react"

export const metadata = { title: "CMS | Success Hub" }

const sections = [
  { href: "/cms/posts", label: "Blog Posts", icon: FileText, color: "bg-violet-50 text-violet-600", description: "Manage published articles and drafts" },
  { href: "/cms/testimonials", label: "Testimonials", icon: Star, color: "bg-amber-50 text-amber-600", description: "Customer and member reviews" },
  { href: "/cms/team", label: "Team", icon: Users, color: "bg-blue-50 text-blue-600", description: "Team member profiles" },
  { href: "/cms/pricing", label: "Pricing Plans", icon: DollarSign, color: "bg-green-50 text-green-600", description: "Subscription tiers and features" },
  { href: "/cms/settings", label: "Site Settings", icon: Settings, color: "bg-gray-50 text-gray-600", description: "Global site configuration" },
]

export default async function CmsOverviewPage() {
  const [posts, testimonials, team, pricing] = await Promise.all([
    getPosts(), getTestimonials(), getTeamMembers(), getPricingPlans()
  ])

  const counts: Record<string, number> = {
    "/cms/posts": posts.length,
    "/cms/testimonials": testimonials.length,
    "/cms/team": team.length,
    "/cms/pricing": pricing.length,
    "/cms/settings": 0,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-dark tracking-tight">Content Management</h1>
        <p className="text-gray-500 mt-1">Manage your site content, blog posts, and configuration.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {sections.map(({ href, label, icon: Icon, color, description }) => (
          <Link key={href} href={href} className="group bg-white/80 backdrop-blur-xl border border-white/60 shadow-glass rounded-2xl p-6 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
                <Icon size={22} />
              </div>
              <ArrowRight size={18} className="text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all mt-1" />
            </div>
            <p className="font-semibold text-dark text-lg">{label}</p>
            <p className="text-gray-500 text-sm mt-1">{description}</p>
            {counts[href] > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <span className="text-2xl font-bold text-dark">{counts[href]}</span>
                <span className="text-gray-400 text-sm ml-1">records</span>
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
