<template>
  <div class="redirect-page">
    <p>正在跳转到博客...</p>
    <NuxtLink to="/blog">如果未自动跳转，请点击这里</NuxtLink>
  </div>
</template>

<script setup lang="ts">
// Server-side redirect
definePageMeta({})

// Client-side fallback redirect
if (process.client) {
  navigateTo('/blog', { replace: true })
}
</script>

<style scoped>
.redirect-page {
  text-align: center;
  padding: 4rem 0;
}
</style>
