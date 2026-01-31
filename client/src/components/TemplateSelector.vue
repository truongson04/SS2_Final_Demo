<script setup>
import { ref } from "vue";

const selectedTemplate = defineModel("selectedTemplate");
const isOpen = ref(false);
const templates = [
  {
    id: "classic",
    name: "Classic",
    preview:
      "A clean, traditional resume format with clear sections and professional typography",
  },

  {
    id: "modern",
    name: "Modern",
    preview: "Sleek design with strategic use of color and modern font choices",
  },
  {
    id: "minimal-image",
    name: "Minimal Image",
    preview: "Minimal design with a single image and clean typography",
  },
  {
    id: "minimal",
    name: "Minimal",
    preview: "Ultra-clean design that puts your content font and center",
  },
];
</script>
<template>
  <div class="relative z-50">
    <button
      @click="isOpen = !isOpen"
      class="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 hover:border-cyan-500/50 rounded-lg transition-all duration-300 active:scale-95 group"
      :class="{ 'border-cyan-500/50 text-white bg-slate-700': isOpen }"
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
        class="group-hover:text-cyan-400 transition-colors"
      >
        <rect width="7" height="7" x="3" y="3" rx="1" />
        <rect width="7" height="7" x="14" y="3" rx="1" />
        <rect width="7" height="7" x="14" y="14" rx="1" />
        <rect width="7" height="7" x="3" y="14" rx="1" />
      </svg>
      <span class="text-sm font-medium">Templates</span>
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
        class="ml-1 transition-transform duration-300"
        :class="{ 'rotate-180': isOpen }"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-2 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-2 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute top-full left-0 mt-2 w-80 bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden origin-top-left"
      >
        <div
          class="px-4 py-3 border-b border-white/5 bg-slate-950/80 backdrop-blur-sm"
        >
          <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Select Layout
          </h3>
        </div>

        <div class="p-2 max-h-[400px] overflow-y-auto custom-scrollbar">
          <div class="flex flex-col gap-1">
            <div
              v-for="template in templates"
              :key="template.id"
              @click="
                () => {
                  selectedTemplate = template.id;
                  isOpen = false;
                }
              "
              class="group relative p-3 rounded-lg border cursor-pointer transition-all duration-200"
              :class="
                selectedTemplate === template.id
                  ? 'border-cyan-500/50 bg-cyan-500/10'
                  : 'border-transparent hover:bg-slate-800 hover:border-slate-700'
              "
            >
              <div class="flex gap-3">
                <div
                  class="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-colors border border-white/5"
                  :class="
                    selectedTemplate === template.id
                      ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                      : 'bg-slate-800 text-slate-400 group-hover:text-white'
                  "
                >
                  <svg
                    v-if="template.icon === 'briefcase'"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                  <svg
                    v-else-if="template.icon === 'palette'"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <circle cx="13.5" cy="6.5" r=".5" />
                    <circle cx="17.5" cy="10.5" r=".5" />
                    <circle cx="8.5" cy="7.5" r=".5" />
                    <circle cx="6.5" cy="12.5" r=".5" />
                    <path
                      d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.01 17.489 2 12 2z"
                    />
                  </svg>
                  <svg
                    v-else-if="template.icon === 'book'"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path
                      d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"
                    />
                  </svg>
                  <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <line x1="3" x2="21" y1="9" y2="9" />
                    <line x1="9" x2="9" y1="21" y2="9" />
                  </svg>
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between mb-0.5">
                    <h4
                      class="text-sm font-bold transition-colors"
                      :class="
                        selectedTemplate === template.id
                          ? 'text-cyan-400'
                          : 'text-slate-300 group-hover:text-white'
                      "
                    >
                      {{ template.name }}
                    </h4>
                    <div
                      v-if="selectedTemplate === template.id"
                      class="text-cyan-500"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="3"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    </div>
                  </div>
                  <p
                    class="text-xs text-slate-500 leading-snug line-clamp-2 group-hover:text-slate-400 transition-colors"
                  >
                    {{ template.preview }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
