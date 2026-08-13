<template>
  <!--
    番剧书架页面
    ============

    数据来源：/api/bangumi/list
    优先 MySQL，数据库不可用时自动降级为静态 JSON。
    更新番剧：python scripts/fetch-bangumi.py --sync --server https://junbx.cn --secret <密钥>
  -->
  <div class="bangumi-page">
    <!-- 加载状态 -->
    <div v-if="status === 'pending'" class="bangumi-status">
      <p class="loading-text">加载中...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="bangumi-status bangumi-status--error">
      <p>❌ 番剧数据加载失败</p>
      <p class="error-detail">{{ error.message || '未知错误' }}</p>
      <button class="retry-btn" @click="refresh()">重试</button>
    </div>

    <!-- 空状态 -->
    <div v-else-if="!subjects.length" class="bangumi-empty">
      <img src="/null.svg" alt="暂无追番" class="empty-img" />
    </div>

    <!-- 番剧卡片网格 -->
    <div v-else class="bangumi-grid">
      <BangumiCard v-for="subject in subjects" :key="subject.id" :subject="subject" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BangumiSubject } from '~/types/resources'

// SEO 元信息
useSeoMeta({
  title: '追番',
  ogTitle: '追番 - JunbXの小作坊',
  ogType: 'website',
  twitterCard: 'summary',
})

// 从 /api/bangumi/list 获取（优先 MySQL，失败降级静态 JSON）
const { data, status, error, refresh } = useAsyncData<{ subjects: BangumiSubject[]; source: string }>(
  'bangumi-shelf',
  () => $fetch('/api/bangumi/list'),
  {
    server: true,
    lazy: false,
  }
)

const subjects = computed(() => data.value?.subjects || [])
</script>

<style scoped>
.bangumi-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px;
}

/* ---- 番剧卡片网格 ---- */
.bangumi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
}

/* ---- 加载/错误/空状态 ---- */
.bangumi-status {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-muted);
}

.bangumi-status--error {
  color: #DC2626;
}

.loading-text {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.error-detail {
  font-size: 0.8rem;
  opacity: 0.7;
  margin-top: 0.25rem;
}

.empty-hint {
  font-size: 0.8rem;
  margin-top: 0.5rem;
}

.bangumi-empty {
  text-align: center;
  padding: 4rem 1rem;
}

.empty-img {
  max-width: 300px;
  width: 100%;
  height: auto;
  opacity: 0.6;
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
  transition: background 0.2s;
}

.retry-btn:hover {
  background: #FF9D95;
}

/* ---- 响应式 ---- */
@media (max-width: 768px) {
  .bangumi-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .bangumi-page {
    padding: 3rem 1rem 2rem;
  }

  .bangumi-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>
