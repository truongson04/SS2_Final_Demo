<script setup>
import { computed } from "vue";
import ModernTemplate from "./templates/ModernTemplate.vue";
import ClassicTemplate from "./templates/ClassicTemplate.vue";
import MinimalImageTemplate from "./templates/MinimalImageTemplate.vue";
import MinimalTemplate from "./templates/MinimalTemplate.vue";

const data = defineModel("data");
console.log(data.value);
const template = defineModel("template");
console.log(template.value);
const accentColor = defineModel("accentColor");
console.log(accentColor.value);
const renderTemplate = computed(() => {
  const templates = {
    classic: ClassicTemplate,
    "minimal-image": MinimalImageTemplate,
    minimal: MinimalTemplate,
    modern: ModernTemplate,
  };
  return templates[template.value] || ModernTemplate;
});
</script>
<template>
  <div>
    <div id="resume-preview">
      <component :is="renderTemplate" :data="data" :accentColor="accentColor" />
    </div>
  </div>
</template>
