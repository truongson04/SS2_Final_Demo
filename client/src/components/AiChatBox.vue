<script setup>
import { ref, watch, nextTick, computed } from "vue";
import clientApi from "../configs/api/clientApi";
import useAuth from "../store/auth";
import { marked } from "marked";
import { useTheme } from "../composables/useTheme";

marked.setOptions({
  breaks: true,
  gfm: true,
});

const authStore = useAuth();
const isLoggedIn = computed(
  () => !!authStore.token || !!localStorage.getItem("token"),
);
const { isDark } = useTheme();
const isOpen = ref(false);
const message = ref("");
const messages = ref([]);
const isLoading = ref(false);
const chatBody = ref(null);

const scrollToBottom = () => {
  nextTick(() => {
    if (chatBody.value) {
      chatBody.value.scrollTop = chatBody.value.scrollHeight;
    }
  });
};

const toggleChat = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value && messages.value.length === 0) {
    messages.value.push({
      role: "assistant",
      content:
        "Xin chào! 👋 Tôi là AI Assistant của CVBuilder. Tôi có thể giúp bạn về viết CV, tư vấn nghề nghiệp, chuẩn bị phỏng vấn. Hãy hỏi tôi bất cứ điều gì!",
      isGreeting: true,
    });
  }
};

const sendMessage = async () => {
  const text = message.value.trim();
  if (!text || isLoading.value) return;

  messages.value.push({ role: "user", content: text });
  message.value = "";
  isLoading.value = true;
  scrollToBottom();

  try {
    const chatHistory = messages.value
      .filter((m) => !m.isGreeting)
      .slice(0, -1)
      .map((m) => ({ role: m.role, content: m.content }));

    const { data } = await clientApi.post("/api/ai/quick-chat", {
      message: text,
      history: chatHistory,
    });

    messages.value.push({ role: "assistant", content: data.response });
  } catch (error) {
    messages.value.push({
      role: "assistant",
      content: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau. 😅",
    });
  } finally {
    isLoading.value = false;
    scrollToBottom();
  }
};

watch(messages, scrollToBottom, { deep: true });
</script>

<template>
  <div class="ai-chat-widget" v-if="isLoggedIn">
    <!-- Floating Button -->
    <button
      @click="toggleChat"
      class="ai-fab"
      :class="{ 'ai-fab--active': isOpen }"
    >
      <svg
        v-if="!isOpen"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path
          d="M12 2a8 8 0 0 1 8 8c0 3.3-2 6.2-5 7.5V20a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2.5C6 16.2 4 13.3 4 10a8 8 0 0 1 8-8z"
        />
        <path d="M9 10h.01" />
        <path d="M15 10h.01" />
        <path d="M9.5 15a3.5 3.5 0 0 0 5 0" />
      </svg>
      <svg
        v-else
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    </button>

    <Transition
      enter-active-class="chat-enter-active"
      enter-from-class="chat-enter-from"
      enter-to-class="chat-enter-to"
      leave-active-class="chat-leave-active"
      leave-from-class="chat-leave-from"
      leave-to-class="chat-leave-to"
    >
      <div
        v-if="isOpen"
        class="ai-chatbox"
        :class="isDark ? 'ai-chatbox--dark' : 'ai-chatbox--light'"
      >
        <div class="ai-chatbox__header">
          <div class="ai-chatbox__header-info">
            <div class="ai-chatbox__avatar">
              <img
                src="../assets/chatbot-icon.png"
                class="object-cover h-full w-full rounded-full"
              />
            </div>
            <div>
              <h3 class="ai-chatbox__title">Your "Blue-eyes" Assistant</h3>
              <span class="ai-chatbox__status">Online</span>
            </div>
          </div>
          <button @click="isOpen = false" class="ai-chatbox__close">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <!-- Messages -->
        <div ref="chatBody" class="ai-chatbox__body">
          <div
            v-for="(msg, i) in messages"
            :key="i"
            class="ai-chatbox__msg"
            :class="{
              'ai-chatbox__msg--user': msg.role === 'user',
              'ai-chatbox__msg--ai': msg.role === 'assistant',
            }"
          >
            <div v-if="msg.role === 'user'" class="ai-chatbox__bubble">
              {{ msg.content }}
            </div>
            <div
              v-else
              class="ai-chatbox__bubble ai-chatbox__bubble--md"
              v-html="marked.parse(msg.content)"
            ></div>
          </div>

          <!-- Loading -->
          <div v-if="isLoading" class="ai-chatbox__msg ai-chatbox__msg--ai">
            <div class="ai-chatbox__bubble ai-chatbox__bubble--loading">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </div>
          </div>
        </div>

        <!-- Input -->
        <div class="ai-chatbox__footer">
          <input
            v-model="message"
            @keyup.enter="sendMessage"
            type="text"
            placeholder="Nhập tin nhắn..."
            class="ai-chatbox__input"
            :disabled="isLoading"
          />
          <button
            @click="sendMessage"
            class="ai-chatbox__send"
            :disabled="!message.trim() || isLoading"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="m22 2-7 20-4-9-9-4 20-7Z" />
              <path d="M22 2 11 13" />
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.ai-chat-widget {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  font-family: "Be Vietnam Pro", "Inter", sans-serif;
}

/* Floating Action Button */
.ai-fab {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #06b6d4, #3b82f6);
  color: white;
  box-shadow:
    0 4px 24px rgba(6, 182, 212, 0.4),
    0 0 40px rgba(6, 182, 212, 0.15);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 10001;
}
.ai-fab:hover {
  transform: scale(1.1);
  box-shadow:
    0 6px 32px rgba(6, 182, 212, 0.5),
    0 0 60px rgba(6, 182, 212, 0.2);
}
.ai-fab--active {
  background: linear-gradient(135deg, #475569, #334155);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}
.ai-fab::before {
  content: "";
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  background: linear-gradient(135deg, #06b6d4, #3b82f6, #8b5cf6);
  z-index: -1;
  opacity: 0.5;
  animation: pulse-ring 2s ease-in-out infinite;
}
.ai-fab--active::before {
  display: none;
}

@keyframes pulse-ring {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.15);
    opacity: 0;
  }
}

/* Chat Box */
.ai-chatbox {
  position: absolute;
  bottom: 76px;
  right: 0;
  width: 380px;
  height: 520px;
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.5),
    0 0 40px rgba(6, 182, 212, 0.1);
}

/* Light mode overrides */
.ai-chatbox--light {
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.12),
    0 0 20px rgba(99, 102, 241, 0.06);
}
.ai-chatbox--light .ai-chatbox__header {
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}
.ai-chatbox--light .ai-chatbox__title {
  color: #1e293b;
}
.ai-chatbox--light .ai-chatbox__close {
  color: #94a3b8;
}
.ai-chatbox--light .ai-chatbox__close:hover {
  color: #1e293b;
  background: rgba(0, 0, 0, 0.05);
}
.ai-chatbox--light .ai-chatbox__msg--ai .ai-chatbox__bubble {
  background: #f1f5f9;
  color: #334155;
  border: 1px solid rgba(0, 0, 0, 0.06);
}
.ai-chatbox--light .ai-chatbox__footer {
  background: #f8fafc;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}
.ai-chatbox--light .ai-chatbox__input {
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: #1e293b;
}
.ai-chatbox--light .ai-chatbox__input::placeholder {
  color: #94a3b8;
}
.ai-chatbox--light .ai-chatbox__input:focus {
  border-color: #6366f1;
}
.ai-chatbox--light .ai-chatbox__body {
  background: #ffffff;
}
.ai-chatbox--light .ai-chatbox__bubble--md :deep(h1),
.ai-chatbox--light .ai-chatbox__bubble--md :deep(h2),
.ai-chatbox--light .ai-chatbox__bubble--md :deep(h3) {
  color: #4f46e5;
}
.ai-chatbox--light .ai-chatbox__bubble--md :deep(strong) {
  color: #1e293b;
}
.ai-chatbox--light .ai-chatbox__bubble--md :deep(code) {
  background: rgba(99, 102, 241, 0.1);
}
.ai-chatbox--light .ai-chatbox__bubble--md :deep(pre) {
  background: #f1f5f9;
}

/* Transition */
.chat-enter-active,
.chat-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.chat-enter-from,
.chat-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.95);
}
.chat-enter-to,
.chat-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* Header */
.ai-chatbox__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: linear-gradient(135deg, #0f172a, #1e293b);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.ai-chatbox__header-info {
  display: flex;
  align-items: center;
  gap: 10px;
}
.ai-chatbox__avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #06b6d4, #3b82f6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}
.ai-chatbox__title {
  font-size: 14px;
  font-weight: 700;
  color: white;
  margin: 0;
}
.ai-chatbox__status {
  font-size: 11px;
  color: #22c55e;
  font-weight: 500;
}
.ai-chatbox__close {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
}
.ai-chatbox__close:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

/* Messages Body */
.ai-chatbox__body {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.ai-chatbox__body::-webkit-scrollbar {
  width: 4px;
}
.ai-chatbox__body::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

/* Message Bubbles */
.ai-chatbox__msg {
  display: flex;
}
.ai-chatbox__msg--user {
  justify-content: flex-end;
}
.ai-chatbox__msg--ai {
  justify-content: flex-start;
}
.ai-chatbox__bubble {
  max-width: 85%;
  padding: 10px 14px;
  border-radius: 14px;
  font-size: 13px;
  line-height: 1.5;
  word-wrap: break-word;
  white-space: pre-wrap;
}
.ai-chatbox__msg--user .ai-chatbox__bubble {
  background: linear-gradient(135deg, #06b6d4, #3b82f6);
  color: white;
  border-bottom-right-radius: 4px;
}
.ai-chatbox__msg--ai .ai-chatbox__bubble {
  background: #1e293b;
  color: #e2e8f0;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-bottom-left-radius: 4px;
}

/* Markdown inside AI bubbles */
.ai-chatbox__bubble--md :deep(h1),
.ai-chatbox__bubble--md :deep(h2),
.ai-chatbox__bubble--md :deep(h3) {
  font-size: 14px;
  font-weight: 700;
  color: #22d3ee;
  margin: 8px 0 4px 0;
}
.ai-chatbox__bubble--md :deep(h3) {
  font-size: 13px;
}
.ai-chatbox__bubble--md :deep(p) {
  margin: 4px 0;
}
.ai-chatbox__bubble--md :deep(ul),
.ai-chatbox__bubble--md :deep(ol) {
  margin: 4px 0;
  padding-left: 18px;
}
.ai-chatbox__bubble--md :deep(li) {
  margin: 2px 0;
}
.ai-chatbox__bubble--md :deep(strong) {
  color: #f1f5f9;
  font-weight: 600;
}
.ai-chatbox__bubble--md :deep(code) {
  background: rgba(6, 182, 212, 0.15);
  padding: 1px 5px;
  border-radius: 4px;
  font-size: 12px;
}
.ai-chatbox__bubble--md :deep(pre) {
  background: #0f172a;
  padding: 8px;
  border-radius: 6px;
  overflow-x: auto;
  margin: 6px 0;
}
.ai-chatbox__bubble--md :deep(pre code) {
  background: none;
  padding: 0;
}

/* Loading Dots */
.ai-chatbox__bubble--loading {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 14px 18px;
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #06b6d4;
  animation: bounce-dot 1.4s ease-in-out infinite;
}
.dot:nth-child(2) {
  animation-delay: 0.2s;
}
.dot:nth-child(3) {
  animation-delay: 0.4s;
}
@keyframes bounce-dot {
  0%,
  80%,
  100% {
    transform: scale(0.6);
    opacity: 0.4;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Footer Input */
.ai-chatbox__footer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: #0f172a;
}
.ai-chatbox__input {
  flex: 1;
  background: #1e293b;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 10px 14px;
  color: white;
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s;
  font-family: "Be Vietnam Pro", "Inter", sans-serif;
}
.ai-chatbox__input::placeholder {
  color: #64748b;
}
.ai-chatbox__input:focus {
  border-color: #06b6d4;
}
.ai-chatbox__input:disabled {
  opacity: 0.6;
}
.ai-chatbox__send {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #06b6d4, #3b82f6);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}
.ai-chatbox__send:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 2px 12px rgba(6, 182, 212, 0.4);
}
.ai-chatbox__send:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Mobile responsive */
@media (max-width: 480px) {
  .ai-chatbox {
    width: calc(100vw - 32px);
    height: calc(100vh - 140px);
    right: -8px;
  }
}
</style>
