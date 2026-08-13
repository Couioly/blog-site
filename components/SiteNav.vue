<template>
  <nav class="site-nav">
    <div class="site-nav-logo">
      <a href="/" class="flex items-center gap-2.5 no-underline border-none">
        <span class="logo-dot" />
        <span class="text-[13px] font-medium text-stone-800">JunbXの小作坊</span>
      </a>
    </div>
    <div class="site-nav-links">
      <NuxtLink to="/blog" :class="navLinkClass('/blog')">博客</NuxtLink>
      <NuxtLink to="/fragment" :class="navLinkClass('/fragment')">碎片</NuxtLink>
      <NuxtLink to="/resources/bangumi" :class="navLinkClass('/resources/bangumi')">追番</NuxtLink>
      <NuxtLink to="/resources/books" :class="navLinkClass('/resources/books')">书架</NuxtLink>
      <div ref="resourceTriggerRef" class="nav-dropdown-wrapper">
        <button
          :class="navLinkClass('/resources')"
          @mouseenter="openDropdown"
          @mouseleave="scheduleClose"
        >
          资料
        </button>
        <NavDropdown
          :open="dropdownOpen"
          :items="resourceItems"
          :trigger-el="resourceTriggerRef"
          @close="closeDropdown"
          @cancel-close="cancelClose"
        />
      </div>
      <NuxtLink to="/me" :class="navLinkClass('/me')">我的</NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import type { NavDropdownItem } from '~/types/resources'

const route = useRoute()

const dropdownOpen = ref(false)
const resourceTriggerRef = ref<HTMLElement>()
let closeTimer: ReturnType<typeof setTimeout> | null = null

const resourceItems: NavDropdownItem[] = [
  { to: '/resources/links', label: '链接' },
]

function openDropdown() {
  if (closeTimer) { clearTimeout(closeTimer); closeTimer = null }
  dropdownOpen.value = true
}

function scheduleClose() {
  closeTimer = setTimeout(() => {
    dropdownOpen.value = false
  }, 200)
}

function closeDropdown() {
  dropdownOpen.value = false
}

function cancelClose() {
  if (closeTimer) { clearTimeout(closeTimer); closeTimer = null }
}

function navLinkClass(path: string) {
  const base = 'text-[13px] font-medium transition-colors duration-200 no-underline border-none py-1 px-2.5 rounded-full'
  const active = route.path.startsWith(path)
  return active
    ? `${base} text-stone-800 bg-[#FFB7B2]/30 shadow-sm`
    : `${base} text-stone-500 hover:text-stone-800 hover:bg-white/40`
}
</script>

<style scoped>
.site-nav {
  position: fixed;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: calc(100% - 3rem);
  max-width: calc(960px - 3rem);
  box-sizing: border-box;
  padding: 0.35rem 0.75rem 0.35rem 1rem;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 9999px;
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(231, 229, 228, 0.5);
}

.site-nav-logo a {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  text-decoration: none;
  border: none;
}

.logo-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #FFB7B2;
  position: relative;
}

.logo-dot::after {
  content: '';
  position: absolute;
  top: 1.5px;
  left: 1.5px;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #fff;
}

.site-nav-links {
  display: flex;
  gap: 0.25rem;
  align-items: center;
}

.nav-dropdown-wrapper {
  position: relative;
}

.nav-dropdown-wrapper button {
  background: none;
  border: none;
  cursor: pointer;
  font-family: "FZYaoTi", "方正姚体", "Noto Sans SC", "Microsoft YaHei", sans-serif;
  font-size: 1.05rem;
  letter-spacing: 0.02em;
  line-height: inherit;
  white-space: nowrap;
}
</style>
