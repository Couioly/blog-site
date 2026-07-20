<template>
  <div class="landing-page">
    <HeroSection />

    <BlogExcerptCards v-if="recentPosts.length" :posts="recentPosts" />

    <SubscribeSection />
  </div>
</template>

<script setup lang="ts">
// Fetch all blog posts for landing page sections
const { data: posts } = await useAsyncData('landing-posts', () =>
  queryContent<{
    title: string
    date: string
    description?: string
    tags?: string[]
    _path: string
  }>('/blog')
    .sort({ date: -1 })
    .find()
)

// Recent posts for tilted cards
const recentPosts = computed(() => {
  if (!posts.value) return []
  return posts.value.slice(0, 4).map((p) => ({
    title: p.title || '',
    slug: p._path.replace(/^\/blog\//, '').toLowerCase(),
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
  title: 'JunbX · 博客',
  description: '个人博客 - 记录思考与学习',
  ogTitle: 'JunbX · 博客',
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
  padding-left: max(1.5rem, calc((100% - 820px) / 2));
  padding-right: max(1.5rem, calc((100% - 820px) / 2));
}
</style>
