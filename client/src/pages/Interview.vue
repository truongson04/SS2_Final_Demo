<script setup>
import { onMounted, ref, toRaw } from "vue";
import clientApi from "../configs/api/clientApi";
import { useRoute } from "vue-router";
import ResumePreview from "../components/ResumePreview.vue";
import Loading from "../components/Loading.vue";
import { toast } from "vue3-toastify";
const route = useRoute();
const resumeData = ref({});

const { resumeId } = route.params;
const isInterview = ref(false);

const setActive = (index) => {
  questions.value.forEach((q, i) => {
    if (i < index) q.status = "completed";
    else if (i === index) q.status = "active";
    else q.status = "pending";
  });
};
const questions = ref([]);

const getDifficultyColor = (difficulty) => {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "text-green-400 bg-green-400/10 border-green-400/20";
    case "medium":
      return "text-amber-400 bg-amber-400/10 border-amber-400/20";
    case "hard":
      return "text-red-400 bg-red-400/10 border-red-400/20";
    default:
      return "text-slate-400 bg-slate-400/10 border-slate-400/20";
  }
};
const handleStart = async () => {
  isInterview.value = true;

  let cloneResume = structuredClone(toRaw(resumeData.value));

  delete cloneResume.accentColor;
  delete cloneResume.public;
  delete cloneResume.template;
  delete cloneResume.title;
  delete cloneResume.personal_info;
  try {
    const { data } = await clientApi.post("/api/ai/interview", {
      userContent: cloneResume,
    });
    questions.value = JSON.parse(data.questions);
    toast.success(data.message);
  } catch (error) {
    toast.error(error.message);
    console.log(error);
  } finally {
    isInterview.value = false;
  }
};
onMounted(async () => {
  try {
    const { data } = await clientApi.get(`/api/resumes/get/${resumeId}`);
    resumeData.value = data.resume;
  } catch (error) {
    toast.error("Failed to load your resume " + error.message);
  }
});
</script>
<template>
  <Loading v-if="isInterview" />
  <div
    v-else
    class="h-screen bg-slate-950 flex flex-col lg:flex-row overflow-hidden relative font-sans text-slate-300"
  >
    <div
      class="absolute inset-0 bg-[url('https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/bg-with-grid.png')] bg-cover bg-center opacity-5 pointer-events-none"
    ></div>

    <div
      class="w-full lg:w-[45%] h-full flex flex-col border-r border-white/5 bg-slate-900/30 relative z-10"
    >
      <div
        class="h-14 border-b border-white/5 flex items-center px-6 bg-slate-950/80 backdrop-blur"
      >
        <router-link
          :to="`/app/builder/${resumeId}`"
          class="inline-flex gap-2 items-center text-slate-400 hover:text-cyan-400 transition-all group"
        >
          <div
            class="p-1.5 rounded-full bg-slate-900 border border-slate-700 group-hover:border-cyan-500/50 group-hover:bg-cyan-500/10 transition-colors"
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

      <div class="flex-1 overflow-y-auto custom-scrollbar p-6 bg-slate-950/50">
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
      class="w-full lg:w-[55%] h-full flex flex-col bg-slate-950 relative z-20"
    >
      <div
        class="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-slate-900/80 backdrop-blur z-20"
      >
        <h2 class="text-lg font-bold text-white tracking-tight">
          Generated Questions
        </h2>
        <span class="text-xs text-slate-500 font-mono"
          >{{ questions.length }} items</span
        >
      </div>
      <!-- question part  -->
      <div
        v-if="questions.length === 0"
        class="h-full flex flex-col items-center justify-center p-8 text-center relative z-10"
      >
        <div class="relative group mb-8"></div>

        <h2 class="text-3xl font-bold text-white mb-3 tracking-tight">
          Ready for your Interview?
        </h2>

        <p
          class="text-slate-400 max-w-md mx-auto mb-10 leading-relaxed text-sm md:text-base"
        >
          Our AI Interviewer will analyze your resume and generate technical
          questions tailored to your profile.
        </p>

        <button
          @click="handleStart"
          class="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-lg tracking-wide shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all active:scale-95 overflow-hidden"
        >
          <div
            class="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"
          ></div>

          <span class="relative flex items-center gap-3">
            Start Interview
          </span>
        </button>

        <div
          class="mt-8 flex items-center gap-4 text-xs text-slate-500 font-mono"
        >
          <div class="flex items-center gap-1.5">
            <div class="w-1.5 h-1.5 rounded-full bg-green-500"></div>
            AI Ready
          </div>
          <div class="flex items-center gap-1.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6" v-else>
        <div
          v-for="(q, index) in questions"
          :key="q.id"
          class="transition-all duration-300 group"
          @click="setActive(index)"
        >
          <div
            v-if="q.status === 'active'"
            class="relative p-6 rounded-2xl bg-slate-900/90 border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)] backdrop-blur-sm"
          >
            <div
              class="absolute -left-[1px] top-6 bottom-6 w-1 bg-cyan-500 rounded-r-full shadow-[0_0_10px_rgba(6,182,212,0.8)]"
            ></div>

            <div class="flex flex-col gap-4">
              <div class="flex justify-between items-center">
                <div class="flex items-center gap-2">
                  <span
                    class="px-2 py-1 rounded-md bg-slate-800 border border-slate-700 text-[10px] font-bold uppercase tracking-wider text-slate-300"
                  >
                    {{ q.category }}
                  </span>
                  <span class="text-xs font-mono text-cyan-500"
                    >#0{{ index + 1 }}</span
                  >
                </div>

                <span
                  class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border"
                  :class="getDifficultyColor(q.difficulty)"
                >
                  {{ q.difficulty }}
                </span>
              </div>

              <h3
                class="text-lg md:text-xl font-medium text-white leading-relaxed"
              >
                {{ q.question }}
              </h3>

              <div
                class="relative mt-2 p-4 rounded-xl bg-purple-900/10 border border-purple-500/20"
              >
                <div class="flex items-center gap-2 mb-2">
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
                    class="text-purple-400"
                  >
                    <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                    <path d="M12 3v1" />
                    <path d="M12 20v1" />
                    <path d="M3 12h1" />
                    <path d="M20 12h1" />
                    <path d="m18.364 5.636-.707.707" />
                    <path d="m6.343 17.657-.707.707" />
                    <path d="m5.636 5.636.707.707" />
                    <path d="m17.657 17.657.707.707" />
                  </svg>
                  <span
                    class="text-[10px] font-bold text-purple-400 uppercase tracking-widest"
                    >Suggested Answer</span
                  >
                </div>
                <p class="text-sm text-purple-200/80 leading-relaxed italic">
                  "{{ q.suggestedAnswer }}"
                </p>
              </div>
            </div>
          </div>

          <div
            v-else
            class="p-5 rounded-xl border border-white/5 bg-slate-900/40 hover:bg-slate-900/60 transition-colors opacity-70 hover:opacity-100"
            :class="q.status === 'completed' ? 'opacity-50' : ''"
          >
            <div class="flex justify-between items-start mb-2">
              <div class="flex gap-2">
                <span class="text-xs font-mono text-slate-500"
                  >#0{{ index + 1 }}</span
                >
                <span
                  class="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 border border-slate-700 uppercase"
                  >{{ q.category }}</span
                >
              </div>
              <span class="text-[10px] text-slate-500 uppercase">{{
                q.difficulty
              }}</span>
            </div>
            <p class="text-sm text-slate-400 line-clamp-2">{{ q.question }}</p>
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
