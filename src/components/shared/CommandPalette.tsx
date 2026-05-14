'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Command, X, FileText, Sparkles, Clock, ArrowRight } from 'lucide-react';
import { SearchOrchestrator, SearchResult } from '@/services/ai/retrieval/SearchOrchestrator';
import { format } from 'date-fns';
import Link from 'next/link';

export const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  // Shortcut listener (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = useCallback(async (val: string) => {
    if (!val.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const mockUserId = '00000000-0000-0000-0000-000000000000';
      const data = await SearchOrchestrator.search(mockUserId, val);
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => handleSearch(query), 300);
    return () => clearTimeout(timer);
  }, [query, handleSearch]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="max-w-2xl w-full bg-background border border-border rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Search Input */}
        <div className="p-6 border-b border-border flex items-center space-x-4 bg-muted/20">
          <Search className="w-6 h-6 text-muted-foreground" />
          <input 
            autoFocus
            type="text" 
            placeholder="Search concepts, decisions, topics..."
            className="flex-1 bg-transparent border-none outline-none text-lg font-medium placeholder:text-muted-foreground/50"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex items-center space-x-2 px-2 py-1 bg-muted border border-border rounded-lg text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto p-4 space-y-2">
          {loading ? (
            <div className="p-10 text-center space-y-4">
              <Sparkles className="w-8 h-8 text-accent animate-pulse mx-auto" />
              <p className="text-sm text-muted-foreground font-medium">Scanning your knowledge base...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted-foreground">
              {query ? "No semantic matches found." : "Type to start searching across your library."}
            </div>
          ) : (
            results.map((res) => (
              <Link 
                key={res.id} 
                href={`/history/${res.session_id}`}
                onClick={() => setIsOpen(false)}
                className="flex items-start space-x-4 p-4 rounded-2xl hover:bg-muted/50 transition-all group border border-transparent hover:border-border"
              >
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold truncate max-w-[300px]">{res.session_title}</span>
                    <span className="text-[10px] text-muted-foreground flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{format(new Date(res.created_at), 'MMM dd')}</span>
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 italic">
                    "...{res.content}..."
                  </p>
                  <div className="flex items-center space-x-2 pt-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-accent bg-accent/5 px-2 py-0.5 rounded-full">
                      {(res.similarity * 100).toFixed(0)}% Match
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity self-center" />
              </Link>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/10 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <span className="px-1 py-0.5 border border-border rounded bg-background">↑↓</span>
              <span>Navigate</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="px-1 py-0.5 border border-border rounded bg-background">Enter</span>
              <span>Open</span>
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <X className="w-3 h-3" />
            <span>Close</span>
          </div>
        </div>
      </div>
    </div>
  );
};
