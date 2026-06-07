<template>
  <div class="theme-toggle">
    <button
      :class="{ active: mode === 'auto' }"
      title="跟随系统"
      @click="setMode('auto')"
    >Auto</button>
    <button
      :class="{ active: mode === 'dark' }"
      title="暗色模式"
      @click="setMode('dark')"
    >暗</button>
    <button
      :class="{ active: mode === 'light' }"
      title="亮色模式"
      @click="setMode('light')"
    >亮</button>
  </div>
</template>

<script setup lang="ts">
const { mode, setMode } = useTheme()
</script>

<style scoped>
.theme-toggle {
  display: flex;
  border: 1px solid var(--border);
  border-radius: 6px;
  overflow: hidden;
}
.theme-toggle button {
  padding: 0.3em 0.55em;
  border: none;
  background: none;
  color: var(--toolbar-icon);
  cursor: pointer;
  font-size: 0.75rem;
  font-family: inherit;
  transition: all 0.15s ease;
}
.theme-toggle button.active {
  color: var(--toolbar-icon-active);
  background: var(--toc-hover-bg);
}
.theme-toggle button:hover {
  color: var(--toolbar-icon-active);
}
</style>
