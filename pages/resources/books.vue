<template>
  <div class="books-page">
    <!-- 加载状态 -->
    <div v-if="status === 'pending'" class="books-status">
      <p class="loading-text">加载中...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="books-status books-status--error">
      <p>❌ 书架数据加载失败</p>
      <p class="error-detail">{{ error.message || '未知错误' }}</p>
      <button class="retry-btn" @click="refresh()">重试</button>
    </div>

    <!-- 空状态 -->
    <div v-else-if="!books.length" class="books-empty">
      <img src="/null.svg" alt="暂无书籍" class="empty-img" />
    </div>

    <!-- 书籍卡片网格 -->
    <div v-else class="books-grid">
      <BookCard v-for="book in books" :key="book.id" :book="book" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface BookItem {
  id: number
  book_name: string
  author: string
  author_desc: string
  status: string
  word_count: number
  tags: string[]
  cover_url: string
  abstract: string
  url: string
}

useSeoMeta({
  title: '书架',
  ogTitle: '书架 - JunbXの小作坊',
  ogType: 'website',
  twitterCard: 'summary',
})

const { data, status, error, refresh } = useAsyncData<{ books: BookItem[] }>(
  'books-shelf',
  () => $fetch('/api/books/list'),
  { server: true, lazy: false }
)

const books = computed(() => data.value?.books || [])
</script>

<style scoped>
.books-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
}

.books-status {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-muted);
}

.books-status--error { color: #DC2626; }

.loading-text { animation: pulse 1.5s ease-in-out infinite; }

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.error-detail {
  font-size: 0.8rem;
  opacity: 0.7;
  margin-top: 0.25rem;
}

.retry-btn {
  margin-top: 1rem;
  padding: 0.4rem 1.2rem;
  font-size: 0.85rem;
  font-weight: 500;
  color: #fff;
  background: var(--coral);
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.retry-btn:hover { background: #FF9D95; }

.books-empty {
  text-align: center;
  padding: 4rem 1rem;
}

.empty-img {
  max-width: 300px;
  width: 100%;
  height: auto;
  opacity: 0.6;
}

@media (max-width: 768px) {
  .books-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 480px) {
  .books-page { padding: 16px; }
  .books-grid { grid-template-columns: 1fr; }
}
</style>
