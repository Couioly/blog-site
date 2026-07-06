<template>
  <article>
    <!-- Search -->
    <div class="search-container" style="margin-bottom: 2rem;">
      <input
        v-model="query"
        type="text"
        class="search-input"
        placeholder="搜索碎片..."
      />
      <p v-if="query.trim()" class="search-results-count">
        找到 {{ searchResults.length }} 条碎片
      </p>
    </div>

    <div v-if="loading" class="empty-state">
      <p>加载中...</p>
    </div>

    <div v-else-if="fragmentMetas.length === 0" class="empty-state">
      <img src="/null.svg" alt="暂无内容" class="empty-illustration" />
      <p>暂无碎片内容</p>
    </div>

    <!-- TOC + Content -->
    <div v-else class="blog-index">
      <FragmentTOC v-if="!query.trim()" :years="displayYears" />

      <div class="blog-content">
        <!-- Search results -->
        <template v-if="query.trim()">
          <div v-if="searchResults.length === 0" class="empty-state">
            <img src="/null.svg" alt="暂无结果" class="empty-illustration" />
            <p>未找到匹配的碎片</p>
          </div>
          <section v-else class="year-section">
            <ul class="post-list">
              <li v-for="item in searchResults" :key="item.slug">
                <svg class="post-list-icon" viewBox="0 0 1024 1024" width="16" height="16">
                  <path d="M455.04 108.8a148.288 148.288 0 0 1 142.592 107.712l1.28 5.12h196.672l6.272 6.336v193.728l5.12 1.28c56.704 16 98.304 63.936 106.688 121.408l1.152 10.88 0.384 10.496a148.48 148.48 0 0 1-108.16 142.72l-5.248 1.216 0.064 199.232-6.272 6.272H540.096l-6.336-6.4 0.384-29.696a78.592 78.592 0 0 0-78.848-78.848A78.912 78.912 0 0 0 376.96 871.04l-0.448 9.088 0.384 28.672-6.336 6.4H115.072l-6.272-6.272v-255.936l6.272-6.272h28.416a78.848 78.848 0 0 0 8.064-157.312l-8.064-0.448h-28.416L108.8 482.688v-254.72l6.272-6.272 196.16-0.064 1.28-5.12a148.224 148.224 0 0 1 121.216-106.176l10.88-1.152 10.432-0.384z m0.064 68.8l-8.896 0.576A79.04 79.04 0 0 0 376.768 247.68l-0.448 8.896-0.192 28.16-6.272 6.272H178.112V423.68l5.184 1.28A148.48 148.48 0 0 1 291.2 557.44l0.384 10.432a148.48 148.48 0 0 1-108.288 142.784l-5.184 1.28v133.952h132.864l1.216-5.12a148.48 148.48 0 0 1 132.48-109.44l10.624-0.384a148.48 148.48 0 0 1 143.104 109.824l1.152 5.12h132.928l0.064-194.816 6.336-6.272h28.288A79.04 79.04 0 0 0 846.08 565.76a78.592 78.592 0 0 0-69.952-78.336l-8.896-0.512h-28.288l-6.336-6.272V291.008H540.288l-6.272-6.208-0.192-28.288a78.848 78.848 0 0 0-70.72-78.464l-8.064-0.448z" fill="currentColor"/>
                </svg>
                <strong>
                  <NuxtLink :to="`/fragment/${item.slug}`">{{ item.title }}</NuxtLink>
                </strong>
                <span class="post-date">({{ formatDate(item.date) }})</span>
              </li>
            </ul>
          </section>
        </template>

        <!-- Normal year-grouped view -->
        <template v-else>
          <section
            v-for="group in fragmentGroups"
            :id="`year-${group.year}`"
            :key="group.year"
            class="year-section"
          >
            <div class="year-header">
              <p style="color: var(--text-muted); font-size: 0.85rem; margin: 0;">
                {{ group.posts.length }} 条碎片
              </p>
              <h1>
                <a :href="`#year-${group.year}`">{{ group.year }}</a>
              </h1>
            </div>
            <ul class="post-list">
              <li v-for="item in group.posts" :key="item.slug">
                <svg class="post-list-icon" viewBox="0 0 1024 1024" width="16" height="16">
                  <path d="M455.04 108.8a148.288 148.288 0 0 1 142.592 107.712l1.28 5.12h196.672l6.272 6.336v193.728l5.12 1.28c56.704 16 98.304 63.936 106.688 121.408l1.152 10.88 0.384 10.496a148.48 148.48 0 0 1-108.16 142.72l-5.248 1.216 0.064 199.232-6.272 6.272H540.096l-6.336-6.4 0.384-29.696a78.592 78.592 0 0 0-78.848-78.848A78.912 78.912 0 0 0 376.96 871.04l-0.448 9.088 0.384 28.672-6.336 6.4H115.072l-6.272-6.272v-255.936l6.272-6.272h28.416a78.848 78.848 0 0 0 8.064-157.312l-8.064-0.448h-28.416L108.8 482.688v-254.72l6.272-6.272 196.16-0.064 1.28-5.12a148.224 148.224 0 0 1 121.216-106.176l10.88-1.152 10.432-0.384z m0.064 68.8l-8.896 0.576A79.04 79.04 0 0 0 376.768 247.68l-0.448 8.896-0.192 28.16-6.272 6.272H178.112V423.68l5.184 1.28A148.48 148.48 0 0 1 291.2 557.44l0.384 10.432a148.48 148.48 0 0 1-108.288 142.784l-5.184 1.28v133.952h132.864l1.216-5.12a148.48 148.48 0 0 1 132.48-109.44l10.624-0.384a148.48 148.48 0 0 1 143.104 109.824l1.152 5.12h132.928l0.064-194.816 6.336-6.272h28.288A79.04 79.04 0 0 0 846.08 565.76a78.592 78.592 0 0 0-69.952-78.336l-8.896-0.512h-28.288l-6.336-6.272V291.008H540.288l-6.272-6.208-0.192-28.288a78.848 78.848 0 0 0-70.72-78.464l-8.064-0.448z" fill="currentColor"/>
                </svg>
                <strong>
                  <NuxtLink :to="`/fragment/${item.slug}`">{{ item.title }}</NuxtLink>
                </strong>
                <span class="post-date">({{ formatDate(item.date) }})</span>
              </li>
            </ul>
          </section>
        </template>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { PostMeta, PostGroup } from '~/types/blog'

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
  year: number
  filename: string
  slug: string
}

const { data, pending: loading } = await useFetch<FragmentItem[]>('/api/fragments')

const fragmentMetas = computed<PostMeta[]>(() => {
  if (!data.value) return []
  return data.value.map((f) => ({
    title: f.title,
    date: f.date,
    slug: f.slug,
    description: '',
    tags: [],
    year: f.year || new Date(f.date).getFullYear(),
  }))
})

const fragmentGroups = computed<PostGroup[]>(() => {
  const map = new Map<number, PostMeta[]>()
  for (const f of fragmentMetas.value) {
    if (!map.has(f.year)) map.set(f.year, [])
    map.get(f.year)!.push(f)
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => b - a)
    .map(([year, posts]) => ({ year, posts }))
})

const displayYears = computed(() => fragmentGroups.value.map((g) => g.year))

const { query, results: searchResults } = useClientSearch(fragmentMetas)

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${mm}-${dd}`
}
</script>
