<script setup>
defineProps(["isOpen"]);
defineEmits(["close", "confirm"]);
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
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 mt-40"
    >
      <div
        class="relative w-full max-w-sm bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden transform transition-all scale-100"
        @click.stop
      >
        <div
          class="absolute inset-0 opacity-20 bg-[size:20px_20px] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] pointer-events-none"
        ></div>
        <div
          class="absolute -top-10 -right-10 w-32 h-32 bg-red-500/10 rounded-full blur-[50px] pointer-events-none"
        ></div>

        <div class="relative z-10 p-6 text-center">
          <div
            class="mx-auto mb-6 w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.2)]"
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
              class="text-red-500 ml-1"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" x2="9" y1="12" y2="12" />
            </svg>
          </div>

          <h3 class="text-xl font-bold text-white mb-2">End Session?</h3>
          <p class="text-md text-slate-400 leading-relaxed mb-8">
            Are you sure you want to log out ? :((
          </p>

          <div class="flex gap-3">
            <button
              @click="$emit('close')"
              class="flex-1 px-4 py-2.5 rounded-lg border border-slate-700 text-slate-300 font-medium hover:bg-slate-800 hover:text-white hover:border-slate-600 transition-all active:scale-95"
            >
              Cancel
            </button>

            <button
              @click="$emit('confirm')"
              class="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold shadow-lg shadow-red-500/20 hover:shadow-red-500/40 hover:from-red-500 hover:to-pink-500 transition-all active:scale-95 flex items-center justify-center gap-2 group"
            >
              <span>Log Out</span>
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
                class="transition-transform group-hover:translate-x-1"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" x2="9" y1="12" y2="12" />
              </svg>
            </button>
          </div>
        </div>

        <div class="absolute bottom-2 right-2 opacity-50 pointer-events-none">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M10 10H0L10 0V10Z" fill="#334155" />
          </svg>
        </div>
      </div>
    </div>
  </Transition>
</template>
