// @ts-nocheck
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function SignUp() {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await signup(name, email, password)
    setLoading(false)
    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sage-light via-cream to-blush">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full mx-4">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray hover:text-sage-dark mb-6">
          <ArrowLeft size={18} /> Back to Home
        </button>
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/60 shadow-glass">
          <h1 className="text-heading-2 text-dark text-center mb-2">Create Account</h1>
          <p className="text-body text-gray text-center mb-6">Join Success Hub and transform your work-life balance</p>
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="text-sm text-gray mb-1 block">Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-sage/20 bg-white/60 text-dark" placeholder="Jane Doe" required />
            </div>
            <div>
              <label className="text-sm text-gray mb-1 block">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-sage/20 bg-white/60 text-dark" placeholder="you@example.com" required />
            </div>
            <div>
              <label className="text-sm text-gray mb-1 block">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-sage/20 bg-white/60 text-dark" placeholder="••••••••" required />
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary py-3 disabled:opacity-50">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray">Already have an account? <button onClick={() => navigate('/auth/login')} className="text-coral hover:underline font-medium">Sign in</button></p>
        </div>
      </motion.div>
    </div>
  )
}
