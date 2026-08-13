/**
 * 书架封面图片服务
 * GET /api/books/cover/{id}
 */
import { query } from '~~/server/utils/db'
import type { RowDataPacket } from 'mysql2/promise'

interface CoverRow extends RowDataPacket {
  cover_data: Buffer | null
}

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id || !/^\d+$/.test(id)) {
    throw createError({ statusCode: 400, message: '无效的 book_id' })
  }

  const rows = await query<CoverRow[]>(
    'SELECT cover_data FROM books WHERE id = ?', [parseInt(id)]
  )

  if (!rows.length || !rows[0].cover_data) {
    throw createError({ statusCode: 404, message: '无封面数据' })
  }

  setHeader(event, 'Content-Type', 'image/jpeg')
  setHeader(event, 'Cache-Control', 'public, max-age=604800, immutable')
  return rows[0].cover_data
})
