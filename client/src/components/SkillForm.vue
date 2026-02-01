<script setup>
import { ref } from "vue";
const data = defineModel("data");
const newSkill = ref("");
const addSkill = () => {
  if (newSkill.value.trim() && !data.value.includes(newSkill.value.trim())) {
    data.value.push(newSkill.value);
    newSkill.value = "";
  }
};
const removeSkill = (index) => {
  data.value = data.value.filter((_, i) => {
    data.value[i] !== data.value[index];
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

    <div class="mb-6 relative z-10">
      <h3 class="text-xl font-bold text-white">Skills</h3>
      <p class="text-sm text-slate-400 mt-1">
        Add technical proficiency and soft skills (e.g., Java, Leadership).
      </p>
    </div>

    <div class="relative z-10">
      <div class="relative group mb-6">
        <div
          class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500"
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
            <path d="M2 12h20" />
            <path d="M12 2v20" />
            <path d="m4.93 4.93 14.14 14.14" />
            <path d="m19.07 4.93-14.14 14.14" />
          </svg>
        </div>

        <input
          type="text"
          placeholder="Type a skill and press Enter..."
          v-model="newSkill"
          @keyup.enter="addSkill"
          class="w-full pl-10 pr-20 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm shadow-inner"
        />

        <button
          @click="addSkill"
          :disabled="!newSkill.trim()"
          class="absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-lg bg-slate-800 hover:bg-cyan-600 text-slate-300 hover:text-white text-xs font-bold transition-all disabled:opacity-50 disabled:hover:bg-slate-800 disabled:cursor-not-allowed flex items-center gap-1"
        >
          Add
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
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
        </button>
      </div>

      <div v-if="data.length > 0" class="flex flex-wrap gap-2">
        <span
          v-for="(skill, index) in data"
          :key="index"
          class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-slate-200 text-sm group hover:border-cyan-500/50 hover:bg-slate-800 transition-all"
        >
          <span class="font-medium">{{ skill }}</span>
          <button
            @click="removeSkill(index)"
            class="p-0.5 rounded-full text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
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
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </span>
      </div>

      <div
        v-else
        class="flex flex-col items-center justify-center py-8 border-2 border-dashed border-slate-700/50 rounded-xl bg-slate-950/30"
      >
        <div class="p-3 rounded-full bg-slate-800/50 text-slate-500 mb-2">
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
          >
            <circle cx="12" cy="12" r="10" />
            <path d="m9 12 2 2 4-4" />
          </svg>
        </div>
        <p class="text-sm text-slate-400">No skills added yet</p>
      </div>
    </div>

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
          Add 6-10 relevant skills. Include a mix of technical ("Hard") skills
          and "Soft" skills like Communication or Leadership.
        </p>
      </div>
    </div>
  </div>
</template>
