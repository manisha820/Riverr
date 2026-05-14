'use client';

import { AlertTriangle, RotateCcw, X, ArrowRight } from 'lucide-react';
import { LocalSessionState } from '@/services/transcription/core/LocalStorageService';

interface RecoveryModalProps {
  session: LocalSessionState;
  onConfirm: () => void;
  onCancel: () => void;
}

export const RecoveryModal = ({ session, onConfirm, onCancel }: RecoveryModalProps) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="max-w-md w-full bg-background border border-border rounded-[32px] p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-300">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
            <RotateCcw className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-serif font-bold">Resume Recording?</h2>
            <p className="text-muted-foreground">
              We found an unfinished session from your last visit: <br />
              <span className="font-medium italic text-foreground">"{session.title}"</span>
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-muted/50 border border-border flex items-start space-x-3 text-sm">
          <AlertTriangle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <p className="text-muted-foreground">
            This will restore the transcript and reconnect the live stream so you can continue where you left off.
          </p>
        </div>

        <div className="flex flex-col space-y-3">
          <button 
            onClick={onConfirm}
            className="w-full flex items-center justify-center space-x-2 py-4 bg-accent text-white rounded-2xl font-bold hover:opacity-90 transition-all shadow-xl shadow-accent/20"
          >
            <span>Yes, Resume Session</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button 
            onClick={onCancel}
            className="w-full py-4 border border-border hover:bg-muted rounded-2xl font-bold transition-all"
          >
            Start New Instead
          </button>
        </div>
      </div>
    </div>
  );
};
