<script setup>
import { useRoute } from "vue-router";

import { onMounted, ref } from "vue";
import ResumePreview from "../components/ResumePreview.vue";
import Loading from "../components/Loading.vue";
import clientApi from "../configs/api/clientApi";

const route = useRoute();
const resumeId = route.params.resumeId;
const isLoading = ref(false);
const resumeData = ref({});
const loadResume = async () => {
  isLoading.value = true;
  try {
    const { data } = await clientApi.get(`/api/resumes/public/${resumeId}`);
    resumeData.value = data.resume;
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};
onMounted(async () => {
  await loadResume();
});
</script>
<template>
  <Loading v-if="isLoading" />

  <div
    v-else
    class="min-h-screen bg-slate-950 relative font-sans text-slate-300 flex flex-col"
  >
    <div
      class="absolute inset-0 bg-[url('https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/bg-with-grid.png')] bg-cover bg-center opacity-5 pointer-events-none"
    ></div>
    <div
      class="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"
    ></div>
    <div
      class="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"
    ></div>

    <main class="flex-1 relative z-10 w-full flex flex-col">
      <div
        v-if="resumeData"
        class="flex-1 flex flex-col items-center py-12 px-4"
      >
        <div
          class="relative w-full max-w-[21cm] shadow-2xl rounded-sm overflow-hidden ring-1 ring-white/10 transition-all duration-500 ease-out animate-fade-in-up"
        >
          <ResumePreview
            v-model:data="resumeData"
            v-model:template="resumeData.template"
            v-model:accent-color="resumeData.accent_color"
          />

          <div
            v-if="isLoading"
            class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <Loading />
          </div>
        </div>

        <router-link
          to="/"
          class="mt-8 flex items-center gap-2 text-slate-500 hover:text-cyan-400 transition-colors"
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
          Back to Home
        </router-link>
      </div>

      <div v-else class="flex-1 flex items-center justify-center p-4">
        <div
          class="max-w-md w-full bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden"
        >
          <div
            class="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 bg-red-500/10 rounded-full blur-[40px]"
          ></div>

          <div
            class="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-white/10"
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
              class="text-slate-400"
            >
              <path
                d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"
              />
              <path d="M12 13v4" />
              <path d="M12 17h.01" />
              <path d="M10 9h4" />
            </svg>
          </div>

          <h2 class="text-2xl font-bold text-white mb-2">Resume Not Found</h2>
          <p class="text-slate-400 mb-8 leading-relaxed">
            The resume you are looking for might have been removed, renamed, or
            is temporarily unavailable.
          </p>

          <router-link
            to="/"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold shadow-lg shadow-cyan-500/25 transition-all active:scale-95 group"
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
              class="transition-transform group-hover:-translate-x-1"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Go to Homepage
          </router-link>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}
</style>
