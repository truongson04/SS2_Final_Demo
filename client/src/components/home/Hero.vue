<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import useAuth from "../../../store/auth";
import LogoutModal from "../LogoutModal.vue";
const router = useRouter();
const authStore = useAuth();
const showLogout = ref(false);
const showUserMenu = ref(false);
const logoutUser = () => {
  authStore.logout();
  showLogout.value = false;
  showUserMenu.value = false;
  router.push("/");
};

const menuClass = ref(
  "fixed inset-0 z-[100] bg-white/60 text-slate-800 backdrop-blur flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-transform duration-300 -translate-x-full",
);
const openMenu = () => {
  menuClass.value =
    "fixed inset-0 z-[100] bg-white/60 text-slate-800 backdrop-blur flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-transform duration-300 translate-x-0";
};
const closeMenu = () => {
  menuClass.value =
    "fixed inset-0 z-[100] bg-white/60 text-slate-800 backdrop-blur flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-transform duration-300 -translate-x-full";
};
</script>
<template>
  <section
    class="relative min-h-screen flex flex-col bg-slate-950 text-white overflow-hidden"
  >
    <div
      class="absolute inset-0 bg-[url('https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/bg-with-grid.png')] bg-cover bg-center opacity-10 pointer-events-none"
    ></div>

    <div
      class="absolute top-1/4 right-0 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none"
    ></div>

    <nav
      class="z-50 flex items-center justify-between w-full py-6 px-6 md:px-12 lg:px-24 border-b border-white/10 backdrop-blur-md"
    >
      <a href="/" class="flex items-center gap-2">
        <div
          class="h-10 w-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-xl"
        >
          <img src="../../assets/dummy_profile.png" class="object-cover" />
        </div>
        <span class="font-bold text-xl tracking-tight text-white"
          >CVBuilder</span
        >
      </a>

      <div class="hidden md:flex items-center gap-8 font-medium">
        <router-link
          to="/"
          class="text-slate-300 hover:text-cyan-400 transition duration-300"
        >
          Home
        </router-link>

        <a class="text-slate-300 hover:text-cyan-400 transition duration-300">
          Testimonials
        </a>
        <a class="text-slate-300 hover:text-cyan-400 transition duration-300">
          Contact
        </a>
      </div>

      <!-- Logged in: show user menu -->
      <div
        v-if="authStore.user"
        class="hidden md:flex items-center gap-4 relative"
      >
        <button
          @click="router.push('/app')"
          class="px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold hover:from-cyan-400 hover:to-blue-500 transition active:scale-95"
        >
          New CV
        </button>

        <div class="relative">
          <button
            @click="showUserMenu = !showUserMenu"
            class="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 hover:border-cyan-500/50 transition"
          >
            <div
              class="h-8 w-8 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center text-xs font-bold text-white"
            >
              {{ authStore.user?.[0]?.name?.charAt(0).toUpperCase() }}
            </div>
            <span class="text-sm font-medium text-white">{{
              authStore.user?.[0]?.name
            }}</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              class="text-slate-400"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          <Transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="opacity-0 -translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-2"
          >
            <div
              v-if="showUserMenu"
              class="absolute right-0 top-12 w-48 bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
            >
              <button
                @click="
                  router.push('/app');
                  showUserMenu = false;
                "
                class="w-full px-4 py-3 text-left text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition flex items-center gap-2"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <rect width="7" height="9" x="3" y="3" rx="1" />
                  <rect width="7" height="5" x="14" y="3" rx="1" />
                  <rect width="7" height="9" x="14" y="12" rx="1" />
                  <rect width="7" height="5" x="3" y="16" rx="1" />
                </svg>
                My Resumes
              </button>
              <div class="border-t border-white/5"></div>
              <button
                @click="
                  showLogout = true;
                  showUserMenu = false;
                "
                class="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition flex items-center gap-2"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" x2="9" y1="12" y2="12" />
                </svg>
                Logout
              </button>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Not logged in: show Login/Register -->
      <div v-else class="hidden md:flex items-center gap-4">
        <button
          class="hover:text-cyan-400 transition text-slate-300 font-medium px-4"
          @click="router.push('/login')"
        >
          Login
        </button>
        <button
          class="hover:text-cyan-400 transition text-slate-300 font-medium px-4"
          @click="router.push('/signup')"
        >
          Register
        </button>
      </div>

      <button id="open-menu" class="md:hidden text-white" @click="openMenu">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M4 6h16" />
          <path d="M4 12h16" />
          <path d="M4 18h16" />
        </svg>
      </button>
    </nav>

    <logout-modal
      :is-open="showLogout"
      @close="showLogout = false"
      @confirm="logoutUser"
    />

    <div
      id="mobile-navLinks"
      :class="menuClass"
      class="bg-slate-900/95 backdrop-blur-xl border-l border-white/10 text-white"
    >
      <a href="/"> Home </a>

      <a href="/products"> Products </a>

      <a href="/stories"> Stories </a>

      <a href="/pricing"> Pricing </a>

      <button
        id="close-menu"
        class="active:ring-3 active:ring-white aspect-square size-10 p-1 items-center justify-center bg-slate-100 hover:bg-slate-200 transition text-black rounded-md flex"
        @click="closeMenu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-x-icon lucide-x"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
    </div>

    <main
      class="flex-grow flex items-center justify-center px-6 md:px-12 lg:px-24 py-12"
    >
      <div class="grid lg:grid-cols-2 gap-12 items-center max-w-7xl w-full">
        <div class="flex flex-col items-start space-y-8 z-10">
          <a
            href="#"
            class="inline-flex items-center gap-2 border border-cyan-500/30 rounded-full p-1 pr-4 bg-cyan-950/30 backdrop-blur-sm hover:border-cyan-400 transition group"
          >
            <span
              class="bg-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full group-hover:bg-cyan-400 transition"
              >NEW</span
            >
            <p
              class="text-sm font-medium text-cyan-200 flex items-center gap-1"
            >
              AI Resume Analysis
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </p>
          </a>

          <h1
            class="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white"
          >
            Build a
            <span
              class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500"
              >Professional CV</span
            >
            in minutes.
          </h1>

          <p class="text-lg text-slate-400 max-w-lg leading-relaxed">
            Stand out from the crowd with our sleek, dark-themed templates and
            AI-powered suggestions. Land your dream job faster.
          </p>

          <div
            class="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <button
              @click="router.push('/app')"
              class="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-slate-950 hover:bg-cyan-500 font-bold rounded-full px-8 h-12 transition active:scale-95"
            >
              Get started for free
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.166 10h11.667m0 0L9.999 4.165m5.834 5.833-5.834 5.834"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>

          <div class="pt-4 flex items-center gap-4 text-sm text-slate-500">
            <div class="flex -space-x-2">
              <div
                class="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-950"
              ></div>
              <div
                class="w-8 h-8 rounded-full bg-slate-600 border-2 border-slate-950"
              ></div>
              <div
                class="w-8 h-8 rounded-full bg-slate-500 border-2 border-slate-950"
              ></div>
            </div>
            <p>Trusted by 10,000+ job seekers</p>
          </div>
        </div>

        <div class="relative group z-10 flex justify-center lg:justify-end">
          <div
            class="absolute inset-0 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-[20px] blur-2xl opacity-40 group-hover:opacity-60 transition duration-700"
          ></div>

          <div
            class="relative rounded-[20px] bg-slate-900 border border-white/10 p-2 shadow-2xl transform transition duration-500 hover:scale-[1.02] hover:-rotate-1"
          >
            <img
              src="../../assets/demo_CV.png"
              class="w-full max-w-md h-auto rounded-[15px] object-cover shadow-inner"
              alt="Professional CV Template Showcase"
            />

            <div
              class="absolute -bottom-6 -left-6 bg-slate-800/90 backdrop-blur border border-white/10 p-4 rounded-xl shadow-xl animate-bounce"
              style="animation-duration: 3s"
            >
              <div class="flex items-center gap-3">
                <div class="bg-green-500/20 p-2 rounded-lg text-green-400">
                  <svg
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
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div>
                  <p class="text-xs text-slate-400">Status</p>
                  <p class="text-sm font-bold text-white">Hired</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </section>
</template>
<style scoped>
.marquee-inner {
  animation: marqueeScroll 35s linear infinite;
}

@keyframes marqueeScroll {
  0% {
    transform: translateX(0%);
  }

  100% {
    transform: translateX(-50%);
  }
}
</style>
