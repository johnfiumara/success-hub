import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Sunrise,
  Heart,
  Target,
  Eye,
  Wind,
  Apple,
  Sparkles,
  Brain,
  Zap,
  Smile,
  CheckCircle2,
  Circle,
  ArrowLeft,
  Bell,
} from 'lucide-react'

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
}

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } },
  viewport: { once: true, amount: 0.15 },
}

const staggerItem = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
}

const timelineItems = [
  {
    time: '9:00 – 9:15',
    title: 'Gratitude Practice',
    desc: 'Write 3 things you\'re grateful for',
    icon: Heart,
    color: 'text-coral',
    bgColor: 'bg-coral/10',
    borderColor: 'border-coral/30',
  },
  {
    time: '9:15 – 9:30',
    title: 'Intention Setting',
    desc: 'Set your top 3 intentions for the day',
    icon: Target,
    color: 'text-sage',
    bgColor: 'bg-sage/10',
    borderColor: 'border-sage/30',
  },
  {
    time: '9:30 – 9:45',
    title: 'Visualization',
    desc: 'Visualize your ideal day unfolding',
    icon: Eye,
    color: 'text-gold',
    bgColor: 'bg-gold/10',
    borderColor: 'border-gold/30',
  },
  {
    time: '9:45 – 10:00',
    title: 'Energy Work',
    desc: 'Breathwork and gentle movement',
    icon: Wind,
    color: 'text-lavender',
    bgColor: 'bg-lavender/10',
    borderColor: 'border-lavender/30',
  },
  {
    time: '10:00 – 10:30',
    title: 'Nourishment',
    desc: 'Healthy breakfast with mindful eating',
    icon: Apple,
    color: 'text-sage-dark',
    bgColor: 'bg-sage-dark/10',
    borderColor: 'border-sage-dark/30',
  },
]

const features = [
  {
    title: 'Spiritual Alignment',
    desc: 'Connect with your higher purpose and set divine intentions for the day ahead.',
    icon: Sparkles,
    color: 'text-lavender',
    bgColor: 'bg-lavender/10',
  },
  {
    title: 'Mental Clarity',
    desc: 'Clear mental fog and sharpen your focus for productive, meaningful work.',
    icon: Brain,
    color: 'text-gold',
    bgColor: 'bg-gold/10',
  },
  {
    title: 'Physical Energy',
    desc: 'Energize your body with breathwork, movement, and nourishing foods.',
    icon: Zap,
    color: 'text-sage',
    bgColor: 'bg-sage/10',
  },
  {
    title: 'Emotional Balance',
    desc: 'Ground your emotions through gratitude and visualization practices.',
    icon: Smile,
    color: 'text-coral',
    bgColor: 'bg-coral/10',
  },
]

const checklistItems = [
  'Write 3 things you\'re grateful for',
  'Set your top 3 intentions for the day',
  'Visualize your ideal day unfolding',
  'Complete 5 minutes of breathwork',
  'Do gentle stretching or movement',
  'Eat a nourishing, mindful breakfast',
]

export default function MorningRoutine() {
  const router = useRouter()
  const [checked, setChecked] = useState<Set<number>>(new Set())

  const toggleCheck = (index: number) => {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  const progress = Math.round((checked.size / checklistItems.length) * 100)

  return (
    <main className="min-h-[100dvh] bg-cream-dark">
      {/* ─── Hero Section ─── */}
      <section className="bg-gradient-to-br from-gold/30 via-cream to-sage/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIgZmlsbD0iI2RmYjg1NSIgZmlsbC1vcGFjaXR5PSIwLjIiLz48L3N2Zz4=')] opacity-40" />
        <div className="max-w-[1200px] mx-auto px-6 pt-12 pb-20 relative">
          <motion.button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-gray hover:text-dark transition-colors mb-8 group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-body-sm">Back to Home</span>
          </motion.button>

          <motion.div
            className="inline-flex items-center gap-2 bg-gold/20 text-gold-dark text-caption px-4 py-1.5 rounded-full mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Sunrise size={14} />
            9:00 AM — 10:30 AM
          </motion.div>

          <motion.h1
            className="text-heading-1 text-dark mb-3 max-w-[700px]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Morning GIV•EN™ Routine
          </motion.h1>

          <motion.p
            className="text-body-lg text-gray mb-4 max-w-[600px]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Start Each Day With Intention & Divine Connection
          </motion.p>

          <motion.p
            className="text-body text-gray/80 max-w-[600px]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Your spiritual alignment and morning routine for starting each day with intention
            and divine connection. This 90-minute sacred practice centers your mind, body, and
            spirit before the workday begins.
          </motion.p>
        </div>
      </section>

      {/* ─── Timeline Section ─── */}
      <section className="section-padding bg-[#F9F6F0]">
        <div className="max-w-[800px] mx-auto px-6">
          <motion.div className="text-center mb-12" {...fadeUp}>
            <span className="text-caption text-sage mb-2 block">Your Sacred Morning Flow</span>
            <h2 className="text-heading-2 text-dark">90-Minute Routine Breakdown</h2>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[27px] top-0 bottom-0 w-0.5 bg-[#8FB573]/20 hidden md:block" />

            {timelineItems.map((item, index) => (
              <motion.div
                key={item.title}
                className="flex gap-5 mb-8 last:mb-0 relative"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.6,
                  ease: [0.25, 0.46, 0.45, 0.94] as const,
                  delay: index * 0.08,
                }}
              >
                {/* Timeline dot */}
                <div
                  className={`hidden md:flex w-14 h-14 rounded-full ${item.bgColor} items-center justify-center shrink-0 z-10 border-2 ${item.borderColor}`}
                >
                  <item.icon size={22} className={item.color} />
                </div>

                {/* Content card */}
                <div className="flex-1 bg-white rounded-[20px] p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <span className="inline-block text-caption text-gray bg-sage-light px-3 py-1 rounded-full mb-2">
                    {item.time}
                  </span>
                  <h3 className="text-heading-4 text-dark mb-1">{item.title}</h3>
                  <p className="text-body text-gray">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features Grid ─── */}
      <section className="section-padding bg-[#F0F4E8]">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div className="text-center mb-12" {...fadeUp}>
            <span className="text-caption text-[#8FB573] mb-2 block">Benefits</span>
            <h2 className="text-heading-2 text-[#2D2D2D]">Why Practice This Routine?</h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            {...staggerContainer}
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                className="card-feature text-center"
                variants={staggerItem}
              >
                <div
                  className={`w-14 h-14 rounded-full ${feature.bgColor} flex items-center justify-center mx-auto mb-4`}
                >
                  <feature.icon size={26} className={feature.color} />
                </div>
                <h3 className="text-heading-4 text-[#2D2D2D] mb-2">{feature.title}</h3>
                <p className="text-body-sm text-[#6B6B6B]">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Interactive Checklist ─── */}
      <section className="section-padding bg-[#F9F6F0]">
        <div className="max-w-[700px] mx-auto px-6">
          <motion.div className="text-center mb-10" {...fadeUp}>
            <span className="text-caption text-[#8FB573] mb-2 block">Interactive Tracker</span>
            <h2 className="text-heading-2 text-[#2D2D2D] mb-3">Your Morning Checklist</h2>
            <p className="text-body text-[#6B6B6B]">
              Track your progress and build consistency with your morning practice.
            </p>
          </motion.div>

          <motion.div
            className="bg-white rounded-[24px] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.1 }}
          >
            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-body-sm text-[#6B6B6B]">Routine Progress</span>
                <span className="text-body-sm font-semibold text-[#8FB573]">{progress}%</span>
              </div>
              <div className="h-2.5 bg-[#F0F4E8] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#8FB573] to-[#D4A853] rounded-full"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }}
                />
              </div>
            </div>

            {/* Checklist items */}
            <div className="space-y-3">
              {checklistItems.map((item, index) => (
                <motion.button
                  key={item}
                  onClick={() => toggleCheck(index)}
                  className={`w-full flex items-center gap-4 p-4 rounded-[16px] border transition-all duration-300 text-left ${
                    checked.has(index)
                      ? 'bg-[#F0F4E8] border-[#8FB573]/30'
                      : 'bg-white border-[#E5E5E5] hover:border-[#8FB573]/30'
                  }`}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.05,
                    ease: [0.25, 0.46, 0.45, 0.94] as const,
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  {checked.has(index) ? (
                    <CheckCircle2 size={24} className="text-[#8FB573] shrink-0" />
                  ) : (
                    <Circle size={24} className="text-[#C5C5C5] shrink-0" />
                  )}
                  <span
                    className={`text-body ${
                      checked.has(index) ? 'text-[#5A7D4A] line-through' : 'text-[#2D2D2D]'
                    }`}
                  >
                    {item}
                  </span>
                </motion.button>
              ))}
            </div>

            {progress === 100 && (
              <motion.div
                className="mt-6 text-center p-4 bg-[#8FB573]/10 rounded-[16px]"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <p className="text-body text-[#5A7D4A] font-semibold">
                  All done! You&apos;re ready for an amazing day.
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="py-20 bg-[#F0F4E8]">
        <div className="max-w-[700px] mx-auto px-6 text-center">
          <motion.div {...fadeUp}>
            <h2 className="text-heading-2 text-[#2D2D2D] mb-4">
              Ready to Transform Your Mornings?
            </h2>
            <p className="text-body-lg text-[#6B6B6B] mb-8">
              Join our community and start each day with intention, clarity, and divine connection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => router.push('/dashboard/schedule')} className="btn-primary">Join The Morning Routine</button>
              <button className="btn-outline-sage flex items-center justify-center gap-2">
                <Bell size={18} />
                Set Your Morning Reminder
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}

