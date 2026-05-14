export interface TranscriptionMetrics {
  droppedChunks: number;
  reconnectAttempts: number;
  averageLatency: number;
  totalDuration: number;
  providerTiming: number[];
}

export class MetricsCollector {
  private metrics: TranscriptionMetrics = {
    droppedChunks: 0,
    reconnectAttempts: 0,
    averageLatency: 0,
    totalDuration: 0,
    providerTiming: [],
  };

  private startTime: number = 0;

  startSession() {
    this.startTime = Date.now();
  }

  logReconnect() {
    this.metrics.reconnectAttempts++;
  }

  logDroppedChunk() {
    this.metrics.droppedChunks++;
  }

  logLatency(ms: number) {
    this.metrics.providerTiming.push(ms);
    this.metrics.averageLatency = 
      this.metrics.providerTiming.reduce((a, b) => a + b, 0) / 
      this.metrics.providerTiming.length;
  }

  getMetrics(): TranscriptionMetrics {
    this.metrics.totalDuration = Date.now() - this.startTime;
    return { ...this.metrics };
  }

  reset() {
    this.metrics = {
      droppedChunks: 0,
      reconnectAttempts: 0,
      averageLatency: 0,
      totalDuration: 0,
      providerTiming: [],
    };
  }
}

export const metrics = new MetricsCollector();
