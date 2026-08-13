<template>
  <li
    @mouseenter="startPreview"
    @mouseleave="scheduleClose"
    style="position: relative;"
  >
    <svg class="post-list-icon" viewBox="0 0 1024 1024" width="16" height="16">
      <path d="M288 416h192c17.67 0 32-14.33 32-32s-14.33-32-32-32H288c-17.67 0-32 14.33-32 32s14.33 32 32 32zM288 576h352c17.69 0 32-14.31 32-32s-14.31-32-32-32H288c-17.67 0-32 14.31-32 32s14.33 32 32 32zM480 672H288c-17.67 0-32 14.31-32 32s14.33 32 32 32h192c17.67 0 32-14.31 32-32s-14.33-32-32-32zM939.98 645.16L826.84 532.02c-6.25-6.25-14.44-9.37-22.63-9.37s-16.38 3.12-22.63 9.37L553.37 760.24c-6 6-9.37 14.14-9.37 22.63V896c0 17.67 14.33 32 32 32h113.14c8.49 0 16.63-3.37 22.63-9.37l228.21-228.21c12.49-12.5 12.49-32.76 0-45.26zM675.88 864H608v-67.88L804.21 599.9l67.88 67.88L675.88 864z" fill="currentColor"/>
      <path d="M448 864H192V160h383.86l0.11 128.09c0.06 35.23 28.78 63.91 64 63.91H768v80c0 17.67 14.33 32 32 32s32-14.33 32-32V274.87c0-8.58-3.45-16.8-9.56-22.82L673.09 105.18A32.002 32.002 0 0 0 650.66 96H160c-17.67 0-32 14.33-32 32v768c0 17.67 14.33 32 32 32h288c17.67 0 32-14.33 32-32s-14.33-32-32-32z m319.72-576H639.97l-0.1-125.73L767.72 288z" fill="currentColor"/>
    </svg>
    <strong>
      <NuxtLink :to="`/blog/${post.slug}`">{{ post.title }}</NuxtLink>
    </strong>
    <span class="post-date">({{ formattedDate }})</span>
    <span v-if="'snippet' in post && post.snippet" class="post-snippet"> — {{ post.snippet }}</span>

    <!-- Preview Popup -->
    <Teleport to="body">
      <div
        v-if="showPreview"
        class="post-preview-popup"
        :style="popupStyle"
        @mouseenter="cancelClose"
        @mouseleave="closePreview"
      >
        <div class="post-preview-title">{{ post.title }}</div>
        <div class="post-preview-meta">
          <span>{{ post.date }}</span>
          <span v-if="post.tags?.length" style="margin-left: 0.75em;">
            <span v-for="tag in post.tags" :key="tag" class="post-preview-tag">{{ tag }}</span>
          </span>
        </div>
        <p v-if="loadingPreview" class="post-preview-desc" style="opacity: 0.6;">加载预览中...</p>
        <div v-if="previewHtml" class="post-preview-content prose" v-html="previewHtml" />
        <NuxtLink :to="`/blog/${post.slug}`" class="post-preview-link">阅读全文 →</NuxtLink>
      </div>
    </Teleport>
  </li>
</template>

<script setup lang="ts">
import type { PostMeta, SearchResult } from '~/types/blog'

const props = defineProps<{ post: PostMeta | SearchResult }>()

const formattedDate = computed(() => {
  const d = new Date(props.post.date)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${mm}-${dd}`
})

// Hover preview (4s delay)
const showPreview = ref(false)
const popupX = ref(0)
const popupY = ref(0)
const previewHtml = ref('')
const loadingPreview = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null
let closeTimer: ReturnType<typeof setTimeout> | null = null

const popupStyle = computed(() => ({
  left: `${popupX.value}px`,
  top: `${popupY.value}px`,
}))

function startPreview(e: MouseEvent) {
  if (timer) { clearTimeout(timer); timer = null }
  if (closeTimer) { clearTimeout(closeTimer); closeTimer = null }
  timer = setTimeout(() => {
    const popupW = 320
    let x = e.clientX + 12
    let y = e.clientY + 12

    // 边界检测：超出右边界则翻到鼠标左侧
    if (x + popupW > window.innerWidth - 16) {
      x = e.clientX - popupW - 12
    }
    // 超出下边界则向上偏移
    if (y + 420 > window.innerHeight - 16) {
      y = window.innerHeight - 420 - 16
    }
    // 不超出左/上边界
    if (x < 16) x = 16
    if (y < 16) y = 16

    popupX.value = x
    popupY.value = y
    showPreview.value = true
    fetchPreview()
  }, 2000)
}

function scheduleClose() {
  if (timer) { clearTimeout(timer); timer = null }
  closeTimer = setTimeout(() => {
    showPreview.value = false
    previewHtml.value = ''
    loadingPreview.value = false
  }, 200)
}

function cancelClose() {
  if (closeTimer) { clearTimeout(closeTimer); closeTimer = null }
}

function closePreview() {
  if (closeTimer) { clearTimeout(closeTimer); closeTimer = null }
  showPreview.value = false
  previewHtml.value = ''
  loadingPreview.value = false
}

async function fetchPreview() {
  loadingPreview.value = true
  try {
    const data = await $fetch<{ html?: string; description?: string }>(`/api/blog/${props.post.slug}?preview=1`)
    if (data?.html) {
      previewHtml.value = data.html
    } else if (data?.description) {
      previewHtml.value = `<p>${data.description}</p>`
    }
    loadingPreview.value = false
  } catch {
    loadingPreview.value = false
  }
}
</script>

<style scoped>
.post-preview-popup {
  position: fixed;
  z-index: 1000;
  width: 320px;
  max-height: 380px;
  overflow-y: auto;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 1rem;
  padding: 1.25rem;
  box-shadow: 0 4px 24px rgba(0,0,0,0.12);
  font-size: 0.9rem;
  line-height: 1.6;
}

.post-preview-title {
  font-weight: 700;
  font-size: 1.05rem;
  color: var(--text);
  margin-bottom: 0.35em;
}

.post-preview-meta {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-bottom: 0.75em;
}

.post-preview-tag {
  display: inline-block;
  border: 1px solid var(--border);
  border-radius: 3px;
  padding: 0 6px;
  margin-right: 4px;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.post-preview-desc {
  color: var(--text-secondary);
  margin: 0.5em 0;
}

.post-preview-content {
  margin-top: 0.5em;
}

.post-preview-link {
  display: inline-block;
  margin-top: 0.75em;
  font-size: 0.85rem;
  color: var(--link);
  border-bottom: none;
}

.post-preview-link:hover {
  color: var(--link-hover);
}

.post-snippet {
  font-size: 0.85rem;
  color: var(--text-muted);
}
</style>
