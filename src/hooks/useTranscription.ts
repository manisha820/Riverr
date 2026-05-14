import { useState, useCallback, useRef, useEffect } from 'react';
import { SessionStatus } from '@/types/transcription';
import { TranscriptionOrchestrator } from '@/services/transcription/core/TranscriptionOrchestrator';
import { MockProvider } from '@/services/transcription/providers/MockProvider';
import { DeepgramProvider } from '@/services/transcription/providers/DeepgramProvider';
import { LocalStorageService, LocalSessionState } from '@/services/transcription/core/LocalStorageService';
import { RecoveryOrchestrator } from '@/services/transcription/core/RecoveryOrchestrator';

export const useTranscription = () => {
  const [transcript, setTranscript] = useState<string>('');
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [status, setStatus] = useState<SessionStatus>('active');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [resumableSession, setResumableSession] = useState<LocalSessionState | null>(null);
  
  const orchestratorRef = useRef<TranscriptionOrchestrator | null>(null);
  const sessionIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Check for resumable session
    if (RecoveryOrchestrator.canResume()) {
      setResumableSession(LocalStorageService.getSession());
    }

    const provider = new MockProvider();
    const orchestrator = new TranscriptionOrchestrator(provider);
    
    orchestrator.onPartial((data) => {
      setInterimTranscript(data.transcript);
    });

    orchestrator.onFinal((data) => {
      setTranscript((prev) => {
        const next = prev + (prev ? " " : "") + data.transcript;
        // Persistence Update
        if (sessionIdRef.current) {
          LocalStorageService.saveSession({
            sessionId: sessionIdRef.current,
            transcript: next,
            title: "Live Session",
            status: 'active',
            lastUpdated: new Date().toISOString(),
            unsyncedSegments: [], // Logic to track unsynced queue would go here
            metadata: { reconnectAttempts: 0, provider: 'mock' }
          });
        }
        return next;
      });
      setInterimTranscript('');
    });

    orchestrator.onError((error) => {
      console.error("[Hook] Transcription error:", error);
      setStatus('error');
    });

    orchestratorRef.current = orchestrator;

    return () => {
      orchestrator.stop();
    };
  }, []);

  const startTranscription = useCallback(async () => {
    if (!orchestratorRef.current) return;
    
    try {
      await orchestratorRef.current.start();
      setIsRecording(true);
      setStatus('active');
    } catch (error) {
      setIsRecording(false);
      setStatus('error');
    }
  }, []);

  const stopTranscription = useCallback(() => {
    if (!orchestratorRef.current) return;
    
    orchestratorRef.current.stop();
    setIsRecording(false);
    setStatus('completed');
    LocalStorageService.clearSession();
  }, []);

  const resumeSession = useCallback(async (session: LocalSessionState) => {
    setTranscript(session.transcript);
    sessionIdRef.current = session.sessionId;
    setResumableSession(null);
    await startTranscription();
  }, [startTranscription]);

  return {
    transcript,
    interimTranscript,
    status,
    isRecording,
    resumableSession,
    startTranscription,
    stopTranscription,
    resumeSession,
    discardRecovery: () => {
      LocalStorageService.clearSession();
      setResumableSession(null);
    }
  };
};
