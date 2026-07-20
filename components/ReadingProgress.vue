<template>
  <div class="reading-progress" :style="{ width: progress + '%' }" />
</template>

<script setup lang="ts">
const progress = ref(0)

function updateProgress() {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  if (docHeight <= 0) {
    progress.value = 0
    return
  }
  progress.value = Math.min(100, Math.round((scrollTop / docHeight) * 100))
}

onMounted(() => {
  updateProgress()
  window.addEventListener('scroll', updateProgress, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateProgress)
})
</script>

<style scoped>
.reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: #FFB7B2;
  z-index: 1000;
  transition: width 0.1s linear;
}
</style>
