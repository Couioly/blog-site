<template>
  <Teleport to="body">
    <!-- Dropdown Menu -->
    <Transition name="dropdown">
      <div
        v-if="open"
        ref="menuRef"
        class="dropdown-menu"
        :style="menuStyle"
        @mouseenter="emit('cancelClose')"
        @mouseleave="emit('close')"
      >
        <NuxtLink
          v-for="item in items"
          :key="item.to"
          :to="item.to"
          class="dropdown-item"
          @click="emit('close')"
        >
          {{ item.label }}
        </NuxtLink>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { NavDropdownItem } from '~/types/resources'

const props = defineProps<{
  open: boolean
  items: NavDropdownItem[]
  triggerEl: HTMLElement | null
}>()

const emit = defineEmits<{
  close: []
  cancelClose: []
}>()

const route = useRoute()
const menuRef = ref<HTMLElement>()

const positioned = ref(false)
const menuStyle = ref<Record<string, string>>({
  position: 'fixed',
  top: '-9999px',
  left: '-9999px',
})

// Calculate position — align left edge with trigger
function updatePosition() {
  if (!props.triggerEl) return
  const triggerRect = props.triggerEl.getBoundingClientRect()
  let left = triggerRect.left

  // Boundary check
  const menuWidth = menuRef.value?.offsetWidth || 100
  if (left + menuWidth > window.innerWidth - 16) {
    left = window.innerWidth - menuWidth - 16
  }
  if (left < 16) {
    left = 16
  }

  menuStyle.value = {
    position: 'fixed',
    top: `${triggerRect.bottom + 8}px`,
    left: `${left}px`,
  }
  positioned.value = true
}

// Watch open state to recalculate position (wait for DOM render)
watch(() => props.open, async (isOpen) => {
  if (isOpen) {
    positioned.value = false
    await nextTick()
    updatePosition()
  }
})

// Close on route change
watch(() => route.path, () => {
  emit('close')
})

// Close on scroll or resize
function onScrollOrResize() {
  if (props.open) {
    emit('close')
  }
}

onMounted(() => {
  window.addEventListener('scroll', onScrollOrResize, true)
  window.addEventListener('resize', onScrollOrResize)
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScrollOrResize, true)
  window.removeEventListener('resize', onScrollOrResize)
  document.removeEventListener('keydown', onKeydown)
})

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.open) {
    emit('close')
  }
}
</script>

<style scoped>
.dropdown-menu {
  z-index: 999;
  min-width: auto;
  padding: 0.35rem;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(231, 229, 228, 0.5);
  border-radius: 12px;
  box-shadow: 0 8px 30px -4px rgba(0, 0, 0, 0.08);
}

.dropdown-item {
  display: block;
  padding: 0.35rem 0.6rem;
  font-family: "FZYaoTi", "方正姚体", "Noto Sans SC", "Microsoft YaHei", sans-serif;
  font-size: 13px;
  font-weight: 500;
  text-align: center;
  color: #57534E;
  text-decoration: none;
  border: none;
  border-radius: 8px;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.dropdown-item:hover,
.dropdown-item:focus {
  background: #FAFAF9;
  color: #292524;
  outline: none;
}

/* Transition */
.dropdown-enter-active {
  transition: all 0.2s ease-out;
}

.dropdown-leave-active {
  transition: all 0.15s ease-in;
}

.dropdown-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(-4px);
}

.dropdown-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-4px);
}
</style>
