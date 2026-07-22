<template>
  <footer class="site-footer">
    <p class="footer-text">JunbX · 记录日常与思考</p>
    <div class="footer-social">
      <a href="https://github.com/Couioly" target="_blank" rel="noopener" title="GitHub">
        <img src="/github.svg" alt="GitHub" />
      </a>
      <a href="https://gitee.com/Couioly" target="_blank" rel="noopener" title="Gitee">
        <img src="/gitee.svg" alt="Gitee" />
      </a>
      <a href="https://blog.csdn.net/2401_86544210" target="_blank" rel="noopener" title="CSDN">
        <img src="/csdn.svg" alt="CSDN" />
      </a>
      <a href="https://space.bilibili.com/3707030822980416" target="_blank" rel="noopener" title="Bilibili">
        <img src="/bilibili.svg" alt="Bilibili" />
      </a>
      <span class="social-icon-btn" title="微信" @click.stop="showQr('weixin', $event)">
        <img src="/微信.svg" alt="微信" />
      </span>
      <span class="social-icon-btn" title="QQ" @click.stop="showQr('qq', $event)">
        <img src="/QQ.svg" alt="QQ" />
      </span>
    </div>

    <!-- QR Popup -->
    <Teleport to="body">
      <div
        v-if="qr.show"
        class="qr-popup"
        :style="{ left: qr.x + 'px', top: qr.y + 'px' }"
        @click.stop
      >
        <img :src="qr.src" :alt="qr.alt" />
      </div>
      <div v-if="qr.show" class="qr-backdrop" @click="qr.show = false" />
    </Teleport>
  </footer>
</template>

<script setup lang="ts">
const qr = reactive({
  show: false,
  src: '',
  alt: '',
  x: 0,
  y: 0,
})

function showQr(type: string, e: MouseEvent) {
  if (qr.show && qr.alt === type) {
    qr.show = false
    return
  }
  qr.alt = type
  qr.src = type === 'weixin' ? '/weixin.png' : '/qq.png'
  qr.x = e.clientX - 100
  qr.y = e.clientY - 200
  qr.show = true
}
</script>

<style scoped>
.site-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0;
  padding: 2rem 0;
  border-top: 1px solid #E7E5E4;
}

.footer-text {
  color: #78716C;
  font-size: 0.85rem;
  margin: 0;
}

.footer-social {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.footer-social a,
.social-icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.5;
  transition: opacity 0.2s ease;
  border: none;
  cursor: pointer;
}

.footer-social a:hover,
.social-icon-btn:hover {
  opacity: 0.8;
}

.footer-social img {
  width: 20px;
  height: 20px;
  margin: 0;
  border-radius: 0;
}
</style>

<style>
.qr-popup {
  position: fixed;
  z-index: 9999;
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  padding: 0.75rem;
}

.qr-popup img {
  width: 180px;
  height: 180px;
  display: block;
  border-radius: 0.5rem;
  margin: 0;
}

.qr-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9998;
}
</style>
