<script setup>
import { onMounted } from "vue";
import getUserData from "./composables/useGetData";

onMounted(async () => {
  await getUserData();
});
</script>
<template>
  <router-view></router-view>
</template>
