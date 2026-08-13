/**
 * 书架同步 API（豆瓣读书）
 * POST /api/books/sync
 */
import { execute } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  if (event.method !== 'POST')
    throw createError({ statusCode: 405, statusMessage: '仅支持 POST' })

  const body = await readBody(event)
  const secret = process.env.BANGUMI_SYNC_SECRET || ''
  if (!secret) throw createError({ statusCode: 500, statusMessage: '未配置 BANGUMI_SYNC_SECRET' })
  if (!body.secret || body.secret !== secret) throw createError({ statusCode: 403, statusMessage: '密钥错误' })

  const books = body.books as any[] | undefined
  if (!Array.isArray(books) || books.length === 0)
    throw createError({ statusCode: 400, statusMessage: 'books 数组为空' })

  const inserted: number[] = []
  const errors: { id: number; error: string }[] = []

  for (let i = 0; i < books.length; i++) {
    const b = books[i]
    if (!b?.id) continue

    let cover: Buffer | null = null
    if (b.cover_base64) {
      try { cover = Buffer.from(b.cover_base64, 'base64') } catch (_) {}
    }

    try {
      await execute(
        `INSERT INTO books (id, book_name, author, cover_url, cover_data,
          rating_score, rating_total, summary, publisher, pub_year,
          pages, price, isbn, binding, tags, url, sort_order)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        ON DUPLICATE KEY UPDATE
          book_name=VALUES(book_name), author=VALUES(author),
          cover_url=VALUES(cover_url), cover_data=VALUES(cover_data),
          rating_score=VALUES(rating_score), rating_total=VALUES(rating_total),
          summary=VALUES(summary), publisher=VALUES(publisher), pub_year=VALUES(pub_year),
          pages=VALUES(pages), price=VALUES(price), isbn=VALUES(isbn),
          binding=VALUES(binding), tags=VALUES(tags), url=VALUES(url)`,
        [b.id, b.book_name||'', b.author||'', b.cover_url||'', cover,
          b.rating_score||0, b.rating_total||0, b.summary||'',
          b.publisher||'', b.pub_year||'', b.pages||'',
          b.price||'', b.isbn||'', b.binding||'',
          b.tags||'', b.url||'', i]
      )
      inserted.push(b.id)
    } catch (err: any) {
      errors.push({ id: b.id, error: err.message })
    }
  }

  return { ok: true, upserted: inserted.length, ids: inserted, errors: errors.length > 0 ? errors : undefined }
})
