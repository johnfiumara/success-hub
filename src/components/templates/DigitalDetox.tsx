// @ts-nocheck
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import {
  Moon,
  Smartphone,
  BookOpen,
  StretchHorizontal,
  Coffee,
  BedDouble,
  ArrowLeft,
  CheckCircle2,
  Circle,
  Bell,
  Sparkles,
  MoonStar,
  Thermometer,
  Sun,
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
    time: '9:00 – 9:10',
    title: 'Digital Sunset',
    desc: 'Turn off all screens and devices',
    icon: Smartphone,
    color: 'text-lavender',
    bgColor: 'bg-lavender/10',
    borderColor: 'border-lavender/30',
  },
  {
    time: '9:10 – 9:25',
    title: 'Reflection & Journaling',
    desc: 'Review your day, write gratitudes',
    icon: BookOpen,
    color: 'text-gold',
    bgColor: 'bg-gold/10',
    borderColor: 'border-gold/30',
  },
  {
    time: '9:25 – 9:40',
    title: 'Gentle Stretching',
    desc: 'Yoga or mobility work',
    icon: StretchHorizontal,
    color: 'text-sage',
    bgColor: 'bg-sage/10',
    borderColor: 'border-sage/30',
  },
  {
    time: '9:40 – 9:50',
    title: 'Herbal Tea Ritual',
    desc: 'Calming tea, dim lights',
    icon: Coffee,
    color: 'text-coral',
    bgColor: 'bg-coral/10',
    borderColor: 'border-coral/30',
  },
  {
    time: '9:50 – 10:00',
    title: 'Sleep Preparation',
    desc: 'Read, breathe, drift off',
    icon: BedDouble,
    color: 'text-sage-dark',
    bgColor: 'bg-sage-dark/10',
    borderColor: 'border-sage-dark/30',
  },
]

const features = [
  {
    title: 'Screen-Free Evening',
    desc: 'Disconnect from digital stimulation and create space for true rest and recovery.',
    icon: Smartphone,
    color: 'text-lavender',
    bgColor: 'bg-lavender/10',
  },
  {
    title: 'Nervous System Reset',
    desc: 'Calm your nervous system with gentle movement, breathwork, and stillness.',
    icon: StretchHorizontal,
    color: 'text-sage',
    bgColor: 'bg-sage/10',
  },
  {
    title: 'Sleep Quality',
    desc: 'Prepare your body and mind for deep, restorative sleep that heals and renews.',
    icon: MoonStar,
    color: 'text-gold',
    bgColor: 'bg-gold/10',
  },
  {
    title: 'Hormone Balance',
    desc: 'Support overnight hormone repair and regulation through proper sleep hygiene.',
    icon: Sparkles,
    color: 'text-coral',
    bgColor: 'bg-coral/10',
  },
]

const checklistItems = [
  'Turn off all screens by 9:00 PM',
  'Write 3 things you\'re grateful for',
  'Reflect on today\'s wins and lessons',
  'Complete 10 minutes of gentle stretching',
  'Prepare and sip calming herbal tea',
  'Dim the lights 30 minutes before bed',
  'Read a physical book (not a screen)',
  'Practice 5 minutes of deep breathing',
]

const sleepTips = [
  {
    title: 'Keep It Cool',
    desc: 'Set your bedroom temperature to 60–67°F for optimal sleep.',
    icon: Thermometer,
    color: 'text-lavender',
    bgColor: 'bg-lavender/10',
  },
  {
    title: 'Dark & Quiet',
    desc: 'Use blackout curtains and white noise to minimize disruptions.',
    icon: Moon,
    color: 'text-gold',
    bgColor: 'bg-gold/10',
  },
  {
    title: 'Consistent Schedule',
    desc: 'Go to bed and wake up at the same time every day — even weekends.',
    icon: Sun,
    color: 'text-sage',
    bgColor: 'bg-sage/10',
  },
  {
    title: 'Avoid Caffeine',
    desc: 'Skip caffeine after 2 PM to ensure it doesn\'t affect your sleep.',
    icon: Coffee,
    color: 'text-coral',
    bgColor: 'bg-coral/10',
  },
]

export default function DigitalDetox() {
  const navigate = useNavigate()
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
    <main className="min-h-[100dvh] bg-[#F9F6F0]">
      {/* ─── Hero Section ─── */}
      <section className="bg-gradient-to-br from-lavender/20 via-cream to-sage/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIgZmlsbD0iIzliOGVjNyIgZmlsbC1vcGFjaXR5PSIwLjE1Ii8+PC9zdmc+')] opacity-40" />
        <div className="max-w-[1200px] mx-auto px-6 pt-12 pb-20 relative">
          <motion.button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-[#6B6B6B] hover:text-[#2D2D2D] transition-colors mb-8 group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-body-sm">Back to Home</span>
          </motion.button>

          <motion.div
            className="inline-flex items-center gap-2 bg-[#9B8EC7]/15 text-[#7A6DA7] text-caption px-4 py-1.5 rounded-full mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Moon size={14} />
            9:00 PM — 10:00 PM
          </motion.div>

          <motion.h1
            className="text-heading-1 text-[#2D2D2D] mb-3 max-w-[800px]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Power Down & Unplug Digital Detox
          </motion.h1>

          <motion.p
            className="text-body-lg text-[#6B6B6B] mb-4 max-w-[600px]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Evening Wind-Down & Nervous System Regulation
          </motion.p>

          <motion.p
            className="text-body text-[#6B6B6B]/80 max-w-[600px]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Your evening wind-down and nervous system regulation for restorative sleep and
            overnight hormone repair. This 1-hour digital detox prepares your body and mind
            for deep, healing sleep.
          </motion.p>
        </div>
      </section>

      {/* ─── Timeline Section ─── */}
      <section className="section-padding bg-cream-dark">
        <div className="max-w-[800px] mx-auto px-6">
          <motion.div className="text-center mb-12" {...fadeUp}>
            <span className="text-caption text-lavender mb-2 block">Your Evening Flow</span>
            <h2 className="text-heading-2 text-dark">1-Hour Detox Breakdown</h2>
          </motion.div>

          <div className="relative">
            <div className="absolute left-[27px] top-0 bottom-0 w-0.5 bg-[#9B8EC7]/20 hidden md:block" />

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
                <div
                  className={`hidden md:flex w-14 h-14 rounded-full ${item.bgColor} items-center justify-center shrink-0 z-10 border-2 ${item.borderColor}`}
                >
                  <item.icon size={22} className={item.color} />
                </div>

                <div className="flex-1 bg-white rounded-[20px] p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <span className="inline-block text-caption text-gray bg-sage-light/30 px-3 py-1 rounded-full mb-2">
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
      <section className="section-padding bg-lavender-light/30">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div className="text-center mb-12" {...fadeUp}>
            <span className="text-caption text-lavender mb-2 block">Benefits</span>
            <h2 className="text-heading-2 text-dark">Why Power Down Each Night?</h2>
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
                <h3 className="text-heading-4 text-dark mb-2">{feature.title}</h3>
                <p className="text-body-sm text-gray">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Interactive Checklist + Sleep Tips ─── */}
      <section className="section-padding bg-[#F9F6F0]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Checklist */}
            <motion.div {...fadeUp}>
              <div className="text-center lg:text-left mb-8">
                <span className="text-caption text-lavender mb-2 block">Interactive Tracker</span>
                <h2 className="text-heading-3 text-dark mb-2">Bedtime Checklist</h2>
                <p className="text-body text-gray">
                  Track your evening routine for better sleep quality.
                </p>
              </div>

              <div className="bg-white rounded-[24px] p-6 shadow-sm">
                {/* Progress bar */}
                <div className="mb-5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-body-sm text-gray">Evening Progress</span>
                    <span className="text-body-sm font-semibold text-lavender">{progress}%</span>
                  </div>
                  <div className="h-2.5 bg-sage-light/30 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-lavender to-sage rounded-full"
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }}
                    />
                  </div>
                </div>

                {/* Checklist items */}
                <div className="space-y-2">
                  {checklistItems.map((item, index) => (
                    <motion.button
                      key={item}
                      onClick={() => toggleCheck(index)}
                      className={`w-full flex items-center gap-3 p-3.5 rounded-[14px] border transition-all duration-300 text-left ${
                        checked.has(index)
                          ? 'bg-lavender-light/20 border-lavender/30'
                          : 'bg-white border-cream-dark hover:border-lavender/30'
                      }`}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.04,
                        ease: [0.25, 0.46, 0.45, 0.94] as const,
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {checked.has(index) ? (
                        <CheckCircle2 size={22} className="text-lavender shrink-0" />
                      ) : (
                        <Circle size={22} className="text-gray-light shrink-0" />
                      )}
                      <span
                        className={`text-body-sm ${
                          checked.has(index) ? 'text-lavender-dark line-through' : 'text-dark'
                        }`}
                      >
                        {item}
                      </span>
                    </motion.button>
                  ))}
                </div>

                {progress === 100 && (
                  <motion.div
                    className="mt-5 text-center p-4 bg-lavender/10 rounded-[16px]"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <p className="text-body text-lavender-dark font-semibold">
                      You&apos;re all set for a restful night.
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Sleep Tips */}
            <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.15 }}>
              <div className="text-center lg:text-left mb-8">
                <span className="text-caption text-lavender mb-2 block">Expert Advice</span>
                <h2 className="text-heading-3 text-dark mb-2">Sleep Better Tonight</h2>
                <p className="text-body text-gray">
                  Simple tips to improve your sleep quality starting tonight.
                </p>
              </div>

              <div className="space-y-4">
                {sleepTips.map((tip, index) => (
                  <motion.div
                    key={tip.title}
                    className="bg-white rounded-[20px] p-5 shadow-sm flex gap-4 items-start hover:shadow-md transition-shadow duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.08,
                      ease: [0.25, 0.46, 0.45, 0.94] as const,
                    }}
                  >
                    <div
                      className={`w-11 h-11 rounded-full ${tip.bgColor} flex items-center justify-center shrink-0`}
                    >
                      <tip.icon size={20} className={tip.color} />
                    </div>
                    <div>
                      <h4 className="text-body font-semibold text-dark mb-0.5">{tip.title}</h4>
                      <p className="text-body-sm text-gray">{tip.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="py-20 bg-lavender-light/30">
        <div className="max-w-[700px] mx-auto px-6 text-center">
          <motion.div {...fadeUp}>
            <h2 className="text-heading-2 text-dark mb-4">
              Ready for Restorative Sleep?
            </h2>
            <p className="text-body-lg text-gray mb-8">
              Join our evening digital detox community and wake up refreshed every morning.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => navigate('/dashboard/schedule')} className="btn-primary">Join The Digital Detox</button>
              <button className="btn-outline-sage flex items-center justify-center gap-2">
                <Bell size={18} />
                Set Your Bedtime Reminder
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
