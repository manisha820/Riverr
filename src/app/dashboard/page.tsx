import { Navbar } from '@/components/shared/Navbar';
import { Plus, Clock, Search, FileText, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className="min-h-screen pt-20 bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto p-6 md:p-12 space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-serif font-bold">Welcome back</h1>
            <p className="text-muted-foreground mt-2">Manage your sessions and start new transcriptions.</p>
          </div>
          
          <Link 
            href="/workspace" 
            className="flex items-center space-x-2 px-6 py-3 bg-accent text-white rounded-full hover:opacity-90 transition-all font-medium self-start"
          >
            <Plus className="w-5 h-5" />
            <span>New Session</span>
          </Link>
        </div>

        {/* Stats / Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl border border-border bg-muted/50 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Transcripts</p>
                <p className="text-2xl font-bold">24</p>
              </div>
            </div>
            <ChevronRight className="text-muted-foreground w-5 h-5" />
          </div>
          
          <div className="p-6 rounded-3xl border border-border bg-muted/50 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Time Saved</p>
                <p className="text-2xl font-bold">12.5h</p>
              </div>
            </div>
            <ChevronRight className="text-muted-foreground w-5 h-5" />
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif font-bold">Recent Sessions</h2>
            <div className="flex items-center space-x-2 px-4 py-2 bg-muted rounded-lg border border-border text-sm text-muted-foreground">
              <Search className="w-4 h-4" />
              <input type="text" placeholder="Search sessions..." className="bg-transparent border-none outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 rounded-2xl border border-border bg-muted/20 hover:bg-muted/40 transition-all flex items-center justify-between cursor-pointer group">
                <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 rounded-xl bg-muted border border-border flex items-center justify-center group-hover:bg-background transition-all">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Product Strategy Meeting</h3>
                    <p className="text-sm text-muted-foreground">May 14, 2026 • 24:15 • 1,240 words</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 opacity-0 group-hover:opacity-100 transition-all">
                  <button className="px-4 py-2 rounded-lg hover:bg-muted font-medium text-sm">View</button>
                  <button className="px-4 py-2 rounded-lg bg-foreground text-background font-medium text-sm">Export</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
