'use client';

import { Sparkles, ArrowRight, Zap, Share2, Target } from 'lucide-react';

export const LandingHero = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-background">
      {/* Cinematic Background Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[radial-gradient(circle_at_center,var(--accent)_0%,transparent_70%)] opacity-[0.05] pointer-events-none" />
      
      {/* Animated Floating Grids */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-center space-y-12 relative z-10">
        <div className="flex items-center justify-center space-x-2 text-accent text-xs font-bold uppercase tracking-[0.4em] animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <Sparkles className="w-4 h-4" />
          <span>The Organizational Intelligence OS</span>
        </div>

        <div className="space-y-6 max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-serif font-bold leading-[1.1] tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
             Your Organization, <br />
             <span className="italic text-accent">Intelligently Mapped.</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
            Riverr captures, remembers, and acts on your team's collective knowledge. From live meetings to automated workflows, it is the persistent brain for modern teams.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500">
           <button className="px-10 py-6 bg-accent text-white rounded-full text-sm font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-accent/40 flex items-center space-x-3">
             <span>Start Building Memory</span>
             <ArrowRight className="w-5 h-5" />
           </button>
           <button className="px-10 py-6 bg-background border border-border rounded-full text-sm font-bold uppercase tracking-widest hover:bg-muted/10 transition-all flex items-center space-x-3">
             <span>Book Enterprise Demo</span>
           </button>
        </div>

        {/* Floating Product Previews */}
        <div className="mt-24 relative animate-in fade-in zoom-in duration-1000 delay-700">
           <div className="max-w-5xl mx-auto rounded-[64px] border border-border bg-muted/5 p-4 md:p-8 glass overflow-hidden relative shadow-2xl">
              <div className="aspect-video bg-background rounded-[48px] border border-border relative overflow-hidden group">
                 {/* Mock UI Preview */}
                 <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070')] bg-cover opacity-20" />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center group-hover:scale-110 transition-all cursor-pointer">
                       <Zap className="w-8 h-8 text-white fill-white" />
                    </div>
                 </div>
                 
                 {/* Floating UI Badges */}
                 <div className="absolute top-10 left-10 p-4 bg-background/80 backdrop-blur-xl rounded-2xl border border-border shadow-xl space-y-2 animate-bounce">
                    <div className="flex items-center space-x-2 text-[10px] font-bold uppercase text-accent">
                       <Share2 className="w-3 h-3" />
                       <span>Topic Mapped</span>
                    </div>
                    <div className="text-sm font-bold">Marketing Strategy</div>
                 </div>

                 <div className="absolute bottom-10 right-10 p-4 bg-background/80 backdrop-blur-xl rounded-2xl border border-border shadow-xl space-y-2 animate-pulse">
                    <div className="flex items-center space-x-2 text-[10px] font-bold uppercase text-green-500">
                       <Target className="w-3 h-3" />
                       <span>Decision Detected</span>
                    </div>
                    <div className="text-sm font-bold">Approve Q3 Budget</div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </section>
  );
};
