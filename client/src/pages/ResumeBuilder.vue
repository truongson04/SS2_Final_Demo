<script setup>
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import { dummyData } from "../assets/assets";
import PersonalInforForm from "../components/PersonalInforForm.vue";
import ResumePreview from "../components/ResumePreview.vue";
import TemplateSelector from "../components/TemplateSelector.vue";
import ColorPicker from "../components/ColorPicker.vue";
import ProfessionSumaryForm from "../components/ProfessionSumaryForm.vue";
import ExperienceForm from "../components/ExperienceForm.vue";
import EducationForm from "../components/EducationForm.vue";
import ProjectForm from "../components/ProjectForm.vue";
import SkillForm from "../components/SkillForm.vue";

const route = useRoute();
const { resumeId } = route.params;

const resumeData = ref({
  _id: "",
  title: "",
  personal_info: {},
  professional_summary: "",
  experience: [],
  education: [],
  project: [],
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
  { id: "personal", name: "Personal Info", title: "Personal Details" },
  { id: "summary", name: "Summary", title: "Professional Summary" },
  { id: "experience", name: "Experience", title: "Work History" },
  { id: "education", name: "Education", title: "Education" },
  { id: "projects", name: "Projects", title: "Key Projects" },
  { id: "skills", name: "Skills", title: "Skills & Expertise" },
];
const activeSection = computed(() => sections[activeSectionIndex.value]);

const nextSection = () => {
  if (activeSectionIndex.value < sections.length - 1) {
    activeSectionIndex.value++;
  }
};

const prevSection = () => {
  if (activeSectionIndex.value > 0) {
    activeSectionIndex.value--;
  }
};
const changeResumeVisibility = () => {
  resumeData.value.public = !resumeData.value.public;
};
const handleShare = () => {
  const frontendUrl = window.location.href.split("/app")[0];
  const resumeUrl = frontendUrl + "/view/" + resumeId;
  if (navigator.share) {
    navigator.share({ url: resumeUrl, text: "My resume" });
  } else {
    window.alert("Share is not supported");
  }
};
const downloadResume = () => {
  window.print();
};
onMounted(async () => {
  await loadExistingResume();
});
</script>
<template>
  <div class="min-h-screen bg-slate-950 relative font-sans text-slate-300">
    <div
      class="absolute inset-0 bg-[url('https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/bg-with-grid.png')] bg-cover bg-center opacity-5 pointer-events-none"
    ></div>

    <div
      class="absolute top-20 left-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"
    ></div>

    <div
      class="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"
    ></div>

    <div class="max-w-7xl mx-auto px-4 py-6 relative z-10">
      <router-link
        to="/app"
        class="inline-flex gap-2 items-center text-slate-400 hover:text-cyan-400 transition-all group"
      >
        <div
          class="p-1.5 rounded-full bg-slate-900 border border-slate-700 group-hover:border-cyan-500/50 group-hover:bg-cyan-500/10 transition-colors"
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
          >
            <path d="m12 19-7-7 7-7" />

            <path d="M19 12H5" />
          </svg>
        </div>

        <span class="font-medium">Back to Dashboard</span>
      </router-link>
      <div class="absolute top-4 right-4 z-20 flex gap-2">
        <button
          v-if="resumeData.public"
          @click="handleShare"
          class="p-2 bg-slate-900/80 backdrop-blur text-slate-400 hover:text-white rounded-lg border border-white/10 shadow-lg hover:border-cyan-500/50 transition"
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
            class="lucide lucide-share2-icon lucide-share-2"
          >
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
            <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
          </svg>
        </button>

        <button
          @click="changeResumeVisibility"
          class="p-2 bg-slate-900/80 backdrop-blur text-slate-400 hover:text-white rounded-lg border border-white/10 shadow-lg hover:border-cyan-500/50 transition"
        >
          <svg
            v-if="resumeData.public"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-eye-icon lucide-eye"
          >
            <path
              d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"
            />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-eye-off-icon lucide-eye-off"
          >
            <path
              d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"
            />
            <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
            <path
              d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"
            />
            <path d="m2 2 20 20" />
          </svg>
        </button>
        <button
          @click="downloadResume"
          class="p-2 bg-slate-900/80 backdrop-blur text-slate-400 hover:text-white rounded-lg border border-white/10 shadow-lg hover:border-cyan-500/50 transition"
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
            class="lucide lucide-arrow-down-from-line-icon lucide-arrow-down-from-line"
          >
            <path d="M19 3H5" />
            <path d="M12 21V7" />
            <path d="m6 15 6 6 6-6" />
          </svg>
        </button>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 pb-12 relative z-10">
      <div class="grid lg:grid-cols-12 gap-8 h-full">
        <div class="lg:col-span-5 flex flex-col h-full">
          <div
            class="relative bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col h-full"
          >
            <div class="absolute top-0 left-0 right-0 h-1 bg-slate-800">
              <div
                class="h-full bg-gradient-to-r from-cyan-400 to-blue-600 shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all duration-500 ease-out"
                :style="{
                  width: `${(activeSectionIndex * 100) / (sections.length - 1)}%`,
                }"
              ></div>
            </div>

            <div
              class="flex flex-col sm:flex-row justify-between items-center gap-4 p-5 border-b border-white/5 bg-slate-900/50"
            >
              <div class="flex items-center gap-3">
                <template-selector
                  v-model:selected-template="resumeData.template"
                />

                <color-picker
                  v-model:selected-color="resumeData.accent_color"
                />
              </div>

              <div class="flex items-center gap-2">
                <button
                  v-if="activeSectionIndex !== 0"
                  @click="
                    activeSectionIndex = Math.max(activeSectionIndex - 1, 0)
                  "
                  class="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
                  :disabled="activeSectionIndex === 0"
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
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>

                  Back
                </button>

                <button
                  @click="
                    activeSectionIndex = Math.min(
                      activeSectionIndex + 1,

                      sections.length - 1,
                    )
                  "
                  class="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="activeSectionIndex === sections.length - 1"
                >
                  Next

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
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              </div>
            </div>

            <div
              class="p-6 overflow-y-auto max-h-[calc(100vh-10px)] custom-scrollbar"
            >
              <div class="mb-6">
                <h2
                  class="text-xl font-bold text-white flex items-center gap-2"
                >
                  <span
                    class="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-xs border border-cyan-500/50"
                  >
                    {{ activeSectionIndex + 1 }}
                  </span>

                  {{ activeSection.name || "Section Title" }}

                  <p>{{ activeSection.id }}</p>
                </h2>
              </div>

              <div class="space-y-6">
                <div v-if="activeSection.id === 'personal'">
                  <personal-infor-form
                    v-model:data="resumeData"
                    v-model:removeBackground="removeBackground"
                  />
                </div>

                <div v-if="activeSection.id === 'summary'">
                  <profession-sumary-form
                    v-model:data="resumeData.professional_summary"
                  />
                </div>
                <div v-if="activeSection.id === 'experience'">
                  <experience-form v-model:data="resumeData.experience" />
                </div>
                <div v-if="activeSection.id === 'education'">
                  <education-form v-model:data="resumeData.education" />
                </div>
                <div v-if="activeSection.id === 'projects'">
                  <project-form v-model:data="resumeData.project" />
                </div>
                <div v-if="activeSection.id === 'skills'">
                  <skill-form v-model:data="resumeData.skills" />
                </div>
                <button
                  class="bg-gradient-to-br from-cyan-100 to-cyan-200 ring-cyan-300 text-cyan-600 ring hover:ring-cyan-400 transition-all rounded-md px-6 py-2 mt-6 text-sm"
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-7 flex flex-col h-full relative">
          <div
            class="flex-1 bg-slate-900/40 border border-white/5 rounded-xl relative overflow-hidden flex flex-col"
          >
            <div
              class="absolute inset-0 opacity-20 bg-[size:20px_20px] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] pointer-events-none"
            ></div>

            <div class="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8">
              <div class="flex flex-col items-center min-h-full justify-start">
                <div
                  class="relative w-full max-w-[21cm] min-h-[29.7cm] bg-white text-black shadow-2xl rounded-sm overflow-hidden ring-1 ring-white/10"
                >
                  <resume-preview
                    id="printable"
                    v-model:data="resumeData"
                    v-model:template="resumeData.template"
                    v-model:accent-color="resumeData.accent_color"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #334155;

  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #475569;
}
@media print {
  body * {
    visibility: hidden !important;
  }
  #resume-preview,
  #resume-preview * {
    visibility: visible !important;
  }
}
</style>
