import type { RowDataPacket } from 'mysql2/promise'
import { query as dbQuery } from '~~/server/utils/db'
import { renderMarkdown } from '~~/server/utils/renderer'
import { wrapCodeBlocks } from '~~/server/utils/code-wrapper'

interface BlogRow extends RowDataPacket {
  slug: string
  title: string
  date: string
  description: string
  tags: string
  content: string
}

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  const { preview } = getQuery(event)

  if (!slug) {
    throw createError({ statusCode: 400, message: 'slug is required' })
  }

  const rows = await dbQuery<BlogRow[]>(
    'SELECT slug, title, date, description, tags, content FROM blog WHERE slug = ?',
    [slug]
  )

  if (rows.length === 0) {
    throw createError({ statusCode: 404, message: 'Blog not found' })
  }

  const row = rows[0]
  const tags: string[] = parseTags(row.tags)

  // Preview mode: return rendered HTML (前 ~800 字)
  if (preview === '1') {
    const rawHtml = renderMarkdown(row.content)
    const previewHtml = wrapCodeBlocks(rawHtml)

    return {
      slug: row.slug,
      title: row.title,
      date: row.date,
      description: row.description || '',
      tags,
      html: previewHtml,
    }
  }

  // Full render
  const rawHtml = renderMarkdown(row.content)
  const html = wrapCodeBlocks(rawHtml)

  return {
    slug: row.slug,
    title: row.title,
    date: row.date,
    description: row.description || '',
    tags,
    content: row.content,
    html,
  }
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
