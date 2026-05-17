import { getAudit } from "@/actions/audit";
import { AuditResults } from "../AuditResults";
import { ClipboardCheck, Sparkles, Target, BarChart3, Play } from "lucide-react";
import Link from "next/link";

export default async function DashboardAudit() {
  const audit = await getAudit();

  if (audit) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="heading-1 text-dark mb-2">Your Balance Scorecard</h1>
            <p className="text-body text-gray">
              Insights and analysis for your work-life harmony.
            </p>
          </div>
        </div>
        <AuditResults scores={audit.scores} insights={audit.insights} />
      </div>
    );
  }

  const features = [
    {
      icon: ClipboardCheck,
      title: '15-Question Assessment',
      description: 'A thorough evaluation covering every dimension of your life balance.',
      color: 'text-sage',
      bg: 'bg-sage/10',
    },
    {
      icon: Sparkles,
      title: 'AI Insights',
      description: 'Receive thoughtful, personalized analysis from Cherry Blossom AI.',
      color: 'text-coral',
      bg: 'bg-coral/10',
    },
    {
      icon: Target,
      title: 'Priority Areas',
      description: 'Discover exactly which areas to focus on for maximum impact.',
      color: 'text-gold',
      bg: 'bg-gold/10',
    },
    {
      icon: BarChart3,
      title: 'Scorecard',
      description: 'See your balance scorecard the moment you complete the audit.',
      color: 'text-sky',
      bg: 'bg-sky/10',
    },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="heading-1 text-dark mb-2">Balance Audit</h1>
        <p className="text-body text-gray">Review and optimize your work-life balance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl p-10 bg-gradient-to-br from-sage/15 via-white to-gold/15 border border-white/60 shadow-glass relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-sage/5 rounded-full -mr-32 -mt-32 blur-3xl" />
             <div className="relative z-10">
              <h2 className="text-4xl font-bold text-dark mb-4">Ready for your clarity?</h2>
              <p className="text-lg text-gray mb-10 max-w-xl leading-relaxed">
                Our comprehensive 15-question assessment evaluates key life areas to give you a complete picture of your current balance.
              </p>
              <Link
                href="/audit-onboarding"
                className="inline-flex items-center gap-3 px-10 py-5 bg-sage text-white rounded-2xl font-bold hover:bg-sage-dark transition-all shadow-xl shadow-sage/20 group text-lg"
              >
                <Play size={24} className="group-hover:scale-110 transition-transform fill-current" />
                Start Audit Now
              </Link>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feat) => (
              <div
                key={feat.title}
                className="p-6 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-glass"
              >
                <div className={`w-12 h-12 rounded-xl ${feat.bg} flex items-center justify-center mb-4`}>
                  <feat.icon size={24} className={feat.color} />
                </div>
                <h3 className="heading-4 text-dark mb-2">{feat.title}</h3>
                <p className="text-sm text-gray">{feat.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl p-6 bg-white/80 backdrop-blur-xl border border-white/60 shadow-glass">
            <h3 className="heading-4 text-dark mb-4">Why Audit?</h3>
            <div className="space-y-4">
              {[
                "Identify hidden bottlenecks in your daily routine.",
                "Compare your current state with your ideal lifestyle.",
                "Get data-driven suggestions for improvement."
              ].map((text, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-sage/20 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-sage" />
                  </div>
                  <p className="text-sm text-gray">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-8 bg-dark text-white shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles size={20} className="text-gold" />
                <h3 className="font-semibold">AI Powered</h3>
              </div>
              <p className="text-sm text-gray-light leading-relaxed">
                Cherry Blossom AI analyzes your answers to provide deep insights that go beyond simple scoring.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
