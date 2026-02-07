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

  if (token) {
    authStore.loading = true;
    localStorage.setItem("token", token);
    try {
      const { data } = await clientApi.get("/api/users/data");

      authStore.login(token, data.user);
      router.replace("/app");
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      authStore.loading = false;
      router.push("/app");
    }
  } else {
    router.push("/app");
  }
});
</script>

<template>
  <Loading v-if="authStore.loading" />
  <div class="min-h-screen bg-gray-500" v-if="authStore.user">
    <Navbar />
    <router-view></router-view>
  </div>
  <Login v-else />
</template>
