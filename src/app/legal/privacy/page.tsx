'use client';

import { Navbar } from '@/components/shared/Navbar';
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-background">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 space-y-12">
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-5xl font-serif font-bold">Privacy Policy</h1>
          <p className="text-muted-foreground uppercase tracking-widest text-xs font-bold">Last Updated: May 14, 2026</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8 text-muted-foreground leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-foreground">1. Commitment to Privacy</h2>
            <p>
              At Riverr, we believe that your organization's conversations are its most valuable and sensitive assets. Our platform is built with a privacy-first architecture, ensuring that your data is never used to train global models without explicit, workspace-level consent.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-foreground">2. Data We Collect</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Audio & Transcripts:</strong> For the purpose of providing organizational memory and intelligence.</li>
              <li><strong>Account Information:</strong> Name, email, and authentication metadata.</li>
              <li><strong>Usage Analytics:</strong> To improve platform performance and security.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-foreground">3. How We Use AI</h2>
            <p>
              Our AI engines process your data locally within your workspace context. We utilize "Explainable AI" principles, meaning you can always trace an AI-generated insight back to the original transcript evidence.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-foreground">4. Data Security</h2>
            <p>
              All data is encrypted using AES-256 at rest and TLS 1.3 in transit. We maintain strict workspace isolation through Row Level Security (RLS) at the database layer.
            </p>
          </section>
        </div>

        <div className="p-10 rounded-[48px] border border-border bg-muted/5 flex items-center justify-between">
           <div className="flex items-center space-x-4">
              <Lock className="w-5 h-5 text-accent" />
              <span className="text-sm font-bold">GDPR & CCPA Compliant Architecture</span>
           </div>
           <button className="text-xs font-bold text-accent hover:underline">Download Data Processing Agreement (DPA)</button>
        </div>
      </main>
    </div>
  );
}
