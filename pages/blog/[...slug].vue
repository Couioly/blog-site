<template>
  <article>
    <NuxtLink to="/blog" class="article-back">← 返回博客索引</NuxtLink>

    <header class="article-header">
      <h1>{{ post?.title || '文章' }}</h1>
      <div class="article-meta">
        <span v-if="post?.date">日期: {{ formattedDate }}</span>
        <span v-if="tags.length">标签: {{ tags.join(', ') }}</span>
      </div>
    </header>

    <div class="article-body">
      <ContentRenderer v-if="post" :value="post" />
      <p v-else>文章未找到。</p>
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
</script>
