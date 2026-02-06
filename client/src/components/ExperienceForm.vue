<script setup>
import { ref } from "vue";
import clientApi from "../configs/api/clientApi";
import { toast } from "vue3-toastify";

const data = defineModel("data");

const addExperience = () => {
  const newExperience = {
    company: "",
    position: "",
    start_date: "",
    end_date: "",
    description: "",
    is_current: false,
  };

  data.value.push(newExperience);
};

const removeExperience = (index) => {
  const updated = data.value.filter((_, i) => i !== index);
  data.value = updated;
};
const updateExperience = (index, field, value) => {
  data.value[index][field] = value;
};
//AI things
const generatingIndex = ref(-1);
const generateDescription = async (index) => {
  generatingIndex.value = index;
  try {
    const experience = data.value[index];
    const prompt = `enhance this job description ${experience.description} for the position of${experience.position} at ${experience.company}`;
    const response = await clientApi.post("/api/ai/enhance-job-desc", {
      userContent: prompt,
    });
    data.value[index].description = response.data.enhanceContent;
    toast.success(response.data.message);
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  } finally {
    generatingIndex.value = -1;
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

    <div class="mb-8 relative z-10">
      <h3 class="text-xl font-bold text-white">Professional Experience</h3>
      <p class="text-sm text-slate-400 mt-1">
        Highlight your career journey and key achievements.
      </p>
      <div
        class="mt-6 flex gap-3 p-4 rounded-lg bg-blue-900/10 border border-blue-500/10 relative z-10"
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
            Use bullet points to list achievements in the description. Quantify
            results where possible (e.g., "Increased sales by 20%").
          </p>
        </div>
      </div>
    </div>

    <div class="relative z-10">
      <div class="flex justify-between items-center mb-6">
        <label class="text-sm font-medium text-slate-300"> Work History </label>

        <button
          @click="addExperience"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 hover:border-cyan-500/50 hover:from-cyan-500/20 hover:to-blue-500/20 transition-all text-xs font-bold text-cyan-400 hover:text-cyan-300 group shadow-lg shadow-cyan-500/5"
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
            class="transition-transform group-hover:rotate-90"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
          Add Position
        </button>
      </div>

      <div
        v-if="data.length == 0"
        class="flex flex-col items-center justify-center py-12 border-2 border-dashed border-slate-700/50 rounded-xl bg-slate-950/30"
      >
        <div class="p-4 rounded-full bg-slate-800/50 text-slate-500 mb-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M12 12h.01" />
            <path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
            <path d="M22 13a18.15 18.15 0 0 1-20 0" />
            <rect width="20" height="14" x="2" y="6" rx="2" />
          </svg>
        </div>
        <p class="text-slate-400 font-medium">No experience added yet</p>
        <p class="text-xs text-slate-500 mt-1">
          Click the button above to add your first job.
        </p>
      </div>

      <div v-else class="flex flex-col gap-6">
        <div
          v-for="(experience, index) in data"
          :key="index"
          class="group relative bg-slate-950 border border-slate-800 rounded-xl p-5 transition-all hover:border-slate-600"
        >
          <div
            class="flex justify-between items-start mb-4 border-b border-slate-800 pb-3"
          >
            <h4 class="text-sm font-bold text-white flex items-center gap-2">
              <span
                class="flex items-center justify-center w-5 h-5 rounded-full bg-slate-800 text-[10px] text-slate-400 border border-slate-700"
              >
                {{ index + 1 }}
              </span>
              Position Details
            </h4>
            <button
              @click="removeExperience(index)"
              class="text-slate-500 hover:text-red-400 transition-colors p-1 rounded hover:bg-red-400/10"
              title="Remove this position"
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
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div class="space-y-1.5">
              <label class="text-xs text-slate-400 ml-1">Job Title</label>
              <input
                type="text"
                placeholder="e.g. Senior Product Designer"
                v-model="experience.position"
                class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm"
              />
            </div>

            <div class="space-y-1.5">
              <label class="text-xs text-slate-400 ml-1">Company</label>
              <input
                type="text"
                placeholder="e.g. Google Inc."
                v-model="experience.company"
                class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm"
              />
            </div>

            <div class="space-y-1.5">
              <label class="text-xs text-slate-400 ml-1">Start Date</label>
              <input
                type="month"
                v-model="experience.start_date"
                class="w-full px-3 py-2 bg-slate-100 border border-slate-700 rounded-lg text-black placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm"
              />
            </div>

            <div class="space-y-1.5">
              <div class="flex justify-between items-center">
                <label class="text-xs text-slate-400 ml-1">End Date</label>
                <label class="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    v-model="experience.is_current"
                    class="w-3 h-3 rounded bg-slate-100 border-slate-600 text-cyan-500 focus:ring-0 focus:ring-offset-0"
                  />
                  <span
                    class="text-[10px] text-cyan-400 font-medium uppercase tracking-wide"
                    >Current</span
                  >
                </label>
              </div>
              <input
                type="month"
                v-model="experience.end_date"
                :disabled="experience.is_current"
                class="w-full px-3 py-2 bg-slate-100 border border-slate-700 rounded-lg text-black placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div class="space-y-2">
            <div class="flex justify-between items-end">
              <label class="text-xs text-slate-400 ml-1">Description</label>

              <button
                @click="generateDescription(index)"
                :disabled="
                  generatingIndex === index ||
                  !experience.position ||
                  !experience.company
                "
                type="button"
                class="flex items-center gap-1 px-2 py-1 rounded border transition-all text-[10px] font-bold"
                :class="
                  generatingIndex === index
                    ? 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed'
                    : 'bg-purple-500/10 border border-purple-500/20 hover:border-purple-500/40 text-purple-300 hover:text-purple-200'
                "
              >
                <svg
                  v-if="generatingIndex === index"
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="animate-spin"
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-sparkles"
                >
                  <path
                    d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"
                  />
                  <path d="M20 2v4" />
                  <path d="M22 4h-4" />
                  <circle cx="4" cy="20" r="2" />
                </svg>

                {{ generatingIndex === index ? "Generating..." : "AI Writer" }}
              </button>
            </div>

            <div class="relative group">
              <textarea
                v-model="experience.description"
                rows="4"
                :disabled="generatingIndex === index"
                class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm leading-relaxed resize-y disabled:opacity-50"
                placeholder="• Led a team of 5 developers...&#10;• Increased system performance by 20%..."
              ></textarea>

              <Transition
                enter-active-class="transition duration-300 ease-out"
                enter-from-class="opacity-0"
                enter-to-class="opacity-100"
                leave-active-class="transition duration-200 ease-in"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
              >
                <div
                  v-if="generatingIndex === index"
                  class="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-[2px] rounded-lg border border-cyan-500/20"
                >
                  <div class="relative flex items-center justify-center">
                    <div
                      class="w-6 h-6 border-2 border-slate-600 rounded-full"
                    ></div>
                    <div
                      class="absolute w-6 h-6 border-2 border-t-cyan-400 rounded-full animate-spin"
                    ></div>
                    <div
                      class="absolute w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,1)] animate-pulse"
                    ></div>
                  </div>

                  <p
                    class="mt-2 text-[10px] font-bold text-cyan-400 tracking-wider animate-pulse"
                  >
                    WRITING...
                  </p>
                </div>
              </Transition>

              <div
                v-if="generatingIndex !== index"
                class="absolute bottom-2 right-2 pointer-events-none opacity-30"
              >
                <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                  <path d="M10 10H0L10 0V10Z" fill="#94a3b8" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
