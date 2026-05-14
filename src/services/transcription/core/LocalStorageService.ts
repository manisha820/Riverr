const STORAGE_KEY = 'riverr_active_session';

export interface LocalSessionState {
  sessionId: string;
  transcript: string;
  title: string;
  status: 'active' | 'completed' | 'error';
  lastUpdated: string;
  unsyncedSegments: any[]; // Queue for offline sync
  metadata: {
    reconnectAttempts: number;
    provider: string;
  };
}

export class LocalStorageService {
  static saveSession(state: LocalSessionState) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('[LocalStorageService] Error saving session:', error);
    }
  }

  static queueUnsyncedSegment(segment: any) {
    const session = this.getSession();
    if (session) {
      session.unsyncedSegments.push(segment);
      this.saveSession(session);
    }
  }

  static clearSyncedSegments() {
    const session = this.getSession();
    if (session) {
      session.unsyncedSegments = [];
      this.saveSession(session);
    }
  }

  static getSession(): LocalSessionState | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('[LocalStorageService] Error getting session:', error);
      return null;
    }
  }

  static clearSession() {
    localStorage.removeItem(STORAGE_KEY);
  }
}
