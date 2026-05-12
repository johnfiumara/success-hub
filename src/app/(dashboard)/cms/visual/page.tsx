import { getSiteSettings, getTestimonials, getTeamMembers, getPricingPlans, getPosts } from "@/actions/cms"
import { VisualEditorShell } from "@/components/cms/visual/VisualEditorShell"

export const metadata = { title: "Visual Editor | CMS | Success Hub" }

export default async function VisualEditorPage() {
  const [settings, testimonials, team, pricing, posts] = await Promise.all([
    getSiteSettings(),
    getTestimonials(),
    getTeamMembers(),
    getPricingPlans(),
    getPosts(),
  ])

  return (
    <VisualEditorShell
      initialSettings={settings}
      initialTestimonials={testimonials}
      initialTeam={team}
      initialPricing={pricing}
      initialPosts={posts}
    />
  )
}
