<template>
  <section class="faq-section">
    <RevealOnScroll>
      <div class="faq-header">
        <h2 class="faq-title">常见<span class="cursive coral-text">问题</span></h2>
        <p class="faq-sub">关于这个博客的一切</p>
      </div>
    </RevealOnScroll>

    <div class="faq-list">
      <RevealOnScroll
        v-for="(item, i) in items"
        :key="i"
      >
        <div class="faq-item">
          <button class="faq-question" @click="toggle(i)">
            <span>{{ item.q }}</span>
            <span class="faq-icon" :class="{ open: openIndex === i }">+</span>
          </button>
          <div class="faq-answer-wrapper" :class="{ open: openIndex === i }">
            <div class="faq-answer">
              <p>{{ item.a }}</p>
            </div>
          </div>
        </div>
      </RevealOnScroll>
    </div>
  </section>
</template>

<script setup lang="ts">
const items = [
  {
    q: '这个博客主要写什么内容？',
    a: '主要分享 Python 编程、PyQt5 桌面开发、安全测试、AI 工具使用以及各种开发实践的经验总结。',
  },
  {
    q: '文章多久更新一次？',
    a: '不定期更新，通常在学习新知识或完成一个有趣的项目后会整理成文章分享出来。',
  },
  {
    q: '可以转载博客文章吗？',
    a: '欢迎转载，但请注明原作者和出处链接。如果有任何疑问，可以通过 GitHub 联系我。',
  },
  {
    q: '如何订阅博客更新？',
    a: '你可以通过 RSS Feed 订阅（点击页面底部的 RSS 链接），或者关注我的 GitHub / CSDN 账号获取更新通知。',
  },
]

const openIndex = ref<number | null>(null)

function toggle(i: number) {
  openIndex.value = openIndex.value === i ? null : i
}
</script>

<style scoped>
.faq-section {
  padding: 5rem 0;
}

.faq-header {
  text-align: center;
  margin-bottom: 3rem;
}

.faq-title {
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

.faq-sub {
  color: #78716C;
  font-size: 1rem;
  margin: 0;
}

/* FAQ List */
.faq-list {
  max-width: 640px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* FAQ Item */
.faq-item {
  background: #fff;
  border: 1px solid #F5F5F4;
  border-radius: 1rem;
  overflow: hidden;
}

.faq-question {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 1.5rem;
  font-family: 'Outfit', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  color: #292524;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: color 0.2s ease;
}

.faq-question:hover {
  color: #FFB7B2;
}

.faq-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: #A8A29E;
  transition: transform 0.5s ease;
}

.faq-icon.open {
  transform: rotate(45deg);
}

/* Answer */
.faq-answer-wrapper {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.5s ease-in-out;
}

.faq-answer-wrapper.open {
  max-height: 200px;
}

.faq-answer {
  padding: 0 1.5rem 1.5rem;
}

.faq-answer p {
  font-size: 0.95rem;
  color: #78716C;
  line-height: 1.6;
  margin: 0;
}
</style>
