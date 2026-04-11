<template>
  <div
    class="max-w-5xl mx-auto bg-white shadow-xl overflow-hidden text-slate-800 flex flex-col md:flex-row min-h-[1000px]"
  >
    <aside
      class="w-full md:w-[35%] bg-slate-50 flex flex-col gap-10 border-r border-slate-200 p-[20px] min-w-0"
    >
      <div v-if="data.personal_info?.image" class="flex justify-center pt-4">
        <div
          class="relative p-1 rounded-full bg-white shadow-md"
          :style="{ border: `2px solid ${accentColor}` }"
        >
          <img
            :src="getImageUrl(data.personal_info.image)"
            alt="Profile"
            class="w-36 h-36 object-cover rounded-full"
          />
        </div>
      </div>

      <section>
        <h2
          class="text-sm font-bold tracking-widest text-slate-400 uppercase mb-4"
        >
          Contact
        </h2>
        <div class="space-y-4 text-sm text-slate-600">
          <div v-if="data.personal_info?.phone" class="flex items-center gap-3">
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
              class="shrink-0"
              :style="{ color: accentColor }"
            >
              <path
                d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
              />
            </svg>
            <span class="break-words">{{ data.personal_info.phone }}</span>
          </div>
          <div v-if="data.personal_info?.email" class="flex items-center gap-3">
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
              class="shrink-0"
              :style="{ color: accentColor }"
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            <span class="break-words">{{ data.personal_info.email }}</span>
          </div>
          <div
            v-if="data.personal_info?.location"
            class="flex items-center gap-3"
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
              class="shrink-0"
              :style="{ color: accentColor }"
            >
              <path
                d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 15 4 10a8 8 0 0 1 16 0"
              />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span class="break-words">{{ data.personal_info.location }}</span>
          </div>
        </div>
      </section>

      <section v-if="data.education?.length">
        <h2
          class="text-sm font-bold tracking-widest text-slate-400 uppercase mb-4"
        >
          Education
        </h2>
        <div class="space-y-5">
          <div v-for="(edu, index) in data.education" :key="index">
            <p class="font-bold text-slate-800 leading-snug">
              {{ edu.degree }}
            </p>
            <p class="text-sm text-slate-600 mt-0.5">{{ edu.institution }}</p>
            <p class="text-xs text-slate-400 mt-1 font-medium tracking-wide">
              {{ formatDate(edu.graduation_date) }}
            </p>
            <div
              v-if="edu.description"
              class="text-xs text-slate-600 mt-2 prose prose-sm max-w-none"
              v-html="edu.description"
            ></div>
          </div>
        </div>
      </section>

      <section v-if="data.skills?.length">
        <h2
          class="text-sm font-bold tracking-widest text-slate-400 uppercase mb-4"
        >
          Skills
        </h2>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="(skill, index) in data.skills"
            :key="index"
            class="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs font-semibold text-slate-600 shadow-sm"
          >
            {{ skill }}
          </span>
        </div>
      </section>
    </aside>

    <main class="w-full md:w-[65%] p-10 py-12 flex flex-col gap-10">
      <header
        class="border-b-2 pb-8"
        :style="{ borderColor: accentColor + '40' }"
      >
        <h1 class="text-5xl font-extrabold text-slate-900 tracking-tight mb-2">
          {{ data.personal_info?.full_name || "Your Name" }}
        </h1>
        <p
          class="text-xl font-medium tracking-widest uppercase"
          :style="{ color: accentColor }"
        >
          {{ data.personal_info?.profession || "Profession" }}
        </p>
      </header>

      <section v-if="data.professional_summary">
        <h2
          class="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"
        >
          Profile
        </h2>
        <div
          class="text-slate-600 leading-relaxed text-justify prose prose-sm max-w-none"
          v-html="data.professional_summary"
        ></div>
      </section>

      <section v-if="data.experience?.length">
        <h2 class="text-xl font-bold text-slate-800 mb-6">Experience</h2>

        <div class="relative border-l-2 border-slate-200 ml-2 space-y-8">
          <div
            v-for="(exp, index) in data.experience"
            :key="index"
            class="relative pl-6"
          >
            <div
              class="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full ring-4 ring-white"
              :style="{ backgroundColor: accentColor }"
            ></div>

            <div
              class="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1"
            >
              <h3 class="text-lg font-bold text-slate-900">
                {{ exp.position }}
              </h3>
              <span
                class="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md mt-1 sm:mt-0"
              >
                {{ formatDate(exp.start_date) }} -
                {{ exp.is_current ? "Present" : formatDate(exp.end_date) }}
              </span>
            </div>

            <p
              class="text-sm font-semibold mb-3"
              :style="{ color: accentColor }"
            >
              {{ exp.company }}
            </p>

            <div
              v-if="exp.description"
              class="text-sm text-slate-600 leading-relaxed space-y-1.5 prose prose-sm max-w-none"
              v-html="exp.description"
            ></div>
          </div>
        </div>
      </section>

      <section v-if="data.project?.length">
        <h2 class="text-xl font-bold text-slate-800 mb-6">Projects</h2>

        <div class="relative border-l-2 border-slate-200 ml-2 space-y-6">
          <div
            v-for="(project, index) in data.project"
            :key="index"
            class="relative pl-6"
          >
            <div
              class="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full ring-4 ring-white"
              :style="{ backgroundColor: accentColor }"
            ></div>

            <div class="flex flex-wrap items-baseline gap-3 mb-1">
              <h3 class="text-base font-bold text-slate-900">
                {{ project.name }}
              </h3>
              <span
                v-if="project.type"
                class="text-[10px] font-medium px-2 py-0.5 rounded-full border bg-slate-50"
                :style="{ color: accentColor, borderColor: accentColor + '60' }"
              >
                {{ project.type }}
              </span>
              <a
                v-if="project.link"
                :href="project.link"
                target="_blank"
                class="text-[10px] font-medium flex items-center gap-1 hover:underline transition-all"
                :style="{ color: accentColor }"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
                  />
                  <path
                    d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
                  />
                </svg>
                Link
              </a>
            </div>

            <div
              v-if="project.description"
              class="text-sm text-slate-600 leading-relaxed space-y-1.5 mt-2 prose prose-sm max-w-none"
              v-html="project.description"
            ></div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  accentColor: {
    type: String,
    default: "#2563eb",
  },
});

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const [year, month] = dateStr.split("-");
  return new Date(year, month - 1).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
};

const getImageUrl = (image) => {
  if (typeof image === "string") return image;
  if (typeof image === "object" && image !== null)
    return URL.createObjectURL(image);
  return "";
};
</script>
