'use client';

import { useState } from 'react';
import { Navbar } from '@/components/shared/Navbar';
import { CreditCard, Zap, CheckCircle2, ShieldCheck, ZapOff, ArrowRight, BarChart3, Clock } from 'lucide-react';

export default function BillingDashboard() {
  const [currentPlan, setCurrentPlan] = useState('Free');

  const usage = [
    { name: 'AI Tokens', used: 45000, limit: 100000, unit: 'Tokens' },
    { name: 'Recording Hours', used: 2.4, limit: 5, unit: 'Hours' },
    { name: 'Workspace Seats', used: 1, limit: 3, unit: 'Seats' },
  ];

  const plans = [
    { name: 'Free', price: '$0', features: ['5 Recording Hours', '100k AI Tokens', '3 Workspace Seats', 'Basic Search'], active: currentPlan === 'Free' },
    { name: 'Pro', price: '$29', features: ['50 Recording Hours', '2M AI Tokens', '15 Workspace Seats', 'Semantic Search', 'Automation Workflows', 'Long-term Memory'], active: currentPlan === 'Pro' },
    { name: 'Enterprise', price: 'Custom', features: ['Unlimited Recording', 'Priority AI Processing', 'Unlimited Seats', 'Advanced RBAC', 'Dedicated Support', 'SSO & Audit Logs'], active: currentPlan === 'Enterprise' },
  ];

  return (
    <div className="min-h-screen pt-20 bg-background overflow-x-hidden">
      <Navbar />

      <main className="max-w-[1400px] mx-auto p-6 md:p-12 space-y-16">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-5xl font-serif font-bold">Billing & Usage</h1>
          <p className="text-muted-foreground text-lg">Manage your workspace subscription and monitor intelligence consumption.</p>
        </div>

        {/* Current Plan & Usage */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <div className="p-10 rounded-[48px] border border-border bg-muted/5 space-y-8">
               <div className="flex items-center justify-between">
                  <div className="space-y-1">
                     <h3 className="text-2xl font-serif font-bold">Workspace Consumption</h3>
                     <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Monthly Usage Metering</p>
                  </div>
                  <BarChart3 className="w-6 h-6 text-accent" />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {usage.map((u) => (
                    <div key={u.name} className="space-y-4">
                       <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-muted-foreground">{u.name}</span>
                          <span>{u.used} / {u.limit}</span>
                       </div>
                       <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-accent rounded-full transition-all duration-1000" style={{ width: `${(u.used/u.limit) * 100}%` }} />
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Invoices Placeholder */}
            <div className="p-10 rounded-[48px] border border-border bg-background space-y-6">
               <h3 className="font-bold flex items-center space-x-3">
                 <Clock className="w-5 h-5 text-muted-foreground" />
                 <span>Billing History</span>
               </h3>
               <div className="text-sm text-muted-foreground italic text-center py-10 border-2 border-dashed border-border rounded-[32px]">
                 No invoices available for the current period.
               </div>
            </div>
          </div>

          <div className="space-y-8">
             <div className="p-10 rounded-[48px] bg-accent text-white shadow-2xl shadow-accent/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                <ShieldCheck className="w-8 h-8 mb-6" />
                <h3 className="text-2xl font-serif font-bold mb-2">Current Plan: {currentPlan}</h3>
                <p className="text-sm text-white/80 mb-8">Your subscription will renew on June 1, 2026.</p>
                <button className="w-full py-4 bg-white text-accent rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-white/90 transition-all">
                  Manage Subscription
                </button>
             </div>
             
             <div className="p-8 rounded-[40px] border border-border bg-muted/5 flex items-start space-x-4">
                <Zap className="w-6 h-6 text-accent flex-shrink-0" />
                <div className="space-y-2">
                   <h4 className="font-bold text-sm">Need more AI power?</h4>
                   <p className="text-xs text-muted-foreground leading-relaxed">Upgrade to the Pro plan for semantic search, automation, and 2 million tokens per month.</p>
                </div>
             </div>
          </div>
        </div>

        {/* Pricing Tiers */}
        <div className="space-y-12">
          <div className="text-center space-y-4">
             <h2 className="text-4xl font-serif font-bold">Choose your path to Intelligence</h2>
             <p className="text-muted-foreground">Select a plan that matches your team's decision velocity.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {plans.map((plan) => (
               <div key={plan.name} className={`p-10 rounded-[48px] border-2 transition-all flex flex-col ${
                 plan.active ? 'border-accent bg-accent/5' : 'border-border bg-background hover:border-muted-foreground/30'
               }`}>
                  <div className="mb-8 space-y-2">
                     <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{plan.name}</h4>
                     <div className="flex items-baseline space-x-1">
                        <span className="text-5xl font-serif font-bold">{plan.price}</span>
                        {plan.name !== 'Enterprise' && <span className="text-sm text-muted-foreground">/mo</span>}
                     </div>
                  </div>

                  <div className="flex-1 space-y-4 mb-10">
                     {plan.features.map((f) => (
                       <div key={f} className="flex items-start space-x-3 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-accent mt-0.5" />
                          <span className="text-muted-foreground">{f}</span>
                       </div>
                     ))}
                  </div>

                  <button className={`w-full py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center space-x-2 ${
                    plan.active ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'bg-background border border-border hover:border-accent hover:text-accent'
                  }`}>
                    <span>{plan.active ? 'Current Plan' : 'Select Plan'}</span>
                    {!plan.active && <ArrowRight className="w-4 h-4" />}
                  </button>
               </div>
             ))}
          </div>
        </div>
      </main>
    </div>
  );
}
