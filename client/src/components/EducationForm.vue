<script setup>
const data = defineModel("data");
const addEducation = () => {
  const newEducation = {
    institution: "",
    degree: "",
    field: "",
    graduation_date: "",
    gpa: "",
  };
  data.value.push(newEducation);
};
const removeEducation = (index) => {
  data.value = data.value.filter((_, i) => {
    return data.value[i] !== data.value[index];
  });
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
      <h3 class="text-xl font-bold text-white">Education</h3>
      <p class="text-sm text-slate-400 mt-1">
        Add details about your academic background.
      </p>
    </div>

    <div class="relative z-10">
      <div class="flex justify-between items-center mb-6">
        <label class="text-sm font-medium text-slate-300">
          Academic History
        </label>

        <button
          @click="addEducation"
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
          Add Education
        </button>
      </div>

      <div
        v-if="data.length === 0"
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
            <path
              d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"
            />
            <path d="M22 10v6" />
            <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
          </svg>
        </div>
        <p class="text-slate-400 font-medium">No education listed</p>
        <p class="text-xs text-slate-500 mt-1">
          Click the button above to add your degree.
        </p>
      </div>

      <div v-else class="flex flex-col gap-6">
        <div
          v-for="(education, index) in data"
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
              Education Details
            </h4>
            <button
              @click="removeEducation(index)"
              class="text-slate-500 hover:text-red-400 transition-colors p-1 rounded hover:bg-red-400/10"
              title="Remove this item"
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

          <div>
            <div class="space-y-1.5">
              <label class="text-xs text-slate-400 ml-1">Degree</label>
              <input
                type="text"
                placeholder="e.g. Bachelor of Science"
                v-model="education.degree"
                class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm"
              />
            </div>

            <div class="space-y-1.5">
              <label class="text-xs text-slate-400 ml-1"
                >Institution / University</label
              >
              <input
                type="text"
                placeholder="e.g. Hanoi University"
                v-model="education.institution"
                class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm"
              />
            </div>

            <div class="space-y-1.5">
              <label class="text-xs text-slate-400 ml-1">Field of Study</label>
              <input
                type="text"
                placeholder="e.g. Computer Science"
                v-model="education.field"
                class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm"
              />
            </div>

            <div>
              <div class="space-y-1.5">
                <label class="text-xs text-slate-400 ml-1"
                  >Graduation Date</label
                >
                <input
                  type="month"
                  v-model="education.graduation_date"
                  class="w-full px-3 py-2 bg-white border border-slate-700 rounded-lg text-black placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm"
                />
              </div>
              <div class="space-y-1.5">
                <label class="text-xs text-slate-400 ml-1"
                  >GPA (Optional)</label
                >
                <input
                  type="text"
                  placeholder="e.g. 3.8/4.0"
                  v-model="education.gpa"
                  class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
