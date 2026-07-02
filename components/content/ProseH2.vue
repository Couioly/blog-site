<template>
  <h2 :id="$attrs.id">
    <a v-if="$attrs.id" :href="`#${$attrs.id}`" class="heading-anchor" aria-hidden="true">#</a>
    <slot />
  </h2>
</template>

<style scoped>
h2 {
  position: relative;
}

.heading-anchor {
  position: absolute;
  left: -1.2em;
  top: 0;
  color: var(--text-muted);
  text-decoration: none;
  opacity: 0;
  transition: opacity 0.2s ease;
  font-size: 0.85em;
  font-weight: 400;
  border-bottom: none;
}

h2:hover .heading-anchor,
.heading-anchor:focus {
  opacity: 1;
}
</style>
