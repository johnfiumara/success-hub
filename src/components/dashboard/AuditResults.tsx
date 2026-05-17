"use client";

import { motion } from "framer-motion";
import { 
  BarChart3, 
  Sparkles, 
  Target, 
  RefreshCcw, 
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

const AREA_ICONS: Record<string, any> = {
  Career: Briefcase,
  Finances: DollarSign,
  Health: HeartPulse,
  Fitness: Dumbbell,
  Nutrition: Apple,
  Sleep: Moon,
  Relationships: Users,
  Family: Baby,
  Social: MessageCircleHeart,
  Spirituality: Flower2,
  "Personal Growth": TrendingUp,
  Creativity: Lightbulb,
  "Home Environment": Home,
  "Time Management": Clock,
  "Fun & Recreation": PartyPopper,
};

export function AuditResults({ scores, insights }: { scores: any, insights?: string | null }) {
  const router = useRouter();
  const areas = Object.entries(scores as Record<string, number>);
  const averageScore = areas.reduce((acc, [_, val]) => acc + val, 0) / areas.length;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 rounded-3xl p-8 bg-gradient-to-br from-sage to-sage-dark text-white shadow-xl">
          <h3 className="text-white/80 font-medium mb-1">Overall Balance Score</h3>
          <div className="text-6xl font-bold mb-4">{Math.round(averageScore * 10)}%</div>
          <p className="text-white/70 text-sm leading-relaxed mb-6">
            Your current life balance shows significant potential for growth. Cherry Blossom AI has analyzed your inputs.
          </p>
          <button 
            onClick={() => router.push("/audit-onboarding")}
            className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all text-sm font-bold backdrop-blur-md"
          >
            <RefreshCcw size={16} />
            Retake Audit
          </button>
        </div>

        <div className="lg:col-span-2 rounded-3xl p-8 bg-white/80 backdrop-blur-xl border border-white/60 shadow-glass">
          <h3 className="heading-4 text-dark mb-6 flex items-center gap-2">
            <Sparkles size={20} className="text-gold" />
            AI Insights
          </h3>
          <div className="prose prose-sage max-w-none">
             <p className="text-gray leading-relaxed italic">
              "{insights || "You have a strong foundation in some areas, but there is room for optimization in your daily routines. Focus on consistency and mindful transitions between work and personal life."}"
             </p>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="flex items-start gap-3 p-4 rounded-2xl bg-sage/5 border border-sage/10">
                <Target size={20} className="text-sage mt-1" />
                <div>
                   <h4 className="font-bold text-dark text-sm">Priority Area</h4>
                   <p className="text-xs text-gray">Based on your scores, focusing on Health & Fitness will yield the highest impact.</p>
                </div>
             </div>
             <div className="flex items-start gap-3 p-4 rounded-2xl bg-coral/5 border border-coral/10">
                <BarChart3 size={20} className="text-coral mt-1" />
                <div>
                   <h4 className="font-bold text-dark text-sm">Growth Trend</h4>
                   <p className="text-xs text-gray">Consistency in your morning routine is key to improving your overall score.</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {areas.map(([area, score], i) => {
          const Icon = AREA_ICONS[area] || BarChart3;
          const scorePercent = (score as number) * 10;
          return (
            <motion.div
              key={area}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="p-5 rounded-2xl bg-white/80 border border-white/60 shadow-glass text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-sage/10 flex items-center justify-center mx-auto mb-3 text-sage">
                <Icon size={20} />
              </div>
              <h4 className="text-xs font-bold text-gray uppercase tracking-wider mb-2">{area}</h4>
              <div className="text-2xl font-bold text-dark">{scorePercent}%</div>
              <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                 <div 
                   className="h-full bg-sage rounded-full" 
                   style={{ width: `${scorePercent}%` }}
                 />
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  );
}
