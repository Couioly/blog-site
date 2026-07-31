<template>
  <ClientOnly>
    <div ref="containerRef" class="live2d-container" :style="containerStyle">
      <div v-if="loading" class="live2d-loading">加载看板娘中...</div>
      <div v-if="error" class="live2d-error" @click="retry">加载失败，点击重试</div>
      <Transition name="bubble">
        <div v-if="bubble.show" class="speech-bubble">{{ bubble.text }}</div>
      </Transition>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
const containerRef = ref<HTMLElement | null>(null)
const loading = ref(true)
const error = ref(false)

const widgetW = ref(500)
const widgetH = ref(500)

const phrases = [
  '你的手离我远点ಠಿ_ಠ',
  '喂，110吗？有人骚扰我ಥ_ಥ',
  '不要动手动脚的，规矩一点＞﹏＜',
  '再碰我黑掉你的电脑(σ｀д′)σ',
]

const bubble = reactive({
  show: false,
  text: '',
})

const containerStyle = computed(() => ({
  width: `${widgetW.value}px`,
  height: `${widgetH.value}px`,
}))

let app: any = null
let model: any = null

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`)
    if (existing) return resolve()
    const el = document.createElement('script')
    el.src = src
    el.onload = () => resolve()
    el.onerror = () => reject(new Error(`Failed to load: ${src}`))
    document.head.appendChild(el)
  })
}

async function initLive2D() {
  if (!containerRef.value) return
  error.value = false
  loading.value = true

  try {
    // 1. PixiJS
    await loadScript('https://cdn.jsdelivr.net/npm/pixi.js@6.5.10/dist/browser/pixi.min.js')
    // 2. Cubism Core (official SDK)
    await loadScript('https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js')
    // 3. pixi-live2d-display plugin
    await loadScript('https://cdn.jsdelivr.net/npm/pixi-live2d-display@0.4.0/dist/cubism4.min.js')

    const PIXI = (window as any).PIXI
    if (!PIXI?.live2d?.Live2DModel) throw new Error('Live2D plugin not loaded')

    // Create transparent PIXI app
    app = new PIXI.Application({
      width: widgetW.value,
      height: widgetH.value,
      transparent: true,
      backgroundAlpha: 0,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    })

    containerRef.value.appendChild(app.view)
    app.view.style.width = '100%'
    app.view.style.height = '100%'

    // Load model
    model = await PIXI.live2d.Live2DModel.from(
      '/live2d/lafei_4/lafei_4.model3.json',
      { autoInteract: true },
    )

    // Scale to fit
    const mw = model.internalModel.width
    const mh = model.internalModel.height
    // Scale: make model 360px tall, then size canvas around it
    const targetH = 300
    const s = targetH / mh
    model.scale.set(s)
    const modelW = mw * s
    const modelH = mh * s
    // Asymmetric padding: model hugs left, room on right for safety
    const padLeft = 0
    const padRight = 0
    const padTop = 140
    const padBottom = 200
    const cw = modelW + padLeft + padRight
    const ch = modelH + padTop + padBottom
    widgetW.value = cw
    widgetH.value = ch
    app.renderer.resize(cw, ch)
    model.x = 0
    model.y = modelH / 2 + padTop

    app.stage.addChild(model)

    // ---- Hover → speech bubble (model-level, not canvas) ----
    const canvas = app.view
    canvas.style.cursor = 'pointer'

    model.on('mouseover', () => {
      bubble.text = phrases[Math.floor(Math.random() * phrases.length)]
      bubble.show = true
    })
    model.on('mouseout', () => {
      bubble.show = false
    })

    // ---- Tap → motion ----
    let tapBusy = false
    canvas.addEventListener('click', () => {
      if (tapBusy) return
      tapBusy = true
      setTimeout(() => { tapBusy = false }, 400)
      try { model.motion('main_1') } catch { /* */ }
    })

    loading.value = false
  } catch (e) {
    console.error('Live2D:', e)
    error.value = true
    loading.value = false
  }
}

function retry() {
  cleanup()
  initLive2D()
}

function cleanup() {
  if (model) { try { model.destroy() } catch { /* */ } model = null }
  if (app) { try { app.destroy(false, { children: true }) } catch { /* */ } app = null }
  if (containerRef.value) containerRef.value.innerHTML = ''
}

onMounted(() => nextTick(initLive2D))
onUnmounted(cleanup)
</script>

<style scoped>
.live2d-container {
  position: fixed;
  bottom: -44px;
  left: 0;
  z-index: 9999;
  overflow: visible;
}

.speech-bubble {
  position: absolute;
  top: 18%;
  margin-top: 120px;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 14px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid var(--ph-shallow);
  border-radius: 14px;
  font-size: 0.82rem;
  color: #333;
  white-space: nowrap;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  pointer-events: none;
}

.speech-bubble::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: rgba(255, 255, 255, 0.92);
}

.bubble-enter-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.bubble-leave-active { transition: opacity 0.15s ease; }
.bubble-enter-from { opacity: 0; transform: translateX(-50%) translateY(6px); }
.bubble-leave-to   { opacity: 0; }

.live2d-loading,
.live2d-error {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 280px;
  height: 100px;
  font-size: 0.85rem;
  color: var(--text-muted);
  background: rgba(255, 255, 255, 0.7);
  border-radius: 1rem;
}

.live2d-error {
  cursor: pointer;
  color: var(--ph-core);
}

@media (max-width: 768px) {
  .live2d-container {
    display: none;
  }
}
</style>
