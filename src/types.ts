export interface PluginTypes {
  /**
   * Enable or disable plugin
   * @default false
   */
  enabled?: boolean
  /**
   * Collections to log
   */
  collections?: string[]
  /**
   * Operations to log
   * @default ['create', 'update', 'delete']
   */
  operations?: ('create' | 'update' | 'delete' | 'read')[]
  /**
   * The slug of the users collection
   * @default 'users'
   */
  userCollection?: string
}
