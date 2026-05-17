import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Sun } from 'lucide-react'

export default function SummerSabbatical() {
  const router = useRouter()

  return (
    <div className="min-h-screen">
      <section className="relative section-padding overflow-hidden bg-gradient-to-br from-coral/20 via-cream to-sage/20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.button onClick={() => router.push('/')} className="flex items-center gap-2 text-gray hover:text-sage-dark transition-colors mb-8" whileHover={{ x: -4 }}>
            <ArrowLeft size={18} />
            <span className="text-body-sm">Back to Home</span>
          </motion.button>
          <div className="text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, type: 'spring' }} className="w-20 h-20 rounded-full bg-gradient-to-br from-coral to-sage flex items-center justify-center mx-auto mb-6">
              <Sun size={40} className="text-white" />
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="text-heading-1 text-dark mb-4">Summer Sabbatical</motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="text-body-lg text-gray mb-4">July - August | Your Permission to Disconnect & Explore</motion.p>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }} className="text-body text-gray max-w-2xl mx-auto">Two full months to travel, play, and fully disconnect. Share vacation plans, family adventures, and sabbatical experiences with the community.</motion.p>
          </div>
        </div>
      </section>
    </div>
  )
}

