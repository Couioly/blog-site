/**
 * Bangumi 封面图片服务
 *
 * GET /api/bangumi/cover/265
 *
 * 从 MySQL BLOB 读取封面图片并返回，带浏览器缓存。
 * 用户浏览器始终只访问 junbx.cn，不接触 lain.bgm.tv。
 */
import { query } from '~~/server/utils/db'
import type { RowDataPacket } from 'mysql2/promise'

interface CoverRow extends RowDataPacket {
  cover_data: Buffer | null
}

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id || !/^\d+$/.test(id)) {
    throw createError({ statusCode: 400, message: '无效的 subject_id' })
  }

  const rows = await query<CoverRow[]>(
    'SELECT cover_data FROM bangumi WHERE id = ?',
    [parseInt(id)]
  )

  if (!rows.length || !rows[0].cover_data) {
    throw createError({ statusCode: 404, message: '无封面数据' })
  }

  // 浏览器缓存 7 天（封面很少变）
  setHeader(event, 'Content-Type', 'image/jpeg')
  setHeader(event, 'Cache-Control', 'public, max-age=604800, immutable')

  return rows[0].cover_data
})
