<template>
  <article>
    <ReadingProgress />

    <header class="article-header">
      <h1>{{ title }}</h1>
      <div v-if="dateStr" class="article-meta-row">
        <span class="meta-pill">{{ dateStr }}</span>
      </div>
    </header>

    <div class="article-body">
      <div v-if="loading" class="empty-state">
        <p>加载中...</p>
      </div>
      <div v-else-if="error" class="empty-state">
        <img src="/null.svg" alt="未找到" class="empty-illustration" />
        <p>碎片未找到</p>
      </div>
      <div v-else ref="contentEl" class="fragment-content" v-html="html" />
    </div>

    <div class="article-footer-nav">
      <NuxtLink to="/fragment" class="article-back">&larr; 返回碎片</NuxtLink>
    </div>

    <!-- Lightbox overlay -->
    <Teleport to="body">
      <div
        class="media-lightbox"
        :class="{ show: lightbox.show }"
        @click="closeLightbox"
      >
        <div class="lb-inner" @click.stop>
          <div v-if="lightbox.type === 'video'" v-html="lightbox.videoHtml" />
          <img
            v-else-if="lightbox.type === 'image'"
            :src="lightbox.src"
            :alt="lightbox.alt"
          />
        </div>
      </div>
    </Teleport>
  </article>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = (route.params.slug as string[]).join('/')

const { data: html, pending: loading, error } = await useFetch(`/fragments/${slug}.html`, {
  parseResponse: (r) => r,
})

const title = computed(() => {
  const match = slug.match(/^\d{4}-\d{2}-\d{2}-(.+)$/)
  return match ? match[1].replace(/-/g, ' ') : slug
})

const dateStr = computed(() => {
  const match = slug.match(/^(\d{4}-\d{2}-\d{2})/)
  if (!match) return ''
  const d = new Date(match[1])
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

// Lightbox state
const lightbox = reactive<{
  show: boolean
  type: 'image' | 'video' | null
  src: string
  alt: string
  videoHtml: string
}>({
  show: false,
  type: null,
  src: '',
  alt: '',
  videoHtml: '',
})

function openLightbox(el: HTMLImageElement | HTMLVideoElement) {
  if (el.tagName === 'VIDEO') {
    lightbox.type = 'video'
    const v = el as HTMLVideoElement
    lightbox.videoHtml = `<video controls autoplay style="max-width:92vw;max-height:92vh;border-radius:4px;">${v.innerHTML}</video>`
  } else {
    lightbox.type = 'image'
    lightbox.src = (el as HTMLImageElement).src
    lightbox.alt = (el as HTMLImageElement).alt || ''
  }
  lightbox.show = true
}

function closeLightbox() {
  lightbox.show = false
  lightbox.type = null
  lightbox.videoHtml = ''
}

// Reference to fragment content container
const contentEl = ref<HTMLElement | null>(null)

onMounted(() => {
  nextTick(() => {
    if (!contentEl.value) return
    const media = contentEl.value.querySelectorAll('img, video')
    media.forEach((el) => {
      el.addEventListener('click', (e) => {
        e.stopPropagation()
        openLightbox(el as HTMLImageElement | HTMLVideoElement)
      })
    })
  })
})

// Handle Escape key
onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})
onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
})
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') closeLightbox()
}

useSeoMeta({
  title: () => title.value,
  ogTitle: () => title.value,
  ogType: 'article',
  twitterCard: 'summary',
})
</script>

<style>
.media-lightbox {
  display: none;
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.9);
  z-index: 9999;
  align-items: center;
  justify-content: center;
}
.media-lightbox.show { display: flex; }
.lb-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 92vw;
  max-height: 92vh;
}
.lb-inner img,
.lb-inner video {
  max-width: 92vw;
  max-height: 92vh;
  border-radius: 4px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.5);
}

.fragment-content img,
.fragment-content video {
  cursor: pointer;
}
</style>

<style scoped>
.fragment-content {
  line-height: 1.75;
}

.fragment-content :deep(img) {
  max-width: 100%;
  height: auto;
}

.fragment-content :deep(video) {
  max-width: 100%;
}
</style>
