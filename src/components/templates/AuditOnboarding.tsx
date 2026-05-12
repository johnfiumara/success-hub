// @ts-nocheck
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ClipboardList,
  Sparkles,
  Target,
  Search,
  BarChart3,
  MessageSquareHeart,
  Flag,
  CheckCircle2,
  Circle,
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
    title: '15 Key Life Areas',
    description: 'Comprehensive assessment covering career, health, relationships, creativity, and more.',
    color: 'text-sage',
    bg: 'bg-sage/10',
  },
  {
    icon: Sparkles,
    title: 'Instant AI Insights',
    description: 'Get personalized analysis powered by Cherry Blossom AI in real-time.',
    color: 'text-coral',
    bg: 'bg-coral/10',
  },
  {
    icon: Target,
    title: 'Personalized Action Plan',
    description: 'Receive a tailored roadmap with clear next steps for your transformation.',
    color: 'text-gold',
    bg: 'bg-gold/10',
  },
]

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Answer 15 Questions',
    description: 'Take a thoughtful 15-question assessment covering key life areas.',
  },
  {
    number: '02',
    icon: BarChart3,
    title: 'Get Your Score',
    description: 'Receive instant results with a comprehensive balance scorecard.',
  },
  {
    number: '03',
    icon: MessageSquareHeart,
    title: 'Review AI Insights',
    description: 'Get personalized AI-powered analysis from Cherry Blossom.',
  },
  {
    number: '04',
    icon: Flag,
    title: 'Set Your Intentions',
    description: 'Transform insights into actionable 28-day transformation goals.',
  },
]

const sampleQuestions = [
  {
    id: 1,
    question: 'How satisfied are you with your current work-life balance?',
    options: [
      'Very satisfied — I feel balanced and fulfilled',
      'Somewhat satisfied — A few areas need improvement',
      'Neutral — It could go either way',
      'Dissatisfied — I often feel overwhelmed',
    ],
  },
  {
    id: 2,
    question: 'How often do you make time for self-care and personal wellness?',
    options: [
      'Daily — Self-care is a non-negotiable priority',
      'A few times per week — I try when I can',
      'Rarely — I struggle to find time',
      'Almost never — There is always something else to do',
    ],
  },
  {
    id: 3,
    question: 'How connected do you feel to your sense of purpose and meaning?',
    options: [
      'Deeply connected — My life feels purposeful',
      'Somewhat connected — I know my purpose but need more alignment',
      'Uncertain — I am still figuring it out',
      'Disconnected — I feel like something is missing',
    ],
  },
]

export default function AuditOnboarding() {
  const navigate = useNavigate()
  const [answers, setAnswers] = useState<Record<number, number>>({})

  const handleSelect = (questionId: number, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }))
  }

  const answeredCount = Object.keys(answers).length

  return (
    <div className="min-h-[100dvh] bg-cream">
      {/* ─── Hero ─── */}
      <section
        className="relative pt-24 pb-20 px-6 overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #F0F4E8 0%, #8FB57320 100%)' }}
      >
        <div className="max-w-[1200px] mx-auto relative z-10">
          <motion.button
            onClick={() => navigate('/')}
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
              Step 1 of 3
            </span>
            <h1 className="text-heading-1 text-sage mb-4">Audit Onboarding</h1>
            <p className="text-serif-accent text-gray mb-4">
              Discover Where You Stand — Your Personalized Work-Life Balance Assessment
            </p>
            <p className="text-body-lg text-dark/80 max-w-2xl">
              A comprehensive 15-question assessment that evaluates 15 key life areas.
              Get instant personalized results with AI-powered insights from Cherry Blossom.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className="section-padding px-6">
        <div className="max-w-[1200px] mx-auto">
          <motion.div className="text-center mb-14" {...fadeUp}>
            <h2 className="text-heading-2 text-dark mb-3">What You Will Receive</h2>
            <p className="text-body text-gray max-w-xl mx-auto">
              Your audit results provide a complete picture of your current life balance.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feat, i) => (
              <motion.div
                key={feat.title}
                className="bg-white rounded-[24px] shadow-card border border-sage/10 p-8 text-center transition-all duration-400 hover:shadow-card-hover hover:-translate-y-2"
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
      <section className="section-padding px-6" style={{ background: 'linear-gradient(180deg, #F9F6F0 0%, #F0F4E8 100%)' }}>
        <div className="max-w-[1200px] mx-auto">
          <motion.div className="text-center mb-14" {...fadeUp}>
            <h2 className="text-heading-2 text-dark mb-3">Your Audit Journey</h2>
            <p className="text-body text-gray max-w-xl mx-auto">
              Four simple steps to uncover your personalized work-life balance insights.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                className="bg-white rounded-[20px] shadow-card p-6 text-center relative transition-all duration-400 hover:-translate-y-2 hover:shadow-card-hover"
                {...staggerFade(i * 0.1)}
              >
                <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-sage text-white text-sm font-bold flex items-center justify-center shadow-md">
                  {step.number}
                </div>
                <div className="w-12 h-12 rounded-full bg-sage/10 flex items-center justify-center mx-auto mb-4">
                  <step.icon size={24} className="text-sage" />
                </div>
                <h3 className="text-heading-4 text-dark mb-2">{step.title}</h3>
                <p className="text-body-sm text-gray">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Sample Audit Form ─── */}
      <section className="section-padding px-6">
        <div className="max-w-[800px] mx-auto">
          <motion.div className="text-center mb-12" {...fadeUp}>
            <h2 className="text-heading-2 text-dark mb-3">Preview The Audit</h2>
            <p className="text-body text-gray">
              Try these sample questions to get a feel for the assessment.
            </p>
          </motion.div>

          <motion.div
            className="bg-white rounded-[24px] shadow-card border border-sage/10 p-8 md:p-10"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const }}
          >
            {/* Progress */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-body-sm font-medium text-dark">
                  Sample Progress
                </span>
                <span className="text-body-sm text-sage font-semibold">
                  {answeredCount}/{sampleQuestions.length} answered
                </span>
              </div>
              <div className="w-full h-2.5 bg-sage/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-sage"
                  initial={{ width: 0 }}
                  animate={{ width: `${(answeredCount / sampleQuestions.length) * 100}%` }}
                  transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }}
                />
              </div>
            </div>

            {/* Questions */}
            <div className="space-y-8">
              {sampleQuestions.map((q, qi) => (
                <motion.div
                  key={q.id}
                  className="border-b border-sage/10 last:border-0 pb-8 last:pb-0"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: qi * 0.1 }}
                >
                  <p className="text-body font-medium text-dark mb-4">
                    {q.id}. {q.question}
                  </p>
                  <div className="space-y-2.5">
                    {q.options.map((option, oi) => {
                      const isSelected = answers[q.id] === oi
                      return (
                        <button
                          key={oi}
                          onClick={() => handleSelect(q.id, oi)}
                          className={`w-full text-left px-5 py-3.5 rounded-xl border-2 transition-all duration-300 flex items-start gap-3 ${
                            isSelected
                              ? 'border-sage bg-sage/5 shadow-sm'
                              : 'border-sage/10 hover:border-sage/30 hover:bg-sage/[0.02]'
                          }`}
                        >
                          {isSelected ? (
                            <CheckCircle2 size={20} className="text-sage mt-0.5 shrink-0" />
                          ) : (
                            <Circle size={20} className="text-sage/30 mt-0.5 shrink-0" />
                          )}
                          <span className={`text-body-sm ${isSelected ? 'text-dark font-medium' : 'text-gray'}`}>
                            {option}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section
        className="py-20 px-6"
        style={{ background: 'linear-gradient(180deg, #F0F4E8 0%, #8FB57330 100%)' }}
      >
        <motion.div
          className="max-w-2xl mx-auto text-center"
          {...fadeUp}
        >
          <h2 className="text-heading-2 text-dark mb-4">Ready To Discover Your Balance?</h2>
          <p className="text-body-lg text-gray mb-8">
            Take the full 15-question assessment and get your personalized results in minutes.
          </p>
          <button
            onClick={() => navigate('/work-life-balance-audit')}
            className="btn-primary text-lg px-10 py-4"
          >
            <ClipboardList size={22} className="inline mr-2 -mt-1" />
            Start Your Audit
          </button>
          <p className="text-caption text-gray mt-4">
            Takes about 5 minutes • Instant results
          </p>
        </motion.div>
      </section>
    </div>
  )
}
