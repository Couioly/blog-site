import { serverQueryContent } from '#content/server'

const SITE_URL = 'https://junbx.cn'

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export default defineEventHandler(async (event) => {
  const posts = await serverQueryContent(event, '/blog')
    .sort({ date: -1 })
    .find()

  const items = posts
    .filter((p) => p.date && p.title)
    .map((p) => {
      const slug = (p._path as string).replace(/^\/blog\//, '')
      const url = `${SITE_URL}/blog/${slug}`
      const date = new Date(p.date as string).toISOString()
      const title = escapeXml(p.title as string)
      const desc = escapeXml((p.description as string) || title)

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
    <title>我的博客</title>
    <link>${SITE_URL}</link>
    <description>个人博客 - 记录思考与学习</description>
    <language>zh-CN</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`

  event.node.res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8')
  return rss
})
