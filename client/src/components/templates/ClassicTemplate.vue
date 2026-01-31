<script setup>
import { defineProps, computed } from "vue";

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

const imageUrl = computed(() => {
  const img = props.data.personal_info?.image;
  if (img && typeof img === "object") {
    return URL.createObjectURL(img);
  }
  return img;
});
</script>

<template>
  <div
    class="max-w-4xl mx-auto p-8 bg-white text-gray-800 leading-relaxed shadow-lg"
  >
    <header
      class="mb-8 pb-6 border-b-2 flex flex-col sm:flex-row items-center sm:items-start gap-6"
      :style="{ borderColor: accentColor }"
    >
      <div v-if="data.personal_info?.image" class="flex-shrink-0">
        <img
          :src="imageUrl"
          alt="Profile Picture"
          class="w-32 h-32 rounded-full object-cover border-2 p-1"
          :style="{ borderColor: accentColor }"
        />
      </div>

      <div
        class="flex-1 w-full"
        :class="data.personal_info?.image ? 'text-left' : 'text-center'"
      >
        <h1
          class="text-4xl font-bold mb-2 uppercase tracking-wide"
          :style="{ color: accentColor }"
        >
          {{ data.personal_info?.full_name || "Your Name" }}
        </h1>

        <p
          v-if="data.personal_info?.profession"
          class="text-xl font-medium text-gray-600 mb-4 uppercase"
        >
          {{ data.personal_info.profession }}
        </p>

        <div
          class="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600"
          :class="
            data.personal_info?.image ? 'justify-start' : 'justify-center'
          "
        >
          <div
            v-if="data.personal_info?.email"
            class="flex items-center gap-1.5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="size-4"
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            <span>{{ data.personal_info.email }}</span>
          </div>

          <div
            v-if="data.personal_info?.phone"
            class="flex items-center gap-1.5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="size-4"
            >
              <path
                d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.05 12.05 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.05 12.05 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
              />
            </svg>
            <span>{{ data.personal_info.phone }}</span>
          </div>

          <div
            v-if="data.personal_info?.location"
            class="flex items-center gap-1.5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="size-4"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{{ data.personal_info.location }}</span>
          </div>

          <a
            v-if="data.personal_info?.linkedin"
            :href="data.personal_info.linkedin"
            target="_blank"
            class="flex items-center gap-1.5 hover:underline"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="size-4"
            >
              <path
                d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
              />
              <rect width="4" height="12" x="2" y="9" />
              <circle cx="4" cy="4" r="2" />
            </svg>
            <span>LinkedIn</span>
          </a>

          <a
            v-if="data.personal_info?.website"
            :href="data.personal_info.website"
            target="_blank"
            class="flex items-center gap-1.5 hover:underline"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="size-4"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
              <path d="M2 12h20" />
            </svg>
            <span>Portfolio</span>
          </a>
        </div>
      </div>
    </header>

    <section v-if="data.professional_summary" class="mb-6">
      <h2
        class="text-lg font-bold uppercase border-b mb-3 pb-1"
        :style="{ color: accentColor, borderColor: accentColor }"
      >
        Professional Summary
      </h2>
      <p class="text-gray-700 leading-relaxed text-justify">
        {{ data.professional_summary }}
      </p>
    </section>

    <section v-if="data.experience && data.experience.length > 0" class="mb-6">
      <h2
        class="text-lg font-bold uppercase border-b mb-4 pb-1"
        :style="{ color: accentColor, borderColor: accentColor }"
      >
        Professional Experience
      </h2>

      <div class="space-y-5">
        <div v-for="(exp, index) in data.experience" :key="index">
          <div class="flex justify-between items-baseline mb-1">
            <h3 class="font-bold text-gray-900 text-lg">{{ exp.position }}</h3>
            <span class="text-sm font-medium text-gray-600 whitespace-nowrap">
              {{ formatDate(exp.start_date) }} -
              {{ exp.is_current ? "Present" : formatDate(exp.end_date) }}
            </span>
          </div>

          <div class="flex items-center gap-2 mb-2">
            <span class="font-semibold text-gray-700">{{ exp.company }}</span>
          </div>

          <div
            v-if="exp.description"
            class="text-gray-700 text-sm leading-relaxed whitespace-pre-line pl-1"
          >
            {{ exp.description }}
          </div>
        </div>
      </div>
    </section>

    <section v-if="data.project && data.project.length > 0" class="mb-6">
      <h2
        class="text-lg font-bold uppercase border-b mb-4 pb-1"
        :style="{ color: accentColor, borderColor: accentColor }"
      >
        Projects
      </h2>

      <div class="space-y-4">
        <div v-for="(proj, index) in data.project" :key="index">
          <div class="flex justify-between items-baseline mb-1">
            <h3 class="font-bold text-gray-900">{{ proj.name }}</h3>
          </div>
          <p class="text-gray-700 text-sm leading-relaxed">
            {{ proj.description }}
          </p>
        </div>
      </div>
    </section>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <section v-if="data.education && data.education.length > 0">
        <h2
          class="text-lg font-bold uppercase border-b mb-4 pb-1"
          :style="{ color: accentColor, borderColor: accentColor }"
        >
          Education
        </h2>

        <div class="space-y-4">
          <div v-for="(edu, index) in data.education" :key="index">
            <h3 class="font-bold text-gray-900">
              {{ edu.degree }} {{ edu.field ? `in ${edu.field}` : "" }}
            </h3>
            <p class="text-gray-700">{{ edu.institution }}</p>
            <div
              class="flex justify-between items-center text-sm text-gray-600 mt-1"
            >
              <span>{{ formatDate(edu.graduation_date) }}</span>
              <span v-if="edu.gpa" class="font-medium">GPA: {{ edu.gpa }}</span>
            </div>
          </div>
        </div>
      </section>

      <section v-if="data.skills && data.skills.length > 0">
        <h2
          class="text-lg font-bold uppercase border-b mb-4 pb-1"
          :style="{ color: accentColor, borderColor: accentColor }"
        >
          Skills
        </h2>

        <div class="flex flex-wrap gap-x-4 gap-y-2">
          <span
            v-for="(skill, index) in data.skills"
            :key="index"
            class="text-gray-700 text-sm font-medium bg-gray-100 px-2 py-1 rounded"
          >
            {{ skill }}
          </span>
        </div>
      </section>
    </div>
  </div>
</template>
