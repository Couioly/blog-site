<template>
  <nav class="site-nav">
    <div class="site-nav-logo">
      <a href="/blog">BLOG</a>
    </div>
    <div class="site-nav-links">
      <NuxtLink to="/blog" :class="{ active: $route.path === '/blog' }">文章</NuxtLink>
      <a href="/blog" @click.prevent="scrollToToc('view-full-posts')">全文</a>
    </div>
  </nav>
</template>

<script setup lang="ts">
function scrollToToc(id: string) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}
</script>
