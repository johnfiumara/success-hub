import { getTestimonials } from "@/actions/cms"
import { TestimonialsManager } from "@/components/cms/TestimonialsManager"
export const metadata = { title: "Testimonials | CMS | Success Hub" }
export default async function TestimonialsPage() {
  const testimonials = await getTestimonials()
  return <TestimonialsManager testimonials={testimonials} />
}
