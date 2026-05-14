import { supabase } from '@/lib/supabase/client';

export type EntityType = 'person' | 'topic' | 'decision' | 'action_item' | 'project' | 'organization' | 'product' | 'deadline' | 'risk';
export type RelationshipType = 'discussed_in' | 'assigned_to' | 'related_to' | 'depends_on' | 'follows_up_from' | 'contradicts' | 'references' | 'approved_by';

export class GraphService {
  /**
   * Upserts an entity node in the workspace graph.
   */
  static async upsertEntity(workspaceId: string, name: string, type: EntityType, description?: string) {
    const { data, error } = await supabase
      .from('entities')
      .upsert({
        workspace_id: workspaceId,
        name: name,
        type: type,
        description: description,
        updated_at: new Date().toISOString()
      }, { onConflict: 'workspace_id, name, type' })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Creates a relationship edge between two entities.
   */
  static async createRelationship(
    workspaceId: string,
    sourceId: string,
    targetId: string,
    type: RelationshipType,
    confidence: number = 1.0,
    referenceId?: string
  ) {
    const { data, error } = await supabase
      .from('relationships')
      .insert({
        workspace_id: workspaceId,
        source_id: sourceId,
        target_id: targetId,
        type: type,
        confidence_score: confidence,
        source_reference_id: referenceId
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Mentions an entity within a specific transcript segment.
   */
  static async logMention(entityId: string, sessionId: string, segmentId: string, confidence: number = 1.0) {
    const { error } = await supabase
      .from('entity_mentions')
      .insert({
        entity_id: entityId,
        session_id: sessionId,
        segment_id: segmentId,
        confidence_score: confidence
      });

    if (error) throw error;
  }
}
