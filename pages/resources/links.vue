<template>
  <div class="resource-links-page">
    <div class="repo-grid">
      <RepoCard v-for="repo in repos" :key="repo.repo" :repo="repo" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ResourceLink } from '~/types/resources'

useSeoMeta({
  title: '资料链接',
  ogTitle: '资料链接',
  ogType: 'website',
  twitterCard: 'summary',
})

const repos: ResourceLink[] = [
  {
    name: 'live2d 模型',
    repo: 'imuncle/live2d',
    url: 'https://github.com/imuncle/live2d',
    description: 'Live2D 看板娘模型资源集合，适用于虚拟主播与桌面宠物场景。',
  },
  {
    name: 'Codex 更换主题',
    repo: 'Fei-Away/Codex-Dream-Skin',
    url: 'https://github.com/Fei-Away/Codex-Dream-Skin',
    description: 'OpenAI Codex CLI 自定义主题皮肤，让终端编程体验更美观。',
  },
  {
    name: '张雪峰 .skill',
    repo: 'alchaincyf/zhangxuefeng-skill',
    url: 'https://github.com/alchaincyf/zhangxuefeng-skill',
    description: '基于 Claude Code 的专业选择与志愿填报指导 Skill 扩展。',
  },
  {
    name: '自媒体爬虫',
    repo: 'NanmiCoder/MediaCrawler',
    url: 'https://github.com/NanmiCoder/MediaCrawler',
    description: '多平台自媒体内容采集工具，支持小红书、抖音、微博、B站等。',
  },
]
</script>

<style scoped>
.resource-links-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px;
}

.repo-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

@media (max-width: 768px) {
  .repo-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .resource-links-page {
    padding: 16px;
  }

  .repo-grid {
    grid-template-columns: 1fr;
  }
}
</style>
