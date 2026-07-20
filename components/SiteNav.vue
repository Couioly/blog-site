<template>
  <nav class="site-nav">
    <div class="site-nav-logo">
      <a href="/" class="flex items-center gap-2.5 no-underline border-none">
        <span class="logo-dot" />
        <span class="text-[13px] font-medium text-stone-800">JunbX</span>
      </a>
    </div>
    <div class="site-nav-links">
      <NuxtLink to="/blog" :class="navLinkClass('/blog')">博客</NuxtLink>
      <NuxtLink to="/fragment" :class="navLinkClass('/fragment')">碎片</NuxtLink>
      <NuxtLink to="/me" :class="navLinkClass('/me')">我的</NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
const route = useRoute()

function navLinkClass(path: string) {
  const base = 'text-[13px] font-medium transition-colors duration-200 no-underline border-none py-1 px-2.5 rounded-full'
  const active = route.path.startsWith(path)
  return active
    ? `${base} text-stone-800 bg-white/50`
    : `${base} text-stone-500 hover:text-stone-800`
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
  width: calc(100% - 32px);
  max-width: 600px;
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
</style>
