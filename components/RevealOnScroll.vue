<template>
  <div ref="el" class="reveal-on-scroll" :class="{ revealed: isVisible }">
    <slot />
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const isVisible = ref(false)

onMounted(() => {
  if (!el.value) return
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        isVisible.value = true
        observer.unobserve(entry.target)
      }
    },
    { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
  )
  observer.observe(el.value)
  onUnmounted(() => observer.disconnect())
})
</script>

<style scoped>
.reveal-on-scroll {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}

.reveal-on-scroll.revealed {
  opacity: 1;
  transform: translateY(0);
}
</style>
