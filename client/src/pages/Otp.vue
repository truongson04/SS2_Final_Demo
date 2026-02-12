<script setup>
import { ref } from "vue";
import clientApi from "../configs/api/clientApi";
import { toast } from "vue3-toastify";
const otp = ref("");
const isLoading = ref(false);
const email = defineModel("email");
const emit = defineEmits(["back", "verify", "resend"]);
const handleSend = async () => {
  try {
    const { data } = await clientApi.post("/api/users/otp", {
      email: email.value,
      otp: otp.value,
    });

    emit("verify");
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
};
</script>

<template>
  <div class="w-full text-center">
    <div class="mb-8">
      <div
        class="w-16 h-16 bg-slate-800 rounded-2xl mx-auto flex items-center justify-center mb-4 border border-white/5 shadow-[0_0_15px_rgba(6,182,212,0.1)] relative group"
      >
        <span class="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
          <span
            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"
          ></span>
          <span
            class="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"
          ></span>
        </span>

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
          class="text-cyan-400 group-hover:scale-110 transition-transform"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      </div>

      <h2 class="text-2xl font-bold text-white mb-2">
        Enter Verification Code
      </h2>
      <p class="text-slate-400 text-sm">
        We have sent a code to <br />
        <span
          class="text-cyan-400 font-mono font-bold bg-cyan-900/20 px-2 py-0.5 rounded border border-cyan-500/20"
          >{{ email }}</span
        >
      </p>
    </div>

    <div class="space-y-6">
      <div class="relative group">
        <input
          v-model="otp"
          type="text"
          maxlength="6"
          placeholder="000000"
          class="w-full bg-slate-950 border-2 border-slate-700 rounded-xl py-4 text-center text-3xl text-white font-mono tracking-[0.5em] placeholder-slate-800 focus:outline-none focus:border-cyan-500 focus:ring-0 transition-all shadow-inner"
          @keyup.enter="handleSend"
        />
        <div
          class="text-[10px] text-slate-500 mt-2 uppercase tracking-widest font-mono"
        >
          Enter 6-digit Security Code
        </div>
      </div>

      <button
        @click="handleSend"
        :disabled="isLoading || otp.length < 6"
        class="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold tracking-wide shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <span
          v-if="isLoading"
          class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
        ></span>
        <span v-else>Verify Code</span>
      </button>
    </div>

    <div class="mt-8 flex flex-col gap-4 text-sm">
      <p class="text-slate-500">
        Didn't receive the email?
        <button
          @click="emit('resend')"
          class="text-cyan-400 font-bold hover:text-cyan-300 transition-colors hover:underline"
        >
          Click to resend
        </button>
      </p>

      <button
        @click="emit('back')"
        class="text-slate-500 hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto"
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
          <path d="m15 18-6-6 6-6" />
        </svg>
        Change Email Address
      </button>
    </div>
  </div>
</template>
