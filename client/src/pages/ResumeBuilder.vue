<script setup>
import { onMounted, ref, computed, toRaw } from "vue";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import { useTheme } from "../composables/useTheme";

import PersonalInforForm from "../components/PersonalInforForm.vue";
import ResumePreview from "../components/ResumePreview.vue";
import TemplateSelector from "../components/TemplateSelector.vue";
import ColorPicker from "../components/ColorPicker.vue";
import ProfessionSumaryForm from "../components/ProfessionSumaryForm.vue";
import ExperienceForm from "../components/ExperienceForm.vue";
import EducationForm from "../components/EducationForm.vue";
import ProjectForm from "../components/ProjectForm.vue";
import SkillForm from "../components/SkillForm.vue";
import clientApi from "../configs/api/clientApi";
import { toast } from "vue3-toastify";
import Loading from "../components/Loading.vue";
import SaveModal from "../components/SaveModal.vue";
import _ from "lodash";

const route = useRoute();
const router = useRouter();
const { isDark } = useTheme();
const { resumeId } = route.params;
const activeSectionIndex = ref(0);
const removeBackground = ref(false);
const isLoading = ref(false);
const showSaveModal = ref(false);
const continuing = ref(null);

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
let initialResume = null;
const loadExistingResume = async () => {
  isLoading.value = true;
  try {
    const { data } = await clientApi.get(`/api/resumes/get/${resumeId}`);
    if (data.resume) {
      resumeData.value = data.resume;
      initialResume = ref(_.cloneDeep(data.resume));
    }
  } catch (error) {
    router.push("/app");
    toast.error(error?.response?.data?.message || error.message);
  } finally {
    isLoading.value = false;
  }
};

const sections = [
  { id: "personal", name: "Personal Info", title: "Personal Details" },
  { id: "summary", name: "Summary", title: "Professional Summary" },
  { id: "experience", name: "Experience", title: "Work History" },
  { id: "education", name: "Education", title: "Education" },
  { id: "projects", name: "Projects", title: "Key Projects" },
  { id: "skills", name: "Skills", title: "Skills & Expertise" },
];
const activeSection = computed(() => sections[activeSectionIndex.value]);

const changeResumeVisibility = async () => {
  try {
    const { data } = await clientApi.put("/api/resumes/update", {
      resumeId,
      resumeData: {
        ...resumeData.value,
        public: !resumeData.value.public,
      },
    });
    resumeData.value.public = !resumeData.value.public;
  } catch (error) {
    router.push("/app");
    toast.error(error?.response?.data?.message || error.message);
  }
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

const saveResume = async () => {
  try {
    let updatedResume = structuredClone(toRaw(resumeData.value));

    if (typeof resumeData.value.personal_info.image === "object") {
      delete updatedResume.personal_info.image;
    }

    const formData = new FormData();

    formData.append("resumeId", resumeId);
    formData.append("removeBackground", removeBackground.value ? "yes" : "");

    formData.append("resumeData", JSON.stringify(updatedResume));

    const imageFile = resumeData.value.personal_info.image;
    if (imageFile && typeof imageFile === "object") {
      formData.append("image", imageFile);
    }

    const { data } = await clientApi.put("/api/resumes/update", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    resumeData.value = data.resume;
    initialResume = ref(_.cloneDeep(resumeData.value));
  } catch (error) {
    console.log(error);
  }
};

// PDF CV
const cvTemplate = ref(null);
const printCV = async () => {
  isLoading.value = true;
  try {
    const clone = cvTemplate.value.cloneNode(true);

    const images = clone.getElementsByTagName("img");
    for (const img of images) {
      if (img.src.startsWith("blob:")) {
        try {
          const response = await fetch(img.src);
          const blob = await response.blob();
          const base64 = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          });
          img.src = base64;
        } catch (e) {
          console.error("Failed to convert image to base64", e);
        }
      }
    }

    const htmlContent = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"><\/script>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap');
      body {
        margin: 0;
        padding: 0;
        font-family: 'Be Vietnam Pro', 'Inter', sans-serif;
        -webkit-print-color-adjust: exact;
      }
      /* Ensure the CV takes full width of the A4 page */
      .max-w-4xl, .max-w-5xl, .max-w-7xl {
        max-width: 100% !important;
        width: 100% !important;
        margin: 0 !important;
        box-shadow: none !important;
      }
    </style>
  </head>
  <body>
    ${clone.innerHTML}
  </body>
</html>
`;

    const response = await clientApi.post(
      "/api/resumes/pdf",
      {
        htmlContent,
      },
      {
        responseType: "blob",
      },
    );
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${resumeData.value.title || "Resume"}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    toast.success("PDF Downloaded!");
  } catch (error) {
    console.log(error);
    toast.error("Failed to generate PDF: " + error.message);
  } finally {
    isLoading.value = false;
  }
};
// prevent user forget to save
onBeforeRouteLeave((to, from, next) => {
  if (!_.isEqual(resumeData.value, initialResume.value)) {
    continuing.value = to; // save the route temporary
    showSaveModal.value = true;
    next(false);
  } else {
    next();
  }
});
onMounted(async () => {
  await loadExistingResume();
  window.addEventListener("beforeunload", (event) => {
    if (!_.isEqual(resumeData.value, initialResume.value))
      event.preventDefault();
    event.returnValue = "";
  });
});
</script>
<template>
  <loading v-if="isLoading" />
  <div
    v-else
    class="w-full relative font-sans transition-colors duration-300"
    :class="
      isDark ? 'text-slate-300 bg-slate-950' : 'text-slate-700 bg-gray-50'
    "
  >
    <save-modal
      :is-open="showSaveModal"
      @back="
        () => {
          showSaveModal = false;
          continuing = null;
        }
      "
      @continue="
        () => {
          //  trick the route
          initialResume = _.cloneDeep(resumeData);
          if (continuing) {
            router.push(continuing);
          }
        }
      "
    />

    <div class="max-w-7xl mx-auto px-4 py-6 relative z-10">
      <router-link
        to="/app"
        class="inline-flex gap-2 items-center transition-all group"
        :class="
          isDark
            ? 'text-slate-400 hover:text-cyan-400'
            : 'text-slate-500 hover:text-indigo-600'
        "
      >
        <div
          class="p-1.5 rounded-full border transition-colors"
          :class="
            isDark
              ? 'bg-slate-900 border-slate-700 group-hover:border-cyan-500/50 group-hover:bg-cyan-500/10'
              : 'bg-white border-gray-200 group-hover:border-indigo-400 shadow-sm'
          "
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
          class="p-2 backdrop-blur rounded-lg border shadow-lg transition"
          :class="
            isDark
              ? 'bg-slate-900/80 text-slate-400 hover:text-white border-white/10 hover:border-cyan-500/50'
              : 'bg-white/80 text-slate-500 hover:text-indigo-600 border-gray-200 hover:border-indigo-400'
          "
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
          class="p-2 backdrop-blur rounded-lg border shadow-lg transition"
          :class="
            isDark
              ? 'bg-slate-900/80 text-slate-400 hover:text-white border-white/10 hover:border-cyan-500/50'
              : 'bg-white/80 text-slate-500 hover:text-indigo-600 border-gray-200 hover:border-indigo-400'
          "
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
          @click="printCV"
          class="p-2 backdrop-blur rounded-lg border shadow-lg transition"
          :class="
            isDark
              ? 'bg-slate-900/80 text-slate-400 hover:text-white border-white/10 hover:border-cyan-500/50'
              : 'bg-white/80 text-slate-500 hover:text-indigo-600 border-gray-200 hover:border-indigo-400'
          "
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
        <button
          @click="
            router.push({
              name: 'Analysis',
              params: {
                resumeId,
              },
            })
          "
          class="p-2 rounded-lg border shadow-lg transition text-sm"
          :class="
            isDark
              ? 'bg-slate-900/80 backdrop-blur text-slate-400 hover:text-white border-white/10 hover:border-cyan-500/50'
              : 'bg-white text-slate-600 hover:text-indigo-700 border-gray-200 hover:border-indigo-400 font-medium'
          "
        >
          Analysis
        </button>
        <button
          @click="
            router.push({
              name: 'Interview',
              params: {
                resumeId,
              },
            })
          "
          class="p-2 rounded-lg border shadow-lg transition text-sm"
          :class="
            isDark
              ? 'bg-slate-900/80 backdrop-blur text-slate-400 hover:text-white border-white/10 hover:border-cyan-500/50'
              : 'bg-white text-slate-600 hover:text-indigo-700 border-gray-200 hover:border-indigo-400 font-medium'
          "
        >
          Interview prepare
        </button>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 pb-12 relative z-10">
      <div class="grid lg:grid-cols-12 gap-8 h-full">
        <div class="lg:col-span-5 flex flex-col h-full">
          <div
            class="relative flex flex-col h-full transition-colors"
            :class="
              isDark
                ? 'bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl overflow-hidden'
                : 'bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden'
            "
          >
            <div class="absolute top-0 left-0 right-0 h-1 bg-slate-800">
              <div
                class="h-full bg-gradient-to-r from-cyan-400 to-blue-600 shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all duration-500 ease-out"
                :style="{
                  width: `${
                    (activeSectionIndex * 100) / (sections.length - 1)
                  }%`,
                }"
              ></div>
            </div>

            <div
              class="flex flex-col sm:flex-row justify-between items-center gap-4 p-5 border-b transition-colors"
              :class="
                isDark
                  ? 'border-white/5 bg-slate-900/50'
                  : 'border-gray-100 bg-gray-50'
              "
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
                  class="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-all"
                  :class="
                    isDark
                      ? 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent hover:border-white/10'
                      : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border-transparent hover:border-indigo-200'
                  "
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
                  class="text-xl font-bold flex items-center gap-2 transition-colors"
                  :class="isDark ? 'text-white' : 'text-slate-800'"
                >
                  <span
                    class="flex items-center justify-center w-6 h-6 rounded-full border transition-colors"
                    :class="
                      isDark
                        ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50'
                        : 'bg-cyan-600/20 text-cyan-700 border-cyan-600/30'
                    "
                  >
                    {{ activeSectionIndex + 1 }}
                  </span>

                  {{ activeSection.name || "Section Title" }}
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
              </div>
            </div>
            <button
              v-if="!_.isEqual(resumeData, initialResume)"
              @click="
                () => {
                  toast.promise(saveResume, {
                    pending: 'Saving, please hang on :))',
                    success: 'Successful save your resume :))',
                    false: 'Oops, something went wrong, fail to save',
                  });
                }
              "
              class="bg-gradient-to-br from-cyan-100 to-cyan-200 ring-cyan-300 text-cyan-600 ring hover:ring-cyan-400 transition-all rounded-md px-6 py-2 mt-6 text-sm w-50"
            >
              Save changes
            </button>
          </div>
        </div>

        <div class="lg:col-span-7 flex flex-col h-full relative">
          <div
            class="flex-1 backdrop-blur-md border border-white/10 shadow-2xl rounded-xl relative overflow-hidden flex flex-col transition-colors"
            :class="isDark ? 'bg-slate-900/40' : 'bg-gray-100/80'"
          >
            <div
              class="absolute inset-0 opacity-20 bg-[size:20px_20px] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] pointer-events-none"
            ></div>

            <div
              class="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 max-w-[40cm]"
            >
              <div class="flex flex-col items-center min-h-full justify-start">
                <div
                  class="relative w-full max-w-[40cm] min-h-[30cm] bg-white text-black shadow-2xl rounded-sm overflow-hidden ring-1 ring-white/10"
                >
                  <div ref="cvTemplate">
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
</style>
