// @ts-nocheck
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router'
import { ArrowLeft, CreditCard } from 'lucide-react'

export default function AdminPricing() {
  const navigate = useNavigate()

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/admin')} className="flex items-center gap-2 text-gray hover:text-sage-dark">
          <ArrowLeft size={18} />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-sage/10">
            <CreditCard size={20} className="text-sage" />
          </div>
          <h1 className="text-2xl font-bold text-dark">Pricing Tiers</h1>
        </div>
      </div>

      <div className="rounded-2xl p-8 bg-white border border-sage/10 shadow-sm">
        <h2 className="text-lg font-semibold text-dark mb-4">Manage Pricing Tiers</h2>
        <p className="text-gray mb-6">This CMS section allows you to manage your Pricing Tiers. Full editing capabilities coming soon.</p>
        <div className="flex flex-wrap gap-3">
          <button className="btn-primary text-sm">Add New</button>
          <button className="btn-outline-sage text-sm">Import</button>
          <button className="btn-outline-sage text-sm">Export</button>
        </div>
      </div>
    </motion.div>
  )
}
