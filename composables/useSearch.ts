import type { SearchResult } from '~/types/blog'

interface IndexEntry {
  title: string
  slug: string
  date: string
  description: string
  tags: string[]
  body: string
}

let indexPromise: Promise<IndexEntry[]> | null = null

function loadIndex(): Promise<IndexEntry[]> {
  if (!indexPromise) {
    indexPromise = $fetch<IndexEntry[]>('/search-index.json').catch(() => [])
  }
  return indexPromise
}

export function useSearch() {
  const query = ref('')
  const results = ref<SearchResult[]>([])
  const searching = ref(false)
  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  watch(query, () => {
    if (debounceTimer) clearTimeout(debounceTimer)
    const q = query.value.trim()
    if (!q) {
      results.value = []
      searching.value = false
      return
    }
    searching.value = true
    debounceTimer = setTimeout(async () => {
      const keyword = query.value.trim().toLowerCase()
      if (!keyword) {
        results.value = []
        searching.value = false
        return
      }

      const index = await loadIndex()
      const matched: (SearchResult & { score: number })[] = []

      for (const entry of index) {
        const titleMatch = entry.title.toLowerCase().includes(keyword) ? 1 : 0
        const descMatch = entry.description.toLowerCase().includes(keyword) ? 1 : 0
        const tagMatch = entry.tags.some((t) => t.toLowerCase().includes(keyword)) ? 1 : 0
        const bodyMatch = entry.body.toLowerCase().includes(keyword) ? 1 : 0

        if (!titleMatch && !descMatch && !tagMatch && !bodyMatch) continue

        const score = titleMatch * 10 + tagMatch * 5 + descMatch * 3 + bodyMatch * 1
        const snippet = bodyMatch ? extractSnippet(entry.body.toLowerCase(), keyword) : entry.description

        matched.push({
          title: entry.title,
          slug: entry.slug,
          date: entry.date,
          description: entry.description || undefined,
          tags: entry.tags.length > 0 ? entry.tags : undefined,
          snippet,
          score,
        })
      }

      matched.sort((a, b) => b.score - a.score || b.date.localeCompare(a.date))
      results.value = matched
      searching.value = false
    }, 300)
  })

  return { query, results, searching }
}

function extractSnippet(text: string, keyword: string): string {
  const idx = text.indexOf(keyword)
  if (idx === -1) return text.slice(0, 150) + '...'
  const start = Math.max(0, idx - 60)
  const end = Math.min(text.length, idx + keyword.length + 60)
  let snippet = text.slice(start, end)
  if (start > 0) snippet = '...' + snippet
  if (end < text.length) snippet = snippet + '...'
  return snippet
}
