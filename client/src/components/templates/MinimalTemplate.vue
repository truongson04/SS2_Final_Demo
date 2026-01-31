<script setup>
import { defineProps } from "vue";

const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  accentColor: {
    type: String,
    default: "#333",
  },
});

// Hàm format ngày tháng
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length < 2) return dateStr;

  const year = parts[0];
  const month = parts[1];

  return new Date(year, month - 1).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
};
</script>

<template>
  <div class="max-w-4xl mx-auto p-8 bg-white text-gray-900 font-light">
    <header class="mb-10">
      <h1 class="text-4xl font-thin mb-4 tracking-wide">
        {{ data.personal_info?.full_name || "Your Name" }}
      </h1>

      <div class="flex flex-wrap gap-6 text-sm text-gray-600">
        <span v-if="data.personal_info?.email">{{
          data.personal_info.email
        }}</span>
        <span v-if="data.personal_info?.phone">{{
          data.personal_info.phone
        }}</span>
        <span v-if="data.personal_info?.location">{{
          data.personal_info.location
        }}</span>
        <span v-if="data.personal_info?.linkedin" class="break-all">
          {{ data.personal_info.linkedin }}
        </span>
        <span v-if="data.personal_info?.website" class="break-all">
          {{ data.personal_info.website }}
        </span>
      </div>
    </header>

    <section v-if="data.professional_summary" class="mb-10">
      <p class="text-gray-700">
        {{ data.professional_summary }}
      </p>
    </section>

    <section v-if="data.experience && data.experience.length > 0" class="mb-10">
      <h2
        class="text-sm uppercase tracking-widest mb-6 font-medium"
        :style="{ color: accentColor }"
      >
        Experience
      </h2>

      <div class="space-y-6">
        <div v-for="(exp, index) in data.experience" :key="index">
          <div class="flex justify-between items-baseline mb-1">
            <h3 class="text-lg font-medium">{{ exp.position }}</h3>
            <span class="text-sm text-gray-500">
              {{ formatDate(exp.start_date) }} -
              {{ exp.is_current ? "Present" : formatDate(exp.end_date) }}
            </span>
          </div>
          <p class="text-gray-600 mb-2">{{ exp.company }}</p>

          <div
            v-if="exp.description"
            class="text-gray-700 leading-relaxed whitespace-pre-line"
          >
            {{ exp.description }}
          </div>
        </div>
      </div>
    </section>

    <section v-if="data.project && data.project.length > 0" class="mb-10">
      <h2
        class="text-sm uppercase tracking-widest mb-6 font-medium"
        :style="{ color: accentColor }"
      >
        Projects
      </h2>

      <div class="space-y-4">
        <div
          v-for="(proj, index) in data.project"
          :key="index"
          class="flex flex-col gap-2 justify-between items-baseline"
        >
          <h3 class="text-lg font-medium">{{ proj.name }}</h3>
          <p class="text-gray-600">{{ proj.description }}</p>
        </div>
      </div>
    </section>

    <section v-if="data.education && data.education.length > 0" class="mb-10">
      <h2
        class="text-sm uppercase tracking-widest mb-6 font-medium"
        :style="{ color: accentColor }"
      >
        Education
      </h2>

      <div class="space-y-4">
        <div
          v-for="(edu, index) in data.education"
          :key="index"
          class="flex justify-between items-baseline"
        >
          <div>
            <h3 class="font-medium">
              {{ edu.degree }} {{ edu.field ? `in ${edu.field}` : "" }}
            </h3>
            <p class="text-gray-600">{{ edu.institution }}</p>
            <p v-if="edu.gpa" class="text-sm text-gray-500">
              GPA: {{ edu.gpa }}
            </p>
          </div>
          <span class="text-sm text-gray-500">
            {{ formatDate(edu.graduation_date) }}
          </span>
        </div>
      </div>
    </section>

    <section v-if="data.skills && data.skills.length > 0">
      <h2
        class="text-sm uppercase tracking-widest mb-6 font-medium"
        :style="{ color: accentColor }"
      >
        Skills
      </h2>

      <div class="text-gray-700">
        {{ data.skills.join(" • ") }}
      </div>
    </section>
  </div>
</template>
