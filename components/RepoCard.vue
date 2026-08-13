<template>
  <a
    :href="repo.url"
    target="_blank"
    rel="noopener noreferrer"
    class="repo-card"
  >
    <div class="repo-card-header">
      <svg class="repo-icon" viewBox="0 0 16 16" width="18" height="18" fill="currentColor">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
      </svg>
      <span class="repo-name">{{ repo.name }}</span>
    </div>
    <p class="repo-description">{{ repo.description }}</p>
    <div class="repo-card-footer">
      <span class="repo-path">{{ repo.repo }}</span>
    </div>
  </a>
</template>

<script setup lang="ts">
import type { ResourceLink } from '~/types/resources'

defineProps<{
  repo: ResourceLink
}>()
</script>

<style scoped>
.repo-card {
  display: block;
  text-decoration: none;
  color: inherit;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 0.75rem;
  box-shadow: var(--shadow-soft);
  transition: all 0.2s ease;
  cursor: pointer;
}

.repo-card:hover {
  border-color: var(--coral);
  box-shadow: var(--shadow-soft-lg);
  transform: translateY(-2px);
}

.repo-card-header {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin-bottom: 0.35rem;
}

.repo-icon {
  flex-shrink: 0;
  width: 14px;
  height: 14px;
  color: var(--text-secondary);
  transition: color 0.2s ease;
}

.repo-card:hover .repo-icon {
  color: var(--text);
}

.repo-name {
  font-weight: 600;
  font-size: 0.8rem;
  color: var(--text);
}

.repo-description {
  font-size: 0.72rem;
  color: var(--text-muted);
  margin: 0 0 0.6rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.repo-card-footer {
  padding-top: 0.5rem;
  border-top: 1px solid var(--border-light);
}

.repo-path {
  font-size: 0.68rem;
  color: var(--text-muted);
  font-family: 'Outfit', monospace;
}
</style>
