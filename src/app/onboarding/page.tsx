import { getCurrentUser } from "@/actions/auth"
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow"

export const metadata = {
  title: "Onboarding | Success Hub",
}

export default async function OnboardingPage() {
  const context = await getCurrentUser()
  const userName = context?.user?.name || "User"
  
  return <OnboardingFlow userName={userName} />
}
