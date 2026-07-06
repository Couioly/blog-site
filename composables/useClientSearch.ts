import type { PostMeta } from '~/types/blog'

export function useClientSearch(posts: Ref<PostMeta[]>) {
  const query = ref('')
  const results = ref<PostMeta[]>([])
  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  function runSearch() {
    const q = query.value.trim().toLowerCase()
    if (!q) {
      results.value = []
      return
    }
    results.value = posts.value.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)))
    )
  }

  watch(query, () => {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(runSearch, 300)
  })

  return { query, results }
}
