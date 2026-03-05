<script setup>
import { onMounted, ref } from "vue";
import clientApi from "../configs/api/clientApi";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import ResumeDisplay from "../components/ResumeDisplay.vue";

const route = useRoute();
const router = useRouter();

const user = ref({});
const resumeList = ref([]);
const showModal = ref(false);
const selectedResume = ref(null);

const userId = route.params.userId;

const openResume = (resume) => {
  selectedResume.value = resume;
  showModal.value = true;
};

const closeResume = () => {
  showModal.value = false;
  selectedResume.value = null;
};

onMounted(async () => {
  try {
    const { data } = await clientApi.get(`/api/admin/user/${userId}`);
    user.value = data.user;
    for (const resume of data.resumes) {
      resumeList.value.push(resume);
    }
  } catch (error) {
    toast.error(error.message);
    console.log(error);
  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 pb-12">
    <header
      class="bg-white shadow-sm sticky top-0 z-10 transition-shadow duration-300"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <button
              @click="router.back()"
              class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-2 -ml-1 text-gray-500 group-hover:text-indigo-500 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Users
            </button>
            <h1
              class="ml-6 text-xl font-bold text-gray-900 truncate tracking-tight"
            >
              Candidate Profile
            </h1>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <div
        class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-10 flex flex-col items-center transform transition-all hover:shadow-md relative overflow-hidden"
      >
        <div
          class="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-t-2xl opacity-10"
        ></div>

        <div class="relative mt-2">
          <img
            class="h-32 w-32 object-cover rounded-full ring-4 ring-white shadow-lg mb-6 z-10 relative"
            src="https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"
            alt="User avatar"
          />
        </div>

        <h2
          class="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight text-center"
        >
          {{ user.name || "Loading details..." }}
        </h2>

        <a
          v-if="user.email"
          :href="`https://mail.google.com/mail/?view=cm&fs=1&to=${user.email}`"
          target="_blank"
          class="inline-flex items-center text-indigo-700 hover:text-indigo-900 transition-colors font-medium bg-indigo-50 hover:bg-indigo-100 px-6 py-2.5 rounded-full shadow-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-2.5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
            />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          {{ user.email }}
        </a>
      </div>

      <div class="mb-6 flex items-center justify-between">
        <h3 class="text-2xl font-bold text-gray-900 flex items-center">
          Candidate Resumes
        </h3>
        <span
          class="text-sm text-indigo-700 bg-indigo-100 px-3.5 py-1.5 rounded-full font-semibold shadow-sm border border-indigo-200"
        >
          {{ resumeList.length }}
          {{ resumeList.length === 1 ? "Resume" : "Resumes" }}
        </span>
      </div>

      <div
        v-if="resumeList.length === 0"
        class="bg-white rounded-3xl border border-gray-100 p-16 text-center shadow-sm"
      >
        <div
          class="bg-gray-50 h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">
          No resumes available
        </h3>
        <p class="text-gray-500 max-w-sm mx-auto">
          This candidate hasn't created or uploaded any resumes to their profile
          yet.
        </p>
      </div>

      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8"
      >
        <div
          v-for="resume in resumeList"
          :key="resume.id || resume._id || Math.random()"
          class="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col transform hover:-translate-y-1.5"
          @click="openResume(resume)"
        >
          <div
            class="h-44 flex flex-col items-center justify-center p-6 relative overflow-hidden border-b border-gray-600"
          >
            <div
              class="absolute inset-0 group-hover:opacity-10 transition-opacity duration-300"
            >
              <ResumeDisplay
                :data="resume"
                :template="resume.template"
                :accent-color="resume.accent_color"
              />
            </div>
            <div
              class="absolute -bottom-6 -right-6 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"
            ></div>
            <div
              class="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            ></div>
          </div>
          <div
            class="p-6 flex-1 flex flex-col justify-between relative bg-white"
          >
            <div>
              <h4 class="text-xl font-bold text-gray-900 line-clamp-2 mb-2">
                {{ resume.title || "Untitled Resume" }}
              </h4>
              <p
                class="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed"
              >
                Click to view the detailed template and contents of this resume
                document.
              </p>
            </div>
            <div
              class="flex items-center text-sm font-semibold text-indigo-600 mt-auto opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 relative"
            >
              <span class="relative z-10 flex items-center">
                Preview Resume
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 ml-1.5 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          <div
            class="absolute inset-0 bg-gray-900/80 backdrop-blur-sm transition-opacity"
            @click="closeResume"
          ></div>

          <div
            class="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden transform transition-all border border-gray-200"
          >
            <div
              class="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white z-10 sticky top-0 shadow-sm"
            >
              <div class="flex items-center space-x-4">
                <h3
                  class="text-xl font-bold text-gray-900 truncate max-w-[200px] sm:max-w-md"
                >
                  {{ selectedResume?.title || "Resume Preview" }}
                </h3>
              </div>
              <button
                @click="closeResume"
                class="text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 transition-colors rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500"
                title="Close preview"
              >
                <span class="sr-only">Close</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div
              class="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-8 flex justify-center custom-scrollbar inset-shadow-sm"
            >
              <ResumeDisplay
                v-if="selectedResume"
                class="w-full max-w-4xl bg-white shadow-lg rounded-xl mx-auto min-h-full"
                :data="selectedResume"
                :template="selectedResume.template"
                :accent-color="selectedResume.accent_color"
              />
            </div>

            <div
              class="bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end"
            >
              <button
                @click="closeResume"
                class="inline-flex justify-center items-center px-6 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 20px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #94a3b8;
}
</style>
