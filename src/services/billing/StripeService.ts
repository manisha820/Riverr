import { supabase } from '@/lib/supabase/client';

export class StripeService {
  /**
   * Creates a Stripe Checkout Session for a plan upgrade.
   */
  static async createCheckoutSession(workspaceId: string, plan: string) {
    console.log(`[StripeService] Creating checkout session for ${plan} in workspace ${workspaceId}`);
    
    // In production, this would call our API route which uses 'stripe' npm package
    const response = await fetch('/api/billing/checkout', {
      method: 'POST',
      body: JSON.stringify({ workspaceId, plan })
    });
    
    const { url } = await response.json();
    return url;
  }

  /**
   * Redirects user to the Stripe Customer Portal.
   */
  static async createCustomerPortalSession(workspaceId: string) {
    const response = await fetch('/api/billing/portal', {
      method: 'POST',
      body: JSON.stringify({ workspaceId })
    });
    
    const { url } = await response.json();
    return url;
  }

  /**
   * Syncs subscription state from a Stripe Webhook.
   */
  static async syncSubscription(stripeSubscriptionId: string, status: string, plan: string, periodEnd: string) {
     const { error } = await supabase
      .from('workspace_plans')
      .update({
        status: status,
        plan: plan as any,
        current_period_end: periodEnd,
        updated_at: new Date().toISOString()
      })
      .eq('stripe_subscription_id', stripeSubscriptionId);

    if (error) throw error;
  }
}
