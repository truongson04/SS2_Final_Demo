<script setup>
import { toast } from "vue3-toastify";
import clientApi from "../configs/api/clientApi";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const email = defineModel("email");
const newPassword = ref("");
const confirmPassword = ref("");
const isLoading = ref(false);
const strength = computed(() => {
  if (!newPassword.value) return 0;
  if (newPassword.value.length < 6) return 1;
  if (newPassword.value.length < 10) return 2;
  return 3;
});
const handleReset = async () => {
  console.log(newPassword.value);
  console.log(confirmPassword.value);
  if (newPassword.value !== confirmPassword.value) {
    toast.error("Passwords do not match.");
    return;
  }
  try {
    isLoading.value = true;
    const { data } = await clientApi.post("/api/users/reset", {
      email: email.value,
      newPassword: newPassword.value,
    });
    toast.success(data.message);
    router.replace("/login");
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  } finally {
    isLoading.value = false;
  }
};
</script>
<template>
  <div class="w-full max-w-md mx-auto">
    <div class="text-center mb-8">
      <div
        class="w-16 h-16 bg-slate-800 rounded-2xl mx-auto flex items-center justify-center mb-4 border border-white/5 shadow-[0_0_20px_rgba(16,185,129,0.15)] relative"
      >
        <div
          class="absolute inset-0 bg-emerald-500/20 rounded-2xl blur-xl opacity-50"
        ></div>

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
          class="text-emerald-400 relative z-10"
        >
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>

      <h2 class="text-2xl font-bold text-white mb-2">Secure Your Account</h2>
      <p class="text-slate-400 text-sm">
        Create a new, strong password to protect your digital identity.
      </p>
    </div>

    <div class="space-y-5">
      <div class="space-y-2">
        <label
          class="text-xs font-bold text-slate-300 ml-1 uppercase tracking-wider"
          >New Password</label
        >
        <div class="relative group">
          <input
            v-model="newPassword"
            :type="showPassword ? 'text' : 'password'"
            class="w-full pl-4 pr-12 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all shadow-inner"
            placeholder="••••••••"
          />
          <button
            @click="showPassword = !showPassword"
            type="button"
            class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-white transition-colors"
          >
            <svg
              v-if="!showPassword"
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
              <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
              <path
                d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"
              />
              <path
                d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"
              />
              <line x1="2" x2="22" y1="2" y2="22" />
            </svg>
            <svg
              v-else
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
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        </div>

        <div
          class="flex gap-1 h-1 mt-1 overflow-hidden rounded-full bg-slate-800"
        >
          <div
            class="h-full transition-all duration-300"
            :class="
              strength >= 1 ? 'bg-red-500 flex-1' : 'bg-transparent flex-1'
            "
          ></div>
          <div
            class="h-full transition-all duration-300"
            :class="
              strength >= 2 ? 'bg-yellow-500 flex-1' : 'bg-transparent flex-1'
            "
          ></div>
          <div
            class="h-full transition-all duration-300"
            :class="
              strength >= 3 ? 'bg-emerald-500 flex-1' : 'bg-transparent flex-1'
            "
          ></div>
        </div>
        <p
          class="text-[10px] text-right font-mono uppercase"
          :class="{
            'text-red-500': strength === 1,
            'text-yellow-500': strength === 2,
            'text-emerald-500': strength === 3,
            'text-slate-600': strength === 0,
          }"
        >
          {{
            strength === 0
              ? "Empty"
              : strength === 1
                ? "Weak"
                : strength === 2
                  ? "Medium"
                  : "Strong"
          }}
        </p>
      </div>

      <div class="space-y-2">
        <label
          class="text-xs font-bold text-slate-300 ml-1 uppercase tracking-wider"
          >Confirm Password</label
        >
        <div class="relative group">
          <input
            v-model="confirmPassword"
            type="password"
            class="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all shadow-inner"
            :class="{
              'border-red-500 focus:border-red-500 focus:ring-red-500': error,
            }"
            placeholder="••••••••"
          />
        </div>
      </div>

      <button
        @click="handleReset"
        :disabled="isLoading"
        class="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold tracking-wide shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <span
          v-if="isLoading"
          class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
        ></span>
        <span v-else>Update Password</span>
      </button>
    </div>
  </div>
</template>
