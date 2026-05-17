"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Sparkles, ArrowLeft, Send, Loader2, Bot } from 'lucide-react'
import { generateAIAdvice } from '@/actions/aiGuide'
import { marked } from 'marked'

export default function DashboardAIGuide() {
  const router = useRouter()
  const [prompt, setPrompt] = useState("")
  const [messages, setMessages] = useState<{role: 'user'|'model', text: string}[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    const userMessage = { role: 'user' as const, text: prompt }
    setMessages(prev => [...prev, userMessage])
    setPrompt("")
    setIsLoading(true)
    
    try {
      const res = await generateAIAdvice(userMessage.text, messages)
      setMessages(prev => [...prev, { role: 'model' as const, text: res || "I'm having trouble connecting right now." }])
    } catch (error) {
      console.error(error)
      setMessages(prev => [...prev, { role: 'model' as const, text: "An error occurred while generating advice." }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-4xl mx-auto space-y-6 h-full flex flex-col">
      <div className="flex items-center gap-4 shrink-0">
        <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 text-gray hover:text-sage-dark transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-sage/20 to-coral/10">
            <Sparkles size={20} className="text-sage" />
          </div>
          <h1 className="heading-1 text-dark bg-clip-text text-transparent bg-gradient-to-r from-sage-dark to-sage">Cherry Blossom AI</h1>
        </div>
      </div>
      <p className="body text-gray -mt-4 ml-14 shrink-0">Your personalized AI coach, analyzing your metrics to provide actionable daily advice.</p>

      <div className="rounded-3xl p-6 md:p-8 bg-white/80 backdrop-blur-xl border border-white/60 shadow-glass flex-1 flex flex-col min-h-[600px] relative">
        {messages.length > 0 ? (
          <div className="flex-1 overflow-y-auto mb-6 pr-2 space-y-6">
            {messages.map((msg, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-dark text-white' : 'bg-gradient-to-br from-sage to-sage-dark text-white'}`}>
                  {msg.role === 'user' ? <div className="text-sm font-medium">U</div> : <Bot size={20} />}
                </div>
                <div className={`p-5 rounded-2xl max-w-[80%] ${msg.role === 'user' ? 'bg-gray-50 border border-gray-100 rounded-tr-none' : 'bg-sage/5 border border-sage/20 rounded-tl-none prose prose-sage'}`}>
                  {msg.role === 'user' ? (
                    <p className="text-dark">{msg.text}</p>
                  ) : (
                    <div dangerouslySetInnerHTML={{ __html: marked(msg.text) }} />
                  )}
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sage to-sage-dark flex items-center justify-center text-white shrink-0">
                  <Bot size={20} />
                </div>
                <div className="p-5 rounded-2xl bg-sage/5 border border-sage/20 rounded-tl-none">
                  <Loader2 size={20} className="text-sage animate-spin" />
                </div>
              </motion.div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60 mb-6">
            <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-sage/20 to-coral/10 flex items-center justify-center">
               <Bot size={48} className="text-sage" />
            </div>
            <h3 className="text-2xl font-semibold text-dark">Hello! I'm Cherry Blossom.</h3>
            <p className="text-gray mt-2 max-w-md text-lg">Ask me for a daily summary, habit analysis, or tips on improving your sleep and nutrition based on your tracked data.</p>
            
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl w-full">
               <button onClick={() => setPrompt("Give me a daily summary of my habits.")} className="p-4 rounded-xl border border-gray-200 hover:border-sage hover:bg-sage/5 text-sm text-dark transition-all text-left">
                  📊 Daily Summary
               </button>
               <button onClick={() => setPrompt("I just had a grilled chicken salad for lunch. Can you log it for me?")} className="p-4 rounded-xl border border-gray-200 hover:border-sage hover:bg-sage/5 text-sm text-dark transition-all text-left">
                  🥗 Log Nutrition
               </button>
               <button onClick={() => setPrompt("Create a task for me to go to the gym at 6pm today with high priority.")} className="p-4 rounded-xl border border-gray-200 hover:border-sage hover:bg-sage/5 text-sm text-dark transition-all text-left">
                  🏋️ Add a Task
               </button>
               <button onClick={() => setPrompt("Analyze my nutrition and suggest an area for improvement.")} className="p-4 rounded-xl border border-gray-200 hover:border-sage hover:bg-sage/5 text-sm text-dark transition-all text-left">
                  🍎 Nutrition Analysis
               </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="relative mt-auto shrink-0 bg-white rounded-2xl shadow-sm border border-gray-200 focus-within:border-sage focus-within:ring-2 focus-within:ring-sage/20 transition-all p-1">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask Cherry Blossom..."
            className="w-full px-5 py-4 pr-16 bg-transparent outline-none text-dark placeholder:text-gray-400"
            disabled={isLoading}
          />
          <button 
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="absolute right-2 top-2 bottom-2 w-12 flex items-center justify-center bg-sage text-white rounded-xl hover:bg-sage-dark transition-colors disabled:opacity-50"
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </form>
      </div>
    </motion.div>
  )
}

