<template>
  <article>
    <NuxtLink to="/blog" class="article-back">&larr; 返回博客索引</NuxtLink>

    <header class="article-header">
      <h1>标签: {{ tag }}</h1>
      <p class="article-meta">{{ filteredPosts.length }} 篇文章</p>
    </header>

    <div v-if="filteredPosts.length === 0" class="empty-state">
      <p>暂无此标签的文章</p>
    </div>

    <ul class="post-list">
      <PostCard v-for="post in filteredPosts" :key="post.slug" :post="post" />
    </ul>
  </article>
</template>

<script setup lang="ts">
import type { PostMeta } from '~/types/blog'

const route = useRoute()
const tag = (route.params.tag as string) || ''

useSeoMeta({
  title: () => `标签: ${tag}`,
  description: () => `查看标签为 "${tag}" 的所有文章`,
  ogTitle: () => `标签: ${tag}`,
  ogDescription: () => `查看标签为 "${tag}" 的所有文章`,
  ogType: 'website',
  twitterCard: 'summary',
})

const { data: posts } = await useAsyncData(`tag-${tag}`, () =>
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

const filteredPosts = computed<PostMeta[]>(() => {
  if (!posts.value) return []
  return posts.value
    .filter((p) => {
      const pTags = p.tags || []
      return pTags.some((t) => t === tag)
    })
    .map((p) => {
      const slug = p._path.replace(/^\/blog\//, '')
      const d = new Date(p.date || '')
      return {
        title: p.title || slug,
        date: p.date || '',
        slug,
        description: p.description,
        tags: p.tags,
        year: d.getFullYear() || new Date().getFullYear(),
      }
    })
})
</script>
