'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/shared/Navbar';
import { IntelligenceCard } from '@/components/dashboard/widgets/IntelligenceCard';
import { 
  Zap, Target, Share2, Users, Clock, 
  TrendingUp, AlertTriangle, CheckCircle2, 
  MessageSquare, Sparkles, PieChart, Activity 
} from 'lucide-react';
import { AnalyticsService, WorkspaceStats } from '@/services/ai/analytics/AnalyticsService';

export default function IntelligenceDashboard() {
  const [stats, setStats] = useState<WorkspaceStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const mockWorkspaceId = '00000000-0000-0000-0000-000000000000';
        const data = await AnalyticsService.getWorkspaceOverview(mockWorkspaceId);
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="min-h-screen pt-20 bg-background overflow-x-hidden">
      <Navbar />

      <main className="max-w-[1600px] mx-auto p-6 md:p-12 space-y-12">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-accent text-xs font-bold uppercase tracking-[0.2em]">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>Workspace Cockpit</span>
            </div>
            <h1 className="text-5xl font-serif font-bold">Organizational Intelligence</h1>
            <p className="text-muted-foreground text-lg">Real-time oversight of projects, decisions, and collaboration health.</p>
          </div>

          <div className="flex items-center space-x-4 bg-muted/20 p-2 rounded-2xl border border-border">
            <button className="px-4 py-2 bg-background shadow-sm border border-border rounded-xl text-xs font-bold">Last 30 Days</button>
            <button className="px-4 py-2 text-muted-foreground hover:text-foreground text-xs font-bold transition-colors">Export Report</button>
          </div>
        </div>

        {/* Top Intelligence Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <IntelligenceCard 
            title="Decision Velocity"
            value={stats?.decision_count || 0}
            subtitle="Approved items"
            trend="up"
            trendValue="+12%"
            icon={<Target className="w-6 h-6" />}
          />
          <IntelligenceCard 
            title="Action Items"
            value={stats?.pending_action_items || 0}
            subtitle="Pending tasks"
            trend="down"
            trendValue="-4%"
            icon={<Zap className="w-6 h-6" />}
          />
          <IntelligenceCard 
            title="Memory Growth"
            value={stats?.total_memories || 0}
            subtitle="Durable facts"
            trend="up"
            trendValue="+24"
            icon={<Share2 className="w-6 h-6" />}
          />
          <IntelligenceCard 
            title="Team Engagement"
            value="86%"
            subtitle="Collaboration health"
            trend="stable"
            trendValue="Flat"
            icon={<Users className="w-6 h-6" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Analytics Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Communication Health */}
            <div className="p-10 rounded-[48px] border border-border bg-muted/5 relative overflow-hidden min-h-[400px]">
              <div className="flex items-center justify-between mb-12">
                <div className="space-y-1">
                   <h3 className="text-2xl font-serif font-bold">Communication Health</h3>
                   <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Speaker participation & Meeting balance</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                   <Activity className="w-5 h-5" />
                </div>
              </div>

              {/* Placeholder for real charts */}
              <div className="flex items-end justify-between h-48 px-4">
                 {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                   <div key={i} className="w-12 bg-accent/20 rounded-t-2xl relative group hover:bg-accent/40 transition-all cursor-pointer" style={{ height: `${h}%` }}>
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold">
                        {h}%
                      </div>
                   </div>
                 ))}
              </div>
              
              <div className="mt-8 border-t border-border/50 pt-8 flex items-center justify-between">
                 <div className="flex space-x-8">
                    <div className="space-y-1">
                       <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Avg Duration</span>
                       <p className="text-lg font-bold">24m 12s</p>
                    </div>
                    <div className="space-y-1">
                       <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Active Speakers</span>
                       <p className="text-lg font-bold">3.4</p>
                    </div>
                 </div>
                 <button className="text-xs font-bold text-accent hover:underline">Full Analytics</button>
              </div>
            </div>

            {/* Recurring Topics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="p-8 rounded-[40px] border border-border bg-background space-y-6">
                  <h4 className="font-bold flex items-center space-x-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span>Trending Concepts</span>
                  </h4>
                  <div className="space-y-4">
                     {[
                       { name: 'Marketing Strategy', count: 12, trend: '+4' },
                       { name: 'API Security', count: 8, trend: '+2' },
                       { name: 'Budget Review', count: 5, trend: '+1' },
                     ].map((t) => (
                       <div key={t.name} className="flex items-center justify-between group cursor-pointer">
                          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{t.name}</span>
                          <div className="flex items-center space-x-2">
                             <span className="text-xs font-bold">{t.count}</span>
                             <span className="text-[10px] font-bold text-green-500">{t.trend}</span>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>

               <div className="p-8 rounded-[40px] border border-border bg-background space-y-6">
                  <h4 className="font-bold flex items-center space-x-2 text-sm">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span>Unresolved Threads</span>
                  </h4>
                  <div className="space-y-4">
                     {[
                       { name: 'Cloud Migration', age: '4 days', status: 'blocked' },
                       { name: 'UI Branding', age: '2 days', status: 'pending' },
                       { name: 'User Feedback', age: '12h', status: 'pending' },
                     ].map((t) => (
                       <div key={t.name} className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{t.name}</span>
                          <span className="text-[10px] font-bold bg-muted px-2 py-0.5 rounded-full">{t.age}</span>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>

          {/* Side Insight Panel */}
          <div className="space-y-8">
             <div className="p-10 rounded-[48px] bg-accent text-white shadow-2xl shadow-accent/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                <Sparkles className="w-8 h-8 mb-6" />
                <h3 className="text-2xl font-serif font-bold mb-4">AI Predictive Insight</h3>
                <p className="text-sm leading-relaxed text-white/80 mb-8">
                  "Based on the last 3 meetings, the **Cloud Migration** project is at risk of stalling due to unresolved dependencies in the API Security thread."
                </p>
                <button className="w-full py-4 bg-white text-accent rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-white/90 transition-all">
                  Take Action
                </button>
             </div>

             <div className="p-10 rounded-[48px] border border-border bg-muted/5 space-y-8">
                <div className="flex items-center justify-between">
                   <h3 className="font-bold text-sm uppercase tracking-widest">Project Velocity</h3>
                   <PieChart className="w-4 h-4 text-muted-foreground" />
                </div>

                <div className="space-y-6">
                   {[
                     { name: 'Riverr Engine', progress: 85, color: 'accent' },
                     { name: 'Intelligence Layer', progress: 62, color: 'blue-500' },
                     { name: 'Mobile App', progress: 12, color: 'muted-foreground' },
                   ].map((p) => (
                     <div key={p.name} className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold">
                           <span>{p.name}</span>
                           <span>{p.progress}%</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                           <div className={`h-full bg-${p.color} rounded-full`} style={{ width: `${p.progress}%` }} />
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
