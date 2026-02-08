<script setup>
import { computed } from "vue";

const data = defineModel("data");

const removeBackground = defineModel("removeBackground");

const handleChange = (field, value) => {
  if (value) {
    const reader = new FileReader();

    reader.onload = (e) => {
      data.value.personal_info[field] = e.target.result;
    };

    reader.readAsDataURL(value);
  }
};
// const imageUrl = computed(() => {
//   const img = data.value.personal_info.image;
//   if (!img) return null;

//   if (typeof img === "string") return img;

//   return URL.createObjectURL(img);
// });
const fields = [
  {
    key: "full_name",
    label: "Full Name",
    type: "text",
    required: true,
    icon: "user",
  },
  {
    key: "email",
    label: "Email Address",
    type: "email",
    required: true,
    icon: "mail",
  },
  {
    key: "location",
    label: "Location",
    type: "text",
    required: true,
    icon: "map-pin",
  },
  {
    key: "profession",
    label: "Profession",
    type: "text",
    required: true,
    icon: "briefcase",
  },
  { key: "linkedin", label: "LinkedIn Profile", type: "url", icon: "linkedin" },
  { key: "website", label: "Personal Website", type: "url", icon: "globe" },
];
</script>
<template>
  <div
    class="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6 sm:p-8 relative overflow-hidden"
  >
    <div
      class="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[80px] pointer-events-none"
    ></div>

    <div class="mb-8 relative z-10">
      <h3 class="text-xl font-bold text-white">Personal Information</h3>
      <p class="text-sm text-slate-400 mt-1">
        Enter your personal details to display on your resume.
      </p>
    </div>

    <div
      class="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10 relative z-10"
    >
      <label class="group relative cursor-pointer flex-shrink-0">
        <div
          class="w-24 h-24 rounded-full border-2 border-dashed border-slate-600 bg-slate-950 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:border-cyan-500 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]"
        >
          <img
            v-if="data.personal_info.image"
            :src="data.personal_info.image"
            alt="Avatar"
            class="w-full h-full object-cover"
          />
          <div
            v-else
            class="flex flex-col items-center justify-center text-slate-500 group-hover:text-cyan-400 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" x2="12" y1="3" y2="15" />
            </svg>
            <span class="text-[10px] mt-1 font-medium uppercase tracking-wide"
              >Upload</span
            >
          </div>
          <div
            class="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="text-white"
            >
              <path
                d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
              />
              <path d="m15 5 4 4" />
            </svg>
          </div>
        </div>
        <input
          type="file"
          accept="image/jpg, image/png, image/jpeg"
          class="hidden"
          @change="handleChange('image', $event.target.files[0])"
        />
      </label>

      <div class="flex flex-col gap-2">
        <p class="text-sm font-medium text-white">Profile Picture</p>
        <p class="text-xs text-slate-500 max-w-[250px]">
          Upload a professional photo (JPG, PNG). Max size 5MB.
        </p>

        <div
          v-if="data.personal_info.image"
          class="mt-2 flex items-center gap-3"
        >
          <label class="relative inline-flex items-center cursor-pointer group">
            <input
              type="checkbox"
              v-model="removeBackground"
              class="sr-only peer"
            />
            <div
              class="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-600 transition-colors"
            ></div>
            <span
              class="ml-2 text-xs font-medium text-slate-400 group-hover:text-cyan-400 transition-colors"
              >Remove Background</span
            >
          </label>
          <span
            class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/20"
            >AI</span
          >
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-6 relative z-10">
      <div v-for="field in fields" :key="field.key" class="group w-full">
        <label
          class="block text-sm font-medium text-slate-300 mb-2 transition-colors group-focus-within:text-cyan-400"
        >
          {{ field.label }}
          <span v-if="field.required" class="text-red-400 ml-0.5">*</span>
        </label>

        <div class="relative">
          <div
            class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"
          >
            <svg
              v-if="field.icon === 'user'"
              class="h-5 w-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <svg
              v-if="field.icon === 'mail'"
              class="h-5 w-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <svg
              v-if="field.icon === 'map-pin'"
              class="h-5 w-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <svg
              v-if="field.icon === 'briefcase'"
              class="h-5 w-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <svg
              v-if="field.icon === 'linkedin'"
              class="h-5 w-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"
              />
              <circle cx="4" cy="4" r="2" />
            </svg>
            <svg
              v-if="field.icon === 'globe'"
              class="h-5 w-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
              />
            </svg>
          </div>

          <input
            :type="field.type"
            v-model="data.personal_info[field.key]"
            :placeholder="`Enter your ${field.label.toLowerCase()}`"
            :required="field.required"
            class="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all shadow-inner text-sm sm:text-base"
          />
        </div>
      </div>
    </div>
  </div>
</template>
