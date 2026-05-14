'use client';

import { Share2, Zap, Brain, Target, ShieldCheck, Activity } from 'lucide-react';

export const ProductShowcase = () => {
  const features = [
    {
      title: 'Persistent Memory',
      description: 'Riverr builds a long-term factual archive of every decision made, across months of history.',
      icon: <Brain className="w-8 h-8" />,
      color: 'accent'
    },
    {
      title: 'Knowledge Graph',
      description: 'Automatically map relationships between people, projects, and topics across your workspace.',
      icon: <Share2 className="w-8 h-8" />,
      color: 'blue-500'
    },
    {
      title: 'Autonomous Workflows',
      description: 'Turn intelligence into action. Auto-sync tasks to Notion, Slack, and Jira from meeting outcomes.',
      icon: <Zap className="w-8 h-8" />,
      color: 'yellow-500'
    },
    {
      title: 'Decision Intelligence',
      description: 'Track decision velocity and project momentum with real-time executive dashboards.',
      icon: <Target className="w-8 h-8" />,
      color: 'red-500'
    },
    {
      title: 'Enterprise Security',
      description: 'Role-based access, audit logs, and SOC2-ready architecture designed for the fortune 500.',
      icon: <ShieldCheck className="w-8 h-8" />,
      color: 'green-500'
    },
    {
      title: 'Real-time Cockpit',
      description: 'A live operational command center for tracking organizational health and collaboration.',
      icon: <Activity className="w-8 h-8" />,
      color: 'purple-500'
    }
  ];

  return (
    <section className="py-32 bg-background border-t border-border/50">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 space-y-24">
        <div className="max-w-3xl space-y-4">
           <h2 className="text-4xl md:text-5xl font-serif font-bold leading-tight">
              One platform. <br />
              Total organizational intelligence.
           </h2>
           <p className="text-muted-foreground text-lg italic">
              "Riverr isn't just software. It is the operational intelligence layer for modern organizations."
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {features.map((f, i) => (
             <div key={i} className="p-10 rounded-[48px] border border-border bg-muted/5 hover:bg-muted/10 transition-all group cursor-pointer">
                <div className={`w-16 h-16 rounded-3xl bg-${f.color}/10 flex items-center justify-center text-${f.color} mb-8 group-hover:scale-110 transition-transform`}>
                   {f.icon}
                </div>
                <h3 className="text-2xl font-serif font-bold mb-4">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                   {f.description}
                </p>
             </div>
           ))}
        </div>

        <div className="p-16 rounded-[64px] bg-muted/10 border border-border relative overflow-hidden text-center space-y-8">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,var(--accent)_0%,transparent_50%)] opacity-[0.03]" />
           <h3 className="text-3xl md:text-4xl font-serif font-bold relative z-10">
             Ready to scale your organizational brain?
           </h3>
           <div className="flex flex-wrap items-center justify-center gap-6 relative z-10">
              <button className="px-12 py-5 bg-accent text-white rounded-full text-xs font-bold uppercase tracking-widest hover:opacity-90 shadow-xl shadow-accent/20">
                Get Started for Free
              </button>
              <button className="px-12 py-5 bg-background border border-border rounded-full text-xs font-bold uppercase tracking-widest hover:bg-muted/10">
                Contact Sales
              </button>
           </div>
        </div>
      </div>
    </section>
  );
};
