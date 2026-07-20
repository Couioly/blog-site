<template>
  <section class="featured-section">
    <RevealOnScroll>
      <div class="featured-header">
        <h2 class="featured-title">精选<span class="cursive coral-text">文章</span></h2>
        <p class="featured-sub">最受欢迎的技术分享</p>
      </div>
    </RevealOnScroll>

    <div class="featured-cards">
      <!-- Left card -->
      <RevealOnScroll>
        <div v-if="posts[0]" class="featured-card featured-card--side featured-card--left">
          <NuxtLink :to="`/blog/${posts[0].slug}`" class="featured-card-link">
            <div class="featured-card-screen" :class="`featured-card-screen--sage`">
              <span class="featured-card-label">{{ posts[0].date }}</span>
              <span class="featured-card-title">{{ posts[0].title }}</span>
              <span v-if="posts[0].description" class="featured-card-desc">{{ posts[0].description }}</span>
            </div>
          </NuxtLink>
        </div>
      </RevealOnScroll>

      <!-- Center card (prominent) -->
      <RevealOnScroll>
        <div v-if="posts[1]" class="featured-card featured-card--center">
          <NuxtLink :to="`/blog/${posts[1].slug}`" class="featured-card-link">
            <div class="featured-card-screen featured-card-screen--coral">
              <span class="featured-card-label">{{ posts[1].date }}</span>
              <span class="featured-card-title featured-card-title--lg">{{ posts[1].title }}</span>
              <span v-if="posts[1].description" class="featured-card-desc">{{ posts[1].description }}</span>
              <span class="featured-card-breathe">阅读全文</span>
            </div>
          </NuxtLink>
        </div>
      </RevealOnScroll>

      <!-- Right card -->
      <RevealOnScroll>
        <div v-if="posts[2]" class="featured-card featured-card--side featured-card--right">
          <NuxtLink :to="`/blog/${posts[2].slug}`" class="featured-card-link">
            <div class="featured-card-screen featured-card-screen--lavender">
              <span class="featured-card-label">{{ posts[2].date }}</span>
              <span class="featured-card-title">{{ posts[2].title }}</span>
              <span v-if="posts[2].description" class="featured-card-desc">{{ posts[2].description }}</span>
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
.featured-section {
  padding: 5rem 0;
}

.featured-header {
  text-align: center;
  margin-bottom: 3rem;
}

.featured-title {
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

.featured-sub {
  color: #78716C;
  font-size: 1rem;
  margin: 0;
}

/* Cards container */
.featured-cards {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  position: relative;
  padding: 2rem 0;
}

/* Individual card */
.featured-card {
  border-radius: 2rem;
  background: #fff;
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.featured-card-link {
  display: block;
  text-decoration: none;
  border: none;
  color: inherit;
  height: 100%;
}

/* Side cards */
.featured-card--side {
  width: 280px;
  opacity: 0.8;
}

.featured-card--left {
  transform: translateY(48px);
}

.featured-card--right {
  transform: translateY(96px);
}

/* Center card */
.featured-card--center {
  width: 300px;
  z-index: 1;
  box-shadow: 0 8px 30px -4px rgba(0, 0, 0, 0.08);
}

/* Card screens */
.featured-card-screen {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.5rem;
  min-height: 380px;
}

.featured-card--center .featured-card-screen {
  min-height: 620px;
  padding: 2rem;
}

.featured-card-screen--sage { background: #E8EFE8; }
.featured-card-screen--coral { background: #FFB7B2; }
.featured-card-screen--lavender { background: #EFEDF4; }

.featured-card-label {
  font-size: 0.8rem;
  color: #78716C;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.featured-card-title {
  font-family: 'Outfit', sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: #292524;
  letter-spacing: -0.015em;
  line-height: 1.3;
}

.featured-card-title--lg {
  font-size: 1.5rem;
}

.featured-card-desc {
  font-size: 0.85rem;
  color: #78716C;
  flex: 1;
}

.featured-card-breathe {
  display: inline-block;
  align-self: flex-start;
  padding: 0.5rem 1.25rem;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 9999px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #292524;
  animation: pulseSoft 2s ease-in-out infinite;
}

@keyframes pulseSoft {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@media (max-width: 768px) {
  .featured-cards {
    flex-direction: column;
    gap: 1.5rem;
  }

  .featured-card--side {
    width: 280px;
    opacity: 1;
  }

  .featured-card--left,
  .featured-card--right {
    transform: none;
  }

  .featured-card--center {
    width: 300px;
  }

  .featured-card--center .featured-card-screen {
    min-height: 420px;
  }
}
</style>
