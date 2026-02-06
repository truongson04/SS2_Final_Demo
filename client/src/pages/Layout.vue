<script setup>
import useAuth from "../../store/auth.js";
import Navbar from "../components/Navbar.vue";
import Loading from "../components/Loading.vue";
import Login from "../pages/Login.vue";
const authStore = useAuth();
</script>

<template>
  <Loading v-if="authStore.loading" />
  <div class="min-h-screen bg-gray-500" v-if="authStore.user">
    <Navbar />
    <router-view></router-view>
  </div>
  <Login v-else />
</template>
