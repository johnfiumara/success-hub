// @ts-nocheck
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await login(email, password)
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
          <h1 className="text-heading-2 text-dark text-center mb-2">Welcome Back</h1>
          <p className="text-body text-gray text-center mb-6">Sign in to your Success Hub account</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm text-gray mb-1 block">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-sage/20 bg-white/60 text-dark" placeholder="you@example.com" required />
            </div>
            <div>
              <label className="text-sm text-gray mb-1 block">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-sage/20 bg-white/60 text-dark" placeholder="••••••••" required />
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary py-3 disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <div className="mt-6 text-center space-y-2">
            <button onClick={() => navigate('/auth/forgot-password')} className="text-sm text-sage hover:underline">Forgot password?</button>
            <p className="text-sm text-gray">Don&apos;t have an account? <button onClick={() => navigate('/auth/signup')} className="text-coral hover:underline font-medium">Sign up</button></p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
