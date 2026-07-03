<template>
  <div class="me-page">
    <div class="me-avatar">
      <img src="/img-me.png" alt="头像" />
    </div>
    <h1 class="me-nickname">姜玖儿</h1>
    <p class="me-bio">喜欢前沿技术，热爱分享知识</p>

    <div class="me-social">
      <a href="https://gitee.com/Couioly" target="_blank" rel="noopener" title="Gitee">
        <img src="/gitee.svg" alt="Gitee" />
      </a>
      <a href="https://github.com/Couioly" target="_blank" rel="noopener" title="GitHub">
        <img src="/github.svg" alt="GitHub" />
      </a>
      <a href="https://blog.csdn.net/2401_86544210" target="_blank" rel="noopener" title="CSDN">
        <img src="/csdn.svg" alt="CSDN" />
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: '我的',
  ogTitle: '我的',
  ogType: 'website',
  twitterCard: 'summary',
})
</script>

<style scoped>
.me-page {
  text-align: center;
  padding: 3.5rem 1rem;
}

.me-avatar {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 1.5rem;
  border: 2px solid var(--border);
}

.me-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  margin: 0;
}

.me-nickname {
  font-family: 'FZYaoTi', '方正姚体', serif;
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  border-bottom: none;
}

.me-bio {
  font-family: 'FZYaoTi', '方正姚体', serif;
  color: var(--text-muted);
  font-size: 1.1rem;
  max-width: 380px;
  margin: 0 auto;
}

.me-social {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 1.75rem;
}

.me-social a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-bottom: none;
  opacity: 0.7;
  transition: opacity 0.15s ease;
}

.me-social a:hover {
  opacity: 1;
}

.me-social img {
  width: 34px;
  height: 34px;
  margin: 0;
  display: block;
}
</style>
