<template>
  <nav class="blog-toc">
    <div class="blog-toc-title">目录</div>
    <a
      v-for="year in years"
      :key="year"
      :href="`#year-${year}`"
      @click.prevent="scrollTo(`year-${year}`)"
    >{{ year }}</a>
    <a
      href="#view-full-posts"
      @click.prevent="scrollTo('view-full-posts')"
    >全文</a>
  </nav>
</template>

<script setup lang="ts">
defineProps<{ years: number[] }>()

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}
</script>
