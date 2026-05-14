import { supabase } from '@/lib/supabase/client';
import { ActionService } from './ActionService';

export class TriggerService {
  /**
   * Main entry point for events in the system.
   * This is called by other services (Transcription, AI, etc.) when key events occur.
   */
  static async onEvent(workspaceId: string, eventName: string, eventContext: any) {
    console.log(`[TriggerService] Event received: ${eventName} in workspace ${workspaceId}`);

    // 1. Fetch active workflows for this trigger
    const { data: workflows, error } = await supabase
      .from('automation_workflows')
      .select('*')
      .eq('workspace_id', workspaceId)
      .eq('trigger_event', eventName)
      .eq('is_active', true);

    if (error || !workflows) return;

    // 2. Evaluate and Execute
    for (const workflow of workflows) {
      try {
        // Evaluate conditions (Simple mock evaluation)
        const shouldExecute = this.evaluateConditions(workflow.condition_logic, eventContext);
        
        if (shouldExecute) {
          await ActionService.executeAction(workspaceId, workflow.id, workflow.action_payload);
        } else {
          console.log(`[TriggerService] Conditions not met for workflow ${workflow.name}`);
        }
      } catch (err) {
        console.error(`[TriggerService] Workflow ${workflow.name} failed:`, err);
      }
    }
  }

  private static evaluateConditions(logic: any, context: any): boolean {
    // In production: Use a robust rule engine like json-rules-engine
    if (!logic || Object.keys(logic).length === 0) return true;
    
    // Example: IF context.confidence > 0.8
    if (logic.min_confidence && context.confidence < logic.min_confidence) return false;
    
    return true;
  }
}
