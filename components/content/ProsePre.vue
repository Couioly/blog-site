<template>
  <div class="code-block-wrapper">
    <div class="code-block-header">
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
}

.code-block-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.35em 0.8em;
  background: var(--code-bg);
  border-radius: 6px 6px 0 0;
  border: 1px solid var(--code-border);
  border-bottom: none;
}

.code-lang {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.copy-btn {
  font-family: inherit;
  font-size: 0.75rem;
  padding: 0.2em 0.7em;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.15s ease;
}

.copy-btn:hover {
  border-color: var(--border-strong);
  color: var(--text);
}

.copy-btn.copied {
  border-color: #4caf50;
  color: #4caf50;
}

.code-block-wrapper :deep(pre) {
  margin-top: 0;
  border-radius: 0 0 6px 6px;
}
</style>
