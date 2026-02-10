<script setup>
import { onMounted, ref, toRaw } from "vue";
import { useRoute } from "vue-router";
import ResumePreview from "../components/ResumePreview.vue";
import { toast } from "vue3-toastify";
import clientApi from "../configs/api/clientApi";
import Loading from "../components/Loading.vue";
const route = useRoute();
const { resumeId } = route.params;
const resumeData = ref({});
const isGenerating = ref(false);

const analysisResult = ref(null);

const getScoreColor = (score) => {
  if (score >= 80) return "text-green-400 border-green-500 shadow-green-500/50";
  if (score >= 60)
    return "text-yellow-400 border-yellow-500 shadow-yellow-500/50";
  return "text-red-400 border-red-500 shadow-red-500/50";
};
const handleStart = async () => {
  isGenerating.value = true;
  let cloneResume = structuredClone(toRaw(resumeData.value));

  delete cloneResume.accentColor;
  delete cloneResume.public;
  delete cloneResume.template;
  delete cloneResume.title;
  delete cloneResume.personal_info;
  try {
    const { data } = await clientApi.post("/api/ai/analysis", {
      userContent: cloneResume,
    });
    analysisResult.value = JSON.parse(data.analysis);
    toast.success(data.message);
  } catch (error) {
    toast.error(error.message);

    console.log(error);
  } finally {
    isGenerating.value = false;
  }
};
onMounted(async () => {
  try {
    isGenerating.value = true;
    const { data } = await clientApi.get(`/api/resumes/get/${resumeId}`);
    resumeData.value = data.resume;
  } catch (error) {
    toast.error("Failed to load your resume " + error.message);
  } finally {
    isGenerating.value = false;
  }
});
</script>
<template>
  <Loading v-if="isGenerating" />

  <div
    class="h-screen bg-slate-950 flex flex-col lg:flex-row overflow-hidden relative font-sans text-slate-300"
  >
    <div
      class="absolute inset-0 bg-[url('https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/bg-with-grid.png')] bg-cover bg-center opacity-5 pointer-events-none"
    ></div>

    <div
      class="w-full lg:w-[40%] h-full flex flex-col border-r border-white/5 bg-slate-900/30 relative z-10"
    >
      <div
        class="h-14 border-b border-white/5 flex items-center px-6 bg-slate-950/80 backdrop-blur"
      >
        <router-link
          :to="`/app/builder/${resumeId}`"
          class="inline-flex gap-2 items-center text-slate-400 hover:text-cyan-400 transition-all group mr-10"
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
          class="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2"
        >
          Original Resume
        </h2>
      </div>
      <div class="flex-1 overflow-y-auto custom-scrollbar p-6 bg-slate-950/50">
        <div class="flex flex-col items-center min-h-full">
          <div
            class="relative w-full max-w-[21cm] origin-top transform scale-[0.8] xl:scale-[0.9] transition-transform duration-300"
          >
            <div
              class="bg-white text-black shadow-2xl rounded-sm overflow-hidden ring-1 ring-white/10 min-h-[29.7cm]"
            >
              <ResumePreview
                v-model:data="resumeData"
                v-model:template="resumeData.template"
                v-model:accent-color="resumeData.accent_color"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- screen before start  -->
    <div
      v-if="!analysisResult"
      class="h-full w-[55%] flex flex-col items-center justify-center p-8 text-center relative z-10"
    >
      <div
        class="relative group mb-10 flex flex-col items-center justify-center"
      >
        <div
          class="absolute inset-0 bg-cyan-500/20 rounded-full blur-2xl group-hover:bg-cyan-500/30 transition-all duration-500 animate-pulse"
        ></div>

        <div
          class="absolute inset-0 bg-slate-800/50 rounded-2xl -rotate-6 scale-90 z-0 group-hover:rotate-0 transition-all duration-300"
        ></div>

        <div
          class="relative w-28 h-28 bg-slate-900 rounded-2xl rotate-3 flex items-center justify-center border border-white/10 shadow-[0_0_30px_rgba(6,182,212,0.15)] group-hover:rotate-0 group-hover:scale-105 transition-all duration-300 ease-out z-10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="text-slate-300 group-hover:text-white transition-colors"
          >
            <path
              d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"
            />
            <polyline points="14 2 14 8 20 8" />
            <line x1="8" x2="16" y1="13" y2="13" class="text-cyan-500/50" />
            <line x1="8" x2="16" y1="17" y2="17" class="text-cyan-500/50" />
            <line x1="10" x2="8" y1="9" y2="9" class="text-cyan-500/50" />
          </svg>

          <div
            class="absolute -bottom-3 -right-3 w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30 border border-white/20 group-hover:-translate-y-1 transition-transform duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="text-white"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
        </div>
      </div>

      <h2
        class="text-3xl md:text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-slate-400 mb-4 tracking-tight"
      >
        Resume Audit AI
      </h2>

      <p
        class="text-slate-400 text-center max-w-md mx-auto mb-10 leading-relaxed text-sm md:text-base"
      >
        Our advanced AI will scan your resume for ATS compatibility, highlight
        strengths, and identify areas for improvement.
      </p>

      <button
        @click="handleStart"
        class="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-lg tracking-wide shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all active:scale-95 overflow-hidden mx-auto"
      >
        <div
          class="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"
        ></div>

        <span class="relative flex items-center justify-center gap-3">
          Start Analysis
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="transition-transform group-hover:translate-x-1"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </span>
      </button>

      <div
        class="mt-10 inline-flex items-center justify-center gap-6 px-5 py-2 rounded-full bg-slate-900/50 border border-white/5 backdrop-blur-sm mx-auto"
      >
        <div class="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <span class="relative flex h-2 w-2">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"
            ></span>
            <span
              class="relative inline-flex rounded-full h-2 w-2 bg-green-500"
            ></span>
          </span>
          AI Model Ready
        </div>

        <div class="w-px h-3 bg-slate-700"></div>

        <div class="flex items-center gap-2 text-xs text-slate-400 font-mono">
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
            class="text-cyan-500"
          >
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 21h5v-5" />
          </svg>
          Instant Result
        </div>
      </div>
    </div>
    <!-- result part  -->
    <div
      v-else
      class="w-full lg:w-[60%] h-full flex flex-col bg-slate-950 relative z-20"
    >
      <div
        class="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-slate-900/80 backdrop-blur z-20"
      >
        <h2
          class="text-lg font-bold text-white tracking-tight flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="text-cyan-400"
          >
            <path d="M2 12h5" />
            <path d="M17 12h5" />
            <path d="M7 12a5 5 0 0 1 5-5" />
            <path d="M12 17a5 5 0 0 1-5-5" />
            <line x1="12" x2="12" y1="2" y2="4" />
            <line x1="12" x2="12" y1="20" y2="22" />
          </svg>
          AI Resume Audit
        </h2>
      </div>

      <div class="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8">
        <div class="max-w-4xl mx-auto space-y-8">
          <div
            class="relative p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900 border border-white/10 shadow-2xl flex items-center justify-between overflow-hidden"
          >
            <div
              class="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none"
            ></div>

            <div>
              <h3
                class="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1"
              >
                ATS Compatibility Score
              </h3>
              <p class="text-2xl font-bold text-white mb-2">Overall Quality</p>
              <p class="text-slate-500 text-sm max-w-sm">
                {{ analysisResult.summary }}
              </p>
            </div>

            <div
              class="relative w-24 h-24 flex items-center justify-center rounded-full border-4 bg-slate-950 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
              :class="getScoreColor(analysisResult.score)"
            >
              <span class="text-3xl font-bold font-mono">{{
                analysisResult.score
              }}</span>
              <div
                class="absolute -bottom-6 text-[10px] font-bold uppercase text-slate-500 tracking-widest"
              >
                / 100
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              class="p-6 rounded-2xl bg-slate-900/50 border border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.05)] relative"
            >
              <div class="flex items-center gap-2 mb-4">
                <h3 class="font-bold text-lg text-green-500">Strengths</h3>
                <img
                  width="60px"
                  height="60px"
                  class="absolute top-0 right-0"
                  src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExb2x6a2RjZW90M205ZTl6eHoxdm5xZ2ttcjJnNHhpMjlxZGZxYmdlcSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/EptlvewQKXPfX7bzSY/giphy.gif"
                />
              </div>
              <ul class="space-y-3">
                <li
                  v-for="(item, i) in analysisResult.strengths"
                  :key="i"
                  class="flex gap-3 text-sm text-slate-300"
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
                    class="text-green-500 flex-shrink-0 mt-0.5"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {{ item }}
                </li>
              </ul>
            </div>

            <div
              class="p-6 rounded-2xl bg-slate-900/50 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.05)] relative"
            >
              <div class="flex items-center gap-2 mb-4">
                <h3 class="font-bold text-red-500 text-lg">Areas to Improve</h3>
                <img
                  width="60px"
                  height="60px"
                  class="absolute top-0 right-0"
                  src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExejFodmhhMjNtNmlueG5uMjRuaGEycTl2cGRkemRlMWdlMG9zZnBoaCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/HdIUvOZyI3Z0JmAi8O/giphy.gif"
                />
              </div>
              <ul class="space-y-3">
                <li
                  v-for="(item, i) in analysisResult.weaknesses"
                  :key="i"
                  class="flex gap-3 text-sm text-slate-300"
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
                    class="text-red-500 flex-shrink-0 mt-0.5"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  {{ item }}
                </li>
              </ul>
            </div>
          </div>

          <div
            class="relative p-6 rounded-2xl bg-slate-900 border border-cyan-500/30 overflow-hidden"
          >
            <div
              class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 to-blue-600"
            ></div>

            <div class="flex items-center gap-2 mb-4 relative">
              <div
                class="w-20 h-20 rounded-lg bg-cyan-500/10 flex items-center justify-center mr-5"
              >
                <img
                  style="object-fit: cover"
                  src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExbHpwZzV4aTh0eXF3ejBiZGg0bWk5bmg0ODlpeTZjaGZsZDkxeW12NCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/2IudUHdI075HL02Pkk/giphy.gif"
                />
              </div>
              <h3 class="font-bold text-white text-lg">Recommended Actions</h3>
            </div>

            <div class="space-y-4">
              <div
                v-for="(item, i) in analysisResult.improvements"
                :key="i"
                class="flex gap-4 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors border border-white/5"
              >
                <div
                  class="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold border border-cyan-500/30"
                >
                  {{ i + 1 }}
                </div>
                <p class="text-sm text-slate-300 leading-relaxed">{{ item }}</p>
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
