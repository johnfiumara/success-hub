import { memo } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Sparkles, Palette, Users, TreePine, BookOpen, Wine, Music, Camera, Heart, GraduationCap, Mountain, Flower2, Utensils, Brush } from 'lucide-react'

const experiences = [
  { name: 'Paint & Sip', icon: Palette, color: 'coral' },
  { name: 'Cooking Class', icon: Utensils, color: 'gold' },
  { name: 'Hiking Group', icon: Mountain, color: 'sage' },
  { name: 'Book Club', icon: BookOpen, color: 'lavender' },
  { name: 'Dance Night', icon: Music, color: 'coral' },
  { name: 'Volunteer Day', icon: Heart, color: 'sage' },
  { name: 'Photography Walk', icon: Camera, color: 'gold' },
  { name: 'Gardening Circle', icon: Flower2, color: 'sage' },
  { name: 'Meditation Retreat', icon: Sparkles, color: 'lavender' },
  { name: 'Wine Tasting', icon: Wine, color: 'coral' },
  { name: 'Craft Workshop', icon: Brush, color: 'gold' },
  { name: 'Music Jam', icon: Music, color: 'lavender' },
]

const categories = [
  { icon: Palette, title: 'Creative Pursuits', desc: 'Express yourself through art, music, and creative workshops', color: 'coral' },
  { icon: Users, title: 'Social Connection', desc: 'Build meaningful relationships through shared experiences', color: 'sage' },
  { icon: TreePine, title: 'Nature & Adventure', desc: 'Explore the outdoors and connect with the natural world', color: 'gold' },
  { icon: GraduationCap, title: 'Learning & Growth', desc: 'Expand your horizons with new skills and knowledge', color: 'lavender' },
]

const LifestyleExperiences = memo(function LifestyleExperiences() {
  const router = useRouter()
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative section-padding overflow-hidden bg-gradient-to-br from-sage/20 via-cream to-gold/20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.button onClick={() => router.push('/#cherry-blossom')} className="flex items-center gap-2 text-gray hover:text-sage-dark transition-colors mb-8" whileHover={{ x: -4 }}>
            <ArrowLeft size={18} />
            <span className="text-body-sm">Back to Home</span>
          </motion.button>
          <div className="text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, type: 'spring' }} className="w-20 h-20 rounded-full bg-gradient-to-br from-sage to-gold flex items-center justify-center mx-auto mb-6">
              <Sparkles size={40} className="text-white" />
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="text-heading-1 text-dark mb-4">Quality of Lifestyle Experiences</motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="text-body-lg text-gray mb-4">12 Curated Experiences for Evenings & Weekends</motion.p>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }} className="text-body text-gray max-w-2xl mx-auto">Your joy, creativity, and connection co-guide for immersing in the real wealth of life experiences.</motion.p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white section-padding">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2 initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-heading-2 text-dark text-center mb-12">Experience Categories</motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
              <motion.div 
                key={cat.title} 
                initial={{ opacity: 0, y: 40 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.7, delay: i * 0.1 }} 
                className={`rounded-3xl p-8 text-center border hover:-translate-y-1 transition-all duration-300 bg-${cat.color}/5 border-${cat.color}/20`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-gradient-to-br from-${cat.color} to-${cat.color}/50`}>
                  <cat.icon size={28} className="text-white" />
                </div>
                <h3 className="text-heading-4 text-dark mb-2">{cat.title}</h3>
                <p className="text-body-sm text-gray">{cat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 12 Experience Grid */}
      <section className="bg-cream section-padding">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2 initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-heading-2 text-dark text-center mb-12">12 Curated Experiences</motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {experiences.map((exp, i) => (
              <motion.div 
                key={exp.name} 
                initial={{ opacity: 0, scale: 0.9 }} 
                whileInView={{ opacity: 1, scale: 1 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.5, delay: i * 0.05 }} 
                className="rounded-2xl p-6 text-center bg-white border border-sage/10 hover:border-sage/30 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 bg-${exp.color}/15`}>
                  <exp.icon size={24} className={`text-${exp.color}`} />
                </div>
                <p className="text-sm font-medium text-dark">{exp.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-sunset">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <h2 className="text-heading-2 text-white mb-4">Ready to Explore?</h2>
            <p className="text-body-lg text-white/90 mb-8">Start planning your quality lifestyle experiences and make every evening and weekend count.</p>
            <button onClick={() => router.push('/dashboard/schedule')} className="bg-white text-coral font-semibold px-8 py-4 rounded-full text-body-sm hover:shadow-lg transition-all">Plan Your Experiences</button>
          </motion.div>
        </div>
      </section>
    </div>
  )
})

export default LifestyleExperiences

