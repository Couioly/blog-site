<template>
  <nav class="site-nav">
    <div class="site-nav-logo">
      <a href="/blog">JunbX</a>
    </div>
    <div class="site-nav-links">
      <NuxtLink to="/blog" :class="{ active: $route.path.startsWith('/blog') }">博客</NuxtLink>
      <NuxtLink to="/fragment" :class="{ active: $route.path.startsWith('/fragment') }">碎片</NuxtLink>
      <NuxtLink to="/me" :class="{ active: $route.path === '/me' }">我的</NuxtLink>
    </div>
  </nav>
</template>
