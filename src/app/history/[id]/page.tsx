'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/shared/Navbar';
import { 
  ArrowLeft, Download, Copy, Sparkles, Clock, 
  MessageSquare, MoreVertical, Share2, Wand2 
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { format } from 'date-fns';
import { EditableSegment } from '@/components/transcription/editor/EditableSegment';
import { EditorService } from '@/services/transcription/editor/EditorService';
import { SpeakerBadge } from '@/components/transcription/speakers/SpeakerBadge';
import { SpeakerActivity } from '@/components/transcription/speakers/SpeakerActivity';
import { SummaryPanel } from '@/components/transcription/ai/SummaryPanel';

export default function TranscriptDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [segments, setSegments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTranscript() {
      setLoading(true);
      try {
        const { data: sessionData } = await supabase
          .from('sessions')
          .select('*')
          .eq('id', id)
          .single();

        const { data: segmentData } = await supabase
          .from('transcript_segments')
          .select('*')
          .eq('session_id', id)
          .order('created_at', { ascending: true });

        setSession(sessionData);
        setSegments(segmentData || []);
      } catch (error) {
        console.error('Error loading transcript:', error);
      } finally {
        setLoading(false);
      }
    }
    loadTranscript();
  }, [id]);

  if (loading) return <div className="min-h-screen pt-40 text-center">Loading transcript...</div>;
  if (!session) return <div className="min-h-screen pt-40 text-center">Transcript not found.</div>;

  return (
    <div className="min-h-screen pt-20 bg-background">
      <Navbar />
      
      {/* Detail Header */}
      <div className="border-b border-border glass sticky top-20 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-muted rounded-xl transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold font-serif">{session.title}</h1>
              <p className="text-xs text-muted-foreground">
                {format(new Date(session.created_at), 'MMMM dd, yyyy • HH:mm')}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button className="p-2 hover:bg-muted rounded-xl transition-all">
              <Share2 className="w-5 h-5 text-muted-foreground" />
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-muted rounded-xl hover:bg-border transition-all text-sm font-medium">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button className="p-2 hover:bg-muted rounded-xl transition-all">
              <MoreVertical className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto p-6 md:p-12 grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Transcript Body */}
        <div className="lg:col-span-3 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <span className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>24m 15s</span>
              </span>
              <span className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4" />
                <span>{segments.length} segments</span>
              </span>
            </div>
            <button className="flex items-center space-x-2 text-sm text-accent font-bold hover:opacity-80 transition-all">
              <Copy className="w-4 h-4" />
              <span>Copy All</span>
            </button>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            {segments.length === 0 ? (
              <p className="text-muted-foreground italic">No transcript content available.</p>
            ) : (
              <div className="space-y-4">
                {segments.map((segment) => (
                  <div key={segment.id} className="space-y-2">
                    <SpeakerBadge 
                      name={segment.temporary_speaker_label || 'Speaker A'} 
                      isConfirmed={!!segment.speaker_id}
                    />
                    <EditableSegment
                      id={segment.id}
                      initialText={segment.transcript_text}
                      timestamp={segment.start_time ? format(new Date(segment.start_time * 1000), 'mm:ss') : undefined}
                      onSave={async (newText) => {
                        const mockUserId = '00000000-0000-0000-0000-000000000000';
                        await EditorService.saveSegmentEdit(
                          segment.id,
                          session.id,
                          segment.transcript_text,
                          newText,
                          mockUserId
                        );
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* AI & Speaker Sidebar */}
        <div className="space-y-6">
          <SpeakerActivity />
          
          <div className="p-6 rounded-[32px] border border-border bg-accent/5 border-accent/20 space-y-4">
            <h3 className="font-bold flex items-center space-x-2 text-accent">
              <Sparkles className="w-4 h-4" />
              <span>AI Summary</span>
            </h3>
            <div className="space-y-3">
              <div className="h-2 w-full bg-accent/10 rounded-full" />
              <div className="h-2 w-4/5 bg-accent/10 rounded-full" />
              <div className="h-2 w-full bg-accent/10 rounded-full" />
            </div>
            <p className="text-xs text-muted-foreground italic">
              Summarization is processing...
            </p>
            <button className="w-full py-2 bg-accent text-white rounded-xl text-xs font-bold hover:opacity-90 transition-all">
              Generate Now
            </button>
          </div>

          <div className="p-6 rounded-[32px] border border-border glass space-y-4">
            <h3 className="font-bold">Actions</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-muted text-sm transition-all">
                <Wand2 className="w-4 h-4" />
                <span>Refine Formatting</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-muted text-sm transition-all text-red-500">
                <X className="w-4 h-4" />
                <span>Delete Session</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function X({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
  );
}
