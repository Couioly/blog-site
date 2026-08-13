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
      <div v-if="post" v-html="post.html" />
      <p v-else>文章未找到</p>
    </div>

    <div class="article-footer-nav">
      <NuxtLink to="/blog" class="article-back">&larr; 返回博客</NuxtLink>
    </div>
  </article>
</template>

<script setup lang="ts">
interface BlogDetail {
  slug: string
  title: string
  date: string
  description: string
  tags: string[]
  html: string
}

const route = useRoute()
const slug = (route.params.slug as string[]).join('/')

const { data: post } = await useFetch<BlogDetail>(`/api/blog/${slug}`)

const formattedDate = computed(() => {
  if (!post.value?.date) return ''
  const d = new Date(post.value.date)
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

const tags = computed(() => {
  return post.value?.tags || []
})

useSeoMeta({
  title: () => post.value?.title || '文章',
  ogTitle: () => post.value?.title || '文章',
  description: () => post.value?.description || '',
  ogDescription: () => post.value?.description || '',
  ogType: 'article',
  twitterCard: 'summary',
})
</script>

<style scoped>
.article-body {
  /* ContentRenderer outputs prose HTML styled by typography.css */
}
</style>
