<template>
  <div class="me-page">
    <!-- ===== Top: Avatar + Info ===== -->
    <div class="me-top">
      <div class="me-avatar" />
      <div class="me-info">
        <h1 class="me-nickname">JunbX工作室</h1>
        <p class="me-bio"><img src="/签名.svg" alt="" class="me-inline-icon" /> 喜欢前沿技术，热爱分享知识</p>
        <p class="me-signature">— Exploring the intersection of code and curiosity —</p>
      </div>
    </div>

    <!-- ===== Bottom: Changelog Timeline ===== -->
    <div class="me-changelog">
      <h2 class="changelog-title"><img src="/日志查询.svg" alt="" class="me-inline-icon" /> 网站日志</h2>

      <div class="timeline">
        <div v-for="(item, i) in changelog" :key="i" class="timeline-item">
          <div class="timeline-dot" />
          <div class="timeline-content">
            <span class="timeline-date"><img src="/日志记录.svg" alt="" class="me-inline-icon" /> {{ item.date }}</span>
            <span class="timeline-text">{{ item.text }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: '关于我',
  ogTitle: '关于我',
  ogType: 'website',
  twitterCard: 'summary',
})

interface ChangelogItem {
  date: string
  text: string
}

const changelog: ChangelogItem[] = [
  { date: '2026-08-05', text: '新增书架模块，接入豆瓣读书，MySQL 动态管理' },
  { date: '2026-08-04', text: '新增番剧书架，接入 Bangumi API，MySQL 动态管理' },
  { date: '2026-08-03', text: '看板娘 Laffey 接入 DeepSeek AI，支持流式对话' },
  { date: '2026-08-01', text: '看板娘全新人设上线，Laffey 正式入驻' },
  { date: '2026-07-31', text: '新增看板娘、备案号、最新笔记模块' },
  { date: '2026-07-22', text: '新增多篇技术博客和片段内容' },
  { date: '2026-07-20', text: '博客主题重构，采用 Softly 设计风格' },
  { date: '2026-07-10', text: '改进搜索功能，优化搜索体验' },
  { date: '2026-07-06', text: '新增 LangChain 系列博客文章' },
  { date: '2026-07-02', text: '新增片段（Fragments）功能模块' },
  { date: '2026-06-14', text: '博客框架搭建完成，首批文章上线' },
]
</script>

<style scoped>
.me-page {
  max-width: 640px;
  margin: 0 auto;
  padding: 4rem 1.5rem 3rem;
}

/* ===== Top Section ===== */
.me-top {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.me-avatar {
  flex-shrink: 0;
  width: 100px;
  height: 100px;
  border-radius: 1.5rem;
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
  border: 3px solid #fff;
  background-image: url('/img-me.png');
  background-size: cover;
  background-position: center 65%;
}

.me-info {
  flex: 1;
}

.me-nickname {
  font-family: 'Outfit', sans-serif;
  font-size: 1.3rem;
  font-weight: 600;
  letter-spacing: -0.025em;
  color: var(--text);
  margin: 0 0 0.4rem;
  border: none;
  padding: 0;
}

.me-bio {
  color: var(--text-muted);
  font-size: 0.95rem;
  margin: 0 0 0.3rem;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.me-inline-icon {
  width: 1em;
  height: 1em;
  flex-shrink: 0;
  display: inline;
  margin: 0;
  padding: 0;
  border: none;
  border-radius: 0;
  outline: none;
  vertical-align: middle;
}

.me-signature {
  font-family: 'Reenie Beanie', cursive;
  font-size: 1.2rem;
  color: var(--border-strong);
  margin: 0;
}

/* ===== Changelog ===== */
.me-changelog {
  border-top: 1px solid var(--border-light);
  padding-top: 2rem;
}

.changelog-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text);
  margin: 0 0 1.5rem;
  border: none;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

/* Timeline */
.timeline {
  position: relative;
  padding-left: 1.5rem;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 0.75rem;
  top: 6px;
  bottom: 6px;
  width: 1px;
  background: var(--border);
}

.timeline-item {
  position: relative;
  padding-bottom: 1.25rem;
}

.timeline-item:last-child {
  padding-bottom: 0;
}

.timeline-dot {
  position: absolute;
  left: -0.75rem;
  top: 6px;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: var(--border-strong);
  border: 2px solid var(--bg);
  transform: translateX(-50%);
}

.timeline-item:first-child .timeline-dot {
  background: var(--coral);
  box-shadow: 0 0 0 3px rgba(255, 183, 178, 0.25);
}

.timeline-content {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.5rem;
  margin-left: 1.75rem;
}

.timeline-date {
  font-size: 0.8rem;
  color: var(--text-muted);
  font-family: 'Outfit', sans-serif;
  white-space: nowrap;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.timeline-text {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

@media (max-width: 480px) {
  .me-top {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .me-avatar {
    width: 80px;
    height: 80px;
  }

  .timeline-content {
    flex-direction: column;
    gap: 0.15rem;
  }
}
</style>
