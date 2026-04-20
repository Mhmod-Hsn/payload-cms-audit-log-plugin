import {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionAfterReadHook,
} from 'payload/types'
import { PluginTypes } from '../types'

export const createAuditLogHook = (
  pluginOptions: PluginTypes,
  collectionSlug: string,
): CollectionAfterChangeHook => {
  return async ({ doc, previousDoc, operation, req }) => {
    const { payload, user } = req
    const operations = pluginOptions.operations || ['create', 'update', 'delete']

    if (!operations.includes(operation)) {
      return doc
    }

    try {
      await payload.create({
        collection: 'audit-logs',
        data: {
          collection: collectionSlug,
          entityId: doc.id,
          operation,
          user: user?.id,
          changes:
            operation === 'update'
              ? {
                  before: previousDoc,
                  after: doc,
                }
              : doc,
        },
      })
    } catch (error) {
      payload.logger.error(`Error creating audit log: ${error}`)
    }

    return doc
  }
}

export const createDeleteAuditLogHook = (
  pluginOptions: PluginTypes,
  collectionSlug: string,
): CollectionAfterDeleteHook => {
  return async ({ doc, req }) => {
    const { payload, user } = req
    const operations = pluginOptions.operations || ['create', 'update', 'delete']

    if (!operations.includes('delete')) {
      return
    }

    try {
      await payload.create({
        collection: 'audit-logs',
        data: {
          collection: collectionSlug,
          entityId: doc.id,
          operation: 'delete',
          user: user?.id,
          changes: doc,
        },
      })
    } catch (error) {
      payload.logger.error(`Error creating audit log for delete: ${error}`)
    }
  }
}

export const createReadAuditLogHook = (
  pluginOptions: PluginTypes,
  collectionSlug: string,
): CollectionAfterReadHook => {
  return async ({ doc, req }) => {
    const { payload, user } = req
    const operations = pluginOptions.operations || ['create', 'update', 'delete']

    if (!operations.includes('read')) {
      return doc
    }

    // Skip if it's an internal call without a user, or if we want to avoid logging every read in the admin UI
    // Note: We might want a way to distinguish between 'api' reads and 'internal' reads
    if (!user) {
      return doc
    }

    try {
      await payload.create({
        collection: 'audit-logs',
        data: {
          collection: collectionSlug,
          entityId: doc.id,
          operation: 'read',
          user: user?.id,
          changes: doc,
        },
      })
    } catch (error) {
      payload.logger.error(`Error creating audit log for read: ${error}`)
    }

    return doc
  }
}
