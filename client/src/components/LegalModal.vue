<script setup>
import { computed } from "vue";

const props = defineProps({
  isOpen: Boolean,
  type: {
    type: String,
    default: "terms", // 'terms' | 'privacy'
  },
});

const emit = defineEmits(["close"]);

const termsContent = [
  {
    title: "1. Acceptance of Terms",
    content: "By accessing and using CVBuilder, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service."
  },
  {
    title: "2. User Accounts",
    content: "When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service."
  },
  {
    title: "3. A.I. Features Usage",
    content: "Our service utilizes Artificial Intelligence (AI) to generate, optimize, and suggest resume content. You acknowledge that AI-generated content may not always be accurate or appropriate. You are solely responsible for reviewing, editing, and verifying all AI-generated content before using it in any professional capacity."
  }
];

const privacyContent = [
  {
    title: "Information We Collect",
    content: "We collect Account Information (Name, email address, profile picture via OAuth), Resume Data (Professional experience, education, skills), and Usage Data."
  },
  {
    title: "How We Use Your Information",
    content: "We use the information we collect to provide, operate, and maintain our website, and process your data through third-party AI APIs (e.g., Google Gemini) exclusively to provide you with resume writing assistance features."
  },
  {
    title: "Third-Party Services",
    content: "We utilize Google Gemini AI models to power our intelligent chat and CV generation features. By using these features, you consent to your input data being processed by Google in accordance with their respective privacy policies. We do not use your personal resume data to train our own public AI models."
  }
];

const content = computed(() => props.type === "terms" ? termsContent : privacyContent);
const title = computed(() => props.type === "terms" ? "Terms of Service" : "Privacy Policy");

</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
      @click="emit('close')"
    >
      <div
        class="relative w-full max-w-2xl max-h-[85vh] flex flex-col bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden transform transition-all scale-100"
        @click.stop
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50">
          <h3 class="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            {{ title }}
          </h3>
          <button
            @click="emit('close')"
            class="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-2 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <!-- Body -->
        <div class="flex-grow p-6 overflow-y-auto space-y-6 custom-scrollbar">
          <div v-for="(item, index) in content" :key="index" class="space-y-2">
            <h4 class="text-lg font-semibold text-slate-200">{{ item.title }}</h4>
            <p class="text-slate-400 leading-relaxed">{{ item.content }}</p>
          </div>
          
          <div v-if="type === 'terms'" class="text-sm text-slate-500 mt-8 pt-4 border-t border-slate-800">
            By clicking "Accept" or continuing to use the service, you agree to these terms.
          </div>
        </div>

        <!-- Footer -->
        <div class="p-4 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3 rounded-b-2xl">
          <button
            @click="emit('close')"
            class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold transition shadow-lg shadow-cyan-500/20 active:scale-95"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.5); /* slate-900 */
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(51, 65, 85, 0.8); /* slate-700 */
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(71, 85, 105, 1); /* slate-600 */
}
</style>
