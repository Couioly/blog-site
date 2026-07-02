<template>
  <div class="error-page">
    <h1>{{ error.statusCode === 404 ? '页面未找到' : '出错了' }}</h1>
    <p v-if="error.statusCode === 404">
      你访问的页面不存在，请检查链接是否正确。
    </p>
    <p v-else>
      {{ error.message || '发生了一个未知错误。' }}
    </p>
    <NuxtLink to="/blog" class="error-back">← 返回博客首页</NuxtLink>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

useSeoMeta({
  title: () => props.error.statusCode === 404 ? '页面未找到' : '出错了',
})
</script>

<style scoped>
.error-page {
  text-align: center;
  padding: 4rem 1rem;
}

.error-page h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.error-page p {
  color: var(--text-muted);
  margin-bottom: 2rem;
}

.error-back {
  font-size: 1rem;
  color: var(--link);
  text-decoration: none;
}

.error-back:hover {
  color: var(--link-hover);
}
</style>
