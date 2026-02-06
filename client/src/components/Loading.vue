<script setup></script>
<template>
  <div
    class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 font-mono"
  >
    <div
      class="absolute inset-0 bg-[url('https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/bg-with-grid.png')] bg-cover bg-center opacity-5 pointer-events-none"
    ></div>
    <div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"
    ></div>

    <div class="relative flex flex-col items-center gap-6 z-10">
      <div class="relative flex items-center justify-center w-24 h-24">
        <div
          class="absolute inset-0 rounded-full border-2 border-slate-800 border-t-cyan-500 animate-spin"
          style="animation-duration: 3s"
        ></div>

        <div
          class="absolute inset-2 rounded-full border-2 border-slate-800 border-b-blue-500 animate-spin"
          style="animation-duration: 1.5s; animation-direction: reverse"
        ></div>

        <div
          class="absolute inset-6 rounded-full border-2 border-transparent border-l-cyan-400 animate-spin"
          style="animation-duration: 0.8s"
        ></div>

        <div
          class="absolute inset-0 flex items-center justify-center animate-pulse"
        >
          <div
            class="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,1)]"
          ></div>
        </div>
      </div>

      <div class="text-center space-y-2">
        <h3 class="text-xl font-bold text-white tracking-[0.2em] animate-pulse">
          INITIALIZING
        </h3>
        <p class="text-xs text-slate-500 uppercase tracking-widest">
          Loading Resources...
        </p>
      </div>
    </div>
  </div>
</template>
