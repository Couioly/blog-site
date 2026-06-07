// Client-side search over blog posts
interface PostMeta {
  title: string
  date: string
  slug: string
  description?: string
  year: number
}

export function useSearch(posts: Ref<PostMeta[]>) {
  const query = ref('')
  const results = ref<PostMeta[]>([])

  watchEffect(() => {
    const q = query.value.trim().toLowerCase()
    if (!q) {
      results.value = []
      return
    }
    results.value = posts.value.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
    )
  })

  return { query, results }
}
