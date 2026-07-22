<template>
  <section class="excerpt-section">
    <RevealOnScroll>
      <div class="excerpt-header">
        <h2 class="excerpt-title">最新<span class="cursive coral-text">笔记</span></h2>
        <p class="excerpt-sub">最新发布的博客文章</p>
      </div>
    </RevealOnScroll>

    <div class="excerpt-grid">
      <RevealOnScroll
        v-for="(post, i) in posts.slice(0, 4)"
        :key="post.slug"
      >
        <div
          class="excerpt-card"
          :class="`excerpt-card--tilt-${i % 2 === 0 ? 'left' : 'right'}`"
        >
          <NuxtLink :to="`/blog/${post.slug}`" class="excerpt-card-link">
            <span class="excerpt-date">{{ post.date }}</span>
            <h3 class="excerpt-post-title">{{ post.title }}</h3>
            <p v-if="post.description" class="excerpt-desc">{{ post.description }}</p>
            <div class="excerpt-signature">
              <span class="excerpt-line" />
              <span class="excerpt-signature-text">read more</span>
            </div>
          </NuxtLink>
        </div>
      </RevealOnScroll>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  posts: { title: string; slug: string; date: string; description?: string }[]
}>()
</script>

<style scoped>
.excerpt-section {
  padding: 5rem 0;
}

.excerpt-header {
  text-align: center;
  margin-bottom: 3rem;
}

.excerpt-title {
  font-family: "FZYaoTi", "方正姚体", "Noto Serif SC", "Microsoft YaHei", sans-serif;
  font-size: 2.5rem;
  font-weight: 600;
  letter-spacing: -0.025em;
  color: #292524;
  margin: 0 0 0.75rem;
  border: none;
  padding: 0;
}

.cursive {
  font-family: "FZYaoTi", "方正姚体", "Noto Serif SC", "Microsoft YaHei", sans-serif;
  font-weight: 400;
  letter-spacing: 0;
  font-size: 1.2em;
}

.coral-text {
  color: #FFB7B2;
}

.excerpt-sub {
  font-family: "FZYaoTi", "方正姚体", "Noto Serif SC", "Microsoft YaHei", sans-serif;
  color: #78716C;
  font-size: 1rem;
  margin: 0;
}

/* Grid */
.excerpt-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

@media (max-width: 768px) {
  .excerpt-grid {
    grid-template-columns: 1fr;
  }
}

/* Card */
.excerpt-card {
  background: #fff;
  border-radius: 1.5rem;
  padding: 1.75rem;
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.excerpt-card:hover {
  box-shadow: 0 8px 30px -4px rgba(0, 0, 0, 0.08);
}

.excerpt-card--tilt-left {
  transform: rotate(-1deg);
}

.excerpt-card--tilt-right {
  transform: rotate(1deg);
}

.excerpt-card-link {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  border: none;
  color: inherit;
}

.excerpt-date {
  font-family: "FZYaoTi", "方正姚体", "Noto Serif SC", "Microsoft YaHei", sans-serif;
  font-size: 0.8rem;
  color: #A8A29E;
  margin-bottom: 0.5rem;
}

.excerpt-post-title {
  font-family: "FZYaoTi", "方正姚体", "Noto Serif SC", "Microsoft YaHei", sans-serif;
  font-size: 1.2rem;
  font-weight: 600;
  color: #292524;
  margin: 0 0 0.5rem;
  border: none;
  padding: 0;
  letter-spacing: -0.015em;
}

.excerpt-desc {
  font-family: "FZYaoTi", "方正姚体", "Noto Serif SC", "Microsoft YaHei", sans-serif;
  font-size: 0.9rem;
  color: #78716C;
  line-height: 1.5;
  margin: 0 0 1.25rem;
}

/* Signature */
.excerpt-signature {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: auto;
}

.excerpt-line {
  width: 32px;
  height: 1px;
  background: #A8A29E;
}

.excerpt-signature-text {
  font-family: 'Reenie Beanie', cursive;
  font-size: 1.5rem;
  color: #78716C;
}
</style>
