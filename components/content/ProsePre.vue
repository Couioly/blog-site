<template>
  <div class="code-block-wrapper">
    <div class="code-block-header">
      <span class="code-dots">
        <i class="dot dot-red" />
        <i class="dot dot-yellow" />
        <i class="dot dot-green" />
      </span>
      <span v-if="$attrs.language" class="code-lang">{{ $attrs.language }}</span>
      <span v-else class="code-lang">code</span>
      <button class="copy-btn" :class="{ copied }" @click="copy">
        {{ copied ? '已复制!' : '复制' }}
      </button>
    </div>
    <pre ref="preEl"><slot /></pre>
  </div>
</template>

<script setup lang="ts">
const copied = ref(false)
const preEl = ref<HTMLElement | null>(null)
let timer: ReturnType<typeof setTimeout> | null = null

function copy() {
  const code = preEl.value?.querySelector('code')?.textContent || ''
  navigator.clipboard.writeText(code).then(() => {
    copied.value = true
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      copied.value = false
    }, 2000)
  }).catch(() => {
    // Fallback for older browsers
  })
}

onUnmounted(() => {
  if (timer) clearTimeout(timer)
})
</script>

<style scoped>
.code-block-wrapper {
  position: relative;
  margin: 1.5rem 0;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.code-block-header {
  display: flex;
  align-items: center;
  gap: 0.6em;
  padding: 0.5em 0.8em;
  background: #f0edf1;
  border-bottom: 1px solid var(--ph-shallow);
}

.code-dots {
  display: flex;
  gap: 6px;
  align-items: center;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.dot-red    { background: #ee5a5a; }
.dot-yellow { background: #f0b94f; }
.dot-green  { background: #5ec26d; }

.code-lang {
  flex: 1;
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-align: right;
}

.copy-btn {
  font-family: inherit;
  font-size: 0.72rem;
  padding: 0.18em 0.6em;
  border: 1px solid var(--ph-shallow);
  border-radius: 4px;
  background: var(--ph-soo-shallow);
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.15s ease;
}

.copy-btn:hover {
  border-color: var(--ph-core);
  color: var(--ph-core);
}

.copy-btn.copied {
  border-color: #5ec26d;
  color: #5ec26d;
}

.code-block-wrapper :deep(pre) {
  margin-top: 0;
  border-radius: 0 0 10px 10px;
  background: #faf9fb;
}
</style>
