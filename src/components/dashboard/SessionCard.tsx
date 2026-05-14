'use client';

import { FileText, Clock, ChevronRight, Calendar, Info } from 'lucide-react';
import { Session } from '@/types/transcription';
import { format } from 'date-fns';
import Link from 'next/link';

interface SessionCardProps {
  session: Session & { word_count?: number; preview?: string };
}

export const SessionCard = ({ session }: SessionCardProps) => {
  return (
    <Link href={`/history/${session.id}`}>
      <div className="p-5 rounded-3xl border border-border bg-muted/10 hover:bg-muted/30 transition-all flex items-center justify-between group cursor-pointer animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="flex items-center space-x-6">
          <div className="w-16 h-16 rounded-2xl bg-background border border-border flex items-center justify-center group-hover:scale-105 transition-transform">
            <FileText className="w-8 h-8 text-muted-foreground" />
          </div>
          
          <div className="space-y-1">
            <h3 className="text-lg font-bold group-hover:text-accent transition-colors">{session.title}</h3>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{format(new Date(session.created_at), 'MMM dd, yyyy')}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>24:15</span> {/* Mock duration */}
              </span>
              <span className="flex items-center space-x-1 text-accent font-medium">
                <Info className="w-3 h-3" />
                <span>{session.word_count || 0} words</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-1 max-w-xl">
              {session.preview || "No transcript content available yet..."}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex flex-col items-end space-y-1">
            <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full ${
              session.status === 'completed' ? 'bg-green-500/10 text-green-500' : 'bg-accent/10 text-accent'
            }`}>
              {session.status}
            </span>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
};
