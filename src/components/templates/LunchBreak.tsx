import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  UtensilsCrossed,
  Clock,
  Users,
  Footprints,
  Coffee,
  ArrowLeft,
  ChefHat,
  Heart,
  Leaf,
  Globe,
  Share2,
  Bookmark,
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
    time: '11:00 – 11:30',
    title: 'Meal Prep & Eat',
    desc: 'Prepare and enjoy a nutritious meal',
    icon: ChefHat,
    color: 'text-sage',
    bgColor: 'bg-sage/10',
    borderColor: 'border-sage/30',
  },
  {
    time: '11:30 – 12:00',
    title: 'Social Connection',
    desc: 'Connect with colleagues, friends, or family',
    icon: Users,
    color: 'text-coral',
    bgColor: 'bg-coral/10',
    borderColor: 'border-coral/30',
  },
  {
    time: '12:00 – 12:30',
    title: 'Light Activity',
    desc: 'Walk, stretch, or gentle movement',
    icon: Footprints,
    color: 'text-gold',
    bgColor: 'bg-gold/10',
    borderColor: 'border-gold/30',
  },
  {
    time: '12:30 – 1:00',
    title: 'Business Meeting (optional)',
    desc: 'Coffee chat or networking',
    icon: Coffee,
    color: 'text-lavender',
    bgColor: 'bg-lavender/10',
    borderColor: 'border-lavender/30',
  },
]

const features = [
  {
    title: 'Healthy Recipes',
    desc: 'Nutritious, easy-to-prepare meals that fuel your afternoon without the crash.',
    icon: ChefHat,
    color: 'text-sage',
    bgColor: 'bg-sage/10',
  },
  {
    title: 'Social Connection',
    desc: 'Build meaningful relationships by sharing meals and conversations.',
    icon: Users,
    color: 'text-coral',
    bgColor: 'bg-coral/10',
  },
  {
    title: 'Activity Stacking',
    desc: 'Combine nourishment with light movement for optimal midday rejuvenation.',
    icon: Footprints,
    color: 'text-gold',
    bgColor: 'bg-gold/10',
  },
  {
    title: 'Networking',
    desc: 'Turn lunch into productive relationship-building and collaboration time.',
    icon: Globe,
    color: 'text-lavender',
    bgColor: 'bg-lavender/10',
  },
]

interface Recipe {
  name: string
  tagline: string
  ingredients: string[]
  time: string
  color: string
  bgColor: string
  borderColor: string
  icon: typeof ChefHat
}

const recipes: Recipe[] = [
  {
    name: 'Mediterranean Grain Bowl',
    tagline: 'Fresh, balanced, and energizing',
    ingredients: [
      'Quinoa or farro base',
      'Cherry tomatoes & cucumber',
      'Chickpeas & feta cheese',
      'Kalamata olives',
      'Lemon-tahini dressing',
      'Fresh parsley & mint',
    ],
    time: '15 min',
    color: 'text-sage',
    bgColor: 'bg-sage/10',
    borderColor: 'border-sage/30',
    icon: Leaf,
  },
  {
    name: 'Rainbow Power Salad',
    tagline: 'Colorful nutrition in every bite',
    ingredients: [
      'Mixed greens & spinach',
      'Shredded purple cabbage',
      'Roasted sweet potato',
      'Avocado slices',
      'Toasted pumpkin seeds',
      'Balsamic vinaigrette',
    ],
    time: '12 min',
    color: 'text-coral',
    bgColor: 'bg-coral/10',
    borderColor: 'border-coral/30',
    icon: Heart,
  },
  {
    name: 'Asian-Inspired Wrap',
    tagline: 'Portable, protein-packed fuel',
    ingredients: [
      'Whole wheat or lettuce wrap',
      'Grilled chicken or tofu',
      'Shredded carrots & cabbage',
      'Edamame beans',
      'Ginger-soy dressing',
      'Sesame seeds & cilantro',
    ],
    time: '10 min',
    color: 'text-gold',
    bgColor: 'bg-gold/10',
    borderColor: 'border-gold/30',
    icon: ChefHat,
  },
]

export default function LunchBreak() {
  const router = useRouter()
  const [savedRecipes, setSavedRecipes] = useState<Set<number>>(new Set())

  const toggleSave = (index: number) => {
    setSavedRecipes((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  return (
    <main className="min-h-[100dvh] bg-[#F9F6F0]">
      {/* ─── Hero Section ─── */}
      <section className="bg-gradient-to-br from-sage/20 via-cream to-lavender/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIgZmlsbD0iIzhmYjU3MyIgZmlsbC1vcGFjaXR5PSIwLjE1Ii8+PC9zdmc+')] opacity-40" />
        <div className="max-w-[1200px] mx-auto px-6 pt-12 pb-20 relative">
          <motion.button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-[#6B6B6B] hover:text-[#2D2D2D] transition-colors mb-8 group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-body-sm">Back to Home</span>
          </motion.button>

          <motion.div
            className="inline-flex items-center gap-2 bg-[#8FB573]/15 text-[#5A7D4A] text-caption px-4 py-1.5 rounded-full mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <UtensilsCrossed size={14} />
            11:00 AM — 1:00 PM
          </motion.div>

          <motion.h1
            className="text-heading-1 text-[#2D2D2D] mb-3 max-w-[800px]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Extended Healthy Hybrid Lunch Break
          </motion.h1>

          <motion.p
            className="text-body-lg text-[#6B6B6B] mb-4 max-w-[600px]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Nourishment, Connection & Activity
          </motion.p>

          <motion.p
            className="text-body text-[#6B6B6B]/80 max-w-[600px]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Your nourishment and activity-stacking co-guide for combining social connections,
            business meetings, and healthy eating in beautiful settings. This extended lunch
            break is designed to refresh and recharge.
          </motion.p>
        </div>
      </section>

      {/* ─── Timeline Section ─── */}
      <section className="section-padding bg-[#F9F6F0]">
        <div className="max-w-[800px] mx-auto px-6">
          <motion.div className="text-center mb-12" {...fadeUp}>
            <span className="text-caption text-sage mb-2 block">Your Midday Flow</span>
            <h2 className="text-heading-2 text-dark">2-Hour Break Breakdown</h2>
          </motion.div>

          <div className="relative">
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
      <section className="section-padding bg-sage-light/50">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div className="text-center mb-12" {...fadeUp}>
            <span className="text-caption text-sage mb-2 block">Benefits</span>
            <h2 className="text-heading-2 text-dark">Why This Lunch Break Works</h2>
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

      {/* ─── Recipe Cards ─── */}
      <section className="section-padding bg-cream-dark">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div className="text-center mb-10" {...fadeUp}>
            <span className="text-caption text-sage mb-2 block">Quick & Healthy</span>
            <h2 className="text-heading-2 text-dark mb-3">Lunch Recipe Ideas</h2>
            <p className="text-body text-gray max-w-[600px] mx-auto">
              Simple, nutritious recipes you can prepare in under 15 minutes.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            {...staggerContainer}
          >
            {recipes.map((recipe, index) => (
              <motion.div
                key={recipe.name}
                className="bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-2"
                variants={staggerItem}
              >
                {/* Recipe header */}
                <div className="p-6 pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-10 h-10 rounded-full ${recipe.bgColor} flex items-center justify-center`}
                    >
                      <recipe.icon size={20} className={recipe.color} />
                    </div>
                    <div className="flex items-center gap-1 text-body-sm text-gray">
                      <Clock size={14} />
                      {recipe.time}
                    </div>
                  </div>
                  <h3 className="text-heading-4 text-dark mb-1">{recipe.name}</h3>
                  <p className="text-body-sm text-gray">{recipe.tagline}</p>
                </div>

                {/* Ingredients */}
                <div className="px-6 pb-4">
                  <div className={`${recipe.bgColor} rounded-[16px] p-4 border ${recipe.borderColor}`}>
                    <h4 className="text-caption text-gray mb-3">Ingredients</h4>
                    <ul className="space-y-2">
                      {recipe.ingredients.map((ingredient) => (
                        <li
                          key={ingredient}
                          className="flex items-center gap-2 text-body-sm text-dark"
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${recipe.bgColor.replace('/10', '')}`} />
                          {ingredient}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-6 pb-6 flex gap-3">
                  <button className="flex-1 btn-primary text-sm py-3">Try This Recipe</button>
                  <button
                    onClick={() => toggleSave(index)}
                    className={`w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      savedRecipes.has(index)
                        ? 'bg-sage border-sage text-white'
                        : 'border-cream-dark text-gray hover:border-sage'
                    }`}
                  >
                    <Bookmark size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="py-20 bg-[#F0F4E8]">
        <div className="max-w-[700px] mx-auto px-6 text-center">
          <motion.div {...fadeUp}>
            <h2 className="text-heading-2 text-dark mb-4">
              Share Your Lunch Experience
            </h2>
            <p className="text-body-lg text-gray mb-8">
              Post your healthy lunch creations and discover recipes from our community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => router.push('/dashboard/community')} className="btn-primary flex items-center justify-center gap-2">
                <Share2 size={18} />
                Post Your Lunch
              </button>
              <button onClick={() => router.push('/dashboard/community')} className="btn-outline-sage flex items-center justify-center gap-2">
                <ChefHat size={18} />
                Share a Recipe
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}

