<script setup>
import { nextTick, onMounted, ref, toRaw } from "vue";
import clientApi from "../configs/api/clientApi";
import { useRoute } from "vue-router";
import ResumePreview from "../components/ResumePreview.vue";
import Loading from "../components/Loading.vue";
import { toast } from "vue3-toastify";
import { computed } from "vue";
import { useTheme } from "../composables/useTheme";
const route = useRoute();
const resumeData = ref({});
const { isDark } = useTheme();

const { resumeId } = route.params;
const isInterview = ref(false);

const mode = ref("");

const cloneResume = computed(() => {
  let newResume = structuredClone(toRaw(resumeData.value));

  delete newResume.accent_color;
  delete newResume.public;
  delete newResume.template;
  delete newResume.title;
  delete newResume.personal_info;
  return newResume;
});

// chat
const userInput = ref("READY");
const chatContainer = ref(null);
const messages = ref([
  {
    role: "ai",
    text: "Hi, I am your AI assistance",
  },
  {
    role: "ai",
    text: "Today, I will be your interviewee, click READY to start",
  },
]);
const isTexting = ref(false);
const isReady = ref(false);
const sessionId = ref("");
const interviewHistory = ref([]);
const isHistoryLoading = ref(false);

const fetchHistory = async () => {
  isHistoryLoading.value = true;
  try {
    const { data } = await clientApi.get(
      `/api/ai/interview/history?resumeId=${resumeId}`,
    );
    interviewHistory.value = data.history;
  } catch (error) {
    console.error("Failed to fetch history:", error);
  } finally {
    isHistoryLoading.value = false;
  }
};

const loadSession = async (id) => {
  isInterview.value = true;
  try {
    const { data } = await clientApi.get(`/api/ai/interview/session/${id}`);
    const session = data.session;

    sessionId.value = session._id;
    mode.value = "chat";
    isReady.value = true;

    // Map history to chat messages
    messages.value = session.history.map((h) => ({
      role: h.role === "model" ? "ai" : "user",
      text: h.parts[0].text,
    }));

    if (messages.value[0]?.text === "Ask the first question") {
      messages.value.shift();
    }

    toast.success("Interview session loaded");
  } catch (error) {
    toast.error("Failed to load session: " + error.message);
  } finally {
    isInterview.value = false;
  }
};

const startNewInterview = () => {
  sessionId.value = "";
  messages.value = [
    {
      role: "ai",
      text: "Hi, I am your AI assistant",
    },
    {
      role: "ai",
      text: "Today, I will be your interviewer. Please paste the job description you are applying for to start.",
    },
  ];
  isReady.value = false;
  mode.value = "chat";
  userInput.value = "READY";
};

const deleteSession = async (id) => {
  if (!confirm("Are you sure you want to delete this interview history?"))
    return;

  try {
    await clientApi.delete(`/api/ai/interview/session/${id}`);
    interviewHistory.value = interviewHistory.value.filter((s) => s._id !== id);
    if (sessionId.value === id) {
      mode.value = "";
      sessionId.value = "";
    }
    toast.success("History deleted");
  } catch (error) {
    toast.error("Failed to delete history");
  }
};

const sendMessage = async () => {
  messages.value.push({
    role: "user",
    text: userInput.value,
  });
  const message = userInput.value;
  userInput.value = "";
  isTexting.value = true;
  if (chatContainer.value) {
    nextTick(() => {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    });
  }
  try {
    const { data } = await clientApi.post(`/api/ai/chat`, {
      userContent: cloneResume.value,
      role: "user",
      text: message,
      sessionId: sessionId.value,
      resumeId: resumeId,
    });

    if (data.sessionId && !sessionId.value) {
      sessionId.value = data.sessionId;
      fetchHistory(); // Refresh history list when a new session is created
    }

    messages.value.push({
      role: "ai",
      text: data.response,
    });
  } catch (error) {
    messages.value.push({
      role: "ai",
      text: "Too many requests,  please try next time :((",
    });
  } finally {
    isTexting.value = false;
    if (chatContainer.value) {
      nextTick(() => {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
      });
    }
  }
};
const handleChat = async () => {
  mode.value = "chat";
};
onMounted(async () => {
  try {
    isInterview.value = true;
    const { data } = await clientApi.get(`/api/resumes/get/${resumeId}`);
    resumeData.value = data.resume;
    await fetchHistory();
  } catch (error) {
    toast.error("Failed to load your resume " + error.message);
  } finally {
    isInterview.value = false;
  }
});
</script>
<template>
  <Loading v-if="isInterview" />
  <div
    v-else
    class="h-screen flex flex-col lg:flex-row overflow-hidden relative font-sans transition-colors duration-300"
    :class="
      isDark ? 'bg-slate-950 text-slate-300' : 'bg-gray-50 text-slate-700'
    "
  >
    <div
      class="absolute inset-0 bg-[url('https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/bg-with-grid.png')] bg-cover bg-center opacity-5 pointer-events-none"
    ></div>

    <div
      class="w-full lg:w-[45%] h-full flex flex-col border-r relative z-10 transition-colors"
      :class="
        isDark ? 'border-white/5 bg-slate-900/30' : 'border-gray-200 bg-white'
      "
    >
      <div
        class="h-14 border-b flex items-center px-6 transition-colors"
        :class="
          isDark
            ? 'border-white/5 bg-slate-950/80 backdrop-blur'
            : 'border-gray-200 bg-white'
        "
      >
        <router-link
          :to="`/app/builder/${resumeId}`"
          class="inline-flex gap-2 items-center transition-all group"
          :class="
            isDark
              ? 'text-slate-400 hover:text-cyan-400'
              : 'text-slate-500 hover:text-indigo-600'
          "
        >
          <div
            class="p-1.5 rounded-full border transition-colors"
            :class="
              isDark
                ? 'bg-slate-900 border-slate-700 group-hover:border-cyan-500/50 group-hover:bg-cyan-500/10'
                : 'bg-gray-100 border-gray-300 group-hover:border-indigo-400'
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m12 19-7-7 7-7" />

              <path d="M19 12H5" />
            </svg>
          </div>

          <span class="font-medium">Back </span>
        </router-link>
        <h2
          class="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 ml-20"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"
            />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" x2="8" y1="13" y2="13" />
            <line x1="16" x2="8" y1="17" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          Resume Context
        </h2>
      </div>

      <div
        class="flex-1 overflow-y-auto custom-scrollbar p-6 transition-colors"
        :class="isDark ? 'bg-slate-950/50' : 'bg-gray-50'"
      >
        <div class="flex flex-col items-center min-h-full">
          <div
            class="relative w-full max-w-[21cm] origin-top transform scale-[0.85] xl:scale-95 transition-transform duration-300"
          >
            <div
              class="bg-white text-black shadow-2xl rounded-sm overflow-hidden ring-1 ring-white/10 min-h-[29.7cm]"
            >
              <div ref="cvTemplate">
                <resume-preview
                  v-model:data="resumeData"
                  v-model:template="resumeData.template"
                  v-model:accent-color="resumeData.accent_color"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="w-full lg:w-[55%] h-full flex flex-col relative z-20 transition-colors"
      :class="isDark ? 'bg-slate-950' : 'bg-white'"
    >
      <div
        class="h-14 border-b flex items-center justify-between px-6 z-20 transition-colors"
        :class="
          isDark
            ? 'border-white/5 bg-slate-900/80 backdrop-blur'
            : 'border-gray-200 bg-white'
        "
      >
        <div class="flex items-center gap-4">
          <h2
            class="text-lg font-bold tracking-tight transition-colors"
            :class="isDark ? 'text-white' : 'text-slate-800'"
          >
            Interview room
          </h2>
          <button
            @click="startNewInterview"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase bg-slate-500/10 text-slate-500 border border-slate-500/20 hover:bg-slate-500 hover:text-white transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Chat
          </button>

          <router-link
            :to="`/app/voice/${resumeId}`"
            class="flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-105 transition-all group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="group-hover:animate-pulse"
            >
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" x2="12" y1="19" y2="22" />
            </svg>
            Live Voice Mode
          </router-link>
        </div>
      </div>

      <div class="flex-1 flex overflow-hidden">
        <!-- Main content area -->
        <div class="flex-1 flex flex-col overflow-hidden relative">
          <!-- interview part  -->
          <div
            v-if="!mode"
            class="h-full flex flex-col items-center justify-center p-8 text-center relative z-10"
          >
            <div class="relative group mb-8"></div>

            <h2
              class="text-3xl font-bold mb-3 tracking-tight transition-colors"
              :class="isDark ? 'text-white' : 'text-slate-800'"
            >
              Ready for your Interview?
            </h2>

            <p
              class="max-w-md mx-auto mb-10 leading-relaxed text-sm md:text-base transition-colors"
              :class="isDark ? 'text-slate-400' : 'text-slate-500'"
            >
              Our AI Interviewer will analyze your resume and conduct a mock
              interview based on the job description you provide.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 md:gap-10">
              <button
                @click="handleChat"
                class="group relative px-10 py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-lg tracking-wide shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all active:scale-95 overflow-hidden"
              >
                <div
                  class="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"
                ></div>

                <span class="relative flex items-center gap-3">
                  Start chat Interview
                </span>
              </button>
              <router-link
                :to="`/app/voice/${resumeId}`"
                class="flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-105 transition-all group"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="group-hover:animate-pulse"
                >
                  <path
                    d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"
                  />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" x2="12" y1="19" y2="22" />
                </svg>
                Live Voice Mode
              </router-link>
            </div>

            <div
              class="mt-8 flex items-center gap-4 text-xs text-slate-500 font-mono"
            >
              <div class="flex items-center gap-1.5">
                <div class="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                AI Ready
              </div>
            </div>
          </div>

          <div
            v-else-if="mode === 'chat'"
            class="flex flex-col h-full relative overflow-hidden font-sans transition-colors"
            :class="isDark ? 'bg-slate-950' : 'bg-white'"
          >
            <div
              class="px-6 py-4 flex items-center justify-between transition-colors sticky top-0 bg-inherit z-10"
            >
              <div class="flex items-center gap-3">
                <button
                  @click="mode = ''"
                  class="p-2 -ml-2 rounded-full hover:bg-white/5 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </button>
                <div class="flex flex-col">
                  <h3
                    class="font-bold text-sm tracking-wide transition-colors"
                    :class="isDark ? 'text-white' : 'text-slate-800'"
                  >
                    AI Interviewer
                  </h3>
                  <div class="flex items-center gap-1.5">
                    <span
                      class="relative flex h-2 w-2 rounded-full bg-green-500"
                    ></span>
                    <span class="text-[10px] text-slate-500 uppercase"
                      >Session:
                      {{ sessionId ? sessionId.slice(-6) : "New" }}</span
                    >
                  </div>
                </div>
              </div>
            </div>

            <div
              ref="chatContainer"
              class="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 scroll-smooth"
            >
              <div
                v-for="(msg, msgIdx) in messages"
                :key="msgIdx"
                class="flex w-full"
                :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
              >
                <div
                  class="flex max-w-[85%] md:max-w-[80%] gap-3"
                  :class="msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'"
                >
                  <div
                    class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border shadow-lg overflow-hidden transition-colors"
                    :class="
                      msg.role === 'user'
                        ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400'
                        : 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400'
                    "
                  >
                    <svg
                      v-if="msg.role === 'ai'"
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path d="M12 8V4H8" />
                      <rect width="16" height="12" x="4" y="8" rx="2" />
                      <path d="M2 14h2" />
                      <path d="M20 14h2" />
                      <path d="M15 13v2" />
                      <path d="M9 13v2" />
                    </svg>
                    <svg
                      v-else
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>

                  <div
                    class="p-4 rounded-2xl text-sm leading-relaxed shadow-sm transition-colors"
                    :class="
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-indigo-600 to-blue-600 text-white rounded-tr-none'
                        : isDark
                          ? 'bg-slate-900 border border-white/5 text-slate-200 rounded-tl-none'
                          : 'bg-white border border-gray-200 text-slate-700 rounded-tl-none shadow-sm'
                    "
                  >
                    {{ msg.text }}
                  </div>
                </div>
              </div>

              <div v-if="isTexting" class="flex justify-start w-full">
                <div class="flex max-w-[80%] gap-3">
                  <div
                    class="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path d="M12 8V4H8" />
                      <rect width="16" height="12" x="4" y="8" rx="2" />
                      <path d="M2 14h2" />
                      <path d="M20 14h2" />
                      <path d="M15 13v2" />
                      <path d="M9 13v2" />
                    </svg>
                  </div>
                  <div
                    class="p-4 rounded-2xl rounded-tl-none flex items-center gap-1 transition-colors"
                    :class="
                      isDark
                        ? 'bg-slate-900 border border-white/5'
                        : 'bg-white border border-gray-200'
                    "
                  >
                    <span
                      class="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce"
                    ></span>
                    <span
                      class="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce"
                      style="animation-delay: 0.1s"
                    ></span>
                    <span
                      class="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce"
                      style="animation-delay: 0.2s"
                    ></span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Input area -->
            <div
              class="p-6 transition-colors"
              :class="
                isDark
                  ? 'bg-slate-950/80 backdrop-blur'
                  : 'bg-white border-t border-gray-100'
              "
            >
              <div v-if="isReady">
                <div class="relative group">
                  <div
                    class="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl opacity-0 group-focus-within:opacity-20 transition duration-500 blur-lg"
                  ></div>

                  <div
                    class="relative flex items-center p-1 bg-slate-900 border border-white/10 rounded-2xl group-focus-within:border-cyan-500/50 transition-all duration-300"
                    :class="!isDark && 'bg-gray-50 border-gray-200'"
                  >
                    <input
                      type="text"
                      v-model="userInput"
                      @keyup.enter="sendMessage"
                      placeholder="Type your answer, or paste JD to start..."
                      class="flex-1 bg-transparent border-none px-4 py-3 focus:outline-none focus:ring-0 text-sm transition-colors"
                      :class="
                        isDark
                          ? 'text-white placeholder-slate-500'
                          : 'text-slate-800 placeholder-slate-400'
                      "
                    />

                    <button
                      @click="sendMessage"
                      :disabled="!userInput.trim() || isTexting"
                      class="p-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all active:scale-95 disabled:opacity-40 disabled:grayscale"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                      >
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                    </button>
                  </div>
                </div>
                <p
                  class="text-[10px] text-center text-slate-500 mt-2 font-medium opacity-60"
                >
                  Tip: Be detailed in your answers for better feedback later.
                </p>
              </div>
              <div v-else class="flex flex-col items-center gap-4">
                <button
                  @click="
                    () => {
                      isReady = true;
                      userInput = 'READY';
                      sendMessage();
                    }
                  "
                  class="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl text-white font-bold shadow-xl shadow-cyan-500/20 transform hover:-translate-y-1 transition-all active:translate-y-0"
                >
                  CLICK HERE TO BEGIN INTERVIEW
                </button>
                <p
                  class="text-[10px] text-slate-500 uppercase tracking-widest font-bold"
                >
                  {{
                    sessionId ? "Continuing previous session" : "System ready"
                  }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- History Sidebar -->
        <div
          class="w-64 border-l transition-colors hidden xl:flex flex-col"
          :class="
            isDark
              ? 'border-white/5 bg-slate-600'
              : 'border-gray-200 bg-gray-300'
          "
        >
          <div
            class="p-4 border-b flex items-center justify-between transition-colors"
            :class="isDark ? 'border-white/5' : 'border-gray-200'"
          >
            <h3
              class="text-xs font-bold uppercase tracking-widest text-slate-200"
            >
              History
            </h3>
            <span
              class="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-bold border border-gray-200 dark:border-white/5 text-black"
              >{{ interviewHistory.length }}</span
            >
          </div>

          <div class="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
            <div v-if="isHistoryLoading" class="p-4 text-center">
              <div
                class="inline-block w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"
              ></div>
            </div>

            <div
              v-else-if="interviewHistory.length === 0"
              class="p-4 text-center"
            >
              <p class="text-[10px] text-slate-500 italic">
                No past sessions found.
              </p>
            </div>

            <div
              v-for="session in interviewHistory"
              :key="session._id"
              class="group relative p-3 rounded-xl border transition-all cursor-pointer overflow-hidden"
              :class="[
                sessionId === session._id
                  ? 'border-cyan-500 bg-cyan-500/5 ring-1 ring-cyan-500/20'
                  : isDark
                    ? 'border-white/5 bg-slate-950/40 hover:bg-slate-900 shadow-sm'
                    : 'border-gray-200 bg-white hover:bg-white shadow-sm',
              ]"
              @click="loadSession(session._id)"
            >
              <div
                class="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <button
                  @click.stop="deleteSession(session._id)"
                  class="p-1 rounded-md hover:bg-red-500/10 text-slate-500 hover:text-red-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"
                    />
                  </svg>
                </button>
              </div>

              <div class="flex flex-col gap-1 pr-4">
                <p
                  class="text-[11px] font-bold line-clamp-1 transition-colors"
                  :class="
                    sessionId === session._id
                      ? 'text-cyan-400'
                      : isDark
                        ? 'text-slate-300'
                        : 'text-slate-700'
                  "
                >
                  {{
                    session.contextData?.jobDescription || "Untitled Interview"
                  }}
                </p>
                <div class="flex items-center justify-between">
                  <p class="text-[9px] text-slate-500">
                    {{ new Date(session.createdAt).toLocaleDateString() }}
                  </p>
                  <span
                    class="text-[8px] font-bold px-1 rounded-sm uppercase border"
                    :class="[
                      session.status === 'active'
                        ? 'text-green-500 border-green-500/20 bg-green-500/5'
                        : 'text-slate-400 border-slate-300',
                    ]"
                    >{{ session.status }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #334155;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #475569;
}
</style>
