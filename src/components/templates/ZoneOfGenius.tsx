// @ts-nocheck
import { lazy, Suspense } from 'react'

const HeroSection = lazy(() => import('../sections/zone-of-genius/HeroSection'))
const FourZonesSection = lazy(() => import('../sections/zone-of-genius/FourZonesSection'))
const TeamOrbitalSection = lazy(() => import('../sections/zone-of-genius/TeamOrbitalSection'))
const TeamProfilesSection = lazy(() => import('../sections/zone-of-genius/TeamProfilesSection'))
const AssessmentSection = lazy(() => import('../sections/zone-of-genius/AssessmentSection'))
const SynergyMapSection = lazy(() => import('../sections/zone-of-genius/SynergyMapSection'))
const AIInsightsSection = lazy(() => import('../sections/zone-of-genius/AIInsightsSection'))
const CTASection = lazy(() => import('../sections/zone-of-genius/CTASection'))

export default function ZoneOfGenius() {
  return (
    <main className="min-h-[100dvh] bg-black">
      <Suspense fallback={<div className="min-h-[100dvh] bg-black" />}>
        <HeroSection />
      </Suspense>
      <Suspense fallback={null}>
        <FourZonesSection />
      </Suspense>
      <Suspense fallback={<div className="h-[600px] bg-black" />}>
        <TeamOrbitalSection />
      </Suspense>
      <Suspense fallback={null}>
        <TeamProfilesSection />
      </Suspense>
      <Suspense fallback={null}>
        <AssessmentSection />
      </Suspense>
      <Suspense fallback={null}>
        <SynergyMapSection />
      </Suspense>
      <Suspense fallback={null}>
        <AIInsightsSection />
      </Suspense>
      <Suspense fallback={null}>
        <CTASection />
      </Suspense>
    </main>
  )
}
