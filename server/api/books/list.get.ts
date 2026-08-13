/**
 * 书架列表 API（豆瓣读书）
 * GET /api/books/list
 */
import { query } from '~~/server/utils/db'
import type { RowDataPacket } from 'mysql2/promise'

interface BookRow extends RowDataPacket {
  id: number; book_name: string; author: string
  cover_url: string; has_cover: number
  rating_score: number; rating_total: number
  summary: string; publisher: string; pub_year: string
  pages: string; price: string; isbn: string; binding: string
  tags: string; url: string; sort_order: number
}

export default defineEventHandler(async () => {
  try {
    const rows = await query<BookRow[]>(
      `SELECT id, book_name, author, cover_url,
        (cover_data IS NOT NULL AND LENGTH(cover_data) > 0) AS has_cover,
        rating_score, rating_total, summary, publisher, pub_year,
        pages, price, isbn, binding, tags, url, sort_order
      FROM books ORDER BY book_name ASC`
    )

    if (rows.length > 0) return { books: rows.map(formatRow), source: 'mysql' as const }
  } catch (err: any) {
    console.warn('[books] MySQL 读取失败:', err.message)
  }
  return { books: [], source: 'none' as const }
})

function formatRow(row: BookRow) {
  return {
    id: row.id,
    book_name: row.book_name || '',
    author: row.author || '',
    cover_url: (row.has_cover === 1) ? `/api/books/cover/${row.id}` : (row.cover_url || ''),
    rating_score: Number(row.rating_score) || 0,
    rating_total: row.rating_total || 0,
    summary: row.summary || '',
    publisher: row.publisher || '',
    pub_year: row.pub_year || '',
    pages: row.pages || '',
    price: row.price || '',
    isbn: row.isbn || '',
    binding: row.binding || '',
    tags: row.tags ? row.tags.split(', ') : [],
    url: row.url || '',
  }
}
