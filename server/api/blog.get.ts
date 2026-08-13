import type { RowDataPacket } from 'mysql2/promise'
import { query as dbQuery } from '~~/server/utils/db'

interface BlogRow extends RowDataPacket {
  slug: string
  title: string
  date: string
  description: string
  tags: string
  content: string
}

export default defineEventHandler(async (event) => {
  const { limit, tag } = getQuery(event)

  // Ensure tables exist (idempotent)
  const { ensureTables } = await import('~~/server/utils/db')
  await ensureTables()

  let sql = 'SELECT slug, title, date, description, tags FROM blog'
  const params: unknown[] = []

  if (tag) {
    // MySQL JSON search: WHERE JSON_CONTAINS(tags, '"<tag>"')
    sql += ' WHERE JSON_CONTAINS(tags, ?)'
    params.push(JSON.stringify(tag))
  }

  sql += ' ORDER BY date DESC'

  if (limit) {
    sql += ' LIMIT ?'
    params.push(Number(limit))
  }

  const rows = await dbQuery<BlogRow[]>(sql, params)

  return rows.map((row) => ({
    slug: row.slug,
    title: row.title,
    date: row.date,
    description: row.description || '',
    tags: parseTags(row.tags),
  }))
})

function parseTags(tags: unknown): string[] {
  if (!tags) return []
  if (Array.isArray(tags)) return tags
  if (typeof tags === 'string') {
    try {
      return JSON.parse(tags)
    } catch {
      return []
    }
  }
  return []
}
