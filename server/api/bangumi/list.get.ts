/**
 * Bangumi 番剧列表 API
 *
 * GET /api/bangumi/list
 *
 * 优先从 MySQL 读取，连接失败时降级为静态 JSON 文件。
 * 服务器（阿里云）不需要访问 api.bgm.tv，只读本地数据库。
 */
import { query, execute } from '~~/server/utils/db'
import type { RowDataPacket } from 'mysql2/promise'
import fs from 'fs'
import path from 'path'

interface BangumiRow extends RowDataPacket {
  id: number
  name: string
  name_cn: string
  name_jp: string
  summary: string
  image_large: string
  image_common: string
  has_cover: number  // 0 或 1
  rating_score: number
  rating_total: number
  type: number
  type_name: string
  url: string
  sort_order: number
}

export default defineEventHandler(async () => {
  // 1) 优先从 MySQL 读取
  try {
    // 不 SELECT cover_data BLOB，用 LENGTH 判断是否存在
    const rows = await query<BangumiRow[]>(
      `SELECT id, name, name_cn, name_jp, summary,
        image_large, image_common,
        (cover_data IS NOT NULL AND LENGTH(cover_data) > 0) AS has_cover,
        rating_score, rating_total, type, type_name, url, sort_order
      FROM bangumi ORDER BY sort_order ASC, id ASC`
    )

    if (rows.length > 0) {
      const subjects = rows.map(formatRow)
      return { subjects, source: 'mysql' as const }
    }
  } catch (err: any) {
    console.warn('[bangumi] MySQL 读取失败，降级到静态 JSON:', err.message)
  }

  // 2) 降级：读取静态 JSON 文件
  try {
    const filePath = path.resolve(process.cwd(), 'public/bangumi-shelf.json')
    const raw = fs.readFileSync(filePath, 'utf-8')
    const data = JSON.parse(raw)
    return { subjects: data.subjects || [], source: 'json' as const }
  } catch (err: any) {
    console.warn('[bangumi] 静态 JSON 读取失败:', err.message)
    return { subjects: [], source: 'none' as const }
  }
})

/** 数据库行 → 前端 BangumiSubject 格式 */
function formatRow(row: BangumiRow) {
  // 有本地封面则用本地 URL，否则回退到 Bangumi CDN
  const hasLocalCover = row.has_cover === 1
  const coverUrl = hasLocalCover
    ? `/api/bangumi/cover/${row.id}`
    : (row.image_large || row.image_common || '')

  return {
    id: row.id,
    name: row.name || '',
    name_cn: row.name_cn || '',
    name_jp: row.name_jp || '',
    summary: row.summary || '',
    images: {
      large: coverUrl,
      common: coverUrl,
      medium: '',
      small: '',
      grid: '',
    },
    rating: {
      score: Number(row.rating_score) || 0,
      total: row.rating_total || 0,
    },
    type: row.type || 2,
    typeName: row.type_name || '动画',
    url: row.url || `https://bgm.tv/subject/${row.id}`,
  }
}
