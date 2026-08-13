<template>
  <!-- Toggle Button -->
  <button
    class="chat-toggle-btn"
    @click="togglePanel"
    :aria-label="isOpen ? '关闭对话' : '打开对话'"
  >
    <img
      v-if="isOpen"
      src="/聊天-待选.svg"
      alt="关闭对话"
      class="toggle-icon"
    />
    <img
      v-else
      src="/聊天-选中.svg"
      alt="打开对话"
      class="toggle-icon"
    />
  </button>

  <!-- Chat Panel -->
  <Transition name="chat-panel">
    <div v-if="isOpen" class="chat-panel">
      <!-- Header -->
      <div class="chat-header">
        <span class="chat-header-title">Chat With Laffey</span>
        <span class="chat-round-badge" v-if="roundCount > 0">
          {{ roundCount }}/10
        </span>
        <button class="chat-header-close" @click="closePanel">✕</button>
      </div>

      <!-- Messages -->
      <div ref="msgListRef" class="chat-messages">
        <div v-if="displayMessages.length === 0" class="chat-empty">
          <p>ヾ(≧▽≦*)o 有什么想问咱的吗？</p>
          <p class="chat-empty-hint">直接打字发送就好～</p>
        </div>

        <TransitionGroup name="msg-item">
          <div
            v-for="(msg, i) in displayMessages"
            :key="i"
            class="chat-msg"
            :class="msg.role"
          >
            <div class="msg-avatar">
              {{ msg.role === 'user' ? '😶' : '🐱' }}
            </div>
            <div class="msg-content">
              <div class="msg-text">{{ msg.content }}</div>
              <div
                v-if="msg.role === 'assistant' && msg.streaming"
                class="msg-cursor"
              >▍</div>
            </div>
          </div>
        </TransitionGroup>

        <div v-if="sessionResetHint" class="chat-reset-hint">
          对话已满 10 轮，自动开启新会话～
        </div>
      </div>

      <!-- Input Area -->
      <div class="chat-input-area">
        <div class="chat-input-row">
          <textarea
            ref="inputRef"
            v-model="inputText"
            class="chat-textarea"
            :rows="1"
            placeholder="输入消息..."
            :disabled="isSending"
            @keydown.enter.exact.prevent="sendMessage"
            @input="autoResize"
          ></textarea>

          <button
            class="input-btn send-btn"
            :disabled="!inputText.trim() || isSending"
            @click="sendMessage"
            aria-label="发送"
          >
            <span v-if="isSending" class="send-spinner">◌</span>
            <span v-else>➤</span>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const MAX_ROUNDS = 10

const isOpen = ref(false)
const inputText = ref('')
const isSending = ref(false)
const sessionResetHint = ref(false)

const inputRef = ref<HTMLTextAreaElement | null>(null)
const msgListRef = ref<HTMLElement | null>(null)

interface DisplayMessage {
  role: 'user' | 'assistant'
  content: string
  streaming?: boolean
}

const displayMessages = ref<DisplayMessage[]>([])
const conversationHistory = ref<{ role: 'user' | 'assistant'; content: string }[]>([])

const roundCount = computed(() =>
  conversationHistory.value.filter((m) => m.role === 'user').length,
)

function togglePanel() {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    nextTick(() => {
      inputRef.value?.focus()
      scrollToBottom()
    })
  }
}

function closePanel() {
  isOpen.value = false
}

// ==================== Send Message ====================

async function sendMessage() {
  const text = inputText.value.trim()
  if (!text || isSending.value) return

  if (roundCount.value >= MAX_ROUNDS) {
    conversationHistory.value = []
    displayMessages.value = []
    sessionResetHint.value = true
    setTimeout(() => {
      sessionResetHint.value = false
    }, 3000)
  }

  displayMessages.value.push({ role: 'user', content: text })
  conversationHistory.value.push({ role: 'user', content: text })
  inputText.value = ''
  if (inputRef.value) {
    inputRef.value.style.height = 'auto'
  }
  scrollToBottom()

  const assistantMsg: DisplayMessage = { role: 'assistant', content: '', streaming: true }
  displayMessages.value.push(assistantMsg)

  isSending.value = true

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: conversationHistory.value }),
    })

    if (!response.ok || !response.body) {
      assistantMsg.content = '唔…连接断掉了，稍后再试试吧 (｡•́︿•̀｡)'
      assistantMsg.streaming = false
      isSending.value = false
      return
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || !trimmed.startsWith('data: ')) continue
        const content = trimmed.slice(6)

        if (content === '[DONE]') {
          assistantMsg.streaming = false
          conversationHistory.value.push({
            role: 'assistant',
            content: assistantMsg.content,
          })
          break
        }

        if (content.startsWith('[ERROR]')) {
          assistantMsg.content =
            assistantMsg.content || '唔…出错了，待会再试试吧 (｡•́︿•̀｡)'
          assistantMsg.streaming = false
          break
        }

        try {
          const parsed = JSON.parse(content)
          const delta = parsed.choices?.[0]?.delta?.content
          if (delta) {
            assistantMsg.content += delta
          }
        } catch {
          /* skip unparseable line */
        }

        scrollToBottom()
      }
    }

    if (assistantMsg.streaming) {
      assistantMsg.streaming = false
      if (assistantMsg.content) {
        conversationHistory.value.push({
          role: 'assistant',
          content: assistantMsg.content,
        })
      }
    }
  } catch {
    assistantMsg.content = '网络好像不太好…等下再聊吧 (｡•́︿•̀｡)'
    assistantMsg.streaming = false
  }

  isSending.value = false
  scrollToBottom()
}

// ==================== Helpers ====================

function autoResize() {
  const el = inputRef.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 120) + 'px'
}

function scrollToBottom() {
  nextTick(() => {
    const el = msgListRef.value
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  })
}
</script>

<style scoped>
/* ===== Toggle Button ===== */
.chat-toggle-btn {
  position: fixed;
  bottom: 16px;
  left: 20px;
  z-index: 10001;
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.25s ease;
  opacity: 0.65;
}

.chat-toggle-btn:hover {
  opacity: 0.9;
}

.toggle-icon {
  width: 100%;
  height: 100%;
  display: block;
}

/* ===== Panel ===== */
.chat-panel {
  position: fixed;
  bottom: 76px;
  left: 20px;
  z-index: 10001;
  width: 340px;
  height: 420px;
  background: rgba(255, 255, 255, 0.98);
  border: 1px solid var(--ph-shallow);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ===== Header ===== */
.chat-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--border-light);
  background: var(--surface);
  flex-shrink: 0;
}

.chat-header-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text);
  flex: 1;
}

.chat-round-badge {
  font-size: 0.7rem;
  color: var(--text-muted);
  background: rgba(255, 255, 255, 0.8);
  padding: 2px 8px;
  border-radius: 10px;
  border: 1px solid var(--ph-shallow);
}

.chat-header-close {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 0.9rem;
  padding: 2px 4px;
  line-height: 1;
  border-radius: 4px;
}

.chat-header-close:hover {
  color: var(--text);
  background: rgba(0, 0, 0, 0.05);
}

/* ===== Messages ===== */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
}

.chat-messages::-webkit-scrollbar {
  width: 4px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb);
  border-radius: 2px;
}

.chat-empty {
  text-align: center;
  padding: 36px 0;
}

.chat-empty p {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.85rem;
}

.chat-empty-hint {
  margin-top: 8px !important;
  font-size: 0.75rem !important;
  color: var(--ph-shallow) !important;
}

.chat-reset-hint {
  text-align: center;
  padding: 8px;
  font-size: 0.72rem;
  color: var(--text-muted);
  background: var(--ph-soo-shallow);
  border-radius: 8px;
  border: 1px dashed var(--ph-shallow);
}

/* ===== Individual Message ===== */
.chat-msg {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.chat-msg.user {
  flex-direction: row-reverse;
}

.msg-avatar {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--ph-soo-shallow);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
}

.chat-msg.user .msg-avatar {
  background: var(--coral-light);
}

.msg-content {
  max-width: 75%;
}

.msg-text {
  padding: 8px 12px;
  border-radius: 14px;
  font-size: 0.82rem;
  line-height: 1.5;
  color: #333;
  word-break: break-word;
}

.chat-msg.assistant .msg-text {
  background: var(--ph-soo-shallow);
  border: 1px solid var(--ph-shallow);
  border-top-left-radius: 4px;
}

.chat-msg.user .msg-text {
  background: var(--coral-light);
  border: 1px solid #FFD5D2;
  border-top-right-radius: 4px;
}

.msg-cursor {
  display: inline-block;
  color: var(--ph-core);
  font-size: 0.85rem;
  animation: blink 1s step-end infinite;
  margin-left: 2px;
  vertical-align: baseline;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

/* ===== Input Area ===== */
.chat-input-area {
  padding: 10px 14px;
  border-top: 1px solid var(--border-light);
  flex-shrink: 0;
}

.chat-input-row {
  display: flex;
  align-items: flex-end;
  gap: 6px;
}

.input-btn {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: var(--surface);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
  transition: all 0.15s ease;
}

.input-btn:hover:not(:disabled) {
  border-color: var(--ph-core);
  background: var(--ph-soo-shallow);
}

.input-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.send-btn {
  background: var(--ph-core);
  color: #fff;
  border-color: var(--ph-core);
}

.send-spinner {
  animation: spin 0.8s linear infinite;
  display: inline-block;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.chat-textarea {
  flex: 1;
  resize: none;
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 8px 14px;
  font-size: 0.82rem;
  line-height: 1.4;
  font-family: inherit;
  color: var(--text);
  background: var(--surface);
  min-height: 36px;
  max-height: 120px;
  outline: none;
  transition: border-color 0.15s ease;
}

.chat-textarea:focus {
  border-color: var(--ph-core);
}

.chat-textarea::placeholder {
  color: var(--text-muted);
}

/* ===== Transitions ===== */
.chat-panel-enter-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.chat-panel-leave-active {
  transition: all 0.18s ease;
}

.chat-panel-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.97);
}

.chat-panel-leave-to {
  opacity: 0;
  transform: translateY(6px) scale(0.98);
}

.msg-item-enter-active {
  transition: all 0.25s ease;
}
.msg-item-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

/* ===== Responsive ===== */
@media (max-width: 768px) {
  .chat-toggle-btn {
    bottom: 12px;
    left: 12px;
    width: 28px;
    height: 28px;
  }

  .chat-panel {
    bottom: 62px;
    left: 8px;
    width: calc(100vw - 16px);
    max-width: 360px;
    height: 380px;
  }
}
</style>
