<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["back", "continue"]);
</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4"
    >
      <div
        class="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden transform transition-all scale-100"
        @click.stop
      >
        <div
          class="absolute inset-0 opacity-20 bg-[size:20px_20px] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] pointer-events-none"
        ></div>
        <div
          class="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-[50px] pointer-events-none"
        ></div>

        <div class="relative z-10 p-6">
          <div
            class="mx-auto mb-5 w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.2)]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="text-amber-500 animate-[pulse_2s_infinite]"
            >
              <path
                d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"
              />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
          </div>

          <div class="text-center mb-8">
            <h3 class="text-xl font-bold text-white mb-2">Beware</h3>
            <p class="text-sm text-slate-400 leading-relaxed">
              Make sure remember to save your changes before you leave,
            </p>
          </div>

          <div class="flex flex-col gap-3">
            <button
              @click="$emit('back')"
              class="w-full py-3 rounded-xl border hover:bg-red-500/10 hover:border-red-500/50 font-medium transition-all active:scale-[0.98] flex items-center justify-center gap-2"
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
                <path
                  d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"
                />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              Comeback to save changes
            </button>

            <button
              @click="$emit('continue')"
              class="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold shadow-lg shadow-cyan-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>
