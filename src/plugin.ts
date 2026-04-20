import type { Plugin } from 'payload/config'
import getAuditLogsCollection from './collections/AuditLogs'
import {
  createAuditLogHook,
  createDeleteAuditLogHook,
  createReadAuditLogHook,
} from './hooks/auditLogHook'
import { onInitExtension } from './onInitExtension'
import type { PluginTypes } from './types'

export const auditLogPlugin =
  (pluginOptions: PluginTypes): Plugin =>
  incomingConfig => {
    let config = { ...incomingConfig }

    // If the plugin is disabled, return the config without modifying it
    if (pluginOptions.enabled === false) {
      return config
    }

    // Add Audit Logs collection
    config.collections = [...(config.collections || []), getAuditLogsCollection(pluginOptions)]

    // Apply hooks to selected collections
    if (pluginOptions.collections && pluginOptions.collections.length > 0) {
      config.collections = config.collections.map(collection => {
        if (pluginOptions.collections?.includes(collection.slug)) {
          return {
            ...collection,
            hooks: {
              ...(collection.hooks || {}),
              afterChange: [
                ...(collection.hooks?.afterChange || []),
                createAuditLogHook(pluginOptions, collection.slug),
              ],
              afterDelete: [
                ...(collection.hooks?.afterDelete || []),
                createDeleteAuditLogHook(pluginOptions, collection.slug),
              ],
              afterRead: [
                ...(collection.hooks?.afterRead || []),
                createReadAuditLogHook(pluginOptions, collection.slug),
              ],
            },
          }
        }
        return collection
      })
    }

    config.onInit = async payload => {
      if (incomingConfig.onInit) await incomingConfig.onInit(payload)
      // Add additional onInit code by using the onInitExtension function
      onInitExtension(pluginOptions, payload)
    }

    return config
  }
