<template>
  <ClientOnly>
    <div class="site-counters">
      <p class="counter-item">
        <span class="counter-label">网站运行时长：</span>
        <span class="counter-value">{{ runtime }}</span>
      </p>
      <p class="counter-item">
        <span class="counter-label">总访客：</span>
        <span class="counter-value">{{ visitors }}</span>
      </p>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
const SITE_START = new Date('2026-07-01T00:00:00').getTime()
const STORAGE_KEY = 'site_visitor_count'

const runtime = ref('')
const visitors = ref(0)

// Runtime counter — update every second
function updateRuntime() {
  const now = Date.now()
  const diff = now - SITE_START
  if (diff < 0) { runtime.value = '0天0时0分0秒'; return }

  const totalSec = Math.floor(diff / 1000)
  const d = Math.floor(totalSec / 86400)
  const h = Math.floor((totalSec % 86400) / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  runtime.value = `${d}天${h}时${m}分${s}秒`
}

let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  updateRuntime()
  timer = setInterval(updateRuntime, 1000)

  // Visitor count — persist in localStorage, +1 each load
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    const count = stored ? parseInt(stored, 10) : 0
    visitors.value = count + 1
    localStorage.setItem(STORAGE_KEY, String(visitors.value))
  } catch {
    visitors.value = 1
  }
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.site-counters {
  text-align: center;
  padding: 0.5rem 0 1rem;
}

.counter-item {
  margin: 0.3em 0;
  font-size: 0.82rem;
  color: var(--text-muted);
}

.counter-label {
  font-family: "FZYaoTi", "方正姚体", "Noto Sans SC", "Microsoft YaHei", sans-serif;
}

.counter-value {
  font-family: Georgia, "Times New Roman", serif;
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum";
  color: var(--text-secondary);
}
</style>
