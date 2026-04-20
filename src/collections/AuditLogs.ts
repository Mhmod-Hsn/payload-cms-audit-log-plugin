import { CollectionConfig } from 'payload/types';
import { PluginTypes } from '../types';

const getAuditLogsCollection = (pluginOptions: PluginTypes): CollectionConfig => ({
  slug: 'audit-logs',
  admin: {
    useAsTitle: 'entityId',
    defaultColumns: ['collection', 'operation', 'entityId', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => !!user,
    create: () => false,
    update: () => false,
    delete: () => false,
  },
  fields: [
    {
      name: 'collection',
      type: 'text',
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'entityId',
      type: 'text',
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'operation',
      type: 'select',
      required: true,
      options: [
        { label: 'Create', value: 'create' },
        { label: 'Update', value: 'update' },
        { label: 'Delete', value: 'delete' },
        { label: 'Read', value: 'read' },
      ],
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: pluginOptions.userCollection || 'users',
      required: false,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'changes',
      type: 'json',
      admin: {
        readOnly: true,
      },
    },
  ],
})

export default getAuditLogsCollection;
