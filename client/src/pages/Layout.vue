<script setup>
import useAuth from "../../store/auth.js";
import Navbar from "../components/Navbar.vue";
import Loading from "../components/Loading.vue";
import Login from "../pages/Login.vue";
import { useRoute, useRouter } from "vue-router";
import { onMounted } from "vue";
import clientApi from "../configs/api/clientApi.js";
import { useTheme } from "../composables/useTheme.js";

const authStore = useAuth();
const route = useRoute();
const router = useRouter();

const { isDark, initTheme } = useTheme();

onMounted(async () => {
  initTheme();

  const token = route.query.token;

  if (token) {
    authStore.loading = true;
    localStorage.setItem("token", token);
    try {
      const { data } = await clientApi.get("/api/users/data");

      authStore.login(token, data.user);
      router.replace("/");
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      authStore.loading = false;
      router.push("/");
    }
  } else {
    router.push("/app");
  }
});
</script>

<template>
  <Loading v-if="authStore.loading" />

  <div
    v-if="authStore.user"
    class="min-h-screen relative font-sans selection:bg-cyan-500/30 transition-colors duration-300"
    :class="
      isDark ? 'bg-slate-950 text-slate-300' : 'bg-slate-50 text-slate-700'
    "
  >
    <!-- Global Background Grid & Orbs for authenticated app -->
    <div
      class="fixed inset-0 bg-cover bg-center pointer-events-none z-0 transition-opacity duration-300"
      :class="isDark ? 'opacity-5' : 'opacity-[0.03]'"
      style="
        background-image: url(&quot;https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/bg-with-grid.png&quot;);
      "
    ></div>
    <div
      class="fixed top-20 right-0 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none z-0 transition-colors duration-300"
      :class="isDark ? 'bg-cyan-500/10' : 'bg-cyan-400/5'"
    ></div>
    <div
      class="fixed bottom-0 left-20 w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none z-0 transition-colors duration-300"
      :class="isDark ? 'bg-blue-600/10' : 'bg-blue-400/5'"
    ></div>

    <div class="relative z-10 min-h-screen flex flex-col">
      <Navbar />
      <div class="flex-grow">
        <router-view></router-view>
      </div>
    </div>
  </div>
  <Login v-else />
</template>
