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
    console.log(resumeData.value);
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
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-7 flex flex-col h-full relative">
          <div class="absolute top-4 right-4 z-20 flex gap-2">
            <button
              class="p-2 bg-slate-900/80 backdrop-blur text-slate-400 hover:text-white rounded-lg border border-white/10 shadow-lg hover:border-cyan-500/50 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
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
            </button>

            <button
              class="p-2 bg-slate-900/80 backdrop-blur text-slate-400 hover:text-white rounded-lg border border-white/10 shadow-lg hover:border-cyan-500/50 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="11" cy="11" r="8" />

                <line x1="21" x2="16.65" y1="21" y2="16.65" />

                <line x1="11" x2="11" y1="8" y2="14" />

                <line x1="8" x2="14" y1="11" y2="11" />
              </svg>
            </button>
          </div>

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

<style scoped>
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
</style>
