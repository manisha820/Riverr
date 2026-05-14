'use client';

import { useEffect, useState } from 'react';
import { LocalStorageService, LocalSessionState } from '@/services/transcription/core/LocalStorageService';
import { AlertTriangle, ArrowRight, X } from 'lucide-react';
import Link from 'next/link';

export const RecoveryBanner = () => {
  const [activeSession, setActiveSession] = useState<LocalSessionState | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const session = LocalStorageService.getSession();
    if (session) {
      setActiveSession(session);
    }
  }, []);

  if (!activeSession || !isVisible) return null;

  return (
    <div className="mx-6 mt-6 p-4 rounded-2xl bg-accent text-white flex items-center justify-between animate-in slide-in-from-top-4 duration-500">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <p className="font-bold">Interrupted Session Detected</p>
          <p className="text-sm opacity-90">
            You have an unsaved session: <span className="font-medium italic">"{activeSession.title}"</span>
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <Link 
          href="/workspace" 
          className="flex items-center space-x-2 px-4 py-2 bg-white text-accent rounded-lg font-bold text-sm hover:bg-white/90 transition-all"
        >
          <span>Resume Session</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <button 
          onClick={() => setIsVisible(false)}
          className="p-2 hover:bg-white/10 rounded-lg transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
