import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Target } from 'lucide-react'

export default function FourHourWorkday() {
  const router = useRouter()

  return (
    <div className="min-h-screen">
      <section className="relative section-padding overflow-hidden bg-gradient-to-br from-sage/20 via-cream to-gold/20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.button onClick={() => router.push('/')} className="flex items-center gap-2 text-gray hover:text-sage-dark transition-colors mb-8" whileHover={{ x: -4 }}>
            <ArrowLeft size={18} />
            <span className="text-body-sm">Back to Home</span>
          </motion.button>
          <div className="text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, type: 'spring' }} className="w-20 h-20 rounded-full bg-gradient-to-br from-sage to-gold flex items-center justify-center mx-auto mb-6">
              <Target size={40} className="text-white" />
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="text-heading-1 text-dark mb-4">4-Hour Focused CEO Workday</motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="text-body-lg text-gray mb-4">1:00 PM — 5:00 PM | Your Productivity & Business Alignment</motion.p>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }} className="text-body text-gray max-w-2xl mx-auto">Your productivity and business alignment co-guide for working ON your business with divine co-creation and quantum focus.</motion.p>
          </div>
        </div>
      </section>
    </div>
  )
}

