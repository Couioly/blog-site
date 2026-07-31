<template>
  <article>
    <ReadingProgress />

    <header class="article-header">
      <h1>{{ post?.title || '文章' }}</h1>
      <div v-if="post?.date || tags.length" class="article-meta-row">
        <span v-if="post?.date" class="meta-pill">{{ formattedDate }}</span>
        <NuxtLink
          v-for="tag in tags"
          :key="tag"
          :to="`/blog/tag/${tag}`"
          class="meta-pill meta-pill-tag"
        >{{ tag }}</NuxtLink>
      </div>
    </header>

    <div class="article-body prose">
      <ContentRenderer v-if="post" :value="post" />
      <p v-else>文章未找到</p>
    </div>

    <div class="article-footer-nav">
      <NuxtLink to="/blog" class="article-back">&larr; 返回博客</NuxtLink>
    </div>
  </article>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = (route.params.slug as string[]).join('/')

const { data: post } = await useAsyncData(`post-${slug}`, () =>
  queryContent(`/blog/${slug}`).findOne()
)

const formattedDate = computed(() => {
  if (!post.value?.date) return ''
  const d = new Date(post.value.date as string)
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

const tags = computed(() => {
  const t = post.value?.tags
  if (!t) return []
  return Array.isArray(t) ? t : [t]
})

useSeoMeta({
  title: () => post.value?.title || '文章',
  ogTitle: () => post.value?.title || '文章',
  description: () => (post.value?.description as string) || '',
  ogDescription: () => (post.value?.description as string) || '',
  ogType: 'article',
  twitterCard: 'summary',
})
</script>

<style scoped>
.article-body {
  /* ContentRenderer outputs prose HTML styled by typography.css */
}
</style>
