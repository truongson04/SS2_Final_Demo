<script setup>
import { useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import useAuth from "../store/auth";
import getUserData from "../composables/useGetData";
import LogoutModal from "./LogoutModal.vue";
import { useTheme } from "../composables/useTheme";

const authStore = useAuth();
const router = useRouter();
const isOpen = ref(false);

const { isDark, toggleTheme } = useTheme();

const logoutUser = () => {
  authStore.logout();
  isOpen.value = false;
  router.push({
    path: "/",
  });
};
getUserData();
</script>
<template>
  <div
    class="sticky top-0 z-50 w-full backdrop-blur-md border-b transition-all"
    :class="
      isDark
        ? 'bg-slate-950/85 border-white/10'
        : 'bg-white/90 border-slate-200 shadow-sm'
    "
  >
    <nav
      class="flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 transition-all"
    >
      <router-link to="/" class="flex items-center gap-2">
        <div
          class="h-10 w-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-xl"
        >
          <img src="../assets/dummy_profile.png" class="object-cover" />
        </div>
        <span
          class="font-bold text-xl tracking-tight transition-colors"
          :class="isDark ? 'text-white' : 'text-slate-800'"
          >CVBuilder</span
        >
      </router-link>

      <div class="flex items-center gap-3">
        <!-- User info -->
        <div class="flex items-center gap-3">
          <div
            class="h-8 w-8 rounded-full bg-gradient-to-tr flex items-center justify-center text-xs font-bold transition-all"
            :class="isDark ? '' : 'border border-black'"
          >
            <img
              src="../assets/avt.png"
              class="object-cover w-full h-full rounded-full"
            />
          </div>
          <p
            class="text-sm font-medium max-sm:hidden transition-colors"
            :class="isDark ? 'text-slate-300' : 'text-slate-600'"
          >
            Hi,
            <span :class="isDark ? 'text-white' : 'text-slate-800'">{{
              authStore.user?.name
            }}</span>
          </p>
        </div>

        <div
          class="h-5 w-px hidden sm:block transition-colors"
          :class="isDark ? 'bg-white/10' : 'bg-slate-200'"
        ></div>

        <button
          @click="toggleTheme"
          :title="isDark ? 'Change to light mode' : 'Change to dark mode'"
          class="relative h-9 w-9 rounded-full flex items-center justify-center transition-all active:scale-90 focus:outline-none"
          :class="
            isDark
              ? 'bg-slate-800 border border-white/10 text-yellow-300 hover:bg-slate-700 hover:border-yellow-400/30'
              : 'bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200 hover:border-slate-300'
          "
        >
          <!-- Sun icon (shown in dark mode) -->
          <svg
            v-if="isDark"
            xmlns="http://www.w3.org/2000/svg"
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="4"></circle>
            <path d="M12 2v2"></path>
            <path d="M12 20v2"></path>
            <path d="m4.93 4.93 1.41 1.41"></path>
            <path d="m17.66 17.66 1.41 1.41"></path>
            <path d="M2 12h2"></path>
            <path d="M20 12h2"></path>
            <path d="m6.34 17.66-1.41 1.41"></path>
            <path d="m19.07 4.93-1.41 1.41"></path>
          </svg>
          <!-- Moon icon (shown in light mode) -->
          <svg
            v-else
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
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
          </svg>
        </button>

        <div
          class="h-5 w-px hidden sm:block transition-colors"
          :class="isDark ? 'bg-white/10' : 'bg-slate-200'"
        ></div>

        <!-- Logout Button -->
        <button
          @click="isOpen = true"
          class="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm transition-all active:scale-95 bg-red-500 font-bold text-white hover:bg-red-900"
        >
          <span>Logout</span>
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
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" x2="9" y1="12" y2="12"></line>
          </svg>
        </button>
      </div>
      <logout-modal
        :is-open="isOpen"
        @close="isOpen = false"
        @confirm="logoutUser"
      />
    </nav>
  </div>
</template>
