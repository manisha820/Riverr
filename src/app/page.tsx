'use client';

import { Navbar } from '@/components/shared/Navbar';
import { LandingHero } from '@/components/landing/LandingHero';
import { ProductShowcase } from '@/components/landing/ProductShowcase';
import { ShieldCheck, Lock, Globe, Zap, Cpu } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background selection:bg-accent selection:text-white">
      <Navbar />
      
      <main>
        <LandingHero />
        
        {/* Trust Bar */}
        <section className="py-12 border-y border-border/50 bg-muted/5">
           <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-wrap items-center justify-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
              <div className="flex items-center space-x-2 font-serif font-bold text-xl tracking-tighter italic">ENTERPRISE-READY</div>
              <div className="flex items-center space-x-2 font-serif font-bold text-xl tracking-tighter italic">GLOBAL SCALE</div>
              <div className="flex items-center space-x-2 font-serif font-bold text-xl tracking-tighter italic">SOC2 COMPLIANT</div>
              <div className="flex items-center space-x-2 font-serif font-bold text-xl tracking-tighter italic">AI ETHICS FIRST</div>
           </div>
        </section>

        <ProductShowcase />

        {/* Security & Intelligence Detail */}
        <section className="py-32 bg-background overflow-hidden">
           <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div className="space-y-12">
                 <div className="space-y-4">
                    <h2 className="text-5xl font-serif font-bold leading-tight">
                       Fortress-grade security <br />
                       for your intellectual property.
                    </h2>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                       Your organization's knowledge is its most valuable asset. We treat it with extreme security and absolute privacy.
                    </p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                       <Lock className="w-6 h-6 text-accent" />
                       <h4 className="font-bold">End-to-End Encryption</h4>
                       <p className="text-sm text-muted-foreground">All data is encrypted in transit and at rest using AES-256 standards.</p>
                    </div>
                    <div className="space-y-4">
                       <ShieldCheck className="w-6 h-6 text-accent" />
                       <h4 className="font-bold">SOC2 Type II Ready</h4>
                       <p className="text-sm text-muted-foreground">Comprehensive auditing and compliance monitoring for enterprise safety.</p>
                    </div>
                    <div className="space-y-4">
                       <Globe className="w-6 h-6 text-accent" />
                       <h4 className="font-bold">Global Data Residency</h4>
                       <p className="text-sm text-muted-foreground">Choose where your organization's memory is stored (US, EU, AP).</p>
                    </div>
                    <div className="space-y-4">
                       <Cpu className="w-6 h-6 text-accent" />
                       <h4 className="font-bold">Explainable AI</h4>
                       <p className="text-sm text-muted-foreground">No black boxes. Every AI decision and recommendation is traceable.</p>
                    </div>
                 </div>
              </div>

              <div className="relative">
                 <div className="absolute inset-0 bg-accent rounded-full blur-[120px] opacity-10 animate-pulse" />
                 <div className="relative p-12 rounded-[64px] border border-border bg-muted/5 glass aspect-square flex items-center justify-center">
                    <div className="space-y-8 text-center">
                       <div className="w-24 h-24 rounded-3xl bg-background border border-border flex items-center justify-center mx-auto shadow-2xl">
                          <Zap className="w-10 h-10 text-accent" />
                       </div>
                       <div className="space-y-2">
                          <h4 className="text-3xl font-serif font-bold">1.2ms</h4>
                          <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Inference Latency</p>
                       </div>
                       <div className="space-y-2">
                          <h4 className="text-3xl font-serif font-bold">99.99%</h4>
                          <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Operational Uptime</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Final CTA Footer */}
        <section className="py-32 bg-accent text-white overflow-hidden relative">
           <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
           <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-center space-y-12 relative z-10">
              <h2 className="text-5xl md:text-7xl font-serif font-bold max-w-4xl mx-auto leading-tight">
                 Build the brain of your organization today.
              </h2>
              <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                 <button className="px-16 py-6 bg-white text-accent rounded-full text-sm font-bold uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-2xl">
                   Start Free Trial
                 </button>
                 <button className="text-sm font-bold uppercase tracking-[0.2em] border-b-2 border-white pb-2 hover:opacity-80 transition-all">
                   Speak to our AI Strategists
                 </button>
              </div>
           </div>
        </section>
      </main>

      <footer className="py-20 bg-background border-t border-border/50">
         <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12">
            <div className="col-span-2 space-y-6">
               <h3 className="text-3xl font-serif font-bold tracking-tighter">Riverr</h3>
               <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
                 The enterprise knowledge operating system for high-velocity teams.
               </p>
            </div>
            <div className="space-y-6">
               <h4 className="text-xs font-bold uppercase tracking-widest">Product</h4>
               <ul className="space-y-4 text-sm text-muted-foreground">
                  <li className="hover:text-accent cursor-pointer">Intelligence Dashboard</li>
                  <li className="hover:text-accent cursor-pointer">Semantic Search</li>
                  <li className="hover:text-accent cursor-pointer">Knowledge Graph</li>
                  <li className="hover:text-accent cursor-pointer">Workflows</li>
               </ul>
            </div>
            <div className="space-y-6">
               <h4 className="text-xs font-bold uppercase tracking-widest">Company</h4>
               <ul className="space-y-4 text-sm text-muted-foreground">
                  <li className="hover:text-accent cursor-pointer">About Us</li>
                  <li className="hover:text-accent cursor-pointer">Careers</li>
                  <li className="hover:text-accent cursor-pointer">Manifesto</li>
                  <li className="hover:text-accent cursor-pointer">Newsroom</li>
               </ul>
            </div>
            <div className="space-y-6">
               <h4 className="text-xs font-bold uppercase tracking-widest">Legal</h4>
               <ul className="space-y-4 text-sm text-muted-foreground">
                  <li className="hover:text-accent cursor-pointer">Privacy Policy</li>
                  <li className="hover:text-accent cursor-pointer">Terms of Service</li>
                  <li className="hover:text-accent cursor-pointer">Security Audit</li>
               </ul>
            </div>
         </div>
         <div className="max-w-[1400px] mx-auto px-6 md:px-12 mt-20 pt-12 border-t border-border/20 flex flex-col md:flex-row items-center justify-between text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
            <span>© 2026 Riverr Intelligence Systems.</span>
            <div className="flex space-x-8 mt-6 md:mt-0">
               <span>Built in the Cloud</span>
               <span>Powered by Human Intent</span>
            </div>
         </div>
      </footer>
    </div>
  );
}
