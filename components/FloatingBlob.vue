<template>
  <div
    class="floating-blob"
    :class="[colorClass, sizeClass]"
    :style="{ left: x, top: y }"
    aria-hidden="true"
  />
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  color?: 'coral' | 'sage' | 'lavender'
  size?: 'sm' | 'md' | 'lg'
  x?: string
  y?: string
}>(), {
  color: 'coral',
  size: 'lg',
  x: '50%',
  y: '50%',
})

const colorClass = computed(() => {
  const map: Record<string, string> = {
    coral: 'blob-coral',
    sage: 'blob-sage',
    lavender: 'blob-lavender',
  }
  return map[props.color || 'coral']
})

const sizeClass = computed(() => {
  const map: Record<string, string> = {
    sm: 'blob-sm',
    md: 'blob-md',
    lg: 'blob-lg',
  }
  return map[props.size || 'lg']
})
</script>

<style scoped>
.floating-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.6;
  animation: float 6s ease-in-out infinite;
  pointer-events: none;
}

.blob-coral { background: #FFE4E1; }
.blob-sage { background: #E8EFE8; }
.blob-lavender { background: #EFEDF4; }

.blob-sm { width: 200px; height: 200px; }
.blob-md { width: 350px; height: 350px; }
.blob-lg { width: 500px; height: 500px; }

@keyframes float {
  0%, 100% { transform: translateY(0) translateX(0); }
  50% { transform: translateY(-10px) translateX(5px); }
}
</style>
