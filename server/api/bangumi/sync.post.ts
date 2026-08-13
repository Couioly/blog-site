/**
 * Bangumi 数据同步 API
 *
 * POST /api/bangumi/sync
 *
 * 接收 Python 脚本推送的番剧数据，写入 MySQL bangumi 表。
 * 需要 BANGUMI_SYNC_SECRET 认证，防止未授权写入。
 *
 * 请求体：
 *   { secret: "xxx", subjects: [...] }
 *
 * Python 调用示例：
 *   python fetch-bangumi.py --sync --server https://junbx.cn --secret your_key
 */
import { execute } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  // 仅接受 POST
  if (event.method !== 'POST') {
    throw createError({ statusCode: 405, statusMessage: '仅支持 POST 请求' })
  }

  const body = await readBody(event)

  // 密钥校验
  const expectedSecret = process.env.BANGUMI_SYNC_SECRET || ''
  if (!expectedSecret) {
    throw createError({
      statusCode: 500,
      statusMessage: '服务器未配置 BANGUMI_SYNC_SECRET',
    })
  }

  if (!body.secret || body.secret !== expectedSecret) {
    throw createError({
      statusCode: 403,
      statusMessage: '密钥错误，拒绝同步',
    })
  }

  const subjects = body.subjects as any[] | undefined
  if (!Array.isArray(subjects) || subjects.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'subjects 数组为空或格式错误',
    })
  }

  // 逐条 upsert（INSERT ... ON DUPLICATE KEY UPDATE）
  const inserted: number[] = []
  const errors: { id: number; error: string }[] = []

  for (let i = 0; i < subjects.length; i++) {
    const s = subjects[i]
    if (!s || !s.id) {
      errors.push({ id: 0, error: `第 ${i + 1} 条缺少 id` })
      continue
    }

    try {
      // 解码 base64 图片为 Buffer，写入 BLOB
      let coverBuffer: Buffer | null = null
      if (s.cover_base64) {
        try {
          coverBuffer = Buffer.from(s.cover_base64, 'base64')
        } catch (_) { /* 忽略解码错误 */ }
      }

      await execute(
        `INSERT INTO bangumi (id, name, name_cn, name_jp, summary,
          image_large, image_common, cover_data, rating_score, rating_total,
          type, type_name, url, sort_order)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          name = VALUES(name),
          name_cn = VALUES(name_cn),
          name_jp = VALUES(name_jp),
          summary = VALUES(summary),
          image_large = VALUES(image_large),
          image_common = VALUES(image_common),
          cover_data = VALUES(cover_data),
          rating_score = VALUES(rating_score),
          rating_total = VALUES(rating_total),
          type = VALUES(type),
          type_name = VALUES(type_name),
          url = VALUES(url),
          sort_order = VALUES(sort_order)`,
        [
          s.id,
          s.name || s.name_cn || '',
          s.name_cn || s.name || '',
          s.name_jp || '',
          s.summary || '',
          s.images?.large || s.image_large || '',
          s.images?.common || s.image_common || '',
          coverBuffer,
          s.rating?.score || s.rating_score || 0,
          s.rating?.total || s.rating_total || 0,
          s.type || 2,
          s.typeName || s.type_name || '动画',
          s.url || `https://bgm.tv/subject/${s.id}`,
          i, // sort_order = 数组顺序
        ]
      )
      inserted.push(s.id)
    } catch (err: any) {
      errors.push({ id: s.id, error: err.message })
    }
  }

  return {
    ok: true,
    upserted: inserted.length,
    ids: inserted,
    errors: errors.length > 0 ? errors : undefined,
  }
})
