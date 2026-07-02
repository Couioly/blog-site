<template>
  <article>
    <div v-if="loading" class="empty-state">
      <p>加载中...</p>
    </div>

    <div v-else-if="fragments.length === 0" class="empty-state">
      <img src="/null.svg" alt="暂无内容" class="empty-illustration" />
      <p>暂无碎片内容</p>
    </div>

    <ul v-else class="post-list">
      <li v-for="item in fragments" :key="item.slug">
        <NuxtLink :to="`/fragment/${item.slug}`">{{ item.title }}</NuxtLink>
        <span class="post-date">({{ item.date }})</span>
      </li>
    </ul>
  </article>
</template>

<script setup lang="ts">
useSeoMeta({
  title: '碎片',
  description: '日常碎片记录',
  ogTitle: '碎片',
  ogDescription: '日常碎片记录',
  ogType: 'website',
  twitterCard: 'summary',
})

interface FragmentItem {
  title: string
  date: string
  filename: string
  slug: string
}

const { data, pending: loading } = await useFetch<FragmentItem[]>('/api/fragments')

const fragments = computed(() => {
  if (!data.value) return []
  return data.value.map((f) => ({
    title: f.title,
    date: f.date ? new Date(f.date).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }) : '',
    slug: f.slug,
  }))
})
</script>
