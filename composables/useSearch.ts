import type { SearchResult } from '~/types/blog'

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
      try {
        const data = await $fetch<{ results: SearchResult[] }>('/api/search', {
          query: { q: query.value.trim() },
        })
        results.value = data.results
      } catch {
        results.value = []
      } finally {
        searching.value = false
      }
    }, 300)
  })

  return { query, results, searching }
}
