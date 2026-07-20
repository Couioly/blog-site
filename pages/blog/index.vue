<template>
  <article>
    <!-- Search -->
    <div class="search-container" style="margin-bottom: 2rem;">
      <input
        v-model="query"
        type="text"
        class="search-input"
        placeholder="搜索文章..."
      />
      <p v-if="query.trim()" class="search-results-count">
        找到 {{ searchResults.length }} 篇文章
      </p>
    </div>

    <!-- TOC + Content -->
    <div class="blog-index">
      <!-- Sidebar TOC -->
      <BlogTOC v-if="!query.trim()" :years="displayYears" />

      <!-- Post List -->
      <div class="blog-content">
        <!-- Search results -->
        <template v-if="query.trim()">
          <div v-if="searching" class="empty-state">
            <p>搜索中...</p>
          </div>
          <div v-else-if="!searching && query.trim() && searchResults.length === 0" class="empty-state">
            <img src="/null.svg" alt="暂无结果" class="empty-illustration" />
            <p>未找到匹配的文章</p>
          </div>
          <section v-else class="year-section">
            <ul class="post-list">
              <PostCard
                v-for="post in searchResults"
                :key="post.slug"
                :post="post"
              />
            </ul>
          </section>
        </template>

        <!-- Normal year-grouped view -->
        <template v-else>
          <div v-if="postGroups.length === 0" class="empty-state">
            <img src="/null.svg" alt="暂无文章" class="empty-illustration" />
            <p>暂无博客文章</p>
          </div>
          <section
            v-for="group in postGroups"
            :id="`year-${group.year}`"
            :key="group.year"
            class="year-section"
          >
            <div class="year-header">
              <p style="color: var(--text-muted); font-size: 0.85rem; margin: 0;">
                {{ group.posts.length }} 篇文章
              </p>
              <h2>
                <a :href="`#year-${group.year}`">{{ group.year }}</a>
              </h2>
            </div>
            <ul class="post-list">
              <PostCard
                v-for="post in group.posts"
                :key="post.slug"
                :post="post"
              />
            </ul>
          </section>
        </template>

        <!-- View Full Posts (collapsible) -->
        <div v-if="!query.trim()" id="view-full-posts" class="collapse-section">
          <button class="collapse-toggle" @click="showFull = !showFull">
            <span class="arrow" :class="{ open: showFull }">▶</span>
            查看全文摘要
          </button>
          <div
            class="collapse-content"
            :style="{ maxHeight: showFull ? 'none' : '0' }"
          >
            <section
              v-for="group in postGroups"
              :id="`full-year-${group.year}`"
              :key="'full-' + group.year"
              class="year-section"
            >
              <div class="year-header">
                <p style="color: var(--text-muted); font-size: 0.85rem; margin: 0;">
                  {{ group.posts.length }} 篇文章
                </p>
                <h2>
                  <a :href="`#full-year-${group.year}`">{{ group.year }}</a>
                </h2>
              </div>
              <div v-for="post in group.posts" :key="post.slug" style="margin-bottom: 1.5rem;">
                <strong>
                  <NuxtLink :to="`/blog/${post.slug}`">{{ post.title }}</NuxtLink>
                </strong>
                <span class="post-date">({{ formatDate(post.date) }})</span>
                <p v-if="post.description" style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.25rem;">
                  {{ post.description }}
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { PostMeta, PostGroup, SearchResult } from '~/types/blog'

useSeoMeta({
  title: '博客文章',
  description: '个人博客 - 记录思考与学习',
  ogTitle: '博客文章',
  ogDescription: '个人博客 - 记录思考与学习',
  ogType: 'website',
  twitterCard: 'summary',
})

const showFull = ref(false)

// Fetch all posts
const { data: posts } = await useAsyncData('blog-posts', () =>
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

// Build post meta list
const postMetas = computed<PostMeta[]>(() => {
  if (!posts.value) return []
  return posts.value.map((p) => {
    const slug = p._path.replace(/^\/blog\//, '').toLowerCase()
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

// Group by year (descending)
const postGroups = computed<PostGroup[]>(() => {
  const map = new Map<number, PostMeta[]>()
  for (const post of postMetas.value) {
    if (!map.has(post.year)) map.set(post.year, [])
    map.get(post.year)!.push(post)
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => b - a)
    .map(([year, posts]) => ({ year, posts }))
})

const displayYears = computed(() => postGroups.value.map((g) => g.year))

// Search (server-side full-text)
const { query, results: searchResults, searching } = useSearch()

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${mm}-${dd}`
}
</script>
