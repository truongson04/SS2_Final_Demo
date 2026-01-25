<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { dummyData } from "../assets/assets";

const route = useRoute();
const { resumeId } = route.params;
const resumeData = ref({
  _id: "",
  title: "",
  personal_info: {},
  professional_summary: "",
  experience: [],
  education: [],
  projects: [],
  skills: [],
  template: "classic",
  accent_color: "#3B82F6",
  public: false,
});
const loadExistingResume = async () => {
  const resume = dummyData.find((items) => {
    return items._id === resumeId;
  });
  if (resume) {
    resumeData.value = resume;
    document.title = resume.title;
  }
};
const activeSectionIndex = ref(0);
const removeBackground = ref(false);
const sections = [
  {
    id: "personal",
    name: "Personal Info",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-icon lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  },
  {
    id: "summary",
    name: "Summary",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text-icon lucide-file-text"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>',
  },
  {
    id: "experience",
    name: "Experience",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-briefcase-business-icon lucide-briefcase-business"><path d="M12 12h.01"/><path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><path d="M22 13a18.15 18.15 0 0 1-20 0"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg>',
  },
  {
    id: "education",
    name: "Education",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-graduation-cap-icon lucide-graduation-cap"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/></svg>',
  },
  {
    id: "projects",
    name: "Projects",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-folder-icon lucide-folder"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>',
  },
  {
    id: "skills",
    name: "Skills",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-glasses-icon lucide-glasses"><circle cx="6" cy="15" r="4"/><circle cx="18" cy="15" r="4"/><path d="M14 15a2 2 0 0 0-2-2 2 2 0 0 0-2 2"/><path d="M2.5 13 5 7c.7-1.3 1.4-2 3-2"/><path d="M21.5 13 19 7c-.7-1.3-1.5-2-3-2"/></svg>',
  },
];
const activeSection = sections[activeSectionIndex];
onMounted(() => {
  loadExistingResume();
});
</script>
<template>
  <div class="max-w-7xl mx-auto px-4 py-6">
    <router-link
      to="/app"
      class="inline-flex gap-2 items-center text-white hover:text-slate-700 transition-all"
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
        class="size-4"
      >
        <path d="m12 19-7-7 7-7" />
        <path d="M19 12H5" />
      </svg>
      Back to Dashboard
    </router-link>
  </div>
  <div class="max-w-7xl mx-auto px-4 pb-8">
    <div class="grid lg:grid-cols-12 gap-8">
      <!-- Bên trái- form điền  -->
      <div class="relative lg:col-span-5 rounded-lg overflow-hidden">
        <div
          class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1"
        >
          <!-- Thanh tiến trình  -->
          <hr class="absolute top-0 left-0 right-0 border-2 border-gray-200" />
          <hr
            class="absolute top-0 left-0 h1 bg-gradient-to-r from-cyan-500 to-cyan-800 border-none transition-all duration-2000"
            :style="{
              width: `${(activeSectionIndex * 100) / (sections.length - 1)}%`,
            }"
          />
        </div>
      </div>
      <!-- Bên phải- xem trước -->
      <div></div>
    </div>
  </div>
</template>
