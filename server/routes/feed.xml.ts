import { query as dbQuery } from '../utils/db'
import type { RowDataPacket } from 'mysql2/promise'

interface BlogRow extends RowDataPacket {
  slug: string
  title: string
  date: string
  description: string
}

const SITE_URL = 'https://junbx.cn'

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export default defineEventHandler(async (event) => {
  const rows = await dbQuery<BlogRow[]>(
    'SELECT slug, title, date, description FROM blog ORDER BY date DESC LIMIT 50'
  )

  const items = rows
    .filter((p) => p.date && p.title)
    .map((p) => {
      const url = `${SITE_URL}/blog/${p.slug}`
      const date = new Date(p.date).toISOString()
      const title = escapeXml(p.title)
      const desc = escapeXml(p.description || title)

      return `    <item>
      <title>${title}</title>
      <link>${escapeXml(url)}</link>
      <guid>${escapeXml(url)}</guid>
      <pubDate>${date}</pubDate>
      <description>${desc}</description>
    </item>`
    })
    .join('\n')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>JunbXの小作坊</title>
    <link>${SITE_URL}</link>
    <description>JunbXの小作坊 - 记录思考与学习</description>
    <language>zh-CN</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`

  event.node.res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8')
  return rss
})
