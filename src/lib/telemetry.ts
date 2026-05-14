/**
 * 🛰️ Riverr Telemetry & Observability Framework
 * 
 * Provides a unified abstraction for product analytics, error tracking,
 * and performance monitoring.
 */

export const Telemetry = {
  /**
   * Tracks a product event (PostHog / Mixpanel ready)
   */
  track: (event: string, properties?: Record<string, any>) => {
    console.log(`[Telemetry] Event: ${event}`, properties);
    if (typeof window !== 'undefined' && (window as any).posthog) {
      (window as any).posthog.capture(event, properties);
    }
  },

  /**
   * Captures an exception (Sentry ready)
   */
  captureException: (error: Error, context?: Record<string, any>) => {
    console.error(`[Telemetry] Exception:`, error, context);
    // if (process.env.NEXT_PUBLIC_SENTRY_DSN) Sentry.captureException(error);
  },

  /**
   * Identifies a user in the telemetry stream
   */
  identify: (userId: string, traits?: Record<string, any>) => {
    console.log(`[Telemetry] Identity: ${userId}`, traits);
    if (typeof window !== 'undefined' && (window as any).posthog) {
      (window as any).posthog.identify(userId, traits);
    }
  }
};
