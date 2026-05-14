import { Navbar } from '@/components/shared/Navbar';
import { Settings, Shield, Bell, User, Cpu, CreditCard } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="min-h-screen pt-20 bg-background">
      <Navbar />
      <main className="max-w-4xl mx-auto p-6 md:p-12 space-y-12">
        <h1 className="text-4xl font-serif font-bold">Settings</h1>

        <div className="space-y-6">
          <section className="space-y-4">
            <h2 className="text-lg font-bold flex items-center space-x-2">
              <User className="w-5 h-5 text-accent" />
              <span>Account</span>
            </h2>
            <div className="p-6 rounded-3xl border border-border space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Profile Information</p>
                  <p className="text-sm text-muted-foreground">Name, email, and avatar.</p>
                </div>
                <button className="text-sm font-bold text-accent">Edit</button>
              </div>
              <div className="pt-6 border-t border-border flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Address</p>
                  <p className="text-sm text-muted-foreground">manishaagunjal123@gmail.com</p>
                </div>
                <span className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded-full">Verified</span>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-bold flex items-center space-x-2">
              <Cpu className="w-5 h-5 text-accent" />
              <span>Transcription Engine</span>
            </h2>
            <div className="p-6 rounded-3xl border border-border space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Default Model</p>
                  <p className="text-sm text-muted-foreground">Deepgram Nova-2 (Ultra-fast)</p>
                </div>
                <button className="text-sm font-bold text-accent">Change</button>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-bold flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-accent" />
              <span>Billing & Subscription</span>
            </h2>
            <div className="p-6 rounded-3xl border border-border bg-accent/5 border-accent/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-accent">Pro Plan</p>
                  <p className="text-sm text-muted-foreground mt-1">Unlimited real-time transcription and AI summaries.</p>
                </div>
                <button className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-bold">Manage</button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
