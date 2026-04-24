<template>
  <admin-loading :is-loading="loading" />
  <div class="min-h-screen pb-12 transition-colors duration-300 bg-gray-50">
    <!-- Header -->
    <header
      class="sticky top-0 z-10 transition-all duration-300 bg-white shadow-sm"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-8">
            <h1
              class="text-xl font-bold tracking-tight flex items-center transition-colors text-gray-900"
            >
              Admin Portal
            </h1>
            <nav class="hidden md:flex space-x-4">
              <router-link
                to="/admin"
                class="px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-500 hover:text-gray-900"
              >
                Users
              </router-link>
              <router-link
                to="/admin/resumes"
                class="px-3 py-2 rounded-md text-sm font-medium transition-colors bg-indigo-50 text-indigo-700"
              >
                Resumes
              </router-link>
            </nav>
          </div>
          <div class="flex gap-5 items-center">
            <h1
              class="text-right text-sm font-medium transition-colors text-gray-700"
            >
              Welcome {{ authStore.user?.name }} !
            </h1>
            <button
              class="bg-red-500 px-4 py-2 rounded-lg text-white text-sm font-medium cursor-pointer hover:bg-red-700 transition-colors"
              @click="handleLogout"
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <!-- Dashboard Stats for Resumes -->
      <div
        v-if="templateStats.length > 0"
        class="flex overflow-x-auto gap-6 mb-8 custom-scrollbar pb-2"
      >
        <!-- Total Resumes card -->
        <div
          class="min-w-[200px] rounded-2xl shadow-sm border p-6 flex items-center justify-between shrink-0 transition-colors bg-white border-gray-100"
        >
          <div>
            <p class="text-sm font-medium mb-1 transition-colors text-gray-500">
              Total Resumes
            </p>
            <h3 class="text-2xl font-bold transition-colors text-gray-900">
              {{ pagination.total }}
            </h3>
          </div>
        </div>
        <!-- Template Stats -->
        <div
          v-for="stat in templateStats"
          :key="stat._id"
          class="min-w-[200px] rounded-2xl shadow-sm border p-6 flex items-center justify-between shrink-0 border-l-4 transition-colors bg-white border-gray-100"
        >
          <div>
            <p
              class="text-sm font-medium mb-1 capitalize transition-colors text-gray-500"
            >
              {{ stat._id || "Unknown" }} Template
            </p>
            <h3 class="text-2xl font-bold transition-colors text-gray-900">
              {{ stat.count }} usage
            </h3>
          </div>
        </div>
      </div>

      <!-- Top Action Bar -->
      <div
        class="rounded-2xl shadow-sm border p-6 mb-6 transition-colors bg-white border-gray-100"
      >
        <div
          class="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <!-- Search -->
          <div class="relative w-full md:w-1/3">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <svg
                class="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              v-model="searchInput"
              @keyup.enter="handleSearch"
              class="block w-full pl-10 pr-3 py-2.5 border rounded-xl leading-5 transition-colors sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400"
              placeholder="Search by resume title (Enter)..."
            />
          </div>

          <!-- Actions: Filters -->
          <div class="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
            <!-- Filter Dropdown -->
            <div class="relative" ref="filterDropdownContainer">
              <button
                @click.prevent="openFilters = !openFilters"
                class="inline-flex items-center px-4 py-2.5 border shadow-sm text-sm font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors border-gray-200 text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-2 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                Filters
                <span
                  v-if="activeFilterCount > 0"
                  class="ml-1.5 bg-indigo-100 text-indigo-600 py-0.5 px-2 rounded-full text-xs font-bold"
                  >{{ activeFilterCount }}</span
                >
              </button>

              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <div
                  v-show="openFilters"
                  class="origin-top-right absolute right-0 mt-2 w-72 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 z-30 overflow-hidden transition-colors bg-white"
                >
                  <div class="p-4 bg-white" role="menu">
                    <!-- Date Range -->
                    <h3
                      class="text-xs font-bold uppercase tracking-wider mb-3 transition-colors text-gray-500"
                    >
                      Filter by Created Date
                    </h3>
                    <div class="grid grid-cols-2 gap-3 mb-4">
                      <div>
                        <label class="block text-xs text-gray-700 mb-1"
                          >From</label
                        >
                        <input
                          type="date"
                          v-model="filterForm.startDate"
                          class="w-full text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label class="block text-xs text-gray-700 mb-1"
                          >To</label
                        >
                        <input
                          type="date"
                          v-model="filterForm.endDate"
                          class="w-full text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <!-- Owner & Template -->
                    <h3
                      class="text-xs font-bold uppercase tracking-wider mb-3 mt-4 transition-colors text-gray-500"
                    >
                      Filter by Details
                    </h3>
                    <div class="space-y-3 mb-4">
                      <div>
                        <label class="block text-xs text-gray-700 mb-1"
                          >User Name</label
                        >
                        <input
                          type="text"
                          placeholder="e.g. John Doe"
                          v-model="filterForm.userName"
                          class="w-full text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label class="block text-xs text-gray-700 mb-1"
                          >Template Type</label
                        >
                        <select
                          v-model="filterForm.template"
                          class="w-full text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="">All Templates</option>
                          <option value="classic">
                            <span class="capitalize">Classic</span>
                          </option>
                          <option value="modern">
                            <span class="capitalize">Modern</span>
                          </option>
                          <option value="minimal-image">
                            <span class="capitalize">Minimal-image</span>
                          </option>
                          <option value="minimal">
                            <span class="capitalize">Minimal</span>
                          </option>
                        </select>
                      </div>
                    </div>

                    <div
                      class="flex justify-end gap-2 mt-5 pt-3 border-t transition-colors border-gray-100"
                    >
                      <button
                        @click="resetFilters"
                        class="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        Reset
                      </button>
                      <button
                        @click="applyFilters"
                        class="px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-md hover:bg-indigo-700 transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>

      <!-- Resumes Table -->
      <div
        class="rounded-2xl shadow-sm border overflow-hidden transition-colors bg-white border-gray-100"
      >
        <div class="overflow-x-auto custom-scrollbar">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-4 text-left text-xs font-bold uppercase sticky top-0 bg-gray-50 z-10"
                >
                  Title
                </th>
                <th
                  scope="col"
                  class="px-6 py-4 text-left text-xs font-bold uppercase sticky top-0 bg-gray-50 z-10"
                >
                  Owner
                </th>
                <th
                  scope="col"
                  class="px-6 py-4 text-left text-xs font-bold uppercase sticky top-0 bg-gray-50 z-10"
                >
                  Template
                </th>
                <th
                  scope="col"
                  class="px-6 py-4 text-left text-xs font-bold uppercase sticky top-0 bg-gray-50 z-10"
                >
                  Created At
                </th>
                <th
                  scope="col"
                  class="px-6 py-4 text-left text-xs font-bold uppercase sticky top-0 bg-gray-50 z-10"
                >
                  Visibility
                </th>
                <th
                  scope="col"
                  class="px-6 py-4 text-left text-xs font-bold uppercase sticky top-0 bg-gray-50 z-10"
                >
                  Action/Status
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100">
              <tr
                v-for="resume in resumes"
                :key="resume._id"
                class="transition-colors duration-150 hover:bg-indigo-50/30"
              >
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium transition-colors text-gray-900"
                >
                  {{ resume.title }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <p class="font-medium transition-colors text-gray-900">
                    {{ resume.ownerName || "Unknown User" }}
                  </p>
                  <p class="text-xs text-indigo-500">
                    {{ resume.ownerEmail || "" }}
                  </p>
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm capitalize transition-colors text-gray-500"
                >
                  <span
                    class="px-2 py-1 rounded-md text-xs font-medium border transition-colors bg-gray-100 text-gray-600 border-gray-200"
                    >{{ resume.template }}</span
                  >
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm transition-colors text-gray-500"
                >
                  {{ formatDate(resume.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    :class="
                      resume.public
                        ? 'text-green-600 bg-green-50 px-2 py-1 rounded-md'
                        : 'text-gray-500 bg-gray-100'
                    "
                  >
                    {{ resume.public ? "Public" : "Private" }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <div class="flex items-center gap-2">
                    <button
                      @click="openResume(resume)"
                      class="px-3 py-1.5 rounded-md text-xs font-bold shadow-sm transition-colors border bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100"
                    >
                      View Details
                    </button>
                    <button
                      @click="toggleLock(resume)"
                      class="px-3 py-1.5 rounded-md text-xs font-bold shadow-sm transition-colors border"
                      :class="
                        resume.isLocked
                          ? 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100'
                          : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                      "
                    >
                      {{ resume.isLocked ? "Unlock" : "Lock/Hide" }}
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="resumes.length === 0 && !loading">
                <td
                  colspan="6"
                  class="px-6 py-12 text-center transition-colors text-gray-500"
                >
                  No resumes found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Server Pagination -->
        <div
          class="px-6 py-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors bg-gray-50 border-gray-200"
        >
          <div
            class="text-sm flex items-center gap-4 transition-colors text-gray-500"
          >
            <span
              >Showing
              <span class="font-medium transition-colors text-gray-900">{{
                resumes.length
              }}</span>
              items</span
            >
            <div class="flex items-center gap-2">
              <span class="text-sm transition-colors text-gray-500"
                >Rows per page:</span
              >
              <select
                v-model="pagination.limit"
                @change="changeLimit"
                class="text-sm rounded-md py-1 pl-2 pr-6 transition-colors border-gray-300"
              >
                <option :value="10">10</option>
                <option :value="30">30</option>
                <option :value="50">50</option>
              </select>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="changePage(pagination.page - 1)"
              :disabled="pagination.page <= 1"
              class="px-3 py-1.5 border rounded-md text-sm font-medium disabled:opacity-50 transition-colors border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            >
              Previous
            </button>
            <span class="text-sm px-2 transition-colors text-gray-700"
              >Page {{ pagination.page }} of
              {{ pagination.totalPages || 1 }}</span
            >
            <button
              @click="changePage(pagination.page + 1)"
              :disabled="pagination.page >= pagination.totalPages"
              class="px-3 py-1.5 border rounded-md text-sm font-medium disabled:opacity-50 transition-colors border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Resume Preview Modal -->
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
            class="absolute inset-0 backdrop-blur-sm transition-opacity bg-gray-900/70"
            @click="closeResume"
          ></div>

          <div
            class="relative w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden transform transition-all border bg-white border-gray-200"
          >
            <div
              class="flex items-center justify-between px-6 py-4 border-b z-10 sticky top-0 shadow-sm transition-colors bg-white border-gray-100"
            >
              <div class="flex items-center space-x-4">
                <h3
                  class="text-xl font-bold truncate max-w-[200px] sm:max-w-md transition-colors text-gray-900"
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
              class="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center custom-scrollbar inset-shadow-sm transition-colors bg-gray-50"
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
              class="border-t px-6 py-4 flex justify-end transition-colors bg-gray-50 border-gray-200"
            >
              <button
                @click="closeResume"
                class="inline-flex justify-center items-center px-6 py-2 border shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:text-gray-900"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from "vue";
import { useTheme } from "../composables/useTheme";
import clientApi from "../configs/api/clientApi";
import { toast } from "vue3-toastify";
import useAuth from "../store/auth";
import AdminLoading from "./AdminLoading.vue";
import ResumeDisplay from "../components/ResumeDisplay.vue";

const resumes = ref([]);
const templateStats = ref([]);
const loading = ref(false);
const searchInput = ref("");
const currentSearch = ref("");
const showModal = ref(false);
const selectedResume = ref(null);

// Filters State
const openFilters = ref(false);
const filterDropdownContainer = ref(null);
const filterForm = ref({
  startDate: "",
  endDate: "",
  userName: "",
  template: "",
});
const activeFilters = ref({
  startDate: "",
  endDate: "",
  userName: "",
  template: "",
});

const activeFilterCount = computed(() => {
  let count = 0;
  if (activeFilters.value.startDate || activeFilters.value.endDate) count++;
  if (activeFilters.value.userName) count++;
  if (activeFilters.value.template) count++;
  return count;
});

const pagination = ref({
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
});

const authStore = useAuth();

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const handleLogout = () => {
  const isLogout = window.confirm("Are you sure want to logout ?");
  if (!isLogout) return;
  authStore.logout();
};

const fetchResumes = async () => {
  try {
    loading.value = true;
    const params = new URLSearchParams({
      page: pagination.value.page,
      limit: pagination.value.limit,
      search: currentSearch.value,
    });

    if (activeFilters.value.startDate)
      params.append("startDate", activeFilters.value.startDate);
    if (activeFilters.value.endDate)
      params.append("endDate", activeFilters.value.endDate);
    if (activeFilters.value.userName)
      params.append("userName", activeFilters.value.userName.trim());
    if (activeFilters.value.template)
      params.append("template", activeFilters.value.template);

    const { data } = await clientApi.get(
      `/api/admin/resumes?${params.toString()}`,
    );
    resumes.value = data.resumes;
    templateStats.value = data.templateStats || [];
    if (data.pagination) {
      pagination.value = data.pagination;
    }
  } catch (error) {
    toast.error("Failed to load resumes");
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  currentSearch.value = searchInput.value.trim();
  pagination.value.page = 1;
  fetchResumes();
};

const openResume = async (resume) => {
  try {
    loading.value = true;
    // Fetch full resume data to display since the list only has basic info
    const { data } = await clientApi.get(`/api/admin/resumes/${resume._id}`);
    selectedResume.value = data.resume;
    showModal.value = true;
  } catch (error) {
    toast.error("Failed to load resume details");
  } finally {
    loading.value = false;
  }
};

const closeResume = () => {
  showModal.value = false;
  selectedResume.value = null;
};

const changePage = (newPage) => {
  if (newPage < 1 || newPage > pagination.value.totalPages) return;
  pagination.value.page = newPage;
  fetchResumes();
};

const changeLimit = () => {
  pagination.value.page = 1;
  fetchResumes();
};

const toggleLock = async (resume) => {
  const isChange = window.confirm(
    `Are you sure you want to ${resume.isLocked ? "unlock" : "lock"} this resume?`,
  );
  if (!isChange) return;

  try {
    const newLockState = !resume.isLocked;
    const { data } = await clientApi.post("/api/admin/resumes/lock", {
      resumeId: resume._id,
      isLocked: newLockState,
    });
    toast.success(data.message);
    resume.isLocked = newLockState;
  } catch (error) {
    toast.error("Failed to update lock status");
  }
};

const applyFilters = () => {
  activeFilters.value = { ...filterForm.value };
  pagination.value.page = 1;
  openFilters.value = false;
  fetchResumes();
};

const resetFilters = () => {
  filterForm.value = {
    startDate: "",
    endDate: "",
    userName: "",
    template: "",
  };
  activeFilters.value = { ...filterForm.value };
  pagination.value.page = 1;
  openFilters.value = false;
  fetchResumes();
};

const handleClickOutside = (event) => {
  if (
    filterDropdownContainer.value &&
    !filterDropdownContainer.value.contains(event.target)
  ) {
    openFilters.value = false;
  }
};

onMounted(() => {
  if (!authStore.user) {
    authStore.fetchUser();
  }
  document.addEventListener("click", handleClickOutside);
  fetchResumes();
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  height: 8px;
  width: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #e2e8f0;
  border-radius: 20px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #cbd5e1;
}
</style>
