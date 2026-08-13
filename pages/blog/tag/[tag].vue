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

interface TagBlogItem {
  slug: string
  title: string
  date: string
  description: string
  tags: string[]
}

const { data: posts } = await useFetch<TagBlogItem[]>('/api/blog', {
  query: { tag },
})

const filteredPosts = computed<PostMeta[]>(() => {
  if (!posts.value) return []
  return posts.value.map((p) => {
    const d = new Date(p.date || '')
    return {
      title: p.title || p.slug,
      date: p.date || '',
      slug: p.slug,
      description: p.description,
      tags: p.tags,
      year: d.getFullYear() || new Date().getFullYear(),
    }
  })
})
</script>
