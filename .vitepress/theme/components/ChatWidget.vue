<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { marked } from 'marked'

const API_URL = 'https://kb-api-server.onrender.com/ask'
const STORAGE_KEY = 'kb-ai-chat-messages'
const SIZE_STORAGE_KEY = 'kb-ai-chat-size'

const START_MESSAGE = {
  role: 'assistant',
  text: 'Привет! Я ИИ-ассистент базы знаний. Чем помочь?'
}

const isOpen = ref(false)
const question = ref('')
const messages = ref([START_MESSAGE])
const loading = ref(false)
const messagesList = ref(null)
const chatSize = ref({ width: 380, height: 520 })

const resizing = ref(false)
const resizeStart = ref({
  x: 0,
  y: 0,
  width: 380,
  height: 520
})

const hasUserMessages = computed(() => messages.value.some((msg) => msg.role === 'user'))

function isBrowser() {
  return typeof window !== 'undefined'
}

function safeJsonParse(value, fallback) {
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function getSizeLimits() {
  if (!isBrowser()) {
    return {
      minWidth: 320,
      maxWidth: 720,
      minHeight: 420,
      maxHeight: 720
    }
  }

  const isMobile = window.innerWidth <= 640

  return {
    minWidth: isMobile ? 280 : 320,
    maxWidth: isMobile ? window.innerWidth - 24 : Math.min(720, window.innerWidth - 48),
    minHeight: isMobile ? 360 : 420,
    maxHeight: isMobile ? window.innerHeight - 24 : window.innerHeight - 120
  }
}

function normalizeChatSize(size) {
  const limits = getSizeLimits()

  return {
    width: clamp(Number(size.width) || 380, limits.minWidth, limits.maxWidth),
    height: clamp(Number(size.height) || 520, limits.minHeight, limits.maxHeight)
  }
}

function loadSavedChat() {
  if (!isBrowser()) return

  const savedMessages = safeJsonParse(window.localStorage.getItem(STORAGE_KEY), null)

  if (Array.isArray(savedMessages) && savedMessages.length) {
    const normalizedMessages = savedMessages.filter((msg) => {
      return msg && ['user', 'assistant'].includes(msg.role) && typeof msg.text === 'string'
    })

    messages.value = normalizedMessages.length ? normalizedMessages : [START_MESSAGE]
  }

  const savedSize = safeJsonParse(window.localStorage.getItem(SIZE_STORAGE_KEY), null)

  if (savedSize?.width && savedSize?.height) {
    chatSize.value = normalizeChatSize(savedSize)
  }
}

function saveChat() {
  if (!isBrowser()) return

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.value))
}

function saveChatSize() {
  if (!isBrowser()) return

  window.localStorage.setItem(SIZE_STORAGE_KEY, JSON.stringify(chatSize.value))
}

function clearChat() {
  messages.value = [START_MESSAGE]
  question.value = ''

  if (isBrowser()) {
    window.localStorage.removeItem(STORAGE_KEY)
  }

  scrollToBottom()
}

function scrollToBottom() {
  nextTick(() => {
    const list = messagesList.value

    if (!list) return

    list.scrollTo({
      top: list.scrollHeight,
      behavior: 'smooth'
    })
  })
}

function renderMarkdown(text) {
  return marked.parse(text || '', {
    async: false,
    breaks: true
  })
}

function handleKeydown(event) {
  if (event.key !== 'Enter' || event.shiftKey) return

  event.preventDefault()
  askBot()
}

function getPointerPosition(event) {
  const source = event.touches?.[0] || event.changedTouches?.[0] || event

  return {
    x: source.clientX,
    y: source.clientY
  }
}

function startResize(event) {
  if (!isBrowser()) return

  const point = getPointerPosition(event)

  resizing.value = true

  resizeStart.value = {
    x: point.x,
    y: point.y,
    width: chatSize.value.width,
    height: chatSize.value.height
  }

  window.addEventListener('mousemove', handleResize)
  window.addEventListener('mouseup', stopResize)
  window.addEventListener('touchmove', handleResize, { passive: false })
  window.addEventListener('touchend', stopResize)

  document.body.style.userSelect = 'none'
  document.body.style.cursor = 'nwse-resize'
}

function handleResize(event) {
  if (!resizing.value) return

  event.preventDefault?.()

  const point = getPointerPosition(event)
  const limits = getSizeLimits()

  const deltaX = resizeStart.value.x - point.x
  const deltaY = resizeStart.value.y - point.y

  chatSize.value = {
    width: clamp(resizeStart.value.width + deltaX, limits.minWidth, limits.maxWidth),
    height: clamp(resizeStart.value.height + deltaY, limits.minHeight, limits.maxHeight)
  }
}

function stopResize() {
  if (!resizing.value) return

  resizing.value = false
  saveChatSize()

  window.removeEventListener('mousemove', handleResize)
  window.removeEventListener('mouseup', stopResize)
  window.removeEventListener('touchmove', handleResize)
  window.removeEventListener('touchend', stopResize)

  document.body.style.userSelect = ''
  document.body.style.cursor = ''
}

async function askBot() {
  const userText = question.value.trim()

  if (!userText || loading.value) return

  messages.value.push({
    role: 'user',
    text: userText
  })

  question.value = ''
  loading.value = true
  scrollToBottom()

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=UTF-8'
      },
      body: JSON.stringify({
        question: userText
      })
    })

    if (!res.ok) {
      throw new Error(`API request failed: ${res.status}`)
    }

    const data = await res.json()

    messages.value.push({
      role: 'assistant',
      text: data.answer || 'К сожалению, я не нашёл ответа.'
    })
  } catch (e) {
    messages.value.push({
      role: 'assistant',
      text: 'Ошибка: не удалось связаться с сервером. Попробуйте ещё раз чуть позже.'
    })
  } finally {
    loading.value = false
    scrollToBottom()
  }
}

onMounted(() => {
  loadSavedChat()
  scrollToBottom()
})

onBeforeUnmount(() => {
  if (!isBrowser()) return

  window.removeEventListener('mousemove', handleResize)
  window.removeEventListener('mouseup', stopResize)
  window.removeEventListener('touchmove', handleResize)
  window.removeEventListener('touchend', stopResize)
  document.body.style.userSelect = ''
  document.body.style.cursor = ''
})

watch(
    messages,
    () => {
      saveChat()
      scrollToBottom()
    },
    { deep: true }
)

watch(isOpen, (opened) => {
  if (opened) scrollToBottom()
})
</script>

<template>
  <div class="ai-chat-container">
    <transition name="chat-window-fade">
      <section
          v-if="isOpen"
          class="chat-window"
          :class="{ resizing }"
          :style="{ width: `${chatSize.width}px`, height: `${chatSize.height}px` }"
          aria-label="Чат с ИИ-ассистентом"
      >
        <div
            class="resize-handle"
            role="button"
            tabindex="0"
            aria-label="Изменить размер окна чата"
            title="Потяните, чтобы изменить размер"
            @mousedown.prevent="startResize"
            @touchstart.prevent="startResize"
        ></div>

        <header class="chat-header">
          <div>
            <p class="chat-title">ИИ Ассистент</p>
            <p class="chat-subtitle">База знаний уральского рока</p>
          </div>

          <div class="chat-header-actions">
            <button
                v-if="hasUserMessages"
                class="header-button"
                type="button"
                title="Очистить историю"
                aria-label="Очистить историю чата"
                @click="clearChat"
            >
              ↺
            </button>

            <button
                class="header-button"
                type="button"
                aria-label="Закрыть чат"
                @click="isOpen = false"
            >
              ✕
            </button>
          </div>
        </header>

        <div ref="messagesList" class="messages-list">
          <article
              v-for="(msg, i) in messages"
              :key="`${msg.role}-${i}`"
              :class="['msg', msg.role]"
          >
            <div class="msg-content" v-html="renderMarkdown(msg.text)"></div>
          </article>

          <article v-if="loading" class="msg assistant typing-message" aria-live="polite">
            <span class="typing-label">Ассистент печатает</span>

            <span class="typing-dots" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </article>
        </div>

        <form class="input-block" @submit.prevent="askBot">
          <textarea
              v-model="question"
              rows="1"
              placeholder="Задайте вопрос..."
              :disabled="loading"
              @keydown="handleKeydown"
          ></textarea>

          <button
              class="send-button"
              type="submit"
              :disabled="loading || !question.trim()"
              aria-label="Отправить сообщение"
          >
            ➤
          </button>
        </form>
      </section>
    </transition>

    <button
        v-if="!isOpen"
        class="chat-toggle"
        type="button"
        aria-label="Открыть чат"
        :aria-expanded="isOpen"
        @click="isOpen = true"
    >
      <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
      >
        <path
            d="M7.2 19.6H6.4C4.5 19.6 3 18.1 3 16.2V8.8C3 6.9 4.5 5.4 6.4 5.4H21.6C23.5 5.4 25 6.9 25 8.8V16.2C25 18.1 23.5 19.6 21.6 19.6H13.4L8.1 23.2C7.7 23.5 7.2 23.2 7.2 22.7V19.6Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linejoin="round"
        />
        <path
            d="M8.6 11.4H19.4M8.6 15H15.6"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
        />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.ai-chat-container {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 50;
  font-family: var(--vp-font-family-base);
}

.chat-toggle {
  display: grid;
  width: 58px;
  height: 58px;
  place-items: center;
  border: 0;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  color: #fff;
  cursor: pointer;
  box-shadow: 0 16px 34px rgba(0, 0, 0, 0.25);
  transition: transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease;
}

.chat-toggle:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 42px rgba(0, 0, 0, 0.3);
}

.chat-toggle:active {
  transform: translateY(0) scale(0.98);
}

.chat-toggle:focus,
.chat-toggle:focus-visible {
  outline: none;
}

.chat-window {
  position: absolute;
  right: 0;
  bottom: 0;
  display: flex;
  min-width: 320px;
  max-width: min(720px, calc(100vw - 48px));
  min-height: 420px;
  max-height: calc(100vh - 120px);
  overflow: hidden;
  flex-direction: column;
  border: 1px solid color-mix(in srgb, var(--vp-c-divider), transparent 20%);
  border-radius: 22px;
  background: color-mix(in srgb, var(--vp-c-bg), transparent 3%);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(16px);
}

.chat-window.resizing {
  user-select: none;
}

.resize-handle {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 4;
  width: 34px;
  height: 34px;
  cursor: nwse-resize;
  opacity: 0.65;
  transition: opacity 0.18s ease;
}

.resize-handle::before,
.resize-handle::after {
  position: absolute;
  left: 9px;
  border-top: 2px solid var(--vp-c-text-3);
  border-left: 2px solid var(--vp-c-text-3);
  content: '';
  pointer-events: none;
}

.resize-handle::before {
  top: 9px;
  width: 12px;
  height: 12px;
  border-top-left-radius: 3px;
}


.resize-handle:hover {
  opacity: 1;
}

.resize-handle:focus,
.resize-handle:focus-visible {
  outline: none;
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 18px 16px 46px;
  border-bottom: 1px solid var(--vp-c-divider);
  background: linear-gradient(135deg, var(--vp-c-bg-soft), var(--vp-c-bg));
}

.chat-title,
.chat-subtitle {
  margin: 0;
}

.chat-title {
  color: var(--vp-c-text-1);
  font-size: 16px;
  font-weight: 700;
  line-height: 1.3;
}

.chat-subtitle {
  margin-top: 2px;
  color: var(--vp-c-text-2);
  font-size: 12px;
  line-height: 1.3;
}

.chat-header-actions {
  display: flex;
  gap: 8px;
}

.header-button {
  display: grid;
  width: 32px;
  height: 32px;
  place-items: center;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  cursor: pointer;
  font-size: 15px;
  transition: background 0.18s ease, color 0.18s ease, border-color 0.18s ease;
}

.header-button:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.header-button:focus,
.header-button:focus-visible {
  outline: none;
}

.messages-list {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  overflow-y: auto;
  scroll-behavior: smooth;
}

.messages-list::-webkit-scrollbar {
  width: 8px;
}

.messages-list::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: var(--vp-c-divider);
}

.msg {
  max-width: min(86%, 520px);
  padding: 11px 14px;
  border-radius: 18px;
  color: var(--vp-c-text-1);
  font-size: 14px;
  line-height: 1.55;
  overflow-wrap: anywhere;
  white-space: normal;
}

.msg.user {
  align-self: flex-end;
  border-bottom-right-radius: 6px;
  background: var(--vp-c-brand-soft);
}

.msg.assistant {
  align-self: flex-start;
  border: 1px solid var(--vp-c-divider);
  border-bottom-left-radius: 6px;
  background: var(--vp-c-bg-soft);
}

.msg-content :deep(p) {
  margin: 0;
}

.msg-content :deep(p + p),
.msg-content :deep(ul),
.msg-content :deep(ol),
.msg-content :deep(pre) {
  margin-top: 8px;
  margin-bottom: 0;
}

.msg-content :deep(a) {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.msg-content :deep(code) {
  border-radius: 5px;
  padding: 2px 5px;
  background: var(--vp-c-bg-mute);
  font-size: 0.92em;
}

.typing-message {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--vp-c-text-2);
}

.typing-label {
  font-size: 13px;
}

.typing-dots {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.typing-dots span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  animation: typing-dot 1.1s infinite ease-in-out;
}

.typing-dots span:nth-child(2) {
  animation-delay: 0.15s;
}

.typing-dots span:nth-child(3) {
  animation-delay: 0.3s;
}

.input-block {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  padding: 14px;
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
}

.input-block textarea {
  flex: 1;
  min-height: 44px;
  max-height: 120px;
  resize: none;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font: inherit;
  font-size: 14px;
  line-height: 1.45;
  padding: 11px 13px;
  transition: border-color 0.18s ease, background 0.18s ease;
}

.input-block textarea:focus,
.input-block textarea:focus-visible {
  border-color: var(--vp-c-brand-1);
  outline: none;
}

.input-block textarea:disabled {
  cursor: not-allowed;
  opacity: 0.72;
}

.send-button {
  display: grid;
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  place-items: center;
  border: 0;
  border-radius: 14px;
  background: var(--vp-c-brand-1);
  color: #fff;
  cursor: pointer;
  font-size: 16px;
  transition: transform 0.18s ease, opacity 0.18s ease, background 0.18s ease;
}

.send-button:hover:not(:disabled) {
  transform: translateY(-1px);
  background: var(--vp-c-brand-2);
}

.send-button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.send-button:focus,
.send-button:focus-visible {
  outline: none;
}

.chat-window-fade-enter-active,
.chat-window-fade-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.chat-window-fade-enter-from,
.chat-window-fade-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.98);
}

@keyframes typing-dot {
  0%,
  80%,
  100% {
    opacity: 0.35;
    transform: translateY(0);
  }

  40% {
    opacity: 1;
    transform: translateY(-4px);
  }
}

@media (max-width: 640px) {
  .ai-chat-container {
    right: 12px;
    bottom: 12px;
  }

  .chat-window {
    right: 0;
    bottom: 0;
    min-width: 280px;
    max-width: calc(100vw - 24px);
    min-height: 360px;
    max-height: calc(100vh - 24px);
    border-radius: 20px;
  }

  .resize-handle {
    display: block;
    width: 42px;
    height: 42px;
    touch-action: none;
  }

  .chat-header {
    padding-left: 42px;
  }

  .msg {
    max-width: 92%;
  }
}
</style>