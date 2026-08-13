<template>
  <div class="landing-page">
    <HeroSection />

    <BlogExcerptCards v-if="recentPosts.length" :posts="recentPosts" />
  </div>
</template>

<script setup lang="ts">
interface LandingBlogItem {
  slug: string
  title: string
  date: string
  description: string
  tags: string[]
}

// Fetch recent 4 blog posts
const { data: posts } = await useFetch<LandingBlogItem[]>('/api/blog?limit=4')

// Recent posts for tilted cards
const recentPosts = computed(() => {
  if (!posts.value) return []
  return posts.value.map((p) => ({
    title: p.title || '',
    slug: p.slug,
    date: formatShortDate(p.date || ''),
    description: p.description,
  }))
})

function formatShortDate(dateStr: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}

useSeoMeta({
  title: 'JunbXの小作坊',
  description: '个人博客 - 记录思考与学习',
  ogTitle: 'JunbXの小作坊',
  ogDescription: '个人博客 - 记录思考与学习',
  ogType: 'website',
  twitterCard: 'summary',
})
</script>

<style scoped>
.landing-page {
  margin: -5rem calc(-50vw + 50%) 0;
  width: 100vw;
  position: relative;
}

.landing-page > section {
  padding-left: max(1.5rem, calc((100% - 960px) / 2));
  padding-right: max(1.5rem, calc((100% - 960px) / 2));
}
</style>
