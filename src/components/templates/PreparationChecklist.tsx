import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Sparkles,
  CalendarCheck,
  Users,
  Brain,
  Armchair,
  Calendar,
  Check,
  Trash2,
  Monitor,
  Cookie,
  Sofa,
  Video,
  Plane,
  MessageCircle,
  Briefcase,
  Handshake,
  FileText,
  Eye,
  HeartHandshake,
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
    icon: Armchair,
    title: 'Clear Your Space',
    description: 'Create a physical environment that supports focus and calm.',
    color: 'text-coral',
    bg: 'bg-coral/10',
  },
  {
    icon: CalendarCheck,
    title: 'Block Your Calendar',
    description: 'Protect dedicated time for your transformation practices.',
    color: 'text-gold',
    bg: 'bg-gold/10',
  },
  {
    icon: Users,
    title: 'Notify Your Circle',
    description: 'Set expectations with family, friends, and colleagues.',
    color: 'text-sage',
    bg: 'bg-sage/10',
  },
  {
    icon: Brain,
    title: 'Prepare Your Mind',
    description: 'Cultivate the mindset that sets you up for lasting success.',
    color: 'text-coral',
    bg: 'bg-coral/5',
  },
]

interface ChecklistItem {
  id: string
  label: string
  category: string
  icon: React.ComponentType<{ size?: number; className?: string }>
}

const checklistItems: ChecklistItem[] = [
  { id: 'clear-clutter', label: 'Clear clutter from your main workspace', category: 'Physical Space', icon: Trash2 },
  { id: 'sacred-workspace', label: 'Create a sacred workspace', category: 'Physical Space', icon: Monitor },
  { id: 'healthy-snacks', label: 'Stock healthy snacks and water', category: 'Physical Space', icon: Cookie },
  { id: 'relaxation-corner', label: 'Set up a relaxation corner', category: 'Physical Space', icon: Sofa },
  { id: 'sunday-shift', label: 'Block Sunday Shift time', category: 'Calendar', icon: Calendar },
  { id: 'co-working', label: 'Schedule co-working sessions', category: 'Calendar', icon: Video },
  { id: 'sabbatical', label: 'Add sabbatical dates to calendar', category: 'Calendar', icon: Plane },
  { id: 'tell-family', label: 'Tell family about your commitment', category: 'People', icon: MessageCircle },
  { id: 'notify-team', label: 'Notify your team at work', category: 'People', icon: Briefcase },
  { id: 'accountability', label: 'Find an accountability partner', category: 'People', icon: Handshake },
  { id: 'write-why', label: 'Write your why', category: 'Mindset', icon: FileText },
  { id: 'visualize', label: 'Visualize your ideal balance', category: 'Mindset', icon: Eye },
  { id: 'commit', label: 'Commit to the process', category: 'Mindset', icon: HeartHandshake },
]

const categoryMeta: Record<string, { icon: React.ComponentType<{ size?: number; className?: string }>; color: string; bg: string }> = {
  'Physical Space': { icon: Armchair, color: 'text-coral', bg: 'bg-coral/10' },
  Calendar: { icon: CalendarCheck, color: 'text-gold', bg: 'bg-gold/10' },
  People: { icon: Users, color: 'text-sage', bg: 'bg-sage/10' },
  Mindset: { icon: Brain, color: 'text-coral', bg: 'bg-coral/5' },
}

export default function PreparationChecklist() {
  const router = useRouter()
  const [checked, setChecked] = useState<Set<string>>(new Set())

  const toggleItem = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const categories = useMemo(() => {
    const cats = new Set<string>()
    checklistItems.forEach((item) => cats.add(item.category))
    return Array.from(cats)
  }, [])

  const itemsByCategory = (category: string) =>
    checklistItems.filter((item) => item.category === category)

  const totalItems = checklistItems.length
  const completedCount = checked.size
  const progressPercent = Math.round((completedCount / totalItems) * 100)

  const isCategoryComplete = (category: string) => {
    const items = itemsByCategory(category)
    return items.every((item) => checked.has(item.id))
  }

  return (
    <div className="min-h-[100dvh] bg-cream">
      {/* Hero */}
      <section
        className="relative pt-24 pb-20 px-6 overflow-hidden bg-gradient-to-br from-coral/20 via-cream-dark to-gold/20"
      >
        <div className="max-w-[1200px] mx-auto relative z-10">
          <motion.button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-dark/70 hover:text-coral transition-colors mb-8 group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-body-sm font-medium">Back to Home</span>
          </motion.button>

          <motion.div className="max-w-3xl" {...fadeUp}>
            <span className="inline-block bg-gold text-white text-caption px-4 py-1.5 rounded-full mb-4">
              Step 3 of 3
            </span>
            <h1 className="text-heading-1 text-gold mb-4">Preparation Checklist</h1>
            <p className="text-serif-accent text-gray mb-4">
              Get Ready For Your Transformation Experience
            </p>
            <p className="text-body-lg text-dark/80 max-w-2xl">
              Complete these essential preparation steps to create the optimal environment for your
              work-life balance journey. Each step sets you up for success.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Progress Bar */}
      <section className="pt-12 pb-4 px-6">
        <div className="max-w-[800px] mx-auto">
          <motion.div
            className="bg-white rounded-[20px] shadow-card border border-gold/10 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-body font-medium text-dark">
                <Check size={18} className="inline mr-1.5 -mt-0.5 text-gold" />
                Your Progress
              </span>
              <span className="text-body font-bold text-gold">{progressPercent}%</span>
            </div>
            <div className="w-full h-3 bg-gold/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gold"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const }}
              />
            </div>
            <p className="text-body-sm text-gray mt-2">
              {completedCount} of {totalItems} items completed
              {progressPercent === 100 && ' — You are ready!'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 px-6">
        <div className="max-w-[1200px] mx-auto">
          <motion.div className="text-center mb-10" {...fadeUp}>
            <h2 className="text-heading-2 text-dark mb-3">Four Pillars of Preparation</h2>
            <p className="text-body text-gray max-w-xl mx-auto">
              Setting yourself up for transformation success.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, i) => (
              <motion.div
                key={feat.title}
                className="bg-white rounded-[24px] shadow-card border border-gold/10 p-7 text-center transition-all duration-400 hover:shadow-card-hover hover:-translate-y-2"
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

      {/* Interactive Checklist */}
      <section className="section-padding px-6 bg-gradient-to-b from-cream-dark to-coral/10">
        <div className="max-w-[800px] mx-auto">
          <motion.div className="text-center mb-12" {...fadeUp}>
            <h2 className="text-heading-2 text-dark mb-3">Your Preparation Checklist</h2>
            <p className="text-body text-gray">
              Click each item to check it off as you complete it.
            </p>
          </motion.div>

          <div className="space-y-10">
            {categories.map((category, ci) => {
              const meta = categoryMeta[category]
              const items = itemsByCategory(category)
              const complete = isCategoryComplete(category)

              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: ci * 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-9 h-9 rounded-full ${meta.bg} flex items-center justify-center`}>
                      <meta.icon size={18} className={meta.color} />
                    </div>
                    <h3 className="text-heading-4 text-dark">{category}</h3>
                    <AnimatePresence>
                      {complete && (
                        <motion.span
                          className="ml-auto text-body-sm font-medium text-sage flex items-center gap-1"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                        >
                          <Check size={16} />
                          Complete
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="space-y-2.5">
                    {items.map((item) => {
                      const isChecked = checked.has(item.id)
                      return (
                        <motion.button
                          key={item.id}
                          onClick={() => toggleItem(item.id)}
                          className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border-2 text-left transition-all duration-300 ${
                            isChecked
                              ? 'border-sage/30 bg-sage/5'
                              : 'border-transparent bg-white shadow-card hover:shadow-card-hover'
                          }`}
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <div
                            className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${
                              isChecked
                                ? 'bg-sage border-sage'
                                : 'border-sage/20 bg-transparent'
                            }`}
                          >
                            <AnimatePresence>
                              {isChecked && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  exit={{ scale: 0 }}
                                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                >
                                  <Check size={14} className="text-white" />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                          <item.icon
                            size={18}
                            className={`shrink-0 transition-colors ${
                              isChecked ? 'text-sage' : 'text-gray/40'
                            }`}
                          />
                          <span
                            className={`text-body-sm transition-all ${
                              isChecked ? 'text-dark/60 line-through' : 'text-dark'
                            }`}
                          >
                            {item.label}
                          </span>
                        </motion.button>
                      )
                    })}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-20 px-6 bg-gradient-to-b from-coral/10 to-gold/20"
      >
        <div className="max-w-2xl mx-auto text-center">
          <motion.div {...fadeUp}>
            {progressPercent === 100 ? (
              <div>
                <div className="w-16 h-16 rounded-full bg-sage flex items-center justify-center mx-auto mb-4">
                  <Check size={32} className="text-white" />
                </div>
                <h2 className="text-heading-2 text-dark mb-4">You Are Ready!</h2>
                <p className="text-body-lg text-gray mb-8">
                  All preparation steps complete. Your transformation journey awaits.
                </p>
              </div>
            ) : (
              <div>
                <h2 className="text-heading-2 text-dark mb-4">Keep Going!</h2>
                <p className="text-body-lg text-gray mb-8">
                  {totalItems - completedCount} more item{totalItems - completedCount !== 1 ? 's' : ''} to go.
                  Every step prepares you for success.
                </p>
              </div>
            )}

            <button
              onClick={() => router.push('/intention-setting')}
              className="btn-primary text-lg px-10 py-4"
            >
              <Sparkles size={22} className="inline mr-2 -mt-0.5" />
              {progressPercent === 100 ? "I'm Ready!" : 'Continue To Intention Setting'}
            </button>

            {progressPercent < 100 && (
              <p className="text-caption text-gray mt-4">
                You can always return to this checklist later
              </p>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  )
}

