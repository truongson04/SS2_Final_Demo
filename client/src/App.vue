<script setup>
import { onMounted, ref } from "vue";
import getUserData from "./composables/useGetData";
import AiChatBox from "./components/AiChatBox.vue";
const checkChatBot = ref(false);
onMounted(async () => {
  await getUserData();
  checkChatBot.value =
    localStorage.getItem("role") && localStorage.getItem("role") !== "admin";
});
</script>
<template>
  <router-view></router-view>
  <AiChatBox v-if="checkChatBot" />
</template>
