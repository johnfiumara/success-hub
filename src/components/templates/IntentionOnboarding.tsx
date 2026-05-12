// @ts-nocheck
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Heart,
  BrainCircuit,
  CalendarDays,
  Search,
  MousePointerClick,
  PenLine,
  Rocket,
  Check,
  Target,
  TrendingUp,
  Users,
  Sparkles,
  Banknote,
  Palette,
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
    icon: Target,
    title: 'Select Focus Areas',
    description: 'Choose 1-3 priority areas that matter most to your transformation journey.',
    color: 'text-coral',
    bg: 'bg-coral/10',
  },
  {
    icon: BrainCircuit,
    title: 'AI-Guided Crafting',
    description: 'Let Cherry Blossom guide you in crafting powerful, actionable intentions.',
    color: 'text-sage',
    bg: 'bg-sage/10',
  },
  {
    icon: CalendarDays,
    title: '28-Day Action Plan',
    description: 'Receive a personalized daily practice plan to bring your intentions to life.',
    color: 'text-gold',
    bg: 'bg-gold/10',
  },
]

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Review Audit Results',
    description: 'Understand your work-life balance scores and identify growth opportunities.',
  },
  {
    number: '02',
    icon: MousePointerClick,
    title: 'Choose 1-3 Priorities',
    description: 'Select the focus areas that will have the greatest impact on your life.',
  },
  {
    number: '03',
    icon: PenLine,
    title: 'Craft Your Intentions',
    description: 'Work with Cherry Blossom to create specific, meaningful intention statements.',
  },
  {
    number: '04',
    icon: Rocket,
    title: 'Begin Your Journey',
    description: 'Start your 28-day transformation with daily practices and support.',
  },
]

const focusAreas = [
  {
    id: 'health',
    label: 'Health & Wellness',
    description: 'Physical vitality and well-being',
    icon: Heart,
    borderColor: 'border-rose-300',
    bgColor: 'bg-rose-50',
    iconColor: 'text-rose-400',
  },
  {
    id: 'career',
    label: 'Career Growth',
    description: 'Professional development and goals',
    icon: TrendingUp,
    borderColor: 'border-blue-300',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-400',
  },
  {
    id: 'relationships',
    label: 'Relationships',
    description: 'Deepen personal connections',
    icon: Users,
    borderColor: 'border-coral/40',
    bgColor: 'bg-coral/5',
    iconColor: 'text-coral',
  },
  {
    id: 'mindfulness',
    label: 'Mindfulness',
    description: 'Presence and inner peace',
    icon: Sparkles,
    borderColor: 'border-purple-300',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-400',
  },
  {
    id: 'creative',
    label: 'Creative Expression',
    description: 'Unlock your creative potential',
    icon: Palette,
    borderColor: 'border-amber-300',
    bgColor: 'bg-amber-50',
    iconColor: 'text-amber-400',
  },
  {
    id: 'financial',
    label: 'Financial Freedom',
    description: 'Wealth and abundance mindset',
    icon: Banknote,
    borderColor: 'border-emerald-300',
    bgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-400',
  },
]

export default function IntentionOnboarding() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<string[]>([])

  const toggleArea = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((a) => a !== id)
      if (prev.length >= 3) return prev
      return [...prev, id]
    })
  }

  return (
    <div className="min-h-[100dvh] bg-cream">
      {/* ─── Hero ─── */}
      <section
        className="relative pt-24 pb-20 px-6 overflow-hidden"
        style={{ background: 'linear-gradient(to bottom right, #E07A6E20, #F9F6F0, #8FB57320)' }}
      >
        <div className="max-w-[1200px] mx-auto relative z-10">
          <motion.button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-dark/70 hover:text-coral transition-colors mb-8 group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-body-sm font-medium">Back to Home</span>
          </motion.button>

          <motion.div className="max-w-3xl" {...fadeUp}>
            <span className="inline-block bg-coral text-white text-caption px-4 py-1.5 rounded-full mb-4">
              Step 2 of 3
            </span>
            <h1 className="text-heading-1 text-coral mb-4">Intention Onboarding</h1>
            <p className="text-serif-accent text-gray mb-4">
              Choose Your Focus — Create Your 28-Day Transformation Plan
            </p>
            <p className="text-body-lg text-dark/80 max-w-2xl">
              Transform your audit insights into powerful, actionable intentions. Select 1-3 focus
              areas and let Cherry Blossom guide you through your personalized transformation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className="section-padding px-6">
        <div className="max-w-[1200px] mx-auto">
          <motion.div className="text-center mb-14" {...fadeUp}>
            <h2 className="text-heading-2 text-dark mb-3">How Intention Setting Works</h2>
            <p className="text-body text-gray max-w-xl mx-auto">
              From insights to impact — a guided journey to your best self.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feat, i) => (
              <motion.div
                key={feat.title}
                className="bg-white rounded-[24px] shadow-card border border-coral/10 p-8 text-center transition-all duration-400 hover:shadow-card-hover hover:-translate-y-2"
                {...staggerFade(i * 0.12)}
              >
                <div className={`w-14 h-14 rounded-full ${feat.bg} flex items-center justify-center mx-auto mb-5`}>
                  <feat.icon size={28} className={feat.color} />
                </div>
                <h3 className="text-heading-4 text-dark mb-3">{feat.title}</h3>
                <p className="text-body-sm text-gray">{feat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Process ─── */}
      <section
        className="section-padding px-6"
        style={{ background: 'linear-gradient(180deg, #F9F6F0 0%, #FDF2F0 100%)' }}
      >
        <div className="max-w-[1200px] mx-auto">
          <motion.div className="text-center mb-14" {...fadeUp}>
            <h2 className="text-heading-2 text-dark mb-3">The Intention Process</h2>
            <p className="text-body text-gray max-w-xl mx-auto">
              Four steps to transform your insights into purposeful action.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                className="bg-white rounded-[20px] shadow-card p-6 text-center relative transition-all duration-400 hover:-translate-y-2 hover:shadow-card-hover"
                {...staggerFade(i * 0.1)}
              >
                <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-coral text-white text-sm font-bold flex items-center justify-center shadow-md">
                  {step.number}
                </div>
                <div className="w-12 h-12 rounded-full bg-coral/10 flex items-center justify-center mx-auto mb-4">
                  <step.icon size={24} className="text-coral" />
                </div>
                <h3 className="text-heading-4 text-dark mb-2">{step.title}</h3>
                <p className="text-body-sm text-gray">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Focus Area Selector ─── */}
      <section className="section-padding px-6">
        <div className="max-w-[1000px] mx-auto">
          <motion.div className="text-center mb-10" {...fadeUp}>
            <h2 className="text-heading-2 text-dark mb-3">Select Your Focus Areas</h2>
            <p className="text-body text-gray">
              Choose 1-3 areas that resonate most with your current journey.
              <span className="block text-caption text-coral mt-1">
                {selected.length}/3 selected
              </span>
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {focusAreas.map((area) => {
              const isSelected = selected.includes(area.id)
              return (
                <motion.button
                  key={area.id}
                  onClick={() => toggleArea(area.id)}
                  className={`relative rounded-[20px] border-2 p-6 text-left transition-all duration-300 ${
                    isSelected
                      ? `${area.borderColor} ${area.bgColor} shadow-card`
                      : 'border-transparent bg-white shadow-card hover:shadow-card-hover'
                  }`}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        className="absolute top-3 right-3 w-6 h-6 rounded-full bg-sage flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      >
                        <Check size={14} className="text-white" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className={`w-11 h-11 rounded-full ${area.bgColor} flex items-center justify-center mb-3`}>
                    <area.icon size={22} className={area.iconColor} />
                  </div>
                  <h3 className="text-heading-4 text-dark mb-1">{area.label}</h3>
                  <p className="text-body-sm text-gray">{area.description}</p>
                </motion.button>
              )
            })}
          </motion.div>

          {selected.length === 3 && (
            <motion.p
              className="text-center text-caption text-coral mt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Maximum 3 areas selected. Click an area to deselect it if you want to change.
            </motion.p>
          )}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section
        className="py-20 px-6"
        style={{ background: 'linear-gradient(180deg, #FDF2F0 0%, #E07A6E20 100%)' }}
      >
        <motion.div className="max-w-2xl mx-auto text-center" {...fadeUp}>
          <h2 className="text-heading-2 text-dark mb-4">Ready To Set Your Intentions?</h2>
          <p className="text-body-lg text-gray mb-8">
            Begin crafting your personalized 28-day transformation plan with Cherry Blossom.
          </p>
          <button
            onClick={() => navigate('/intention-setting')}
            className="btn-primary text-lg px-10 py-4"
          >
            <Target size={22} className="inline mr-2 -mt-1" />
            Set Your Intentions
          </button>
          {selected.length > 0 && (
            <motion.p
              className="text-body-sm text-sage mt-4 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Check size={16} className="inline mr-1 -mt-0.5" />
              {selected.length} focus area{selected.length > 1 ? 's' : ''} ready
            </motion.p>
          )}
        </motion.div>
      </section>
    </div>
  )
}
