// @ts-nocheck
import Hero from '../sections/Hero'
import Onboarding from '../sections/Onboarding'
import SundayShift from '../sections/SundayShift'
import CoWorkSchedule from '../sections/CoWorkSchedule'
import SanctuarySection from '../sections/SanctuarySection'
import CherryBlossomSuite from '../sections/CherryBlossomSuite'
import WellnessDashboard from '../sections/WellnessDashboard'
import IntegrationWeek from '../sections/IntegrationWeek'
import SuccessStories from '../sections/SuccessStories'
import Community from '../sections/Community'
import Sabbaticals from '../sections/Sabbaticals'
import Pricing from '../sections/Pricing'
import Contact from '../sections/Contact'

export default function Home() {
  return (
    <div>
      <Hero />
      <Onboarding />
      <SundayShift />
      <CoWorkSchedule />
      <SanctuarySection />
      <CherryBlossomSuite />
      <WellnessDashboard />
      <IntegrationWeek />
      <SuccessStories />
      <Community />
      <Sabbaticals />
      <Pricing />
      <Contact />
    </div>
  )
}
