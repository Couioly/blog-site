import { query as dbQuery } from '~~/server/utils/db'
import type { RowDataPacket } from 'mysql2/promise'

interface SearchRow extends RowDataPacket {
  slug: string
  title: string
  date: string
  description: string
  tags: string
}

export default defineEventHandler(async (event) => {
  const { q } = getQuery(event)

  if (!q || typeof q !== 'string' || q.trim().length === 0) {
    return []
  }

  const keyword = q.trim()

  // Try FULLTEXT search first; fall back to LIKE for short/ambiguous queries
  let rows: SearchRow[]
  try {
    rows = await dbQuery<SearchRow[]>(
      `SELECT slug, title, date, description, tags
       FROM blog
       WHERE MATCH(title, description, content) AGAINST(? IN NATURAL LANGUAGE MODE)
       ORDER BY date DESC
       LIMIT 20`,
      [keyword]
    )
  } catch {
    // FULLTEXT may fail for very short queries (< minimum word length)
    // Fallback to LIKE
    const likePattern = `%${keyword}%`
    rows = await dbQuery<SearchRow[]>(
      `SELECT slug, title, date, description, tags
       FROM blog
       WHERE title LIKE ? OR description LIKE ? OR content LIKE ?
       ORDER BY date DESC
       LIMIT 20`,
      [likePattern, likePattern, likePattern]
    )
  }

  return rows.map((row) => ({
    title: row.title,
    date: row.date,
    slug: row.slug,
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
