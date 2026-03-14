<script setup>
import { onMounted } from "vue";
import getUserData from "./composables/useGetData";
import AiChatBox from "./components/AiChatBox.vue";

onMounted(async () => {
  await getUserData();
});
</script>
<template>
  <router-view></router-view>
  <AiChatBox />
</template>
