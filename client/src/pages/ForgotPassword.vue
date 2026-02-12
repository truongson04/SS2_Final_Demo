<script setup>
import { ref } from "vue";

import clientApi from "../configs/api/clientApi";
import { toast } from "vue3-toastify";
import { useRouter } from "vue-router";
import Otp from "./Otp.vue";
import NewPassword from "./NewPassword.vue";

const email = ref("");
const router = useRouter();
const showOtp = ref(false);
const showReset = ref(false);
const isLoading = ref(false);
const getOtp = async () => {
  try {
    isLoading.value = true;
    const { data } = await clientApi.post("/api/users/forgot", {
      email: email.value,
    });

    toast.success(data.message);
    showOtp.value = true;
  } catch (error) {
    toast.error(error.message);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div
    class="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans"
  >
    <div
      class="absolute inset-0 bg-[url('https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/bg-with-grid.png')] bg-cover bg-center opacity-5 pointer-events-none"
    ></div>
    <div
      class="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"
    ></div>
    <div
      class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"
    ></div>

    <div class="w-full max-w-md relative z-10">
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 transform translate-y-4"
        enter-to-class="opacity-100 transform translate-y-0"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 transform translate-y-0"
        leave-to-class="opacity-0 transform translate-y-4"
        mode="out-in"
      >
        <div
          v-if="!showOtp && !showReset"
          class="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl"
        >
          <div class="text-center mb-8">
            <div
              class="w-16 h-16 bg-slate-800 rounded-2xl mx-auto flex items-center justify-center mb-4 border border-white/5 shadow-inner"
            >
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
                class="text-cyan-400"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-white mb-2">Forgot Password?</h2>
            <p class="text-slate-400 text-sm">
              Don't worry! It happens. Please enter the email associated with
              your account.
            </p>
          </div>

          <form @submit.prevent="getOtp" class="space-y-6">
            <div class="space-y-2">
              <label
                class="text-xs font-bold text-slate-300 ml-1 uppercase tracking-wider"
                >Email Address</label
              >
              <div class="relative group">
                <div
                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
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
                    class="text-slate-500 group-focus-within:text-cyan-400 transition-colors"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <input
                  v-model="email"
                  type="email"
                  required
                  class="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all shadow-inner"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <button
              type="submit"
              :disabled="isLoading"
              class="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold tracking-wide shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span
                v-if="isLoading"
                class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
              ></span>
              <span v-else>Send Code</span>
            </button>
          </form>

          <div class="mt-6 text-center">
            <a
              href="/login"
              class="text-sm text-slate-500 hover:text-cyan-400 transition-colors flex items-center justify-center gap-2"
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
              Back to Login
            </a>
          </div>
        </div>
        <div
          v-else-if="!showOtp && showReset"
          class="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl"
        >
          <NewPassword v-model:email="email" />
        </div>
        <div
          v-else-if="showOtp && !showReset"
          class="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl"
        >
          <Otp
            v-model:email="email"
            @back="showOtp = false"
            @verify="
              () => {
                showOtp = false;
                showReset = true;
              }
            "
            @resend="getOtp"
          />
        </div>
      </Transition>
    </div>
  </div>
</template>
