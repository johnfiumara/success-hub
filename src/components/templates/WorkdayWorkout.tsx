import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Dumbbell,
  Flame,
  Zap,
  Brain,
  Clock,
  Activity,
  ArrowLeft,
  Play,
  BookOpen,
  Timer,
  Heart,
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
    time: '10:30 – 10:35',
    title: 'Warm-Up',
    desc: 'Dynamic stretching and mobility',
    icon: Activity,
    color: 'text-sage',
    bgColor: 'bg-sage/10',
    borderColor: 'border-sage/30',
  },
  {
    time: '10:35 – 10:45',
    title: 'Cardio Burst',
    desc: 'Jumping jacks, high knees, burpees',
    icon: Flame,
    color: 'text-coral',
    bgColor: 'bg-coral/10',
    borderColor: 'border-coral/30',
  },
  {
    time: '10:45 – 10:55',
    title: 'Strength Circuit',
    desc: 'Bodyweight exercises (squats, pushups, planks)',
    icon: Dumbbell,
    color: 'text-gold',
    bgColor: 'bg-gold/10',
    borderColor: 'border-gold/30',
  },
  {
    time: '10:55 – 11:00',
    title: 'Cool Down',
    desc: 'Stretching and breathing exercises',
    icon: Heart,
    color: 'text-lavender',
    bgColor: 'bg-lavender/10',
    borderColor: 'border-lavender/30',
  },
]

const features = [
  {
    title: 'No Equipment Needed',
    desc: 'Every exercise uses only your bodyweight — workout anywhere, anytime.',
    icon: Dumbbell,
    color: 'text-sage',
    bgColor: 'bg-sage/10',
  },
  {
    title: 'Boosts Energy',
    desc: 'Get a natural energy boost that lasts through your entire workday.',
    icon: Zap,
    color: 'text-gold',
    bgColor: 'bg-gold/10',
  },
  {
    title: 'Reduces Stress',
    desc: 'Release tension and cortisol with targeted movement and breath.',
    icon: Flame,
    color: 'text-coral',
    bgColor: 'bg-coral/10',
  },
  {
    title: 'Enhances Focus',
    desc: 'Sharpen mental clarity and concentration for deep work sessions.',
    icon: Brain,
    color: 'text-lavender',
    bgColor: 'bg-lavender/10',
  },
]

type WorkoutTab = 'yoga' | 'hiit' | 'strength'

const workoutPlans: Record<WorkoutTab, { name: string; exercises: string[]; duration: string }> = {
  yoga: {
    name: 'Yoga Flow',
    duration: '30 min',
    exercises: [
      'Sun Salutation A (3 rounds)',
      'Warrior I & II Flow',
      'Tree Pose Balance',
      'Seated Forward Fold',
      'Cat-Cow Spine Mobility',
      'Child\'s Pose to Downward Dog',
      'Savasana Relaxation',
    ],
  },
  hiit: {
    name: 'HIIT Circuit',
    duration: '30 min',
    exercises: [
      'Jumping Jacks (45 sec)',
      'High Knees (45 sec)',
      'Burpees (30 sec)',
      'Mountain Climbers (45 sec)',
      'Jump Squats (30 sec)',
      'Plank to Push-Up (45 sec)',
      'Rest & Repeat Circuit',
    ],
  },
  strength: {
    name: 'Strength Training',
    duration: '30 min',
    exercises: [
      'Bodyweight Squats (3 x 15)',
      'Push-Ups (3 x 10)',
      'Glute Bridges (3 x 15)',
      'Plank Hold (3 x 45 sec)',
      'Lunges (3 x 12 each)',
      'Tricep Dips (3 x 12)',
      'Wall Sit (2 x 60 sec)',
    ],
  },
}

export default function WorkdayWorkout() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<WorkoutTab>('hiit')

  const tabs: { key: WorkoutTab; label: string; icon: typeof Activity }[] = [
    { key: 'yoga', label: 'Yoga Flow', icon: Heart },
    { key: 'hiit', label: 'HIIT Circuit', icon: Flame },
    { key: 'strength', label: 'Strength Training', icon: Dumbbell },
  ]

  return (
    <main className="min-h-[100dvh] bg-cream-dark">
      {/* ─── Hero Section ─── */}
      <section className="bg-gradient-to-br from-coral/20 via-cream to-gold/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIgZmlsbD0iI2UwN2E2ZSIgZmlsbC1vcGFjaXR5PSIwLjE1Ii8+PC9zdmc+')] opacity-40" />
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
            className="inline-flex items-center gap-2 bg-coral/15 text-coral-dark text-caption px-4 py-1.5 rounded-full mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Dumbbell size={14} />
            10:30 AM — 11:00 AM
          </motion.div>

          <motion.h1
            className="text-heading-1 text-dark mb-3 max-w-[700px]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            30-Minute Workday Workout
          </motion.h1>

          <motion.p
            className="text-body-lg text-gray mb-4 max-w-[600px]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Movement & Energy Optimization
          </motion.p>

          <motion.p
            className="text-body text-gray/80 max-w-[600px]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Your movement and energy optimization for integrating physical wellness into your
            workday. This 30-minute workout is designed to boost energy, reduce stress, and
            enhance focus without requiring a gym.
          </motion.p>
        </div>
      </section>

      {/* ─── Timeline Section ─── */}
      <section className="section-padding bg-[#F9F6F0]">
        <div className="max-w-[800px] mx-auto px-6">
          <motion.div className="text-center mb-12" {...fadeUp}>
            <span className="text-caption text-coral mb-2 block">Your Workout Flow</span>
            <h2 className="text-heading-2 text-dark">30-Minute Breakdown</h2>
          </motion.div>

          <div className="relative">
            <div className="absolute left-[27px] top-0 bottom-0 w-0.5 bg-[#E07A6E]/20 hidden md:block" />

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
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={14} className="text-gray" />
                    <span className="text-caption text-gray">{item.time}</span>
                  </div>
                  <h3 className="text-heading-4 text-dark mb-1">{item.title}</h3>
                  <p className="text-body text-gray">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features Grid ─── */}
      <section className="section-padding bg-[#FDF2F0]">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div className="text-center mb-12" {...fadeUp}>
            <span className="text-caption text-coral mb-2 block">Benefits</span>
            <h2 className="text-heading-2 text-dark">Why Move During Your Workday?</h2>
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

      {/* ─── Workout Selector ─── */}
      <section className="section-padding bg-[#F9F6F0]">
        <div className="max-w-[800px] mx-auto px-6">
          <motion.div className="text-center mb-10" {...fadeUp}>
            <span className="text-caption text-coral mb-2 block">Choose Your Workout</span>
            <h2 className="text-heading-2 text-dark mb-3">Pick Your Movement Style</h2>
            <p className="text-body text-gray">
              Select the workout that matches your energy level and goals for today.
            </p>
          </motion.div>

          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
            {/* Tabs */}
            <div className="flex flex-col sm:flex-row gap-2 mb-8 bg-white rounded-[20px] p-2 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center justify-center gap-2 px-6 py-3 rounded-[16px] text-body-sm font-semibold transition-all duration-300 flex-1 ${
                    activeTab === tab.key
                      ? 'bg-coral text-white shadow-md'
                      : 'text-gray hover:bg-coral/10'
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Workout content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-[24px] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-heading-3 text-dark">
                      {workoutPlans[activeTab].name}
                    </h3>
                    <p className="text-body-sm text-gray">
                      {workoutPlans[activeTab].duration} · No equipment needed
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-coral/10 flex items-center justify-center">
                    <Timer size={22} className="text-coral" />
                  </div>
                </div>

                <div className="space-y-3">
                  {workoutPlans[activeTab].exercises.map((exercise, index) => (
                    <motion.div
                      key={exercise}
                      className="flex items-center gap-4 p-4 bg-[#F9F6F0] rounded-[14px]"
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <div className="w-8 h-8 rounded-full bg-coral/10 flex items-center justify-center shrink-0">
                        <span className="text-body-sm font-semibold text-coral">
                          {index + 1}
                        </span>
                      </div>
                      <span className="text-body text-dark">{exercise}</span>
                      <Play size={16} className="text-gray/50 ml-auto shrink-0" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="py-20 bg-[#FDF2F0]">
        <div className="max-w-[700px] mx-auto px-6 text-center">
          <motion.div {...fadeUp}>
            <h2 className="text-heading-2 text-dark mb-4">
              Ready to Get Moving?
            </h2>
            <p className="text-body-lg text-gray mb-8">
              Join our daily workout sessions and feel the difference in your energy and focus.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => router.push('/dashboard/workout')} className="btn-primary">Join The Workout</button>
              <button className="btn-outline-coral flex items-center justify-center gap-2">
                <BookOpen size={18} />
                View Workout Library
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
