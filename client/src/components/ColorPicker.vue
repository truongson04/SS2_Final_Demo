<script setup>
import { ref } from "vue";
const selectedColor = defineModel("selectedColor");
const colors = [
  { name: "Blue", value: "#3b82f6" },
  { name: "Cyan", value: "#06b6d4" },
  { name: "Emerald", value: "#10b981" },
  { name: "Purple", value: "#8b5cf6" },
  { name: "Pink", value: "#ec4899" },
  { name: "Orange", value: "#f97316" },
  { name: "Yellow", value: "#eab308" },
  { name: "Red", value: "#ef4444" },
  { name: "Slate", value: "#64748b" },
  { name: "Black", value: "#000000" },
  { name: "None", value: "#ffff" },
];
const isOpen = ref(false);
</script>
<template>
  <div class="relative">
    <button
      @click="isOpen = !isOpen"
      class="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 hover:border-cyan-500/50 rounded-lg transition-all duration-300 active:scale-95 group"
      :class="{ 'border-cyan-500/50 text-white bg-slate-700': isOpen }"
    >
      <div
        class="w-5 h-5 rounded-full border border-white/10 shadow-sm"
        :style="{ backgroundColor: selectedColor || '#3b82f6' }"
      ></div>

      <span class="text-sm font-medium">Accent</span>

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
        class="absolute top-full left-0 mt-2 w-64 bg-slate-900 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden origin-top-left"
      >
        <div
          class="px-4 py-3 border-b border-white/5 bg-slate-950/80 backdrop-blur-sm"
        >
          <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Select Color
          </h3>
        </div>

        <div class="p-4 grid grid-cols-5 gap-3">
          <button
            v-for="color in colors"
            :key="color.value"
            @click="
              () => {
                selectedColor = color.value;
                isOpen = false;
              }
            "
            class="group relative w-8 h-8 rounded-full cursor-pointer transition-transform hover:scale-110 focus:outline-none"
            :class="{
              'ring-2 ring-white ring-offset-2 ring-offset-slate-900':
                selectedColor === color.value,
            }"
            :style="{ backgroundColor: color.value }"
            :title="color.name"
          >
            <span
              v-if="selectedColor === color.value"
              class="absolute inset-0 flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="text-white drop-shadow-md"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </span>
          </button>
        </div>

        <div class="px-4 pb-4 pt-2 border-t border-white/5">
          <div
            class="flex items-center gap-2 bg-slate-950 rounded-lg border border-slate-700 px-3 py-1.5 focus-within:border-cyan-500 transition-colors"
          >
            <span class="text-slate-500 text-xs">#</span>
            <input
              type="text"
              :value="selectedColor"
              @input="$emit('update:selectedColor', $event.target.value)"
              class="bg-transparent text-xs text-white focus:outline-none w-full font-mono uppercase"
              placeholder="HEX"
            />
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
