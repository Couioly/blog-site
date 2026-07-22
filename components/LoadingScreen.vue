<template>
  <Teleport to="body">
    <Transition name="loading-fade">
      <div v-if="visible" class="loading-screen">
        <div ref="lottieContainer" class="loading-animation" />
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import lottie from 'lottie-web'

const lottieContainer = ref<HTMLElement | null>(null)
const visible = ref(true)

onMounted(() => {
  // Only show once per session
  const hasLoaded = sessionStorage.getItem('loading-shown')
  if (hasLoaded) {
    visible.value = false
    return
  }

  if (lottieContainer.value) {
    const anim = lottie.loadAnimation({
      container: lottieContainer.value,
      path: '/下载加载.json',
      renderer: 'svg',
      loop: false,
      autoplay: true,
    })

    anim.addEventListener('complete', () => {
      setTimeout(() => {
        visible.value = false
        sessionStorage.setItem('loading-shown', '1')
      }, 400)
    })

    // Fallback: hide after 5s if animation doesn't complete
    setTimeout(() => {
      if (visible.value) {
        visible.value = false
        sessionStorage.setItem('loading-shown', '1')
      }
    }, 5000)
  }
})
</script>

<style scoped>
.loading-screen {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FDFCF8;
}

.loading-animation {
  width: 200px;
  height: 200px;
}

.loading-fade-leave-active {
  transition: opacity 0.5s ease;
}

.loading-fade-leave-to {
  opacity: 0;
}
</style>
