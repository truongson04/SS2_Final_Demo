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

const getImageUrl = (image) => {
  if (typeof image === "string") {
    return image;
  }
  //  else if (image && typeof image === "object") {
  //   return URL.createObjectURL(image);
  // }
  // return null;
};
</script>

<template>
  <div class="max-w-5xl mx-auto bg-white text-zinc-800">
    <div class="grid grid-cols-3">
      <div class="col-span-1 py-10">
        <div v-if="data.personal_info?.image" class="mb-6">
          <img
            :src="getImageUrl(data.personal_info.image)"
            alt="Profile"
            class="w-32 h-32 object-cover rounded-full mx-auto"
            :style="
              typeof data.personal_info.image === 'string'
                ? { background: accentColor + '70' }
                : {}
            "
          />
        </div>
      </div>

      <div class="col-span-2 flex flex-col justify-center py-10 px-8">
        <h1 class="text-4xl font-bold text-zinc-700 tracking-widest">
          {{ data.personal_info?.full_name || "Your Name" }}
        </h1>
        <p class="uppercase text-zinc-600 font-medium text-sm tracking-widest">
          {{ data.personal_info?.profession || "Profession" }}
        </p>
      </div>

      <aside class="col-span-1 border-r border-zinc-400 p-6 pt-0">
        <section class="mb-8">
          <h2 class="text-sm font-semibold tracking-widest text-zinc-600 mb-3">
            CONTACT
          </h2>
          <div class="space-y-2 text-sm">
            <div
              v-if="data.personal_info?.phone"
              class="flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                :style="{ color: accentColor }"
              >
                <path
                  d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.05 12.05 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.05 12.05 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                />
              </svg>
              <span>{{ data.personal_info.phone }}</span>
            </div>

            <div
              v-if="data.personal_info?.email"
              class="flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                :style="{ color: accentColor }"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <span>{{ data.personal_info.email }}</span>
            </div>

            <div
              v-if="data.personal_info?.location"
              class="flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                :style="{ color: accentColor }"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{{ data.personal_info.location }}</span>
            </div>
          </div>
        </section>

        <section
          v-if="data.education && data.education.length > 0"
          class="mb-8"
        >
          <h2 class="text-sm font-semibold tracking-widest text-zinc-600 mb-3">
            EDUCATION
          </h2>
          <div class="space-y-4 text-sm">
            <div v-for="(edu, index) in data.education" :key="index">
              <p class="font-semibold uppercase">{{ edu.degree }}</p>
              <p class="text-zinc-600">{{ edu.institution }}</p>
              <p class="text-xs text-zinc-500">
                {{ formatDate(edu.graduation_date) }}
              </p>
            </div>
          </div>
        </section>

        <section v-if="data.skills && data.skills.length > 0">
          <h2 class="text-sm font-semibold tracking-widest text-zinc-600 mb-3">
            SKILLS
          </h2>
          <ul class="space-y-1 text-sm">
            <li v-for="(skill, index) in data.skills" :key="index">
              {{ skill }}
            </li>
          </ul>
        </section>
      </aside>

      <main class="col-span-2 p-8 pt-0">
        <section v-if="data.professional_summary" class="mb-8">
          <h2
            class="text-sm font-semibold tracking-widest mb-3"
            :style="{ color: accentColor }"
          >
            SUMMARY
          </h2>
          <p class="text-zinc-700 leading-relaxed">
            {{ data.professional_summary }}
          </p>
        </section>

        <section v-if="data.experience && data.experience.length > 0">
          <h2
            class="text-sm font-semibold tracking-widest mb-4"
            :style="{ color: accentColor }"
          >
            EXPERIENCE
          </h2>
          <div class="space-y-6 mb-8">
            <div v-for="(exp, index) in data.experience" :key="index">
              <div class="flex justify-between items-center">
                <h3 class="font-semibold text-zinc-900">
                  {{ exp.position }}
                </h3>
                <span class="text-xs text-zinc-500">
                  {{ formatDate(exp.start_date) }} -
                  {{ exp.is_current ? "Present" : formatDate(exp.end_date) }}
                </span>
              </div>
              <p class="text-sm mb-2" :style="{ color: accentColor }">
                {{ exp.company }}
              </p>

              <ul
                v-if="exp.description"
                class="list-disc list-inside text-sm text-zinc-700 leading-relaxed space-y-1"
              >
                <li v-for="(line, i) in exp.description.split('\n')" :key="i">
                  {{ line }}
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section v-if="data.project && data.project.length > 0">
          <h2
            class="text-sm uppercase tracking-widest font-semibold"
            :style="{ color: accentColor }"
          >
            PROJECTS
          </h2>
          <div class="space-y-4">
            <div v-for="(project, index) in data.project" :key="index">
              <h3 class="text-md font-medium text-zinc-800 mt-3">
                {{ project.name }}
              </h3>
              <p class="text-sm mb-1" :style="{ color: accentColor }">
                {{ project.type }}
              </p>

              <ul
                v-if="project.description"
                class="list-disc list-inside text-sm text-zinc-700 space-y-1"
              >
                <li
                  v-for="(line, i) in project.description.split('\n')"
                  :key="i"
                >
                  {{ line }}
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>
