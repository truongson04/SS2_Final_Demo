<script setup>
import { onMounted, ref } from "vue";
import { Transition } from "vue";
import { dummyData } from "../assets/assets";
import { useRouter } from "vue-router";
import clientApi from "../configs/api/clientApi";
import Loading from "../components/Loading.vue";
import { toast } from "vue3-toastify";
import { useTheme } from "../composables/useTheme";

import extractTextFromPDF from "../composables/useTextFromPdf";

const { isDark } = useTheme();

const allResumes = ref([]);
const isLoading = ref(false);
const router = useRouter();
const showCreate = ref(false);
const showUpload = ref(false);
const title = ref("");
const resume = ref(null);
const editResumeId = ref("");
const loadAllResumes = async () => {
  isLoading.value = true;
  try {
    const { data } = await clientApi.get("/api/users/resumes");
    allResumes.value = data.resumes;
  } catch (err) {
    console.log(err);
    toast.error(err?.response?.data?.message || err.message);
  } finally {
    isLoading.value = false;
  }
};

// hàm tạo CV
const createResume = async () => {
  try {
    const { data } = await clientApi.post("/api/resumes/create", {
      title: title.value,
    });

    allResumes.value.push(data.resume);
    showCreate.value = false;
    title.value = "";
    toast.success(data.message);
    router.push({
      name: "ResumeBuilder",
      params: {
        resumeId: data.resume._id,
      },
    });
  } catch (error) {
    toast.error(error?.response?.data?.message || error.message);
  }
};

// hàm tải CV
const uploadResume = async () => {
  isLoading.value = true;
  try {
    const resumeText = await extractTextFromPDF(resume.value);
    const { data } = await clientApi.post("/api/ai/upload-resume", {
      title: title.value,
      resumeText,
    });

    resume.value = null;
    showUpload.value = false;

    title.value = "";
    router.push({
      name: "ResumeBuilder",
      params: {
        resumeId: data.resumeId,
      },
    });
    toast.info(data.message, {
      autoClose: 5000,
    });
    isLoading.value = false;
  } catch (error) {
    console.log(error);
    isLoading.value = false;

    toast.error("Please check your uploaded file and try again");
  }
};
const editTitle = async () => {
  try {
    const { data } = await clientApi.put("/api/resumes/update", {
      resumeId: editResumeId.value,
      resumeData: { title: title.value },
    });
    await loadAllResumes();
    title.value = "";
    editResumeId.value = "";
    toast.success(data.message);
  } catch (error) {
    isLoading.value = false;
    toast.error(error?.response?.data?.message || error.message);
  }
};
// hàm xóa CV khi biết id
const deleteResume = async (resumeId) => {
  const confirm = window.confirm("Are you sure want to delete this resume ?");
  try {
    if (confirm) {
      const { data } = await clientApi.delete(
        `/api/resumes/delete/${resumeId}`,
      );
      await loadAllResumes();
      toast.success(data.message);
    }
  } catch (error) {
    isLoading.value = false;
    toast.error(error?.response?.data?.message || error.message);
  }
};
onMounted(() => {
  loadAllResumes();
});
</script>
<template>
  <Loading v-if="isLoading" />
  <div
    v-else
    class="w-full relative font-sans transition-colors duration-300"
    :class="isDark ? 'text-slate-300' : 'text-slate-700'"
  >
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
      <div
        class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12"
      >
        <div>
          <h1
            class="text-3xl md:text-4xl font-bold tracking-tight transition-colors"
            :class="isDark ? 'text-white' : 'text-slate-800'"
          >
            My Resumes
          </h1>
          <p
            class="mt-2 transition-colors"
            :class="isDark ? 'text-slate-400' : 'text-slate-500'"
          >
            Manage your professional profiles and create new ones.
          </p>
        </div>

        <div class="flex items-center gap-4">
          <button
            @click="showUpload = true"
            class="flex items-center gap-2 px-5 py-2.5 rounded-lg border font-medium group transition-all active:scale-95"
            :class="
              isDark
                ? 'border-slate-700 bg-slate-900/50 text-slate-300 hover:text-white hover:border-cyan-500/50 hover:bg-slate-800'
                : 'border-slate-300 bg-white text-slate-600 hover:text-slate-900 hover:border-cyan-500 hover:bg-slate-50 shadow-sm'
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 group-hover:text-cyan-500 transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            <span>Upload Existing CV</span>
          </button>

          <button
            @click="showCreate = true"
            class="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all active:scale-95"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>Create New</span>
          </button>
        </div>
      </div>

      <div
        v-if="allResumes.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <div v-for="(resume, index) in allResumes" :key="index">
          <div
            class="group relative w-full h-64 flex flex-col rounded-2xl border hover:border-cyan-500/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            :class="[
              isDark
                ? 'border-white/10 bg-slate-900/40 hover:bg-slate-900/60 hover:shadow-[0_0_40px_rgba(6,182,212,0.2)] backdrop-blur-md'
                : 'border-slate-200 bg-white hover:bg-slate-50 hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] shadow-sm',
              { 'opacity-60 grayscale hover:grayscale-0': resume.isLocked },
            ]"
          >
            <!-- Locked Badge -->
            <div
              v-if="resume.isLocked"
              class="absolute top-3 left-3 z-30 bg-red-500/90 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded shadow-sm flex items-center gap-1"
              :class="isDark ? 'backdrop-blur-md' : ''"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Locked by Admin
            </div>

            <div
              class="flex-1 flex flex-col items-center justify-center p-6 text-center z-10 cursor-pointer"
            >
              <div
                class="mb-4 p-4 rounded-full group-hover:scale-110 transition-all duration-300"
                :class="
                  isDark
                    ? 'bg-slate-800/50 group-hover:bg-cyan-500/10'
                    : 'bg-slate-100 group-hover:bg-cyan-50'
                "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="group-hover:text-cyan-500 transition-colors"
                  :class="isDark ? 'text-slate-400' : 'text-slate-500'"
                >
                  <path
                    d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"
                  />
                  <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                  <path d="M10 9H8" />
                  <path d="M16 13H8" />
                  <path d="M16 17H8" />
                </svg>
              </div>

              <h3
                class="text-lg font-bold group-hover:text-cyan-500 transition-colors line-clamp-1"
                :class="isDark ? 'text-white' : 'text-slate-800'"
              >
                {{ resume.title }}
              </h3>
              <p
                class="text-sm mt-2 font-medium transition-colors"
                :class="isDark ? 'text-slate-500' : 'text-slate-400'"
              >
                Updated {{ new Date(resume.updatedAt).toLocaleDateString() }}
              </p>
            </div>

            <div
              class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 z-20"
              :class="
                isDark ? 'bg-slate-950/60 backdrop-blur-[2px]' : 'bg-white/75'
              "
            >
              <button
                @click.stop="
                  () => {
                    if (resume.isLocked) {
                      toast.error(
                        'This resume is locked by the admin and cannot be edited.',
                      );
                      return;
                    }
                    editResumeId = resume._id;
                    title = resume.title;
                  }
                "
                class="p-3 rounded-full bg-cyan-500/20 text-cyan-500 hover:bg-cyan-500 hover:text-white border border-cyan-500/50 transition-all transform hover:scale-110"
                title="Edit Title"
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
                >
                  <path
                    d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
                  />
                  <path d="m15 5 4 4" />
                </svg>
              </button>

              <button
                @click.stop="
                  () => {
                    if (resume.isLocked) {
                      toast.error(
                        'This resume is locked by the admin and cannot be deleted here.',
                      );
                      return;
                    }
                    deleteResume(resume._id);
                  }
                "
                class="p-3 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/30 transition-all transform hover:scale-110"
                title="Delete Resume"
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
                >
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </svg>
              </button>

              <button
                class="p-3 rounded-full bg-cyan-500/20 text-cyan-500 hover:bg-cyan-500 hover:text-white border border-cyan-500/50 transition-all transform hover:scale-110"
                title="View Resume"
                @click.stop="
                  () => {
                    if (resume.isLocked) {
                      toast.error(
                        'This resume is locked by the admin and cannot be edited.',
                      );
                      return;
                    }
                    router.push(`/app/builder/${resume._id}`);
                  }
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
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M17 12h.01" />
                  <path d="M12 12h.01" />
                  <path d="M7 12h.01" />
                </svg>
              </button>
            </div>

            <div
              class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
            ></div>
          </div>
        </div>

        <button
          @click="showCreate = true"
          class="group w-full h-64 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-300"
          :class="
            isDark
              ? 'border-slate-700/50 bg-slate-900/20 hover:border-cyan-500/50 hover:bg-slate-900/40 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]'
              : 'border-slate-300 bg-slate-50/50 hover:border-cyan-400 hover:bg-cyan-50/30'
          "
        >
          <div
            class="p-4 rounded-full transition-all duration-300 group-hover:bg-cyan-500 group-hover:text-white"
            :class="
              isDark
                ? 'bg-slate-800 text-slate-400'
                : 'bg-slate-200 text-slate-500'
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
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
          </div>
          <p
            class="mt-4 font-semibold group-hover:text-cyan-500 transition-colors"
            :class="isDark ? 'text-slate-400' : 'text-slate-500'"
          >
            Create New Resume
          </p>
        </button>
      </div>

      <div
        v-else
        class="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-3xl transition-colors"
        :class="
          isDark
            ? 'border-slate-800 bg-slate-900/20'
            : 'border-slate-200 bg-slate-50'
        "
      >
        <div
          class="w-20 h-20 rounded-full flex items-center justify-center mb-6 animate-pulse"
          :class="isDark ? 'bg-slate-800' : 'bg-slate-200'"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            :class="isDark ? 'text-slate-500' : 'text-slate-400'"
          >
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
            <path
              d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"
            />
          </svg>
        </div>
        <h3
          class="text-xl font-bold mb-2"
          :class="isDark ? 'text-white' : 'text-slate-800'"
        >
          No resumes found
        </h3>
        <p
          class="max-w-md mb-8"
          :class="isDark ? 'text-slate-400' : 'text-slate-500'"
        >
          You haven't created any resumes yet. Start by creating a new one or
          uploading an existing file.
        </p>
        <button
          @click="
            () => {
              showCreate = true;
            }
          "
          class="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-full transition shadow-lg shadow-cyan-500/20"
        >
          Create First Resume
        </button>
      </div>

      <!-- Modal: Create Resume -->
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showCreate"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          :class="isDark ? 'backdrop-blur-sm' : ''"
          @click="showCreate = false"
        >
          <div
            @click.stop
            class="relative w-full max-w-md transform overflow-hidden rounded-2xl border shadow-2xl transition-all"
            :class="
              isDark
                ? 'bg-slate-900 border-white/10'
                : 'bg-white border-slate-200'
            "
          >
            <div
              class="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-cyan-500/20 rounded-full blur-[50px] pointer-events-none"
            ></div>

            <form
              @submit.prevent="createResume"
              class="relative z-10 p-6 sm:p-8"
            >
              <div class="mb-6">
                <h2
                  class="text-2xl font-bold"
                  :class="isDark ? 'text-white' : 'text-slate-800'"
                >
                  Create New Resume
                </h2>
                <p
                  class="text-sm mt-1"
                  :class="isDark ? 'text-slate-400' : 'text-slate-500'"
                >
                  Give your resume a name to get started.
                </p>
              </div>

              <div class="mb-6 group">
                <label
                  for="title"
                  class="block text-sm font-medium mb-2"
                  :class="isDark ? 'text-slate-300' : 'text-slate-600'"
                  >Resume Title</label
                >
                <div class="relative">
                  <div
                    class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 group-focus-within:text-cyan-400 transition"
                      :class="isDark ? 'text-slate-500' : 'text-slate-400'"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="title"
                    placeholder="e.g. Java backend developer"
                    required
                    v-model="title"
                    class="w-full pl-10 pr-4 py-2.5 rounded-lg border focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition shadow-inner"
                    :class="
                      isDark
                        ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-500'
                        : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                    "
                    autofocus
                  />
                </div>
              </div>

              <div class="flex items-center justify-end gap-3 mt-8">
                <button
                  type="button"
                  @click="showCreate = false"
                  class="px-4 py-2.5 rounded-lg font-medium text-sm transition"
                  :class="
                    isDark
                      ? 'text-slate-300 hover:text-white hover:bg-white/5'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  "
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-lg shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all active:scale-95 text-sm"
                >
                  Create Resume
                </button>
              </div>

              <button
                type="button"
                @click="
                  () => {
                    showCreate = false;
                    title = '';
                  }
                "
                class="absolute top-4 right-4 p-1.5 rounded-full transition"
                :class="
                  isDark
                    ? 'text-slate-400 hover:text-white hover:bg-white/10'
                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                "
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
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </Transition>

      <!-- Modal: Edit Title -->
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="editResumeId"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          :class="isDark ? 'backdrop-blur-sm' : ''"
          @click="editResumeId = ''"
        >
          <div
            @click.stop
            class="relative w-full max-w-md transform overflow-hidden rounded-2xl border shadow-2xl transition-all"
            :class="
              isDark
                ? 'bg-slate-900 border-white/10'
                : 'bg-white border-slate-200'
            "
          >
            <div
              class="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-cyan-500/20 rounded-full blur-[50px] pointer-events-none"
            ></div>

            <form @submit.prevent="editTitle" class="relative z-10 p-6 sm:p-8">
              <div class="mb-6">
                <h2
                  class="text-2xl font-bold"
                  :class="isDark ? 'text-white' : 'text-slate-800'"
                >
                  Edit Resume
                </h2>
                <p
                  class="text-sm mt-1"
                  :class="isDark ? 'text-slate-400' : 'text-slate-500'"
                >
                  Give your resume a name to get started.
                </p>
              </div>

              <div class="mb-6 group">
                <label
                  for="edit-title"
                  class="block text-sm font-medium mb-2"
                  :class="isDark ? 'text-slate-300' : 'text-slate-600'"
                  >Resume Title</label
                >
                <div class="relative">
                  <div
                    class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 group-focus-within:text-cyan-400 transition"
                      :class="isDark ? 'text-slate-500' : 'text-slate-400'"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="edit-title"
                    placeholder="e.g. Java backend developer"
                    required
                    v-model="title"
                    class="w-full pl-10 pr-4 py-2.5 rounded-lg border focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition shadow-inner"
                    :class="
                      isDark
                        ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-500'
                        : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                    "
                    autofocus
                  />
                </div>
              </div>

              <div class="flex items-center justify-end gap-3 mt-8">
                <button
                  type="button"
                  @click="editResumeId = false"
                  class="px-4 py-2.5 rounded-lg font-medium text-sm transition"
                  :class="
                    isDark
                      ? 'text-slate-300 hover:text-white hover:bg-white/5'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  "
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-lg shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all active:scale-95 text-sm"
                >
                  Update
                </button>
              </div>

              <button
                type="button"
                @click="
                  () => {
                    editResumeId = '';
                    title = '';
                  }
                "
                class="absolute top-4 right-4 p-1.5 rounded-full transition"
                :class="
                  isDark
                    ? 'text-slate-400 hover:text-white hover:bg-white/10'
                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                "
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
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </Transition>

      <!-- Modal: Upload Resume -->
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showUpload"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          :class="isDark ? 'backdrop-blur-sm' : ''"
          @click="showUpload = false"
        >
          <div
            @click.stop
            class="relative w-full max-w-md transform overflow-hidden rounded-2xl border shadow-2xl transition-all"
            :class="
              isDark
                ? 'bg-slate-900 border-white/10'
                : 'bg-white border-slate-200'
            "
          >
            <div
              class="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-cyan-500/20 rounded-full blur-[50px] pointer-events-none"
            ></div>

            <form
              @submit.prevent="uploadResume"
              class="relative z-10 p-6 sm:p-8"
            >
              <div class="mb-6">
                <h2
                  class="text-2xl font-bold"
                  :class="isDark ? 'text-white' : 'text-slate-800'"
                >
                  Upload Resume
                </h2>
                <p
                  class="text-sm mt-1"
                  :class="isDark ? 'text-slate-400' : 'text-slate-500'"
                >
                  Import your existing CV (PDF) to get started.
                </p>
              </div>

              <div class="mb-5 group">
                <label
                  for="upload-title"
                  class="block text-sm font-medium mb-2"
                  :class="isDark ? 'text-slate-300' : 'text-slate-600'"
                  >Resume Title</label
                >
                <div class="relative">
                  <div
                    class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 group-focus-within:text-cyan-400 transition"
                      :class="isDark ? 'text-slate-500' : 'text-slate-400'"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="upload-title"
                    placeholder="e.g. Java Backend Developer"
                    required
                    v-model="title"
                    class="w-full pl-10 pr-4 py-2.5 rounded-lg border focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition shadow-inner"
                    :class="
                      isDark
                        ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-500'
                        : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                    "
                    autofocus
                  />
                </div>
              </div>

              <div class="mb-6">
                <label
                  class="block text-sm font-medium mb-2"
                  :class="isDark ? 'text-slate-300' : 'text-slate-600'"
                  >Select Resume File</label
                >
                <div class="relative group">
                  <input
                    type="file"
                    id="file-upload"
                    class="hidden"
                    accept=".pdf"
                    @change="
                      ($event) => {
                        resume = $event.target.files[0];
                      }
                    "
                  />
                  <label
                    for="file-upload"
                    class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                    :class="
                      isDark
                        ? 'border-slate-700 bg-slate-950/30 hover:bg-slate-950/50 hover:border-cyan-500/50'
                        : 'border-slate-300 bg-slate-50 hover:bg-cyan-50/30 hover:border-cyan-400'
                    "
                  >
                    <div
                      v-if="resume"
                      class="flex flex-col items-center animate-pulse"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="text-green-400 mb-2"
                      >
                        <path
                          d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"
                        />
                        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                        <path d="M10 9H8" />
                        <path d="M16 13H8" />
                        <path d="M16 17H8" />
                      </svg>
                      <p
                        class="text-sm font-medium truncate max-w-[200px]"
                        :class="isDark ? 'text-white' : 'text-slate-700'"
                      >
                        {{ resume.name || resume }}
                      </p>
                      <p class="text-xs text-cyan-500 mt-1">
                        Click to change file
                      </p>
                    </div>
                    <div
                      v-else
                      class="flex flex-col items-center text-center p-4"
                    >
                      <div
                        class="p-2 rounded-full transition mb-3"
                        :class="
                          isDark
                            ? 'bg-slate-800 text-slate-400 group-hover:text-cyan-400 group-hover:bg-cyan-500/10'
                            : 'bg-slate-200 text-slate-400 group-hover:text-cyan-500 group-hover:bg-cyan-100'
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
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" x2="12" y1="3" y2="15" />
                        </svg>
                      </div>
                      <p
                        class="text-sm"
                        :class="isDark ? 'text-slate-300' : 'text-slate-600'"
                      >
                        <span class="font-bold text-cyan-500"
                          >Click to upload</span
                        >
                        or drag and drop
                      </p>
                      <p
                        class="text-xs mt-1"
                        :class="isDark ? 'text-slate-500' : 'text-slate-400'"
                      >
                        PDF (Max 5MB)
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <div class="flex items-center justify-end gap-3 mt-8">
                <button
                  type="button"
                  @click="showUpload = false"
                  class="px-4 py-2.5 rounded-lg font-medium text-sm transition"
                  :class="
                    isDark
                      ? 'text-slate-300 hover:text-white hover:bg-white/5'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  "
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-lg shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all active:scale-95 text-sm"
                >
                  Upload Resume
                </button>
              </div>

              <button
                type="button"
                @click="showUpload = false"
                class="absolute top-4 right-4 p-1.5 rounded-full transition"
                :class="
                  isDark
                    ? 'text-slate-400 hover:text-white hover:bg-white/10'
                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                "
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
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </Transition>
    </main>
  </div>
</template>
