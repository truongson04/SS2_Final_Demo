<script setup>
import { ref } from "vue";
import clientApi from "../configs/api/clientApi";
import { toast } from "vue3-toastify";

const data = defineModel("data");
const isGenerating = ref(false);
const generateSummary = async () => {
  try {
    isGenerating.value = true;
    const prompt = `enhancing my professional summary "${data.value}"`;
    const response = await clientApi.post("/api/ai/enhance-pro-sum", {
      userContent: prompt,
    });
    console.log(response);
    data.value = response.data.enhanceContent;
    toast.success(response.data.message);
  } catch (error) {
    console.log(error);
    toast.error(error?.response?.data?.message || error.message);
  } finally {
    isGenerating.value = false;
  }
};
</script>
<template>
  <div
    class="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6 sm:p-8 relative overflow-hidden"
  >
    <div
      class="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[80px] pointer-events-none"
    ></div>

    <div class="mb-6 relative z-10">
      <h3 class="text-xl font-bold text-white">Professional Summary</h3>
      <p class="text-sm text-slate-400 mt-1">
        Write a short overview of your career history, skills, and value
        proposition.
      </p>
    </div>

    <div class="relative z-10 group">
      <div class="flex justify-between items-end mb-3">
        <label class="text-sm font-medium text-slate-300">
          Summary Content
        </label>

        <button
          :disabled="isGenerating"
          @click="generateSummary"
          type="button"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 hover:border-purple-500/50 hover:from-purple-500/20 hover:to-blue-500/20 transition-all text-xs font-bold text-purple-300 hover:text-purple-200 group/btn"
        >
          <svg
            v-if="isGenerating"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="size-4 text-cyan-400"
          >
            <path
              class="animate-spin origin-center"
              d="M21 12a9 9 0 1 1-6.219-8.56"
            />

            <circle
              cx="12"
              cy="12"
              r="3"
              class="fill-cyan-400 animate-pulse border-none"
              stroke="none"
            />
          </svg>
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
            class="lucide lucide-sparkles text-purple-400 group-hover/btn:animate-pulse"
          >
            <path
              d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"
            />
            <path d="M20 2v4" />
            <path d="M22 4h-4" />
            <circle cx="4" cy="20" r="2" />
          </svg>
          {{ isGenerating ? "Enhancing..." : "AI Enhance" }}
        </button>
      </div>

      <div class="relative group">
        <textarea
          v-model="data"
          rows="6"
          :disabled="isGenerating"
          class="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-slate-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-y leading-relaxed text-sm sm:text-base shadow-inner disabled:cursor-not-allowed"
          placeholder="e.g. Detail-oriented Editorial Assistant with 2+ years of experience..."
        ></textarea>

        <div class="absolute bottom-2 right-2 pointer-events-none opacity-50">
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10 10H0L10 0V10Z" fill="#334155" />
          </svg>
        </div>

        <Transition
          enter-active-class="transition duration-500 ease-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition duration-300 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div
            v-if="isGenerating"
            class="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-xl bg-slate-950/60 backdrop-blur-[3px] border border-cyan-500/30 shadow-[inset_0_0_20px_rgba(6,182,212,0.1)]"
          >
            <div class="relative mb-3">
              <div
                class="w-10 h-10 rounded-full border-2 border-slate-700 border-t-cyan-400 animate-spin"
              ></div>
              <div class="absolute inset-0 flex items-center justify-center">
                <div
                  class="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,211,238,1)]"
                ></div>
              </div>
            </div>

            <p
              class="text-xs font-mono font-bold text-cyan-400 tracking-widest animate-pulse uppercase"
            >
              Enhancing....
            </p>
          </div>
        </Transition>
      </div>
    </div>

    <div
      class="mt-4 flex gap-3 p-4 rounded-lg bg-blue-900/10 border border-blue-500/10"
    >
      <div class="flex-shrink-0 mt-0.5">
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
          class="text-blue-400"
        >
          <path d="M12 2v4" />
          <path d="m16.2 7.8 2.9-2.9" />
          <path d="M18 12h4" />
          <path d="m16.2 16.2 2.9 2.9" />
          <path d="M12 18v4" />
          <path d="m7.8 16.2-2.9 2.9" />
          <path d="M2 12h4" />
          <path d="m7.8 7.8-2.9-2.9" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </div>
      <div>
        <h4
          class="text-xs font-bold text-blue-300 uppercase tracking-wide mb-1"
        >
          Pro Tip
        </h4>
        <p class="text-xs text-slate-400 leading-relaxed">
          Keep it concise (3-4 sentences). Focus on your most relevant
          achievements and skills that match the job description. Use strong
          action verbs.
        </p>
      </div>
    </div>
  </div>
</template>
