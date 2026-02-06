<script setup>
import { onMounted } from "vue";
import useAuth from "../store/auth";
import clientApi from "./configs/api/clientApi";
const authStore = useAuth();
const getUserData = async () => {
  const token = localStorage.getItem("token");
  try {
    if (token) {
      const { data } = await clientApi.get("/api/users/data", {
        headers: { Authorization: token },
      });
      if (data.user) {
        authStore.login(token, data.user);
      }
      authStore.loading = false;
    } else {
      authStore.loading = false;
    }
  } catch (error) {
    authStore.loading = false;
    console.log(error);
  }
};
onMounted(() => {
  getUserData();
});
</script>
<template>
  <router-view></router-view>
</template>
