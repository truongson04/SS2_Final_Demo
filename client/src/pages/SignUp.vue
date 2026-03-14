<script setup>
import { ref } from "vue";
import clientApi from "../configs/api/clientApi";
import useAuth from "../../store/auth";
import { toast } from "vue3-toastify";
import { useRouter } from "vue-router";
import Otp from "./Otp.vue";
const authStore = useAuth();
const router = useRouter();
const handleGoogleSignIn = () => {
  window.location.href = `${import.meta.env.VITE_BASE_URL}/api/users/auth/google`;
};

import LegalModal from "../components/LegalModal.vue";
const showLegalModal = ref(false);
const legalModalType = ref("terms");

const openLegalModal = (type) => {
  legalModalType.value = type;
  showLegalModal.value = true;
};

const showOtp = ref(false);
const formData = ref({
  name: "",
  email: "",
  password: "",
});
const getOtp = async () => {
  try {
    const { data } = await clientApi.post("/api/users/forgot", {
      email: email.value,
      newCheck: true,
    });

    showOtp.value = true;
  } catch (error) {
    toast.error(error.message);
  }
};
const handleSubmit = async () => {
  try {
    const { data } = await clientApi.post(
      "/api/users/register",
      formData.value,
    );

    authStore.login(data.token, data.user);
    localStorage.setItem("token", data.token);

    router.push("/");
    toast.success(data.message);
  } catch (error) {
    console.log(error);
    toast.error(error?.response?.data?.message || error.message, {
      position: "top-center",
    });
  }
};
const handleGithubSignIn = async () => {
  window.location.href = `${import.meta.env.VITE_BASE_URL}/api/users/auth/github`;
};
</script>
<template>
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
      v-if="!showOtp"
      class="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden px-4"
    >
      <div
        class="absolute inset-0 bg-[url('https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/bg-with-grid.png')] bg-cover bg-center opacity-10 pointer-events-none"
      ></div>
      <div
        class="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"
      ></div>
      <div
        class="absolute top-0 left-0 -translate-x-1/3 -translate-y-1/3 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none"
      ></div>

      <div
        class="relative w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 z-10"
      >
        <div class="text-center mb-8">
          <a href="/" class="inline-flex items-center gap-2 mb-4 group">
            <div
              class="h-10 w-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-xl"
            >
              <img src="../assets/dummy_profile.png" class="object-cover" />
            </div>
          </a>
          <h1 class="text-2xl font-bold text-white">Create an Account</h1>
          <p class="text-slate-400 text-sm mt-2">
            Start building your professional career today
          </p>
        </div>

        <form action="#" method="POST" @submit.prevent="getOtp">
          <div class="mb-5 group">
            <label
              for="name"
              class="block text-sm font-medium text-slate-300 mb-1.5"
              >Full Name</label
            >
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <svg
                  class="h-5 w-5 text-slate-500 group-focus-within:text-cyan-400 transition"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="name"
                placeholder="Enter your full name"
                autocomplete="name"
                required
                v-model="formData.name"
                class="w-full pl-10 pr-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 hover:border-slate-500 hover:bg-slate-900/50 transition duration-300 shadow-inner"
              />
            </div>
          </div>

          <div class="mb-5 group">
            <label
              for="email"
              class="block text-sm font-medium text-slate-300 mb-1.5"
              >Email Address</label
            >
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <svg
                  class="h-5 w-5 text-slate-500 group-focus-within:text-cyan-400 transition"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
                  />
                  <path
                    d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"
                  />
                </svg>
              </div>
              <input
                type="email"
                id="email"
                placeholder="name@example.com"
                autocomplete="email"
                required
                v-model="formData.email"
                class="w-full pl-10 pr-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 hover:border-slate-500 hover:bg-slate-900/50 transition duration-300 shadow-inner"
              />
            </div>
          </div>

          <div class="mb-6 group">
            <label
              for="password"
              class="block text-sm font-medium text-slate-300 mb-1.5"
              >Password</label
            >
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <svg
                  class="h-5 w-5 text-slate-500 group-focus-within:text-cyan-400 transition"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                autocomplete="new-password"
                required
                v-model="formData.password"
                class="w-full pl-10 pr-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 hover:border-slate-500 hover:bg-slate-900/50 transition duration-300 shadow-inner"
              />
            </div>
          </div>

          <div class="flex items-start mb-6">
            <div class="flex items-center h-5">
              <input
                id="terms"
                type="checkbox"
                required
                class="h-4 w-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500/20 focus:ring-offset-0"
              />
            </div>
            <label for="terms" class="ml-2 text-sm text-slate-400">
              I agree to the
              <button type="button" @click="openLegalModal('terms')" class="text-cyan-400 hover:underline cursor-pointer focus:outline-none"
                >Terms of Service</button
              >
              and
              <button type="button" @click="openLegalModal('privacy')" class="text-cyan-400 hover:underline cursor-pointer focus:outline-none"
                >Privacy Policy</button
              >.
            </label>
          </div>

          <button
            type="submit"
            class="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition duration-300 transform active:scale-[0.98]"
          >
            Create Account
          </button>
        </form>

        <div class="relative my-8">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-slate-700"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-slate-900 text-slate-500"
              >Or register with</span
            >
          </div>
        </div>

        <div class="flex justify-center gap-4">
          <button
            @click="handleGoogleSignIn"
            type="button"
            class="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-lg text-slate-300 hover:text-white transition duration-300"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span>Google</span>
          </button>

          <button
            @click="handleGithubSignIn"
            type="button"
            class="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-lg text-slate-300 hover:text-white transition duration-300"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span>GitHub</span>
          </button>
        </div>

        <p class="mt-8 text-center text-sm text-slate-500">
          Already have an account?
          <a
            href="/login"
            class="text-cyan-400 hover:text-cyan-300 font-medium hover:underline decoration-cyan-400/50 underline-offset-4"
            >Login</a
          >
        </p>
      </div>
    </div>
    <div
      class="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden px-4"
      v-else
    >
      <div
        class="relative w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 z-10"
      >
        <Otp
          v-model:email="formData.email"
          @back="showOtp = false"
          @verify="
            () => {
              showOtp = false;
              handleSubmit();
            }
          "
          @resend="getOtp"
        />
      </div>
    </div>
  </Transition>
  <LegalModal
    :is-open="showLegalModal"
    :type="legalModalType"
    @close="showLegalModal = false"
  />
</template>
