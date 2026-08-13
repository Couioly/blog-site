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

// ==================== AI Bubble ====================

const bubble = reactive({
  show: false,
  text: '',
})

let hovering = false
let idleTimer: ReturnType<typeof setTimeout> | null = null
let hideTimer: ReturnType<typeof setTimeout> | null = null
let hoverDebounceTimer: ReturnType<typeof setTimeout> | null = null

// 降级短语（API 不可用时使用）
const fallbackHover = [
  '[害羞] 诶嘿~不要碰Laffey啦...',
  '[委屈] 呜...你不是主人，不要乱摸...',
  '[病娇] 只有主人才能碰Laffey哦...',
  '[紧张] 啊呜...Laffey要告诉主人了！',
]

const fallbackIdle = [
  '[发呆] 呜...主人什么时候回来呀...',
  '[委屈] 好无聊呢，Laffey想主人了...',
  '[困] 啊呜...有点想睡觉了...',
  '[期待] 主人会不会突然出现呢～',
  '[失落] 又是没人陪Laffey的一天...',
  '[发呆] 数羊羊...一只主人...两只主人...',
]

function getFallbackBubble(type: 'idle' | 'hover'): string {
  const pool = type === 'hover' ? fallbackHover : fallbackIdle
  return pool[Math.floor(Math.random() * pool.length)]
}

// AI 气泡缓存（避免相同类型在短时间内重复请求）
let lastBubbleType: 'idle' | 'hover' | null = null
let lastBubbleTime = 0

async function fetchAIBubble(type: 'idle' | 'hover'): Promise<string> {
  // 极短冷却仅防止快速连续触发（如 hover 快速进出）
  const now = Date.now()
  if (type === lastBubbleType && now - lastBubbleTime < 2000) {
    return getFallbackBubble(type)
  }

  lastBubbleType = type
  lastBubbleTime = now

  try {
    const pageTitle = document.title || undefined
    const res = await $fetch<{ text: string }>('/api/chat/ai-bubble', {
      method: 'POST',
      body: { type, pageTitle },
      timeout: 8000,
    })
    return res.text || getFallbackBubble(type)
  } catch {
    return getFallbackBubble(type)
  }
}

// ==================== Bubble Display Logic ====================

function showBubble(text: string) {
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
  bubble.text = text
  bubble.show = true
}

function hideBubble() {
  bubble.show = false
}

// 悬停气泡（带防抖）
async function handleMouseEnter() {
  hovering = true
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }

  // 防抖：300ms 内不重复触发
  if (hoverDebounceTimer) return
  hoverDebounceTimer = setTimeout(async () => {
    hoverDebounceTimer = null
    if (!hovering) return
    const text = await fetchAIBubble('hover')
    if (hovering) showBubble(text)
  }, 300)
}

function handleMouseLeave() {
  hovering = false
  if (hoverDebounceTimer) {
    clearTimeout(hoverDebounceTimer)
    hoverDebounceTimer = null
  }
  hideBubble()
  scheduleIdle()
}

// 空闲气泡
function scheduleIdle() {
  if (idleTimer) clearTimeout(idleTimer)
  const delay = 10000 + Math.random() * 10000 // 10~20s
  idleTimer = setTimeout(async () => {
    if (hovering || bubble.show) {
      scheduleIdle()
      return
    }
    const text = await fetchAIBubble('idle')
    if (!hovering && !bubble.show) {
      showBubble(text)
      hideTimer = setTimeout(() => {
        hideBubble()
        hideTimer = null
        scheduleIdle()
      }, 5000)
    } else {
      scheduleIdle()
    }
  }, delay)
}

// ==================== Container Style ====================

const containerStyle = computed(() => ({
  width: `${widgetW.value}px`,
  height: `${widgetH.value}px`,
}))

// ==================== Live2D Initialization ====================

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
    const targetH = 300
    const s = targetH / mh
    model.scale.set(s)
    const modelW = mw * s
    const modelH = mh * s
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

    // ---- Mouse interaction ----
    const canvas = app.view
    canvas.style.cursor = 'pointer'

    model.on('mouseover', handleMouseEnter)
    model.on('mouseout', handleMouseLeave)

    // ---- Idle bubbles ----
    scheduleIdle()

    // ---- Tap → motion ----
    let tapBusy = false
    canvas.addEventListener('click', () => {
      if (tapBusy) return
      tapBusy = true
      setTimeout(() => {
        tapBusy = false
      }, 400)
      try {
        model.motion('main_1')
      } catch {
        /* */
      }
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
  if (idleTimer) {
    clearTimeout(idleTimer)
    idleTimer = null
  }
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
  if (hoverDebounceTimer) {
    clearTimeout(hoverDebounceTimer)
    hoverDebounceTimer = null
  }
  if (model) {
    try {
      model.destroy()
    } catch {
      /* */
    }
    model = null
  }
  if (app) {
    try {
      app.destroy(false, { children: true })
    } catch {
      /* */
    }
    app = null
  }
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
  bottom: 62%;
  left: 50%;
  transform: translateX(-50%);
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid var(--ph-shallow);
  border-radius: 12px;
  font-size: 0.78rem;
  color: #333;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  pointer-events: none;
  max-width: 200px;
  word-break: break-word;
  text-align: center;
  line-height: 1.35;
}

.speech-bubble::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: rgba(255, 255, 255, 0.92);
}

.bubble-enter-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.bubble-leave-active {
  transition: opacity 0.15s ease;
}
.bubble-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(6px);
}
.bubble-leave-to {
  opacity: 0;
}

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
