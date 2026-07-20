<template>
  <div class="me-page">
    <div class="me-avatar">
      <img src="/img-me.png" alt="头像" />
    </div>
    <h1 class="me-nickname">姜玖儿</h1>
    <p class="me-bio">喜欢前沿技术，热爱分享知识</p>
    <p class="me-signature">— Exploring the intersection of code and curiosity —</p>

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
  title: '关于我',
  ogTitle: '关于我',
  ogType: 'website',
  twitterCard: 'summary',
})
</script>

<style scoped>
.me-page {
  text-align: center;
  padding: 5rem 1rem 3rem;
}

.me-avatar {
  width: 130px;
  height: 130px;
  border-radius: 2rem;
  overflow: hidden;
  margin: 0 auto 1.75rem;
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
  border: 3px solid #fff;
}

.me-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  margin: 0;
  border-radius: 0;
}

.me-nickname {
  font-family: 'Outfit', sans-serif;
  font-size: 2rem;
  font-weight: 600;
  letter-spacing: -0.025em;
  color: #292524;
  margin: 0 0 0.75rem;
  border: none;
  padding: 0;
}

.me-bio {
  font-family: 'Outfit', sans-serif;
  color: #78716C;
  font-size: 1.05rem;
  max-width: 380px;
  margin: 0 auto 0.5rem;
}

.me-signature {
  font-family: 'Reenie Beanie', cursive;
  font-size: 1.4rem;
  color: #A8A29E;
  margin: 0.25rem 0 1.75rem;
}

.me-social {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 0.5rem;
}

.me-social a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border: 1px solid #E7E5E4;
  border-radius: 1rem;
  background: #fff;
  opacity: 0.7;
  transition: all 0.2s ease;
  text-decoration: none;
}

.me-social a:hover {
  opacity: 1;
  border-color: #FFB7B2;
  box-shadow: 0 4px 20px -2px rgba(255, 183, 178, 0.3);
}

.me-social img {
  width: 24px;
  height: 24px;
  margin: 0;
  display: block;
}
</style>
