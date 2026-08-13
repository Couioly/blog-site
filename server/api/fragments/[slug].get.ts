import { query as dbQuery } from '~~/server/utils/db'
import type { RowDataPacket } from 'mysql2/promise'

interface FragmentRow extends RowDataPacket {
  slug: string
  title: string
  date: string
  content: string
}

export default defineEventHandler(async (event) => {
  const slugParam = getRouterParam(event, 'slug')

  if (!slugParam) {
    throw createError({ statusCode: 400, message: 'slug is required' })
  }

  const rows = await dbQuery<FragmentRow[]>(
    'SELECT slug, title, date, content FROM fragments WHERE slug = ?',
    [slugParam]
  )

  if (rows.length === 0) {
    throw createError({ statusCode: 404, message: 'Fragment not found' })
  }

  return rows[0].content
})
