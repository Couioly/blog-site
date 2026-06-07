<template>
  <div class="page-container">
    <SiteNav />
    <ThemeToggle style="position: absolute; top: 1.5rem; right: 1.5rem;" />
    <main>
      <NuxtPage />
    </main>
    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
const { init } = useTheme()
onMounted(() => init())
</script>
