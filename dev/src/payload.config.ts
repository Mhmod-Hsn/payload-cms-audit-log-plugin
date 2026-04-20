import { webpackBundler } from '@payloadcms/bundler-webpack'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { slateEditor } from '@payloadcms/richtext-slate'
import path from 'path'
import { buildConfig } from 'payload/config'
import { auditLogPlugin } from '../../src/index'
import Examples from './collections/Examples'
import Users from './collections/Users'

export default buildConfig({
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
    webpack: config => {
      const newConfig = {
        ...config,
        resolve: {
          ...config.resolve,
          alias: {
            ...(config?.resolve?.alias || {}),
            react: path.join(__dirname, '../node_modules/react'),
            'react-dom': path.join(__dirname, '../node_modules/react-dom'),
            payload: path.join(__dirname, '../node_modules/payload'),
          },
        },
      }
      return newConfig
    },
  },
  editor: slateEditor({}),
  collections: [Examples, Users],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  plugins: [
    auditLogPlugin({
      enabled: true,
      collections: ['examples'],
      operations: ['create', 'update', 'delete', 'read'],
    }),
  ],
  db: sqliteAdapter({
    client: {
      url: 'file:./payload.db',
    },
  }),
})
