<template>
  <section class="subscribe-section">
    <FloatingBlob color="sage" size="md" x="20%" y="30%" />
    <FloatingBlob color="lavender" size="lg" x="70%" y="20%" />

    <RevealOnScroll>
      <div class="subscribe-content">
        <h2 class="subscribe-title">保持<span class="cursive coral-text">联系</span></h2>
        <p class="subscribe-sub">
          欢迎在以下平台关注我
        </p>

        <div class="subscribe-social">
          <a href="https://github.com/Couioly" target="_blank" rel="noopener" class="social-card" title="GitHub">
            <img src="/github.svg" alt="GitHub" />
            <span class="social-label">GitHub</span>
          </a>
          <a href="https://gitee.com/Couioly" target="_blank" rel="noopener" class="social-card" title="Gitee">
            <img src="/gitee.svg" alt="Gitee" />
            <span class="social-label">Gitee</span>
          </a>
          <a href="https://blog.csdn.net/2401_86544210" target="_blank" rel="noopener" class="social-card" title="CSDN">
            <img src="/csdn.svg" alt="CSDN" />
            <span class="social-label">CSDN</span>
          </a>
        </div>
      </div>
    </RevealOnScroll>
  </section>
</template>

<style scoped>
.subscribe-section {
  position: relative;
  padding: 6rem 1.5rem;
  overflow: hidden;
}

.subscribe-content {
  position: relative;
  z-index: 1;
  max-width: 520px;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.subscribe-title {
  font-family: "FZYaoTi", "方正姚体", "Noto Serif SC", "Microsoft YaHei", sans-serif;
  font-size: 2.5rem;
  font-weight: 600;
  letter-spacing: -0.025em;
  color: #292524;
  margin: 0;
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

.subscribe-sub {
  font-family: "FZYaoTi", "方正姚体", "Noto Serif SC", "Microsoft YaHei", sans-serif;
  font-size: 1rem;
  color: #78716C;
  margin: 0;
}

/* Social cards */
.subscribe-social {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}

.social-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  text-decoration: none;
  transition: all 0.2s ease;
  border: none;
  background: none;
  border-radius: 0;
  box-shadow: none;
}

.social-card:hover {
  transform: translateY(-2px);
}

.social-card:hover img {
  opacity: 1;
}

.social-card img {
  width: 28px;
  height: 28px;
  margin: 0;
  border-radius: 0;
  opacity: 0.6;
  transition: opacity 0.2s ease;
}

.social-label {
  font-size: 0.8rem;
  color: #78716C;
  font-family: "FZYaoTi", "方正姚体", "Noto Serif SC", "Microsoft YaHei", sans-serif;
}
</style>
