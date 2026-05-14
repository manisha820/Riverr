'use client';

import { useState, useMemo } from 'react';
import { DiffEngine, DiffToken } from '@/services/transcription/core/DiffEngine';
import { useSyncScroll } from '@/hooks/useSyncScroll';
import { Columns, List, ArrowLeftRight, Minus, Plus } from 'lucide-react';

interface DiffViewerProps {
  oldText: string;
  newText: string;
}

export const DiffViewer = ({ oldText, newText }: DiffViewerProps) => {
  const [viewMode, setViewMode] = useState<'side-by-side' | 'unified'>('side-by-side');
  const { leftRef, rightRef, onScroll } = useSyncScroll();

  const diffTokens = useMemo(() => DiffEngine.computeDiff(oldText, newText), [oldText, newText]);
  const stats = useMemo(() => DiffEngine.getStats(diffTokens), [diffTokens]);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Diff Toolbar */}
      <div className="p-4 border-b border-border flex items-center justify-between bg-muted/5">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-sm font-medium">
            <span className="flex items-center space-x-1 text-red-500">
              <Minus className="w-3 h-3" />
              <span>{stats.deletions} removed</span>
            </span>
            <span className="flex items-center space-x-1 text-green-500">
              <Plus className="w-3 h-3" />
              <span>{stats.additions} added</span>
            </span>
          </div>
        </div>

        <div className="flex bg-muted p-1 rounded-xl">
          <button 
            onClick={() => setViewMode('side-by-side')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'side-by-side' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'
            }`}
          >
            <Columns className="w-3 h-3" />
            <span>Side-by-Side</span>
          </button>
          <button 
            onClick={() => setViewMode('unified')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'unified' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'
            }`}
          >
            <List className="w-3 h-3" />
            <span>Unified</span>
          </button>
        </div>
      </div>

      {/* Diff Content */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'side-by-side' ? (
          <div className="grid grid-cols-2 h-full divide-x divide-border">
            <div 
              ref={leftRef}
              onScroll={() => onScroll('left')}
              className="overflow-y-auto p-8 font-serif text-lg leading-relaxed bg-red-500/[0.02]"
            >
              <h4 className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-6">Original Version</h4>
              {diffTokens.map((t, i) => (
                t.type !== 'insert' && (
                  <span key={i} className={t.type === 'delete' ? 'bg-red-500/20 text-red-700 dark:text-red-400' : ''}>
                    {t.value}
                  </span>
                )
              ))}
            </div>
            <div 
              ref={rightRef}
              onScroll={() => onScroll('right')}
              className="overflow-y-auto p-8 font-serif text-lg leading-relaxed bg-green-500/[0.02]"
            >
              <h4 className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-6">New Version</h4>
              {diffTokens.map((t, i) => (
                t.type !== 'delete' && (
                  <span key={i} className={t.type === 'insert' ? 'bg-green-500/20 text-green-700 dark:text-green-400' : ''}>
                    {t.value}
                  </span>
                )
              ))}
            </div>
          </div>
        ) : (
          <div className="h-full overflow-y-auto p-8 font-serif text-lg leading-relaxed max-w-4xl mx-auto">
             <h4 className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-6">Unified Changes</h4>
             {diffTokens.map((t, i) => (
               <span 
                key={i} 
                className={
                  t.type === 'insert' ? 'bg-green-500/20 text-green-700 dark:text-green-400' : 
                  t.type === 'delete' ? 'bg-red-500/20 text-red-700 dark:text-red-400 line-through' : ''
                }
               >
                 {t.value}
               </span>
             ))}
          </div>
        )}
      </div>
    </div>
  );
};
