import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ClipboardList,
  Sparkles,
  UserCircle,
  Crosshair,
  Briefcase,
  DollarSign,
  HeartPulse,
  Dumbbell,
  Apple,
  Moon,
  Users,
  Baby,
  MessageCircleHeart,
  Flower2,
  TrendingUp,
  Lightbulb,
  Home,
  Clock,
  PartyPopper,
  Play,
  BookOpen,
} from 'lucide-react'

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
}

const staggerFade = (delay: number) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const, delay },
})

const features = [
  {
    icon: ClipboardList,
    title: '15-Question Comprehensive Assessment',
    description: 'A thorough evaluation covering every dimension of your life balance.',
    color: 'text-sage',
    bg: 'bg-sage/10',
  },
  {
    icon: Sparkles,
    title: 'Instant Personalized Results',
    description: 'Receive your balance scorecard the moment you complete the audit.',
    color: 'text-coral',
    bg: 'bg-coral/10',
  },
  {
    icon: UserCircle,
    title: 'AI-Powered Insights from Cherry Blossom',
    description: 'Get thoughtful, personalized analysis from our AI guide.',
    color: 'text-gold',
    bg: 'bg-gold/10',
  },
  {
    icon: Crosshair,
    title: 'Priority Area Identification',
    description: 'Discover exactly which areas to focus on for maximum impact.',
    color: 'text-sage-dark',
    bg: 'bg-sage/10',
  },
]

const lifeAreas = [
  { icon: Briefcase, label: 'Career', color: 'text-blue-400', bg: 'bg-blue-50' },
  { icon: DollarSign, label: 'Finances', color: 'text-emerald-400', bg: 'bg-emerald-50' },
  { icon: HeartPulse, label: 'Health', color: 'text-rose-400', bg: 'bg-rose-50' },
  { icon: Dumbbell, label: 'Fitness', color: 'text-orange-400', bg: 'bg-orange-50' },
  { icon: Apple, label: 'Nutrition', color: 'text-green-400', bg: 'bg-green-50' },
  { icon: Moon, label: 'Sleep', color: 'text-indigo-400', bg: 'bg-indigo-50' },
  { icon: Users, label: 'Relationships', color: 'text-coral', bg: 'bg-coral/5' },
  { icon: Baby, label: 'Family', color: 'text-pink-400', bg: 'bg-pink-50' },
  { icon: MessageCircleHeart, label: 'Social', color: 'text-purple-400', bg: 'bg-purple-50' },
  { icon: Flower2, label: 'Spirituality', color: 'text-teal-400', bg: 'bg-teal-50' },
  { icon: TrendingUp, label: 'Personal Growth', color: 'text-sage', bg: 'bg-sage/10' },
  { icon: Lightbulb, label: 'Creativity', color: 'text-amber-400', bg: 'bg-amber-50' },
  { icon: Home, label: 'Home Environment', color: 'text-cyan-400', bg: 'bg-cyan-50' },
  { icon: Clock, label: 'Time Management', color: 'text-gray-500', bg: 'bg-gray-50' },
  { icon: PartyPopper, label: 'Fun & Recreation', color: 'text-gold', bg: 'bg-gold/10' },
]

const auditSteps = [
  {
    number: '01',
    title: 'Complete 15 Questions',
    description: 'Answer thoughtful questions about each life area. Takes ~5 minutes.',
  },
  {
    number: '02',
    title: 'Get Your Balance Score',
    description: 'See your overall balance score plus individual area breakdowns.',
  },
  {
    number: '03',
    title: 'Review AI Insights',
    description: 'Cherry Blossom provides personalized observations and suggestions.',
  },
  {
    number: '04',
    title: 'Identify Priorities',
    description: 'Learn which 1-3 areas will create the biggest transformation.',
  },
]

export default function WorkLifeBalanceAudit() {
  const router = useRouter()

  return (
    <div className="min-h-[100dvh] bg-cream">
      {/* ─── Hero ─── */}
      <section
        className="relative pt-24 pb-20 px-6 overflow-hidden bg-gradient-to-br from-sage/20 via-cream-dark to-gold/20"
      >
        <div className="max-w-[1200px] mx-auto relative z-10">
          <motion.button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-dark/70 hover:text-sage transition-colors mb-8 group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-body-sm font-medium">Back to Home</span>
          </motion.button>

          <motion.div className="max-w-3xl" {...fadeUp}>
            <span className="inline-block bg-sage text-white text-caption px-4 py-1.5 rounded-full mb-4">
              Assessment
            </span>
            <h1 className="text-heading-1 text-sage mb-4">Work-Life Balance Audit</h1>
            <p className="text-serif-accent text-gray mb-4">
              The 15-Question Assessment That Changes Everything
            </p>
            <p className="text-body-lg text-dark/80 max-w-2xl">
              Discover exactly where you stand across 15 key life areas with our comprehensive
              assessment. Get personalized insights and identify your biggest opportunities for growth.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className="section-padding px-6">
        <div className="max-w-[1200px] mx-auto">
          <motion.div className="text-center mb-14" {...fadeUp}>
            <h2 className="text-heading-2 text-dark mb-3">Why Take The Audit?</h2>
            <p className="text-body text-gray max-w-xl mx-auto">
              This is not just a quiz — it is a mirror for your life.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, i) => (
              <motion.div
                key={feat.title}
                className="bg-white rounded-[24px] shadow-card border border-sage/10 p-7 text-center transition-all duration-400 hover:shadow-card-hover hover:-translate-y-2"
                {...staggerFade(i * 0.1)}
              >
                <div className={`w-14 h-14 rounded-full ${feat.bg} flex items-center justify-center mx-auto mb-4`}>
                  <feat.icon size={28} className={feat.color} />
                </div>
                <h3 className="text-heading-4 text-dark mb-2">{feat.title}</h3>
                <p className="text-body-sm text-gray">{feat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 15 Life Areas Grid ─── */}
      <section
        className="section-padding px-6 bg-gradient-to-b from-sage-light/50 to-cream-dark"
      >
        <div className="max-w-[1000px] mx-auto">
          <motion.div className="text-center mb-14" {...fadeUp}>
            <h2 className="text-heading-2 text-dark mb-3">15 Key Life Areas</h2>
            <p className="text-body text-gray max-w-xl mx-auto">
              Each area is carefully evaluated to give you a complete picture of your life balance.
            </p>
          </motion.div>

          <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
            {lifeAreas.map((area, i) => (
              <motion.div
                key={area.label}
                className="bg-white rounded-[16px] shadow-feature border border-sage/5 p-5 text-center transition-all duration-300 hover:shadow-card hover:-translate-y-1"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  ease: [0.25, 0.46, 0.45, 0.94] as const,
                  delay: i * 0.03,
                }}
              >
                <div className={`w-10 h-10 rounded-full ${area.bg} flex items-center justify-center mx-auto mb-2.5`}>
                  <area.icon size={20} className={area.color} />
                </div>
                <p className="text-body-sm font-medium text-dark">{area.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Process ─── */}
      <section className="section-padding px-6">
        <div className="max-w-[1000px] mx-auto">
          <motion.div className="text-center mb-14" {...fadeUp}>
            <h2 className="text-heading-2 text-dark mb-3">How It Works</h2>
            <p className="text-body text-gray">Simple, insightful, and transformative.</p>
          </motion.div>

          <div className="relative">
            {/* Connecting line - desktop only */}
            <div className="hidden lg:block absolute top-[28px] left-[12.5%] right-[12.5%] h-0.5 bg-sage/20" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {auditSteps.map((step, i) => (
                <motion.div
                  key={step.number}
                  className="text-center relative"
                  {...staggerFade(i * 0.12)}
                >
                  <div className="w-14 h-14 rounded-full bg-sage text-white text-lg font-bold flex items-center justify-center mx-auto mb-4 shadow-md relative z-10">
                    {step.number}
                  </div>
                  <h3 className="text-heading-4 text-dark mb-2">{step.title}</h3>
                  <p className="text-body-sm text-gray">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section
        className="py-20 px-6 bg-gradient-to-b from-sage-light/50 to-sage/20"
      >
        <motion.div className="max-w-2xl mx-auto text-center" {...fadeUp}>
          <h2 className="text-heading-2 text-dark mb-4">Ready To See Where You Stand?</h2>
          <p className="text-body-lg text-gray mb-10">
            Take 5 minutes. Get a lifetime of clarity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/audit-onboarding')}
              className="btn-primary text-lg px-10 py-4"
            >
              <Play size={22} className="inline mr-2 -mt-0.5" />
              Begin The Audit
            </button>
            <button
              onClick={() => router.push('/#onboarding')}
              className="btn-outline-sage text-lg px-10 py-4"
            >
              <BookOpen size={22} className="inline mr-2 -mt-0.5" />
              Learn More About The Assessment
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
