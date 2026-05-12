// @ts-nocheck
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Target,
  BrainCircuit,
  Sun,
  BarChart3,
  Heart,
  TrendingUp,
  Users,
  Lightbulb,
  Palette,
  Banknote,
  Check,
  PenLine,
  ArrowRight,
  Sparkles,
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
    title: 'Focus Area Selection',
    description: 'Choose the life areas that matter most for your transformation.',
    color: 'text-lavender',
    bg: 'bg-lavender/10',
  },
  {
    icon: BrainCircuit,
    title: 'AI-Guided Intention Crafting',
    description: 'Cherry Blossom helps you craft powerful, specific intentions.',
    color: 'text-sage',
    bg: 'bg-sage/10',
  },
  {
    icon: Sun,
    title: 'Personalized Daily Practices',
    description: 'Daily micro-actions designed to bring your intentions to life.',
    color: 'text-gold',
    bg: 'bg-gold/10',
  },
  {
    icon: BarChart3,
    title: 'Progress Tracking',
    description: 'Visual dashboards to celebrate wins and stay motivated.',
    color: 'text-coral',
    bg: 'bg-coral/10',
  },
]

const focusAreas = [
  {
    id: 'health',
    label: 'Health & Wellness',
    description: 'Build vitality and lasting well-being',
    icon: Heart,
    borderColor: 'border-rose-300',
    bgColor: 'bg-rose-50',
    iconColor: 'text-rose-400',
    selectedBg: 'bg-rose-100',
  },
  {
    id: 'career',
    label: 'Career & Leadership',
    description: 'Advance with purpose and confidence',
    icon: TrendingUp,
    borderColor: 'border-blue-300',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-400',
    selectedBg: 'bg-blue-100',
  },
  {
    id: 'relationships',
    label: 'Relationships',
    description: 'Deepen meaningful connections',
    icon: Users,
    borderColor: 'border-coral/40',
    bgColor: 'bg-coral/5',
    iconColor: 'text-coral',
    selectedBg: 'bg-coral/10',
  },
  {
    id: 'growth',
    label: 'Personal Growth',
    description: 'Expand your mindset and potential',
    icon: Lightbulb,
    borderColor: 'border-purple-300',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-400',
    selectedBg: 'bg-purple-100',
  },
  {
    id: 'creative',
    label: 'Creative Expression',
    description: 'Unlock your artistic potential',
    icon: Palette,
    borderColor: 'border-amber-300',
    bgColor: 'bg-amber-50',
    iconColor: 'text-amber-400',
    selectedBg: 'bg-amber-100',
  },
  {
    id: 'financial',
    label: 'Financial Abundance',
    description: 'Cultivate wealth and security',
    icon: Banknote,
    borderColor: 'border-emerald-300',
    bgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-400',
    selectedBg: 'bg-emerald-100',
  },
]

const intentionTemplate = {
  goal: '',
  date: '',
  action: '',
}

export default function IntentionSetting() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<string[]>([])
  const [template, setTemplate] = useState(intentionTemplate)
  const [showPreview, setShowPreview] = useState(false)

  const toggleArea = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((a) => a !== id)
      if (prev.length >= 3) return prev
      return [...prev, id]
    })
  }

  const handleTemplateChange = (field: keyof typeof intentionTemplate, value: string) => {
    setTemplate((prev) => ({ ...prev, [field]: value }))
  }

  const filledFields = Object.values(template).filter(Boolean).length

  return (
    <div className="min-h-[100dvh] bg-cream">
      {/* ─── Hero ─── */}
      <section
        className="relative pt-24 pb-20 px-6 overflow-hidden"
        style={{ background: 'linear-gradient(to bottom right, #9B8EC720, #F9F6F0, #8FB57320)' }}
      >
        <div className="max-w-[1200px] mx-auto relative z-10">
          <motion.button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-dark/70 hover:text-lavender transition-colors mb-8 group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-body-sm font-medium">Back to Home</span>
          </motion.button>

          <motion.div className="max-w-3xl" {...fadeUp}>
            <span
              className="inline-block text-white text-caption px-4 py-1.5 rounded-full mb-4"
              style={{ backgroundColor: '#9B8EC7' }}
            >
              Guided Practice
            </span>
            <h1 className="text-heading-1 mb-4" style={{ color: '#9B8EC7' }}>
              Intention Setting Guide
            </h1>
            <p className="text-serif-accent text-gray mb-4">
              Transform Insights Into Purposeful Action
            </p>
            <p className="text-body-lg text-dark/80 max-w-2xl">
              Choose 1-3 focus areas for maximum impact. Let Cherry Blossom guide you through
              creating your personalized 28-day transformation plan with daily practices and action steps.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className="section-padding px-6">
        <div className="max-w-[1200px] mx-auto">
          <motion.div className="text-center mb-14" {...fadeUp}>
            <h2 className="text-heading-2 text-dark mb-3">Your Intention Toolkit</h2>
            <p className="text-body text-gray max-w-xl mx-auto">
              Everything you need to turn dreams into daily practice.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, i) => (
              <motion.div
                key={feat.title}
                className="bg-white rounded-[24px] shadow-card border p-7 text-center transition-all duration-400 hover:shadow-card-hover hover:-translate-y-2"
                style={{ borderColor: 'rgba(155,142,199,0.15)' }}
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

      {/* ─── Focus Area Selector ─── */}
      <section
        className="section-padding px-6"
        style={{ background: 'linear-gradient(180deg, #F9F6F0 0%, #F0F4E8 100%)' }}
      >
        <div className="max-w-[1000px] mx-auto">
          <motion.div className="text-center mb-10" {...fadeUp}>
            <h2 className="text-heading-2 text-dark mb-3">Choose Your Focus Areas</h2>
            <p className="text-body text-gray">
              Select 1-3 areas to focus your transformation energy.
              <span className="block text-caption mt-1" style={{ color: '#9B8EC7' }}>
                {selected.length}/3 selected
              </span>
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {focusAreas.map((area) => {
              const isSelected = selected.includes(area.id)
              return (
                <motion.button
                  key={area.id}
                  onClick={() => toggleArea(area.id)}
                  className={`relative rounded-[20px] border-2 p-6 text-left transition-all duration-300 ${
                    isSelected
                      ? `${area.borderColor} ${area.selectedBg} shadow-card`
                      : `border-transparent bg-white shadow-card hover:shadow-card-hover`
                  }`}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: '#9B8EC7' }}
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
          </div>
        </div>
      </section>

      {/* ─── Intention Crafting Template ─── */}
      <section className="section-padding px-6">
        <div className="max-w-[800px] mx-auto">
          <motion.div className="text-center mb-10" {...fadeUp}>
            <h2 className="text-heading-2 text-dark mb-3">Craft Your Intention</h2>
            <p className="text-body text-gray">
              Fill in the blanks below to create a powerful, actionable intention statement.
            </p>
          </motion.div>

          <motion.div
            className="bg-white rounded-[24px] shadow-card border p-8 md:p-10"
            style={{ borderColor: 'rgba(155,142,199,0.12)' }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const }}
          >
            {/* Template fill-ins */}
            <div className="space-y-6 mb-8">
              <div>
                <label className="block text-body-sm font-medium text-dark mb-2">
                  <Sparkles size={14} className="inline mr-1 -mt-0.5" style={{ color: '#9B8EC7' }} />
                  What do you intend to achieve?
                </label>
                <input
                  type="text"
                  placeholder="e.g., create more balance in my work and personal life"
                  value={template.goal}
                  onChange={(e) => handleTemplateChange('goal', e.target.value)}
                  className="w-full px-5 py-3.5 rounded-xl border-2 border-lavender/20 bg-cream/50 text-dark placeholder:text-gray/40 focus:outline-none focus:border-lavender/50 transition-colors text-body"
                />
              </div>
              <div>
                <label className="block text-body-sm font-medium text-dark mb-2">
                  <Sparkles size={14} className="inline mr-1 -mt-0.5" style={{ color: '#9B8EC7' }} />
                  By what date?
                </label>
                <input
                  type="text"
                  placeholder="e.g., the end of this 28-day cycle"
                  value={template.date}
                  onChange={(e) => handleTemplateChange('date', e.target.value)}
                  className="w-full px-5 py-3.5 rounded-xl border-2 border-lavender/20 bg-cream/50 text-dark placeholder:text-gray/40 focus:outline-none focus:border-lavender/50 transition-colors text-body"
                />
              </div>
              <div>
                <label className="block text-body-sm font-medium text-dark mb-2">
                  <Sparkles size={14} className="inline mr-1 -mt-0.5" style={{ color: '#9B8EC7' }} />
                  What daily action will you take?
                </label>
                <input
                  type="text"
                  placeholder="e.g., blocking 30 minutes each morning for reflection and planning"
                  value={template.action}
                  onChange={(e) => handleTemplateChange('action', e.target.value)}
                  className="w-full px-5 py-3.5 rounded-xl border-2 border-lavender/20 bg-cream/50 text-dark placeholder:text-gray/40 focus:outline-none focus:border-lavender/50 transition-colors text-body"
                />
              </div>
            </div>

            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-body-sm font-medium text-dark">Template Progress</span>
                <span className="text-body-sm font-semibold" style={{ color: '#9B8EC7' }}>
                  {filledFields}/3 fields
                </span>
              </div>
              <div className="w-full h-2.5 bg-lavender/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: '#9B8EC7' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(filledFields / 3) * 100}%` }}
                  transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }}
                />
              </div>
            </div>

            {/* Preview toggle */}
            {filledFields === 3 && (
              <motion.button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 text-body-sm font-medium mx-auto transition-colors"
                style={{ color: '#9B8EC7' }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <PenLine size={16} />
                {showPreview ? 'Hide Preview' : 'Show My Intention'}
              </motion.button>
            )}

            <AnimatePresence>
              {showPreview && filledFields === 3 && (
                <motion.div
                  className="mt-6 p-6 rounded-[16px] border-2 text-center"
                  style={{ borderColor: '#9B8EC740', backgroundColor: '#9B8EC708' }}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <p className="text-body-lg text-dark italic leading-relaxed">
                    &ldquo;I intend to{' '}
                    <span className="font-semibold" style={{ color: '#9B8EC7' }}>
                      {template.goal}
                    </span>{' '}
                    by{' '}
                    <span className="font-semibold" style={{ color: '#9B8EC7' }}>
                      {template.date}
                    </span>{' '}
                    through{' '}
                    <span className="font-semibold" style={{ color: '#9B8EC7' }}>
                      {template.action}
                    </span>
                    .&rdquo;
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section
        className="py-20 px-6"
        style={{ background: 'linear-gradient(180deg, #F0F4E8 0%, #9B8EC720 100%)' }}
      >
        <motion.div className="max-w-2xl mx-auto text-center" {...fadeUp}>
          <h2 className="text-heading-2 text-dark mb-4">Ready To Live With Intention?</h2>
          <p className="text-body-lg text-gray mb-8">
            Your transformation begins with a single, purposeful choice.
          </p>
          <button
            onClick={() => navigate('/#pricing')}
            className="btn-primary text-lg px-10 py-4"
          >
            Start Setting Your Intentions
            <ArrowRight size={22} className="inline ml-2 -mt-0.5" />
          </button>
        </motion.div>
      </section>
    </div>
  )
}
