<template>
  <section class="feedback-section">
    <div class="feedback-card">
      <div class="feedback-header">
        <p class="feedback-eyebrow">Форма обратной связи</p>
        <h2>Напишите нам</h2>
        <p>
          Можно отправить уточнение, предложить правку, сообщить об ошибке
          или дополнить материалы проекта.
        </p>
      </div>

      <form class="feedback-form" @submit.prevent="submitForm">
        <div class="feedback-grid">
          <label class="feedback-field">
            <span>Ваше имя</span>
            <input
                v-model.trim="form.name"
                type="text"
                name="name"
                placeholder="Например, Иван"
                autocomplete="name"
                :disabled="isLoading"
                required
            />
          </label>

          <label class="feedback-field">
            <span>Email или Telegram</span>
            <input
                v-model.trim="form.contact"
                type="text"
                name="contact"
                placeholder="email@example.com или @username"
                :disabled="isLoading"
                required
            />
          </label>
        </div>

        <label class="feedback-field">
          <span>Сообщение</span>
          <textarea
              v-model.trim="form.message"
              name="message"
              rows="7"
              placeholder="Напишите ваше сообщение"
              :disabled="isLoading"
              required
          ></textarea>
        </label>

        <div class="feedback-footer">
          <button
              class="feedback-submit"
              type="submit"
              :disabled="isLoading"
          >
            {{ isLoading ? 'Отправляем...' : 'Отправить сообщение' }}
          </button>

          <p class="feedback-note">
            Заполните все поля, чтобы команда могла с вами связаться.
          </p>
        </div>

        <div
            v-if="statusText"
            class="feedback-message"
            :class="isSuccess ? 'feedback-message-success' : 'feedback-message-error'"
        >
          {{ statusText }}
        </div>
      </form>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'

const FEEDBACK_API_URL = 'https://kb-api-server.onrender.com/api/feedback'

const form = reactive({
  name: '',
  contact: '',
  message: ''
})

const isLoading = ref(false)
const statusText = ref('')
const isSuccess = ref(false)

async function submitForm() {
  statusText.value = ''
  isSuccess.value = false

  if (!form.name || !form.contact || !form.message) {
    statusText.value = 'Пожалуйста, заполните все поля формы.'
    return
  }

  isLoading.value = true

  try {
    const response = await fetch(FEEDBACK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: form.name,
        contact: form.contact,
        message: form.message
      })
    })

    const data = await response.json()

    if (!response.ok || !data.ok) {
      throw new Error(data.message || 'Ошибка отправки')
    }

    form.name = ''
    form.contact = ''
    form.message = ''

    isSuccess.value = true
    statusText.value = 'Сообщение успешно отправлено. Спасибо!'
  } catch (error) {
    console.error(error)

    isSuccess.value = false
    statusText.value = 'Не удалось отправить сообщение. Попробуйте позже.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.feedback-section {
  display: flex;
  justify-content: center;
  margin-top: 36px;
  font-family: var(--vp-font-family-base);
}

.feedback-card {
  width: 100%;
  max-width: 760px;
  padding: 30px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 18px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  transition:
      border-color 0.18s ease,
      background 0.18s ease;
}

.feedback-card:hover {
  border-color: var(--vp-c-brand-2);
}

.feedback-header {
  max-width: 620px;
  margin-bottom: 24px;
}

.feedback-eyebrow {
  margin: 0 0 8px;
  color: var(--vp-c-brand-1);
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.05em;
  line-height: 1.4;
  text-transform: uppercase;
}

.feedback-header h2 {
  margin: 0 0 10px;
  border-top: none;
  padding-top: 0;
  color: var(--vp-c-text-1);
  font-size: 28px;
  font-weight: 800;
  line-height: 1.25;
  letter-spacing: -0.03em;
}

.feedback-header p {
  margin: 0;
  color: var(--vp-c-text-2);
  line-height: 1.75;
}

.feedback-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.feedback-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.feedback-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.feedback-field span {
  color: var(--vp-c-text-1);
  font-size: 14px;
  font-weight: 700;
}

.feedback-field input,
.feedback-field textarea {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid var(--vp-c-border);
  border-radius: 14px;
  padding: 13px 15px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-family: var(--vp-font-family-base);
  font-size: 15px;
  line-height: 1.5;
  transition:
      border-color 0.18s ease,
      box-shadow 0.18s ease,
      background 0.18s ease;
}

.feedback-field textarea {
  min-height: 160px;
  resize: vertical;
}

.feedback-field input::placeholder,
.feedback-field textarea::placeholder {
  color: var(--vp-c-text-3);
}

.feedback-field input:focus,
.feedback-field textarea:focus {
  outline: none;
  border-color: var(--vp-c-brand-2);
  box-shadow: 0 0 0 4px var(--vp-c-brand-soft);
}

.feedback-field input:disabled,
.feedback-field textarea:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.feedback-footer {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 14px;
}

.feedback-submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 22px;
  border: 1px solid var(--vp-button-brand-border);
  border-radius: 999px;
  background: var(--vp-button-brand-bg);
  color: var(--vp-button-brand-text);
  font-family: var(--vp-font-family-base);
  font-size: 14px;
  font-weight: 800;
  line-height: 1;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  transition:
      color 0.25s,
      border-color 0.25s,
      background-color 0.25s,
      transform 0.18s ease,
      opacity 0.25s;
}

.feedback-submit:hover {
  border-color: var(--vp-button-brand-hover-border);
  background: var(--vp-button-brand-hover-bg);
  color: var(--vp-button-brand-hover-text);
  transform: translateY(-1px);
}

.feedback-submit:active {
  border-color: var(--vp-button-brand-active-border);
  background: var(--vp-button-brand-active-bg);
  color: var(--vp-button-brand-text);
  transform: translateY(0);
}

.feedback-submit:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  transform: none;
}

.feedback-note {
  margin: 0;
  color: var(--vp-c-text-3);
  font-size: 14px;
  line-height: 1.6;
}

.feedback-message {
  border-radius: 16px;
  padding: 13px 15px;
  font-weight: 700;
  line-height: 1.5;
}

.feedback-message-success {
  border: 1px solid rgba(34, 197, 94, 0.28);
  background: rgba(34, 197, 94, 0.12);
  color: #15803d;
}

.feedback-message-error {
  border: 1px solid rgba(239, 68, 68, 0.28);
  background: rgba(239, 68, 68, 0.12);
  color: #b91c1c;
}

.dark .feedback-message-success {
  color: #86efac;
}

.dark .feedback-message-error {
  color: #fca5a5;
}

@media (max-width: 640px) {
  .feedback-section {
    margin-top: 28px;
  }

  .feedback-card {
    padding: 22px;
    border-radius: 16px;
  }

  .feedback-grid {
    grid-template-columns: 1fr;
  }

  .feedback-header h2 {
    font-size: 24px;
  }

  .feedback-submit {
    width: 100%;
  }

  .feedback-note {
    width: 100%;
  }
}
</style>