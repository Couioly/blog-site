<template>
  <h3 :id="$attrs.id">
    <a v-if="$attrs.id" :href="`#${$attrs.id}`" class="heading-anchor" aria-hidden="true">#</a>
    <slot />
  </h3>
</template>

<style scoped>
h3 {
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

h3:hover .heading-anchor,
.heading-anchor:focus {
  opacity: 1;
}
</style>
