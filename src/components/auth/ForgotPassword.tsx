import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

export default function ForgotPassword() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sage-light via-cream to-blush">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full mx-4">
        <button onClick={() => router.push('/auth/login')} className="flex items-center gap-2 text-gray hover:text-sage-dark mb-6">
          <ArrowLeft size={18} /> Back to Login
        </button>
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/60 shadow-glass">
          <h1 className="text-heading-2 text-dark text-center mb-2">Reset Password</h1>
          <p className="text-body text-gray text-center mb-6">Enter your email and we&apos;ll send you a reset link</p>
          {sent ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-sage/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✓</span>
              </div>
              <p className="text-body text-dark mb-2">Reset link sent!</p>
              <p className="text-body-sm text-gray">Check your email for instructions</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-gray mb-1 block">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-sage/20 bg-white/60 text-dark" placeholder="you@example.com" required />
              </div>
              <button type="submit" className="w-full btn-primary py-3">Send Reset Link</button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  )
}

