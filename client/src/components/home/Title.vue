<script setup>
  const props = defineProps(['title', 'description'])
</script>
<template>
    <div class="text-center mt-6 text-slate-700">
        <h2 class="tex-3xl sm:text-4xl font-medium">{{ props.title }}</h2>
        <p class="max-sm max-w-2xl mt-4 text-slate-500">{{ props.description }}</p>
    </div>
</template>