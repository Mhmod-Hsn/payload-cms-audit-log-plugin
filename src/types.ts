import type { CollectionSlug } from 'payload';

export type AuditLogOperation = 'create' | 'delete' | 'read' | 'update'

export interface AuditLogConfig {
  /**
   * List of collections to track and which operations to log for each.
   */
  collections: Partial<Record<CollectionSlug, {
    operations: AuditLogOperation[]
  }>>
  /**
   * Whether the plugin is disabled.
   */
  disabled?: boolean
  /**
   * The slug of the collection used for users. Defaults to 'users'.
   */
  userCollection?: CollectionSlug
}
