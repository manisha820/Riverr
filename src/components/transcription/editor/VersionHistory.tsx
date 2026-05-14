'use client';

import { useState, useEffect } from 'react';
import { History, CheckCircle2, Clock, User, ChevronRight, Lock } from 'lucide-react';
import { VersionService, VersionType } from '@/services/transcription/editor/VersionService';
import { format } from 'date-fns';

interface VersionHistoryProps {
  sessionId: string;
  onRestore: (content: string) => void;
}

export const VersionHistory = ({ sessionId, onRestore }: VersionHistoryProps) => {
  const [versions, setVersions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const data = await VersionService.getVersionHistory(sessionId);
        setVersions(data || []);
      } catch (err) {
        console.error('Failed to load version history:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, [sessionId]);

  const getBadgeColor = (type: VersionType) => {
    switch (type) {
      case 'published': return 'bg-green-500/10 text-green-500';
      case 'ai_enhanced': return 'bg-accent/10 text-accent';
      case 'raw': return 'bg-muted text-muted-foreground';
      default: return 'bg-border text-muted-foreground';
    }
  };

  return (
    <div className="h-full flex flex-col bg-background border-l border-border">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <h3 className="font-bold flex items-center space-x-2">
          <History className="w-4 h-4" />
          <span>Version History</span>
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-10 text-center text-sm text-muted-foreground">Loading history...</div>
        ) : versions.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground italic">No checkpoints saved yet.</div>
        ) : (
          <div className="divide-y divide-border">
            {versions.map((version) => (
              <div 
                key={version.id} 
                className="p-5 hover:bg-muted/50 cursor-pointer transition-all group"
                onClick={() => onRestore(version.content)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm">{version.version_name}</span>
                      {version.is_locked && <Lock className="w-3 h-3 text-muted-foreground" />}
                    </div>
                    <div className="flex items-center space-x-2 text-[10px] uppercase font-bold tracking-widest">
                      <span className={`px-2 py-0.5 rounded-full ${getBadgeColor(version.version_type)}`}>
                        {version.version_type}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {format(new Date(version.created_at), 'MMM dd, HH:mm')}
                  </span>
                </div>
                
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                  {version.change_summary || "No description provided."}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-[10px] text-muted-foreground">
                    <User className="w-3 h-3" />
                    <span>Manish (You)</span>
                  </div>
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-6 border-t border-border">
        <button className="w-full py-3 bg-muted rounded-xl text-sm font-bold hover:bg-border transition-all">
          Create New Checkpoint
        </button>
      </div>
    </div>
  );
};
