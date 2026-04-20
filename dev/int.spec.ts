import type { Payload } from 'payload';

import config from '@payload-config';
import { getPayload } from 'payload';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

let payload: Payload

const getAuditLogsCount = async () => {
  const result = await payload.find({
    collection: 'audit-logs',
    limit: 0,
  })
  return result.totalDocs
}

const getAuditLogs = async (collection: string, documentId: number | string, operation: string) => {
  return payload.find({
    collection: 'audit-logs',
    where: {
      and: [
        {
          collection: { equals: collection },
        },
        {
          documentId: { equals: String(documentId) },
        },
        {
          operation: { equals: operation },
        },
      ],
    },
  })
}

describe('Audit Log Plugin Integration Tests', () => {
  beforeAll(async () => {
    payload = await getPayload({ config })
  })

  afterAll(async () => {
    if (payload) {
      await payload.destroy()
    }
  })

  test('should create audit log on document creation', async () => {
    const totalBefore = await getAuditLogsCount()

    const post = await payload.create({
      collection: 'posts',
      data: { 
        title: 'New Post',
      },
    })
 
    const totalAfter = await getAuditLogsCount()
    expect(totalAfter).toBe(totalBefore + 1)

    const auditLogs = await getAuditLogs('posts', post.id, 'create') 
    
    expect(auditLogs.docs.length).toBeGreaterThan(0)
    expect((auditLogs.docs[0].newData as any).id).toBe(post.id)
    expect((auditLogs.docs[0].newData as any).title).toBe('New Post')
  })
 
  test('should create audit log on document update', async () => {
    const post = await payload.create({
      collection: 'posts',
      data: {
        title: 'Original Title',
      },
    })

    const totalBefore = await getAuditLogsCount()

    await payload.update({
      id: post.id,
      collection: 'posts',
      data: {
        title: 'Updated Title',
      },
    })

    const totalAfter = await getAuditLogsCount()
    expect(totalAfter).toBe(totalBefore + 1)

    const auditLogs = await getAuditLogs('posts', post.id, 'update')
    expect(auditLogs.docs.length).toBeGreaterThan(0)
    expect((auditLogs.docs[0].originalData as any).title).toBe('Original Title')
    expect((auditLogs.docs[0].newData as any).title).toBe('Updated Title')
  })

  test('should create audit log on document deletion', async () => {
    const post = await payload.create({
      collection: 'posts',
      data: {
        title: 'To Be Deleted',
      },
    })

    const totalBefore = await getAuditLogsCount()

    await payload.delete({
      id: post.id,
      collection: 'posts',
    })

    const totalAfter = await getAuditLogsCount()
    expect(totalAfter).toBe(totalBefore + 1)

    const auditLogs = await getAuditLogs('posts', post.id, 'delete')
    expect(auditLogs.docs.length).toBeGreaterThan(0)
    expect((auditLogs.docs[0].originalData as any).title).toBe('To Be Deleted')
  })

  test('should respect the userCollection option', () => {
    const auditLogsCollection = payload.collections['audit-logs'].config
    const userField = auditLogsCollection.fields.find((f: any) => 'name' in f && f.name === 'user') as any
    expect(userField.relationTo).toBe('users') 
  })
})
 