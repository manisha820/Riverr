import { supabase } from '@/lib/supabase/client';

export interface WorkflowAction {
  provider: 'slack' | 'notion' | 'webhook';
  type: string;
  payload: any;
}

export class ActionService {
  /**
   * Orchestrates the execution of a workflow action.
   */
  static async executeAction(workspaceId: string, workflowId: string, action: WorkflowAction) {
    const startTime = Date.now();
    try {
      console.log(`[ActionService] Executing ${action.provider} action for workspace ${workspaceId}...`);
      
      // 1. Get Integration Config
      const { data: integration } = await supabase
        .from('workspace_integrations')
        .select('*')
        .eq('workspace_id', workspaceId)
        .eq('provider', action.provider)
        .single();

      if (!integration || !integration.is_active) {
        throw new Error(`Integration for ${action.provider} is not configured or active.`);
      }

      // 2. Dispatch to specific adapter (Mocking execution)
      let result;
      switch (action.provider) {
        case 'slack':
          result = await this.executeSlackAction(integration, action.payload);
          break;
        case 'notion':
          result = await this.executeNotionAction(integration, action.payload);
          break;
        default:
          throw new Error(`Provider ${action.provider} not implemented.`);
      }

      // 3. Log Success
      await this.logExecution(workflowId, workspaceId, 'success', Date.now() - startTime);
      return result;
    } catch (error: any) {
      console.error(`[ActionService] Execution failed:`, error);
      await this.logExecution(workflowId, workspaceId, 'failed', Date.now() - startTime, error.message);
      throw error;
    }
  }

  private static async executeSlackAction(integration: any, payload: any) {
    // In production: fetch(integration.config.webhook_url, { ... })
    return { success: true, message: 'Message sent to Slack' };
  }

  private static async executeNotionAction(integration: any, payload: any) {
    // In production: notionClient.pages.create({ ... })
    return { success: true, message: 'Page created in Notion' };
  }

  private static async logExecution(workflowId: string, workspaceId: string, status: string, timeMs: number, error?: string) {
    await supabase.from('automation_logs').insert({
      workflow_id: workflowId,
      workspace_id: workspaceId,
      status,
      execution_time_ms: timeMs,
      error_message: error
    });
  }
}
