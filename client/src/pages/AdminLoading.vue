<template>
  <div
    class="h-screen w-full bg-white fixed top-0 left-0 flex items-center justify-center z-999"
    v-if="props.isLoading"
  >
    <div
      class="rounded-full border-4 border-black border-t-transparent animate-spin size-50"
    ></div>
  </div>
</template>
<script setup>
const props = defineProps(["isLoading"]);
</script>
