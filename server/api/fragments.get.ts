import { query as dbQuery } from '~~/server/utils/db'
import type { RowDataPacket } from 'mysql2/promise'

interface FragmentRow extends RowDataPacket {
  slug: string
  title: string
  date: string
  year: number
  filename: string
}

export default defineEventHandler(async () => {
  // Ensure tables exist (idempotent)
  const { ensureTables } = await import('~~/server/utils/db')
  await ensureTables()

  const rows = await dbQuery<FragmentRow[]>(
    'SELECT slug, title, date FROM fragments ORDER BY date DESC'
  )

  return rows.map((row) => {
    const date = row.date ? new Date(row.date).toISOString().slice(0, 10) : ''
    const year = date ? parseInt(date.slice(0, 4)) : 0
    return {
      title: row.title,
      date,
      year,
      filename: `${row.slug}.html`,
      slug: row.slug,
    }
  })
})
