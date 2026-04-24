<script setup>
import { nextTick, onMounted, onUnmounted, ref, toRaw, computed } from "vue";
import clientApi from "../configs/api/clientApi";
import { useRoute, useRouter } from "vue-router";
import Loading from "../components/Loading.vue";
import { toast } from "vue3-toastify";
import { useTheme } from "../composables/useTheme";

const route = useRoute();
const router = useRouter();
const { isDark } = useTheme();

const resumeId = route.params.resumeId;
const isInterviewLoading = ref(false);
const resumeData = ref({});

const cloneResume = computed(() => {
  let newResume = structuredClone(toRaw(resumeData.value));
  delete newResume.accent_color;
  delete newResume.public;
  delete newResume.template;
  delete newResume.title;
  delete newResume.personal_info;
  return newResume;
});

// STT & TTS
const isRecording = ref(false);
let recognition = null;
let speechResult = false;
let speechError = false;

const isTexting = ref(false);
const isAiSpeaking = ref(false);
let currentAudio = null;
const audioAnalyserData = ref([]);

// Chat states
const sessionId = ref("");
const isReady = ref(false);
const userInput = ref("");

// Language & Voice
const selectedLanguage = ref("English");
const languages = ["English", "Vietnamese"];

const selectedVoice = ref("Puck");
const voices = [
  { id: "Puck", name: "Puck", description: "Confident, professional male" },
  { id: "Charon", name: "Charon", description: "Authoritative, deep male" },
  { id: "Kore", name: "Kore", description: "Clear, articulate female" },
  { id: "Fenrir", name: "Fenrir", description: "Strong, dynamic male" },
  { id: "Aoede", name: "Aoede", description: "Warm, expressive female" },
];

const messages = ref([
  {
    role: "ai",
    text: "Hello! I am your AI Interviewer. To begin our voice interview, please paste your Job Description below and click 'Start Audio Interview'.",
  },
]);
const chatContainer = ref(null);

const scrollToBottom = () => {
  if (chatContainer.value) {
    nextTick(() => {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    });
  }
};
// hàm để phát âm thanh khi server trả về cho client
const playAudio = (base64Audio, textFallback = "") => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
    isAiSpeaking.value = false;
  }

  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
    isAiSpeaking.value = false;
  }

  if (base64Audio) {
    try {
      currentAudio = new Audio(base64Audio);

      currentAudio.onplay = () => {
        isAiSpeaking.value = true;
      };

      currentAudio.onended = () => {
        currentAudio = null;
        isAiSpeaking.value = false;
      };

      const playPromise = currentAudio.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {})
          .catch((error) => {
            console.warn("Audio cannot play", error);

            currentAudio = null;
            isAiSpeaking.value = false;

            if (textFallback) {
              playBrowserTTS(textFallback);
            }
          });
      }
    } catch (error) {
      console.error("Cannot start the audio", error);
      if (textFallback) playBrowserTTS(textFallback);
    }
  } else if (textFallback) {
    playBrowserTTS(textFallback);
  }
};

const playBrowserTTS = (text) => {
  if (!window.speechSynthesis) return;
  const utterance = new SpeechSynthesisUtterance(text);

  // Try to find a good English voice
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice =
    voices.find(
      (v) => v.name.includes("Google") || v.name.includes("Natural"),
    ) || voices[0];
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  utterance.rate = 1.05;
  utterance.pitch = 1.1;
  utterance.onstart = () => {
    isAiSpeaking.value = true;
  };
  utterance.onend = () => {
    isAiSpeaking.value = false;
  };
  utterance.onerror = () => {
    isAiSpeaking.value = false;
  };

  window.speechSynthesis.speak(utterance);
};

const lastMessageText = computed(() => {
  if (messages.value.length === 0) return "";
  return messages.value[messages.value.length - 1].text;
});
// gửi giọng nói lên server
const sendMessage = async (overrideText = null) => {
  const message = overrideText || userInput.value;
  if (!message || message.trim() === "") return;

  messages.value.push({ role: "user", text: message });
  userInput.value = "";
  isTexting.value = true;
  scrollToBottom();

  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }

  try {
    const { data } = await clientApi.post(`/api/ai/chat`, {
      userContent: cloneResume.value,
      role: "user",
      text: message,
      sessionId: sessionId.value,
      resumeId: resumeId,
      voiceMode: true, // Request AUDIO response from Gemini!
      language: selectedLanguage.value,
      voiceName: selectedVoice.value,
    });

    if (data.sessionId && !sessionId.value) {
      sessionId.value = data.sessionId;
      isReady.value = true;
    }

    messages.value.push({
      role: "ai",
      text: data.response,
    });

    scrollToBottom();

    if (data.audioData) {
      playAudio(data.audioData, data.response);
    } else {
      playAudio(null, data.response); // Fallback to browser TTS
    }
  } catch (error) {
    messages.value.push({
      role: "ai",
      text: "Oops, something went wrong. Let's try again.",
    });
    scrollToBottom();

    toast.error("Something went wrong, please try latter");
  } finally {
    isTexting.value = false;
  }
};

const toggleRecording = () => {
  if (!recognition) {
    toast.error("Your browser doesn't support Speech Recognition.");
    return;
  }

  if (isRecording.value) {
    recognition.stop();
    isRecording.value = false;
  } else {
    // Stop any AI audio if user wants to speak
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }

    try {
      recognition.start();
      isRecording.value = true;
    } catch (err) {
      console.warn("Speech recognition already started", err);
    }
  }
};

// Ensure voices are loaded
if (window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}

onMounted(async () => {
  // Initialize resume
  try {
    isInterviewLoading.value = true;
    const { data } = await clientApi.get(`/api/resumes/get/${resumeId}`);
    resumeData.value = data.resume;
  } catch (error) {
    toast.error("Failed to load your resume");
    router.push("/app");
  } finally {
    isInterviewLoading.value = false;
  }

  // Initialize SpeechRecognition
  // hàm nhận diện giọng nói
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      speechResult = false;
      speechError = false;
    };

    recognition.onresult = (event) => {
      speechResult = true;
      const transcript = event.results[0][0].transcript;

      if (transcript.trim()) {
        toast.success("Voice recognized successfully!!");
        sendMessage(transcript);
      } else {
        toast.info("Didn't catch that. Please try again.");
      }
    };
    recognition.onend = () => {
      isRecording.value = false;
      // Handle the case where user manually stops mic without speaking
      if (!speechResult && !speechError) {
        toast.info("Recording stopped. No voice detected !!");
      }
    };
    recognition.onerror = (event) => {
      speechError = true;
      if (event.error !== "no-speech") {
        console.error("Speech recognition error:", event.error);
        toast.error(`Recording error: ${event.error}`);
      } else {
        toast.error("Cannot detect your voice !!");
      }
      isRecording.value = false;
    };
  }
});

onUnmounted(() => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  if (recognition && isRecording.value) {
    recognition.stop();
  }
});

const startInitialInterview = async () => {
  if (!userInput.value.trim()) return toast.error("Please enter JD first");

  try {
    isInterviewLoading.value = true;
    await sendMessage(userInput.value);
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong");
  } finally {
    isInterviewLoading.value = false;
  }
};
</script>

<template>
  <Loading v-if="isInterviewLoading" />

  <div
    v-else
    class="min-h-screen flex flex-col font-sans transition-colors duration-300 relative"
    :class="
      isDark ? 'bg-slate-950 text-slate-200' : 'bg-gray-50 text-slate-800'
    "
  >
    <!-- Navbar -->
    <header
      class="h-16 px-6 border-b flex items-center justify-between sticky top-0 z-50 transition-colors"
      :class="
        isDark
          ? 'border-white/10 bg-slate-900/80 backdrop-blur'
          : 'border-gray-200 bg-white'
      "
    >
      <div class="flex items-center gap-4">
        <router-link
          :to="`/app/builder/${resumeId}`"
          class="p-2 rounded-full border transition-colors hover:bg-slate-500/10"
          :class="
            isDark
              ? 'border-slate-700 text-slate-400'
              : 'border-gray-300 text-slate-500'
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
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
        </router-link>
        <div class="flex flex-col">
          <h1 class="text-sm font-bold tracking-tight">AI Voice Interview</h1>
          <span
            class="text-xs text-green-500 font-medium flex items-center gap-1"
          >
            <span
              class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"
            ></span>
            Online
          </span>
        </div>
      </div>
    </header>

    <main
      class="flex-1 flex flex-col items-center justify-center max-w-5xl mx-auto w-full p-6 relative"
    >
      <!-- Start Phase: Need JD -->
      <div
        v-if="!isReady"
        class="w-full max-w-2xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 p-8 rounded-3xl backdrop-blur-sm mx-auto shadow-2xl"
      >
        <div class="text-center mb-6">
          <h2
            class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 mb-2"
          >
            Initialize Interview
          </h2>
          <p class="opacity-60 text-sm">
            Please provide the Job Description to configure the AI Interviewer.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label
              class="block text-sm font-medium mb-1"
              :class="isDark ? 'text-slate-300' : 'text-slate-700'"
              >Interview Language</label
            >
            <select
              v-model="selectedLanguage"
              class="w-full bg-transparent border border-white/20 rounded-xl p-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm transition-all"
              :class="
                isDark
                  ? 'text-white border-slate-700 bg-slate-900/50'
                  : 'text-slate-800 border-gray-300 bg-white/50'
              "
            >
              <option
                v-for="lang in languages"
                :key="lang"
                :value="lang"
                :class="
                  isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-800'
                "
              >
                {{ lang }}
              </option>
            </select>
          </div>
          <div>
            <label
              class="block text-sm font-medium mb-1"
              :class="isDark ? 'text-slate-300' : 'text-slate-700'"
              >AI Voice</label
            >
            <select
              v-model="selectedVoice"
              class="w-full bg-transparent border border-white/20 rounded-xl p-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm transition-all"
              :class="
                isDark
                  ? 'text-white border-slate-700 bg-slate-900/50'
                  : 'text-slate-800 border-gray-300 bg-white/50'
              "
            >
              <option
                v-for="voice in voices"
                :key="voice.id"
                :value="voice.id"
                :class="
                  isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-800'
                "
              >
                {{ voice.name }} - {{ voice.description }}
              </option>
            </select>
          </div>
        </div>

        <textarea
          v-model="userInput"
          placeholder="Paste Job Description here..."
          class="w-full bg-transparent border border-white/20 rounded-2xl p-5 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm mb-6 min-h-[200px] resize-none transition-all"
          :class="
            isDark
              ? 'text-white border-slate-700 bg-slate-900/50'
              : 'text-slate-800 border-gray-300 bg-white/50'
          "
        ></textarea>

        <button
          @click="startInitialInterview"
          :disabled="isTexting || !userInput"
          class="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-2xl font-bold uppercase tracking-widest text-sm shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transform hover:-translate-y-1 transition-all active:translate-y-0 disabled:opacity-50 disabled:grayscale"
        >
          Start Live Voice Session
        </button>
      </div>

      <!-- Live Voice Wavy Interface -->
      <div
        v-else
        class="flex flex-col items-center justify-center w-full h-full"
      >
        <!-- The Core Visualizer -->
        <div
          class="relative flex items-center justify-center w-64 h-64 md:w-80 md:h-80 my-10"
        >
          <!-- AI Speaking Waves (Blobs/Orbs) -->
          <div
            v-show="isAiSpeaking"
            class="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-500 blur-3xl opacity-50 animate-spin-slow"
          ></div>
          <div
            v-show="isAiSpeaking"
            class="absolute inset-4 rounded-[40%_60%_70%_30%] bg-gradient-to-tr from-purple-400 to-indigo-500 blur-2xl animate-blob opacity-70 mix-blend-screen"
          ></div>
          <div
            v-show="isAiSpeaking"
            class="absolute inset-2 rounded-[60%_40%_30%_70%] bg-gradient-to-bl from-cyan-300 to-blue-500 blur-2xl animate-blob animation-delay-2000 opacity-60 mix-blend-screen"
          ></div>

          <!-- User Recording Waves -->
          <div
            v-show="isRecording"
            class="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-400 to-cyan-400 blur-3xl opacity-50 animate-ping"
          ></div>

          <!-- AI Thinking Indicator -->
          <div
            v-show="isTexting"
            class="absolute inset-6 rounded-full border-[6px] border-t-cyan-500 border-r-purple-500 border-b-transparent border-l-transparent animate-spin opacity-80"
          ></div>

          <!-- Main Microphone Button -->
          <button
            @click="toggleRecording"
            class="relative z-10 w-28 h-28 md:w-36 md:h-36 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(6,182,212,0.15)] transition-all duration-500 overflow-hidden group"
            :class="
              isRecording
                ? 'bg-gradient-to-br from-cyan-500 to-blue-500 text-white scale-110 shadow-cyan-500/50'
                : isDark
                  ? 'bg-slate-800 border border-slate-700 text-cyan-400 hover:border-cyan-500/50'
                  : 'bg-white border border-gray-200 text-cyan-600 hover:border-cyan-400 hover:shadow-cyan-500/20'
            "
          >
            <!-- Hover sheen -->
            <div
              class="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-500 ease-in-out"
            ></div>

            <svg
              v-if="!isRecording"
              xmlns="http://www.w3.org/2000/svg"
              width="56"
              height="56"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="relative z-20 group-hover:scale-110 transition-transform"
            >
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" x2="12" y1="19" y2="22" />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              width="56"
              height="56"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="relative z-20 animate-pulse"
            >
              <rect
                width="10"
                height="10"
                x="7"
                y="7"
                rx="2"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>

        <!-- Status & Subtitles -->
        <div class="text-center max-w-2xl px-6 mt-8">
          <!-- Status Tag -->
          <div
            class="inline-flex items-center justify-center px-4 py-1.5 rounded-full border mb-6 transition-colors shadow-sm"
            :class="
              isAiSpeaking
                ? 'border-purple-500/30 bg-purple-500/10 text-purple-400'
                : isRecording
                  ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400'
                  : isTexting
                    ? 'border-blue-500/30 bg-blue-500/10 text-blue-400'
                    : isDark
                      ? 'border-slate-800 bg-slate-900/50 text-slate-400'
                      : 'border-gray-200 bg-white text-slate-500'
            "
          >
            <span
              v-if="isAiSpeaking"
              class="font-bold tracking-widest text-[10px] uppercase flex items-center gap-2"
            >
              <div
                class="w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping"
              ></div>
              AI is Speaking
            </span>
            <span
              v-else-if="isRecording"
              class="font-bold tracking-widest text-[10px] uppercase flex items-center gap-2"
            >
              <div
                class="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"
              ></div>
              Listening
            </span>
            <span
              v-else-if="isTexting"
              class="font-bold tracking-widest text-[10px] uppercase flex items-center gap-2"
            >
              <div
                class="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"
              ></div>
              Processing
            </span>
            <span
              v-else
              class="font-bold tracking-widest text-[10px] uppercase"
            >
              Standby - Tap Mic To Speak
            </span>
          </div>

          <!-- Subtitles (Last Message) -->
          <div class="min-h-[100px] flex items-center justify-center">
            <Transition
              enter-active-class="transition duration-500 ease-out"
              enter-from-class="opacity-0 translate-y-4"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition duration-300 ease-in"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
              mode="out-in"
            >
              <p
                :key="lastMessageText"
                class="text-xl md:text-2xl font-light leading-relaxed italic transition-colors"
                :class="isDark ? 'text-slate-200' : 'text-slate-700'"
              >
                "{{ lastMessageText }}"
              </p>
            </Transition>
          </div>
        </div>
      </div>
    </main>
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
  background: #cbd5e1;
  border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #334155;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}
.animate-blob {
  animation: blob 7s infinite;
}
.animation-delay-2000 {
  animation-delay: 2s;
}
.animate-spin-slow {
  animation: spin 8s linear infinite;
}
</style>
