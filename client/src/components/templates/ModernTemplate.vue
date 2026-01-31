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

// Helper để xử lý logic hiển thị link rút gọn (giống code React gốc)
const getShortLink = (url, removeStr) => {
  if (!url) return "";
  const parts = url.split(removeStr);
  return parts[1] ? parts[1] : url;
};
</script>

<template>
  <div class="max-w-4xl mx-auto bg-white text-gray-800">
    <header class="p-8 text-white" :style="{ backgroundColor: accentColor }">
      <h1 class="text-4xl font-light mb-3">
        {{ data.personal_info?.full_name || "Your Name" }}
      </h1>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
        <div v-if="data.personal_info?.email" class="flex items-center gap-2">
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

        <div v-if="data.personal_info?.phone" class="flex items-center gap-2">
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
          class="flex items-center gap-2"
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
          class="flex items-center gap-2"
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
          <span class="break-all text-xs">
            {{ getShortLink(data.personal_info.linkedin, "https://www.") }}
          </span>
        </a>

        <a
          v-if="data.personal_info?.website"
          :href="data.personal_info.website"
          target="_blank"
          class="flex items-center gap-2"
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
          <span class="break-all text-xs">
            {{ getShortLink(data.personal_info.website, "https://") }}
          </span>
        </a>
      </div>
    </header>

    <div class="p-8">
      <section v-if="data.professional_summary" class="mb-8">
        <h2 class="text-2xl font-light mb-4 pb-2 border-b border-gray-200">
          Professional Summary
        </h2>
        <p class="text-gray-700">
          {{ data.professional_summary }}
        </p>
      </section>

      <section
        v-if="data.experience && data.experience.length > 0"
        class="mb-8"
      >
        <h2 class="text-2xl font-light mb-6 pb-2 border-b border-gray-200">
          Experience
        </h2>

        <div class="space-y-6">
          <div
            v-for="(exp, index) in data.experience"
            :key="index"
            class="relative pl-6 border-l border-gray-200"
          >
            <div class="flex justify-between items-start mb-2">
              <div>
                <h3 class="text-xl font-medium text-gray-900">
                  {{ exp.position }}
                </h3>
                <p class="font-medium" :style="{ color: accentColor }">
                  {{ exp.company }}
                </p>
              </div>
              <div class="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded">
                {{ formatDate(exp.start_date) }} -
                {{ exp.is_current ? "Present" : formatDate(exp.end_date) }}
              </div>
            </div>

            <div
              v-if="exp.description"
              class="text-gray-700 leading-relaxed mt-3 whitespace-pre-line"
            >
              {{ exp.description }}
            </div>
          </div>
        </div>
      </section>

      <section v-if="data.project && data.project.length > 0" class="mb-8">
        <h2 class="text-2xl font-light mb-4 pb-2 border-b border-gray-200">
          Projects
        </h2>

        <div class="space-y-6">
          <div
            v-for="(p, index) in data.project"
            :key="index"
            class="relative pl-6 border-l border-gray-200"
            :style="{ borderLeftColor: accentColor }"
          >
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-lg font-medium text-gray-900">{{ p.name }}</h3>
              </div>
            </div>

            <div
              v-if="p.description"
              class="text-gray-700 leading-relaxed text-sm mt-3"
            >
              {{ p.description }}
            </div>
          </div>
        </div>
      </section>

      <div class="grid sm:grid-cols-2 gap-8">
        <section v-if="data.education && data.education.length > 0">
          <h2 class="text-2xl font-light mb-4 pb-2 border-b border-gray-200">
            Education
          </h2>

          <div class="space-y-4">
            <div v-for="(edu, index) in data.education" :key="index">
              <h3 class="font-semibold text-gray-900">
                {{ edu.degree }} {{ edu.field ? `in ${edu.field}` : "" }}
              </h3>
              <p :style="{ color: accentColor }">{{ edu.institution }}</p>
              <div
                class="flex justify-between items-center text-sm text-gray-600"
              >
                <span>{{ formatDate(edu.graduation_date) }}</span>
                <span v-if="edu.gpa">GPA: {{ edu.gpa }}</span>
              </div>
            </div>
          </div>
        </section>

        <section v-if="data.skills && data.skills.length > 0">
          <h2 class="text-2xl font-light mb-4 pb-2 border-b border-gray-200">
            Skills
          </h2>

          <div class="flex flex-wrap gap-2">
            <span
              v-for="(skill, index) in data.skills"
              :key="index"
              class="px-3 py-1 text-sm text-white rounded-full"
              :style="{ backgroundColor: accentColor }"
            >
              {{ skill }}
            </span>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
