<template>
  <section class="topic-scroll-section">
    <RevealOnScroll>
      <div class="topic-scroll-header">
        <h2 class="topic-scroll-title">探索<span class="cursive coral-text">话题</span></h2>
        <p class="topic-scroll-sub">按标签分类浏览博客内容</p>
      </div>
    </RevealOnScroll>

    <RevealOnScroll>
      <div class="topic-scroll-container">
        <div class="topic-scroll-track">
          <div
            v-for="(topic, i) in topics"
            :key="i"
            class="topic-card"
          >
            <NuxtLink :to="`/blog/tag/${topic.tag}`" class="topic-card-link">
              <span class="topic-card-time">{{ topic.count }} 篇文章</span>
              <span class="topic-card-text">{{ topic.label }}</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </RevealOnScroll>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  topics: { tag: string; label: string; count: number }[]
}>()
</script>

<style scoped>
.topic-scroll-section {
  padding: 4rem 0;
}

.topic-scroll-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.topic-scroll-title {
  font-family: 'Outfit', sans-serif;
  font-size: 2.5rem;
  font-weight: 600;
  letter-spacing: -0.025em;
  color: #292524;
  margin: 0 0 0.75rem;
  border: none;
  padding: 0;
}

.cursive {
  font-family: 'Reenie Beanie', cursive;
  font-weight: 400;
  letter-spacing: 0;
  font-size: 1.2em;
}

.coral-text {
  color: #FFB7B2;
}

.topic-scroll-sub {
  color: #78716C;
  font-size: 1rem;
  margin: 0;
}

.topic-scroll-container {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding: 0.5rem 1rem;
  scrollbar-width: none;
}

.topic-scroll-container::-webkit-scrollbar {
  display: none;
}

.topic-scroll-track {
  display: flex;
  gap: 1rem;
  padding: 0 calc(50vw - 410px);
}

@media (max-width: 900px) {
  .topic-scroll-track {
    padding: 0 1rem;
  }
}

.topic-card {
  flex-shrink: 0;
  width: 288px;
  height: 160px;
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.topic-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px -4px rgba(0, 0, 0, 0.08);
}

.topic-card-link {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  padding: 1.25rem;
  text-decoration: none;
  border: none;
  color: inherit;
}

.topic-card-time {
  font-size: 0.85rem;
  color: #A8A29E;
}

.topic-card-text {
  font-size: 1.25rem;
  font-weight: 500;
  color: #292524;
  transition: color 0.2s ease;
}

.topic-card:hover .topic-card-text {
  color: #FFB7B2;
}
</style>
