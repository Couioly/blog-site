import { serverQueryContent } from '#content/server'

export default defineEventHandler(async (event) => {
  const q = getQuery(event).q as string | undefined
  if (!q || q.trim().length === 0) {
    return { results: [] }
  }

  const keyword = q.trim().toLowerCase()
  const posts = await serverQueryContent(event, '/blog')
    .sort({ date: -1 })
    .find()

  const results: Array<{
    title: string
    date: string
    slug: string
    description?: string
    tags?: string[]
    snippet?: string
    score: number
  }> = []

  for (const post of posts) {
    const title = (post.title as string) || ''
    const desc = (post.description as string) || ''
    const tags = (post.tags as string[]) || []
    const bodyText = extractText(post.body).toLowerCase()

    const titleMatch = title.toLowerCase().includes(keyword) ? 1 : 0
    const descMatch = desc.toLowerCase().includes(keyword) ? 1 : 0
    const tagMatch = tags.some((t) => t.toLowerCase().includes(keyword)) ? 1 : 0
    const bodyMatch = bodyText.includes(keyword) ? 1 : 0

    if (!titleMatch && !descMatch && !tagMatch && !bodyMatch) continue

    const score = titleMatch * 10 + tagMatch * 5 + descMatch * 3 + bodyMatch * 1
    const snippet = extractSnippet(bodyText, keyword)

    results.push({
      title,
      date: (post.date as string) || '',
      slug: ((post._path as string) || '').replace(/^\/blog\//, ''),
      description: desc || undefined,
      tags: tags.length > 0 ? tags : undefined,
      snippet,
      score,
    })
  }

  results.sort((a, b) => b.score - a.score || b.date.localeCompare(a.date))

  return { results }
})

function extractText(node: unknown): string {
  if (!node) return ''
  if (typeof node === 'string') return node
  if (Array.isArray(node)) return node.map(extractText).join(' ')
  if (typeof node === 'object' && node !== null) {
    const n = node as Record<string, unknown>
    if (n.type === 'text' && typeof n.value === 'string') return n.value
    if (Array.isArray(n.children)) return extractText(n.children)
  }
  return ''
}

function extractSnippet(text: string, keyword: string): string {
  if (!text) return ''
  const idx = text.indexOf(keyword)
  if (idx === -1) return text.slice(0, 150) + '...'
  const start = Math.max(0, idx - 60)
  const end = Math.min(text.length, idx + keyword.length + 60)
  let snippet = text.slice(start, end)
  if (start > 0) snippet = '...' + snippet
  if (end < text.length) snippet = snippet + '...'
  return snippet
}
