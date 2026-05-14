export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private stream: MediaStream | null = null;
  private onChunkCallback: (chunk: Blob) => void;

  constructor(onChunk: (chunk: Blob) => void) {
    this.onChunkCallback = onChunk;
  }

  async start(timeslice: number = 250): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } 
      });

      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.onChunkCallback(event.data);
        }
      };

      this.mediaRecorder.start(timeslice);
      console.log("[AudioRecorder] Started with timeslice:", timeslice);
    } catch (error) {
      console.error("[AudioRecorder] Error starting recorder:", error);
      throw error;
    }
  }

  stop(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
    console.log("[AudioRecorder] Stopped");
  }
}
