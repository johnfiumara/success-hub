"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Briefcase, 
  DollarSign, 
  HeartPulse, 
  Dumbbell, 
  Apple, 
  Moon, 
  Users, 
  Baby, 
  MessageCircleHeart, 
  Flower2, 
  TrendingUp, 
  Lightbulb, 
  Home, 
  Clock, 
  PartyPopper
} from "lucide-react";
import { useRouter } from "next/navigation";
import { submitAudit } from "@/actions/audit";

const LIFE_AREAS = [
  { id: "Career", icon: Briefcase, label: "Career", color: "text-blue-500", bg: "bg-blue-50", question: "How satisfied are you with your professional growth and work environment?" },
  { id: "Finances", icon: DollarSign, label: "Finances", color: "text-emerald-500", bg: "bg-emerald-50", question: "How secure and satisfied do you feel with your current financial situation?" },
  { id: "Health", icon: HeartPulse, label: "Health", color: "text-rose-500", bg: "bg-rose-50", question: "How would you rate your overall physical health and vitality?" },
  { id: "Fitness", icon: Dumbbell, label: "Fitness", color: "text-orange-500", bg: "bg-orange-50", question: "How consistent and effective is your current exercise routine?" },
  { id: "Nutrition", icon: Apple, label: "Nutrition", color: "text-green-500", bg: "bg-green-50", question: "How well are you nourishing your body with quality food and hydration?" },
  { id: "Sleep", icon: Moon, label: "Sleep", color: "text-indigo-500", bg: "bg-indigo-50", question: "How would you rate the quality and consistency of your rest?" },
  { id: "Relationships", icon: Users, label: "Relationships", color: "text-coral", bg: "bg-coral/5", question: "How fulfilling are your romantic and close personal relationships?" },
  { id: "Family", icon: Baby, label: "Family", color: "text-pink-500", bg: "bg-pink-50", question: "How satisfied are you with your connection to and time spent with family?" },
  { id: "Social", icon: MessageCircleHeart, label: "Social", color: "text-purple-500", bg: "bg-purple-50", question: "How satisfied are you with your social life and community involvement?" },
  { id: "Spirituality", icon: Flower2, label: "Spirituality", color: "text-teal-500", bg: "bg-teal-50", question: "How connected do you feel to your sense of purpose or spirituality?" },
  { id: "Personal Growth", icon: TrendingUp, label: "Personal Growth", color: "text-sage", bg: "bg-sage/10", question: "How much time and energy are you investing in learning and self-improvement?" },
  { id: "Creativity", icon: Lightbulb, label: "Creativity", color: "text-amber-500", bg: "bg-amber-50", question: "How often do you engage in creative expression or hobbies?" },
  { id: "Home Environment", icon: Home, label: "Home Environment", color: "text-cyan-500", bg: "bg-cyan-50", question: "How much does your physical living space support your well-being?" },
  { id: "Time Management", icon: Clock, label: "Time Management", color: "text-gray-500", bg: "bg-gray-50", question: "How effectively are you managing your time and setting boundaries?" },
  { id: "Fun & Recreation", icon: PartyPopper, label: "Fun & Recreation", color: "text-gold", bg: "bg-gold/10", question: "How much joy and playfulness are you experiencing in your weekly life?" },
];

export default function AuditOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0 = Welcome, 1-15 = Questions, 16 = Submitting/Results
  const [scores, setScores] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentAreaIndex = step - 1;
  const currentArea = LIFE_AREAS[currentAreaIndex];

  const handleScoreSelect = (score: number) => {
    if (!currentArea) return;
    
    setScores(prev => ({ ...prev, [currentArea.id]: score }));
    
    if (step < LIFE_AREAS.length) {
      setStep(step + 1);
    } else {
      setStep(LIFE_AREAS.length + 1);
      handleSubmit({ ...scores, [currentArea.id]: score });
    }
  };

  const handleSubmit = async (finalScores: Record<string, number>) => {
    setIsSubmitting(true);
    try {
      await submitAudit(finalScores);
      router.push("/dashboard/audit");
    } catch (error) {
      console.error("Audit submission failed:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-8"
            >
              <div className="w-20 h-20 bg-sage rounded-3xl flex items-center justify-center mx-auto shadow-xl rotate-3">
                <Sparkles size={40} className="text-white" />
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold text-dark">Life Balance Audit</h1>
                <p className="text-xl text-gray max-w-lg mx-auto leading-relaxed">
                  15 questions to unlock clarity across every dimension of your life. Ready to see your scorecard?
                </p>
              </div>
              <button
                onClick={() => setStep(1)}
                className="btn-primary text-xl px-12 py-5 rounded-2xl group shadow-2xl shadow-sage/20"
              >
                Begin Assessment
                <ArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}

          {step > 0 && step <= LIFE_AREAS.length && (
            <motion.div
              key={currentArea?.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setStep(step - 1)}
                  className="p-2 text-gray hover:text-dark transition-colors"
                >
                  <ArrowLeft size={24} />
                </button>
                <div className="text-sm font-bold text-sage bg-sage/10 px-4 py-1.5 rounded-full">
                  Question {step} of 15
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 md:p-12 shadow-glass border border-white/60 space-y-10 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100">
                  <motion.div 
                    className="h-full bg-sage"
                    initial={{ width: `${((step - 1) / 15) * 100}%` }}
                    animate={{ width: `${(step / 15) * 100}%` }}
                  />
                </div>

                <div className={`w-20 h-20 ${currentArea?.bg} ${currentArea?.color} rounded-2xl flex items-center justify-center mx-auto mb-2`}>
                   {currentArea && <currentArea.icon size={40} />}
                </div>

                <div className="space-y-3">
                  <h2 className="text-3xl font-bold text-dark">{currentArea?.label}</h2>
                  <p className="text-lg text-gray leading-relaxed">
                    {currentArea?.question}
                  </p>
                </div>

                <div className="grid grid-cols-5 md:grid-cols-10 gap-2 md:gap-3">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                    <button
                      key={score}
                      onClick={() => handleScoreSelect(score)}
                      className={`h-12 md:h-16 rounded-xl font-bold text-lg transition-all border-2 ${
                        scores[currentArea?.id || ""] === score
                          ? "bg-sage text-white border-sage scale-105"
                          : "bg-cream/50 text-dark border-transparent hover:border-sage/30 hover:bg-white"
                      }`}
                    >
                      {score}
                    </button>
                  ))}
                </div>

                <div className="flex justify-between text-[10px] uppercase font-bold text-gray tracking-widest px-2">
                   <span>Least Satisfied</span>
                   <span>Most Satisfied</span>
                </div>
              </div>
            </motion.div>
          )}

          {step > LIFE_AREAS.length && (
            <motion.div
              key="submitting"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-8"
            >
              <div className="w-24 h-24 bg-sage/10 text-sage rounded-full flex items-center justify-center mx-auto animate-pulse">
                <CheckCircle2 size={48} />
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl font-bold text-dark">Calculating your results...</h2>
                <p className="text-xl text-gray max-w-md mx-auto">
                  Cherry Blossom AI is analyzing your inputs to generate personalized insights for your journey.
                </p>
              </div>
              <div className="flex justify-center">
                 <div className="w-64 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-sage"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
