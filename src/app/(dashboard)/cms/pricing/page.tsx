import { getPricingPlans } from "@/actions/cms"
import { PricingManager } from "@/components/cms/PricingManager"
export const metadata = { title: "Pricing | CMS | Success Hub" }
export default async function PricingPage() {
  const plans = await getPricingPlans()
  return <PricingManager plans={plans} />
}
