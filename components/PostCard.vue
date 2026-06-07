<template>
  <li>
    <strong>
      <NuxtLink :to="`/blog/${post.slug}`">{{ post.title }}</NuxtLink>
    </strong>
    <span class="post-date">({{ formattedDate }})</span>
  </li>
</template>

<script setup lang="ts">
import type { PostMeta } from '~/types/blog'

const props = defineProps<{ post: PostMeta }>()

const formattedDate = computed(() => {
  const d = new Date(props.post.date)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${mm}-${dd}`
})
</script>
