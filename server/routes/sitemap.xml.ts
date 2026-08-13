import { query as dbQuery } from '../utils/db'
import type { RowDataPacket } from 'mysql2/promise'

interface SlugRow extends RowDataPacket {
  slug: string
  date: string
}

const SITE_URL = 'https://junbx.cn'

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export default defineEventHandler(async (event) => {
  const blogRows = await dbQuery<SlugRow[]>(
    'SELECT slug, date FROM blog ORDER BY date DESC'
  )
  const fragmentRows = await dbQuery<SlugRow[]>(
    'SELECT slug, date FROM fragments ORDER BY date DESC'
  )

  const urls: string[] = [
    `  <url><loc>${SITE_URL}</loc><changefreq>daily</changefreq><priority>1.0</priority></url>`,
    `  <url><loc>${SITE_URL}/blog</loc><changefreq>daily</changefreq><priority>0.9</priority></url>`,
    `  <url><loc>${SITE_URL}/fragment</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`,
    `  <url><loc>${SITE_URL}/me</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>`,
  ]

  for (const row of blogRows) {
    urls.push(
      `  <url><loc>${SITE_URL}/blog/${escapeXml(row.slug)}</loc><lastmod>${row.date}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>`
    )
  }

  for (const row of fragmentRows) {
    urls.push(
      `  <url><loc>${SITE_URL}/fragment/${escapeXml(row.slug)}</loc><lastmod>${row.date}</lastmod><changefreq>monthly</changefreq><priority>0.4</priority></url>`
    )
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`

  event.node.res.setHeader('Content-Type', 'application/xml; charset=utf-8')
  return xml
})
