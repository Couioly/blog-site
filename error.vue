<template>
  <div class="error-page">
    <div class="error-icon">
      <span class="text-5xl">🧸</span>
    </div>
    <h1>{{ error.statusCode === 404 ? '页面未找到' : '出错了' }}</h1>
    <p v-if="error.statusCode === 404">
      你访问的页面不存在，请检查链接是否正确。
    </p>
    <p v-else>
      {{ error.message || '发生了一个未知错误。' }}
    </p>
    <NuxtLink to="/" class="btn-secondary">← 返回首页</NuxtLink>
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
  padding: 6rem 1rem;
}

.error-icon {
  margin-bottom: 1.5rem;
}

.error-page h1 {
  font-family: 'Outfit', sans-serif;
  font-size: 2.5rem;
  font-weight: 600;
  color: #292524;
  margin: 0 0 1rem;
  border: none;
  padding: 0;
  letter-spacing: -0.025em;
}

.error-page p {
  color: #78716C;
  margin-bottom: 2rem;
  font-size: 1.05rem;
}
</style>
