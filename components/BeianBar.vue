<template>
  <div class="beian-bar">
    <p class="copyright">© 2026 JunbX. 版权所有</p>
    <div class="beian-box">
      <div class="beian-group">
        <span class="beian-icon">
          <img src="/备案图标.png" alt="备案图标" />
        </span>
        <a class="beian-text" href="https://beian.mps.gov.cn/#/query/webSearch?code=62050302000387" target="_blank" rel="noopener">甘公网安备 62050302000387号</a>
      </div>
      <a class="beian-text" href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank" rel="noopener">陇ICP备2026000724号-2</a>
    </div>
  </div>
</template>

<style scoped>
.beian-bar {
  padding: 0.75rem 0 1.5rem;
  text-align: center;
  line-height: 1.4;
}

.copyright {
  margin: 0 0 2px;
  padding: 0;
  font-size: 0.8rem;
  font-weight: 700;
  line-height: 1.3;
  color: #78716C;
  font-family: "FZYaoTi", "方正姚体", "Noto Sans SC", "Microsoft YaHei", sans-serif;
}

.beian-box {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 0;
  line-height: 1.3;
  font-size: 0.8rem;
  font-weight: 700;
  color: #78716C;
  font-family: "FZYaoTi", "方正姚体", "Noto Sans SC", "Microsoft YaHei", sans-serif;
}

.beian-group {
  display: flex;
  align-items: center;
  gap: 4px;
}

.beian-icon {
  width: 16px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.beian-icon img {
  width: 100%;
  display: block;
}

.beian-text {
  letter-spacing: -0.4px;
}

.beian-box a {
  color: inherit;
  text-decoration: none;
  transition: color 0.2s;
}

.beian-box a:hover {
  color: #57534E;
}
</style>
