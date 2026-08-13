<template>
  <!--
    BangumiCard — 番剧展示卡片组件
    ================================

    用途：渲染 Bangumi 番剧/书籍卡片，支持点击新标签跳转至 bgm.tv 条目页。

    调用示例：
      <BangumiCard :subject="subject" />

    subject 数据结构（BangumiSubject）：
      {
        id: 265,
        name_cn: "命运石之门",
        name_jp: "シュタインズ・ゲート",
        summary: "冈部伦太郎——通称冈伦...",
        images: { large: "https://...", common: "https://..." },
        rating: { score: 8.8, total: 12345 },
        url: "https://bgm.tv/subject/265"
      }
  -->
  <a
    :href="subject.url"
    target="_blank"
    rel="noopener noreferrer"
    class="bangumi-card"
  >
    <!-- 封面图区域 -->
    <div class="bangumi-cover">
      <img
        :src="coverSrc"
        :alt="subject.name_cn"
        loading="lazy"
        @error="onImgError"
      />
      <!-- 类型标签 -->
      <span class="bangumi-type-tag">{{ subject.typeName || '动画' }}</span>
      <!-- 评分标签 -->
      <span v-if="subject.rating?.score" class="bangumi-score-tag">
        {{ subject.rating.score.toFixed(1) }}
      </span>
    </div>

    <!-- 信息区域 -->
    <div class="bangumi-info">
      <!-- 中文名 -->
      <h3 class="bangumi-title" :title="subject.name_cn">
        {{ subject.name_cn || subject.name_jp }}
      </h3>
      <!-- 日文原名 -->
      <p v-if="subject.name_jp && subject.name_jp !== subject.name_cn" class="bangumi-origin">
        {{ subject.name_jp }}
      </p>
      <!-- 简介（最多显示 3 行） -->
      <p v-if="subject.summary" class="bangumi-summary">
        {{ subject.summary }}
      </p>
    </div>
  </a>
</template>

<script setup lang="ts">
import type { BangumiSubject } from '~/types/resources'

const props = defineProps<{
  subject: BangumiSubject
}>()

// 封面图：优先使用 large，不存在时降级使用 common
const coverSrc = computed(() => {
  return props.subject.images?.large || props.subject.images?.common || ''
})

// 图片加载失败时显示占位背景
const imgFailed = ref(false)

function onImgError() {
  imgFailed.value = true
}
</script>

<style scoped>
.bangumi-card {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow-soft);
  transition: all 0.25s ease;
  cursor: pointer;
}

.bangumi-card:hover {
  border-color: var(--coral);
  box-shadow: var(--shadow-soft-lg);
  transform: translateY(-3px);
}

/* ---- 封面区 ---- */
.bangumi-cover {
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 4;  /* 标准动漫海报比例 ≈ 3:4 */
  overflow: hidden;
  background: linear-gradient(135deg, #F5F0FA 0%, #FFE4E1 100%);
}

.bangumi-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.bangumi-card:hover .bangumi-cover img {
  transform: scale(1.06);
}

/* 类型标签（左上角） */
.bangumi-type-tag {
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 2px 8px;
  font-size: 0.7rem;
  font-weight: 500;
  color: #57534E;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 6px;
  border: 1px solid rgba(231, 229, 228, 0.6);
}

/* 评分标签（右上角） */
.bangumi-score-tag {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 2px 8px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #292524;
  background: rgba(255, 183, 178, 0.88);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 6px;
  border: 1px solid rgba(255, 183, 178, 0.5);
}

/* ---- 信息区 ---- */
.bangumi-info {
  padding: 0.9rem 1rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.bangumi-title {
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--text);
  margin: 0;
  line-height: 1.4;
  /* 单行溢出省略号 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bangumi-origin {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin: 0;
  /* 单行溢出省略号 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bangumi-summary {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin: 0.35rem 0 0;
  line-height: 1.55;
  /* 最多 3 行，超出显示省略号 */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
