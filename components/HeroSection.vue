<template>
  <section class="hero-section">
    <!-- Background Blobs -->
    <FloatingBlob color="coral" size="lg" x="15%" y="10%" />
    <FloatingBlob color="lavender" size="md" x="75%" y="60%" />

    <RevealOnScroll>
      <div class="hero-content">
        <!-- Badge -->
        <div class="hero-badge">
          <span class="hero-badge-dot" />
          <span>个人博客 · 记录思考与学习</span>
        </div>

        <!-- Headline -->
        <h1 class="hero-headline">
          努力<span class="coral-text">提升</span>自己，让我们<br />
          顶峰<span class="coral-text">相见</span>
        </h1>

        <!-- Sub-headline -->
        <p class="hero-sub">
          从 Python 入门到Agent构建，从 AI 工具到开发实践<br />
          这里记录着一个技术爱好者的探索旅程
        </p>

        <!-- CTA Buttons -->
        <div class="hero-ctas">
          <NuxtLink to="/blog" class="btn-hero btn-blog">探索博客</NuxtLink>
          <NuxtLink to="/me" class="btn-hero btn-about">关于我</NuxtLink>
        </div>
      </div>
    </RevealOnScroll>
  </section>
</template>

<style scoped>
.hero-section {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 90vh;
  padding: 8rem 1.5rem 4rem;
  overflow: hidden;
  text-align: center;
}

.hero-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

/* Badge */
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 1rem;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid #E7E5E4;
  border-radius: 9999px;
  font-size: 0.85rem;
  color: #78716C;
  backdrop-filter: blur(8px);
}

.hero-badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #FFB7B2;
}

/* Headline */
.hero-headline {
  font-family: "FZShuTi", "方正舒体", "STKaiti", "楷体", serif;
  font-size: 2.75rem;
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: -0.025em;
  color: #292524;
  margin: 0;
  border: none;
  padding: 0;
}

@media (min-width: 768px) {
  .hero-headline {
    font-size: 4.5rem;
  }
}

.cursive {
  font-family: 'Reenie Beanie', cursive;
  font-weight: 400;
  letter-spacing: 0;
  font-size: 1.15em;
}

.coral-text {
  color: #FFB7B2;
}

/* Sub-headline */
.hero-sub {
  font-family: "FZShuTi", "方正舒体", "STKaiti", "楷体", serif;
  font-size: 1.05rem;
  line-height: 1.6;
  color: #78716C;
  max-width: 500px;
  margin: 0;
}

@media (min-width: 768px) {
  .hero-sub {
    font-size: 1.15rem;
  }
}

/* CTAs */
.hero-ctas {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 0.5rem;
}

.btn-hero {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.85rem 2rem;
  font-family: "FZYaoTi", "方正姚体", "Noto Serif SC", "Microsoft YaHei", sans-serif;
  font-weight: 500;
  font-size: 1.05rem;
  border-radius: 9999px;
  cursor: pointer;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn-hero:hover {
  transform: scale(1.05);
}

.btn-blog {
  background: #E3F2FD;
  color: #292524;
  border: 1px solid #BBDEFB;
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
}

.btn-blog:hover {
  box-shadow: 0 6px 25px -2px rgba(0, 0, 0, 0.1);
}

.btn-about {
  background: #fff;
  color: #292524;
  border: 1px solid #D6D3D1;
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
}

.btn-about:hover {
  box-shadow: 0 6px 25px -2px rgba(0, 0, 0, 0.1);
}
</style>
