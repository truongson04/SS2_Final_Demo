<script setup>
import useAuth from "../../store/auth.js";
import Navbar from "../components/Navbar.vue";
import Loading from "../components/Loading.vue";
import Login from "../pages/Login.vue";
import { useRoute, useRouter } from "vue-router";
import { onMounted } from "vue";
import clientApi from "../configs/api/clientApi.js";

const authStore = useAuth();
const route = useRoute();
const router = useRouter();

onMounted(async () => {
  const token = route.query.token;
  console.log(authStore.user);

  if (token) {
    authStore.loading = true;
    localStorage.setItem("token", token);
    try {
      const { data } = await clientApi.get("/api/users/data");

      authStore.login(token, data.user);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      authStore.loading = false;
    }
  } else {
    router.push("/app");
  }
});
</script>

<template>
  <Loading v-if="authStore.loading" />
  <div v-if="authStore.user" class="min-h-screen bg-slate-950 relative overflow-hidden font-sans text-slate-300 selection:bg-cyan-500/30">
    <!-- Global Background Grid & Orbs for authenticated app -->
    <div class="fixed inset-0 bg-[url('https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/bg-with-grid.png')] bg-cover bg-center opacity-5 pointer-events-none z-0"></div>
    <div class="fixed top-20 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
    <div class="fixed bottom-0 left-20 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
    
    <div class="relative z-10 min-h-screen flex flex-col">
      <Navbar />
      <div class="flex-grow">
        <router-view></router-view>
      </div>
    </div>
  </div>
  <Login v-else />
</template>
