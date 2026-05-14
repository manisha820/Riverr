'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/shared/Navbar';
import { SessionCard } from '@/components/dashboard/SessionCard';
import { RecoveryBanner } from '@/components/dashboard/RecoveryBanner';
import { Search, Filter, ArrowUpDown, Loader2, Sparkles } from 'lucide-react';
import { db } from '@/services/supabase/SupabaseService';
import { Session } from '@/types/transcription';

export default function HistoryPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'oldest'>('latest');

  useEffect(() => {
    async function loadSessions() {
      setLoading(true);
      try {
        // Mock user ID for now; in production, this comes from auth context
        const mockUserId = '00000000-0000-0000-0000-000000000000';
        const data = await db.getSessionsWithFilters(mockUserId, { sortBy });
        setSessions(data || []);
      } catch (error) {
        console.error('Failed to load sessions:', error);
      } finally {
        setLoading(false);
      }
    }
    loadSessions();
  }, [sortBy]);

  return (
    <div className="min-h-screen pt-20 bg-background">
      <Navbar />
      
      <RecoveryBanner />

      <main className="max-w-7xl mx-auto p-6 md:p-12 space-y-10">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-serif font-bold">Transcription Library</h1>
            <p className="text-muted-foreground">Browse, search, and manage your intelligence assets.</p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
              <input 
                type="text" 
                placeholder="Search transcripts..." 
                className="pl-11 pr-6 py-3 bg-muted/50 border border-border rounded-2xl focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all w-full md:w-80"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <button className="p-3 bg-muted/50 border border-border rounded-2xl hover:bg-muted transition-all">
              <Filter className="w-5 h-5 text-muted-foreground" />
            </button>
            
            <button 
              onClick={() => setSortBy(sortBy === 'latest' ? 'oldest' : 'latest')}
              className="flex items-center space-x-2 px-4 py-3 bg-muted/50 border border-border rounded-2xl hover:bg-muted transition-all text-sm font-medium"
            >
              <ArrowUpDown className="w-4 h-4" />
              <span>{sortBy === 'latest' ? 'Latest' : 'Oldest'}</span>
            </button>
          </div>
        </div>

        {/* Content State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="w-10 h-10 text-accent animate-spin" />
            <p className="text-muted-foreground font-medium">Indexing your library...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-6 text-center border-2 border-dashed border-border rounded-[40px]">
            <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-muted-foreground/30" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-serif font-bold">No transcripts found</h3>
              <p className="text-muted-foreground max-w-sm">
                Start your first recording session to build your transcription library.
              </p>
            </div>
            <button className="px-8 py-4 bg-accent text-white rounded-full font-bold shadow-xl shadow-accent/20 hover:opacity-90 transition-all">
              Start New Recording
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {sessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
            
            {/* Pagination Placeholder */}
            <div className="flex justify-center py-10">
              <button className="text-sm font-bold text-muted-foreground hover:text-accent transition-colors">
                Load more sessions
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
