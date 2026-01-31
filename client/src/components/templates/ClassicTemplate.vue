<script setup>
// Không cần import thư viện icon nữa
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
  <div class="max-w-4xl mx-auto p-8 bg-white text-gray-800 leading-relaxed">
    <header
      class="text-center mb-8 pb-6 border-b-2"
      :style="{ borderColor: accentColor }"
    >
      <h1 class="text-3xl font-bold mb-2" :style="{ color: accentColor }">
        {{ data.personal_info?.full_name || "Your Name" }}
      </h1>

      <div class="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
        <div v-if="data.personal_info?.email" class="flex items-center gap-1">
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

        <div v-if="data.personal_info?.phone" class="flex items-center gap-1">
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
          class="flex items-center gap-1"
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

        <div
          v-if="data.personal_info?.linkedin"
          class="flex items-center gap-1"
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
          <span class="break-all">{{ data.personal_info.linkedin }}</span>
        </div>

        <div v-if="data.personal_info?.website" class="flex items-center gap-1">
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
          <span class="break-all">{{ data.personal_info.website }}</span>
        </div>
      </div>
    </header>

    <section v-if="data.professional_summary" class="mb-6">
      <h2 class="text-xl font-semibold mb-3" :style="{ color: accentColor }">
        PROFESSIONAL SUMMARY
      </h2>
      <p class="text-gray-700 leading-relaxed">
        {{ data.professional_summary }}
      </p>
    </section>

    <section v-if="data.experience && data.experience.length > 0" class="mb-6">
      <h2 class="text-xl font-semibold mb-4" :style="{ color: accentColor }">
        PROFESSIONAL EXPERIENCE
      </h2>

      <div class="space-y-4">
        <div
          v-for="(exp, index) in data.experience"
          :key="index"
          class="border-l-4 pl-4"
          :style="{ borderColor: accentColor }"
        >
          <div class="flex justify-between items-start mb-2">
            <div>
              <h3 class="font-semibold text-gray-900">{{ exp.position }}</h3>
              <p class="text-gray-700 font-medium">{{ exp.company }}</p>
            </div>
            <div class="text-right text-sm text-gray-600">
              <p>
                {{ formatDate(exp.start_date) }} -
                {{ exp.is_current ? "Present" : formatDate(exp.end_date) }}
              </p>
            </div>
          </div>

          <div
            v-if="exp.description"
            class="text-gray-700 leading-relaxed whitespace-pre-line"
          >
            {{ exp.description }}
          </div>
        </div>
      </div>
    </section>

    <section v-if="data.project && data.project.length > 0" class="mb-6">
      <h2 class="text-xl font-semibold mb-4" :style="{ color: accentColor }">
        PROJECTS
      </h2>

      <div class="space-y-3">
        <div
          v-for="(proj, index) in data.project"
          :key="index"
          class="flex justify-between items-start border-l-4 border-gray-300 pl-6"
        >
          <div>
            <div class="font-semibold text-gray-800">{{ proj.name }}</div>
            <p class="text-gray-600">{{ proj.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <section v-if="data.education && data.education.length > 0" class="mb-6">
      <h2 class="text-xl font-semibold mb-4" :style="{ color: accentColor }">
        EDUCATION
      </h2>

      <div class="space-y-3">
        <div
          v-for="(edu, index) in data.education"
          :key="index"
          class="flex justify-between items-start"
        >
          <div>
            <h3 class="font-semibold text-gray-900">
              {{ edu.degree }} {{ edu.field ? `in ${edu.field}` : "" }}
            </h3>
            <p class="text-gray-700">{{ edu.institution }}</p>
            <p v-if="edu.gpa" class="text-sm text-gray-600">
              GPA: {{ edu.gpa }}
            </p>
          </div>
          <div class="text-sm text-gray-600">
            <p>{{ formatDate(edu.graduation_date) }}</p>
          </div>
        </div>
      </div>
    </section>

    <section v-if="data.skills && data.skills.length > 0" class="mb-6">
      <h2 class="text-xl font-semibold mb-4" :style="{ color: accentColor }">
        CORE SKILLS
      </h2>

      <div class="flex gap-4 flex-wrap">
        <div
          v-for="(skill, index) in data.skills"
          :key="index"
          class="text-gray-700"
        >
          • {{ skill }}
        </div>
      </div>
    </section>
  </div>
</template>
