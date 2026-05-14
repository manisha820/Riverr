'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/shared/Navbar';
import { Search, Filter, Sparkles, Clock, FileText, ArrowRight, User } from 'lucide-react';
import { SearchOrchestrator, SearchResult } from '@/services/ai/retrieval/SearchOrchestrator';
import { format } from 'date-fns';
import Link from 'next/link';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const mockUserId = '00000000-0000-0000-0000-000000000000';
        const data = await SearchOrchestrator.search(mockUserId, query);
        setResults(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="min-h-screen pt-20 bg-background">
      <Navbar />

      <main className="max-w-5xl mx-auto p-6 md:p-12 space-y-12">
        {/* Search Header */}
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-5xl font-serif font-bold">Global Intelligence</h1>
            <p className="text-muted-foreground text-lg">Search across your entire knowledge library semantically.</p>
          </div>

          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground group-focus-within:text-accent transition-colors" />
            <input 
              type="text" 
              autoFocus
              placeholder="e.g., 'What did we decide about the marketing budget?' or 'Find discussions about the rebrand'"
              className="w-full pl-16 pr-8 py-6 bg-muted/30 border border-border rounded-[32px] text-xl font-medium outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all shadow-xl shadow-accent/5"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Sparkles className="w-10 h-10 text-accent animate-pulse" />
              <p className="text-muted-foreground font-medium">Analyzing concept relationships...</p>
            </div>
          ) : !query ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {[
                 { title: "Project Decisions", desc: "Find outcomes and approved items." },
                 { title: "Action Items", desc: "Locate tasks discussed in meetings." },
                 { title: "Key Concepts", desc: "Discover recurring themes and topics." }
               ].map((c) => (
                 <div key={c.title} className="p-8 rounded-[32px] border border-border bg-muted/10 space-y-3">
                   <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                     <Sparkles className="w-5 h-5" />
                   </div>
                   <h4 className="font-bold">{c.title}</h4>
                   <p className="text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
                 </div>
               ))}
            </div>
          ) : results.length === 0 ? (
            <div className="py-20 text-center space-y-4 border-2 border-dashed border-border rounded-[40px]">
              <p className="text-muted-foreground">No semantic matches found for "{query}".</p>
              <button className="text-sm font-bold text-accent">Try a broader query</button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2 mb-6">
                <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground">
                  Found {results.length} semantic matches
                </h3>
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-bold">Filter</span>
                </div>
              </div>

              {results.map((res) => (
                <Link 
                  key={res.id} 
                  href={`/history/${res.session_id}`}
                  className="block p-8 rounded-[40px] border border-border bg-muted/5 hover:bg-muted/10 transition-all group"
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-2xl bg-background border border-border flex items-center justify-center">
                          <FileText className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
                        </div>
                        <div>
                          <h4 className="font-bold group-hover:text-accent transition-colors">{res.session_title}</h4>
                          <div className="flex items-center space-x-3 text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">
                            <span className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{format(new Date(res.created_at), 'MMM dd, yyyy')}</span>
                            </span>
                            <span className="w-1 h-1 bg-border rounded-full" />
                            <span className="flex items-center space-x-1">
                              <User className="w-3 h-3" />
                              <span>Speaker A</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-lg font-serif leading-relaxed line-clamp-3">
                        "...{res.content}..."
                      </p>

                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 px-4 py-1.5 bg-accent/5 border border-accent/20 rounded-full text-[10px] font-bold text-accent uppercase tracking-widest">
                          <Sparkles className="w-3 h-3" />
                          <span>Semantic Match ({(res.similarity * 100).toFixed(0)}%)</span>
                        </div>
                      </div>
                    </div>

                    <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center group-hover:bg-accent group-hover:border-accent group-hover:text-white transition-all shrink-0 self-center">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
