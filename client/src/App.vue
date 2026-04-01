<script setup>
import { onMounted, ref } from "vue";
import getUserData from "./composables/useGetData";
import AiChatBox from "./components/AiChatBox.vue";
import useAuth from "../store/auth";
const authStore = useAuth();
onMounted(async () => {
  await getUserData();
});
</script>
<template>
  <router-view></router-view>
  <AiChatBox v-if="authStore.user && authStore.user.role !== 'admin'" />
</template>
