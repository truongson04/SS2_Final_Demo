<template>
  <admin-loading :is-loading="loading" />
  <div class="min-h-screen bg-gray-50 pb-12">
    <!-- Header -->
    <header
      class="bg-white shadow-sm sticky top-0 z-10 transition-shadow duration-300"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <h1
            class="text-xl font-bold text-gray-900 tracking-tight flex items-center"
          >
            User Management
          </h1>
          <div class="flex gap-5 items-center">
            <h1 class="text-right">Welcome {{ authStore.user.name }} !</h1>
            <button
              class="bg-red-500 p-3 rounded-full text-white cursor-pointer hover:bg-red-800"
              @click="handleLogout"
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <!-- Dashboard Stats -->
      <div
        v-if="dashboardStats"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <!-- Total Users -->
        <div
          class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between"
        >
          <div>
            <p class="text-sm font-medium text-gray-500 mb-1">Total Users</p>
            <h3 class="text-2xl font-bold text-gray-900">
              {{ dashboardStats.totalUsers }}
            </h3>
          </div>
        </div>
        <!-- Active Users -->
        <div
          class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between"
        >
          <div>
            <p class="text-sm font-medium text-gray-500 mb-1">Active Users</p>
            <h3 class="text-2xl font-bold text-gray-900">
              {{ dashboardStats.activeUsersCount }}
            </h3>
          </div>
        </div>
        <!-- New Users -->
        <div
          class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between"
        >
          <div>
            <p class="text-sm font-medium text-gray-500 mb-1">
              New user in the last 7 days
            </p>
            <h3 class="text-2xl font-bold text-gray-900">
              {{ dashboardStats.newUsersThisWeek }}
            </h3>
          </div>
        </div>
        <!-- Total Resumes -->
        <div
          class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between"
        >
          <div>
            <p class="text-sm font-medium text-gray-500 mb-1">Total Resumes</p>
            <h3 class="text-2xl font-bold text-gray-900">
              {{ dashboardStats.totalResumes }}
            </h3>
          </div>
        </div>
      </div>

      <!-- Top Action Bar -->
      <div
        class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6"
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
                aria-hidden="true"
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
              class="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 transition-colors sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Search by name or email (Enter)..."
            />
          </div>

          <!-- Actions -->
          <div class="flex flex-wrap items-center gap-3">
            <!-- Advanced Filters Button (NEW) -->
            <div class="relative" ref="filterContainer">
              <button
                @click.prevent="openFilters = !openFilters"
                class="inline-flex items-center px-4 py-2.5 border border-gray-200 shadow-sm text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                :class="{
                  'ring-2 ring-indigo-500 border-indigo-500': hasActiveFilters,
                }"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-2 text-gray-400"
                  :class="{ 'text-indigo-500': hasActiveFilters }"
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
                  class="origin-top-right absolute right-0 mt-2 w-72 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-30 overflow-hidden"
                >
                  <div class="p-4 bg-white" role="menu">
                    <h3
                      class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3"
                    >
                      Filter by Date
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

                    <h3
                      class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 mt-4"
                    >
                      Filter by CV Count
                    </h3>
                    <div class="grid grid-cols-2 gap-3 mb-4">
                      <div>
                        <label class="block text-xs text-gray-700 mb-1"
                          >Min CVs</label
                        >
                        <input
                          type="number"
                          min="0"
                          v-model="filterForm.minCv"
                          class="w-full text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label class="block text-xs text-gray-700 mb-1"
                          >Max CVs</label
                        >
                        <input
                          type="number"
                          min="0"
                          v-model="filterForm.maxCv"
                          class="w-full text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div
                      class="flex justify-end gap-2 mt-5 pt-3 border-t border-gray-100"
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

            <!-- Export CSV Button (NEW) -->
            <button
              @click="exportDataToCSV"
              class="inline-flex items-center px-4 py-2.5 border border-indigo-200 shadow-sm text-sm font-medium rounded-xl text-indigo-700 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-2 text-indigo-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Export CSV
            </button>

            <!-- Columns Dropdown -->
            <div class="relative" ref="dropdownContainer">
              <button
                @click.prevent="open = !open"
                class="inline-flex items-center px-4 py-2.5 border border-gray-200 shadow-sm text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
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
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
                Columns
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
                  v-show="open"
                  class="origin-top-right absolute right-0 mt-2 w-56 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20 overflow-hidden"
                >
                  <div class="py-1 p-2" role="menu" aria-orientation="vertical">
                    <label
                      v-for="heading in headings"
                      :key="heading.key"
                      class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-md cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        class="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 transition duration-150 ease-in-out mr-3 cursor-pointer"
                        :checked="!hiddenColumns.includes(heading.key)"
                        @change="toggleColumn(heading.key)"
                      />
                      {{ heading.value }}
                    </label>
                  </div>
                </div>
              </transition>
            </div>

            <transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="opacity-0 translate-x-4"
              enter-to-class="opacity-100 translate-x-0"
              leave-active-class="transition ease-in duration-150"
              leave-from-class="opacity-100 translate-x-0"
              leave-to-class="opacity-0 translate-x-4"
            >
              <div
                v-if="selectedRows.length > 0"
                class="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100"
              >
                <span class="text-xs font-semibold text-indigo-700 mr-1"
                  >{{ selectedRows.length }} selected</span
                >

                <select
                  v-model="multiStatus"
                  class="block w-32 pl-3 pr-10 py-1.5 text-sm border-indigo-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-lg text-gray-700 bg-white"
                >
                  <option value="" disabled hidden>Set status</option>
                  <option :value="true">Active</option>
                  <option :value="false">Inactive</option>
                </select>

                <button
                  v-if="multiStatus !== ''"
                  @click="handleChangeStatusMulti"
                  class="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  Apply
                </button>

                <div class="h-6 border-l border-indigo-200 mx-1"></div>

                <button
                  @click="handleDeleteMany"
                  class="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 mr-1.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete
                </button>
              </div>
            </transition>
          </div>
        </div>
      </div>

      <div
        class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div class="overflow-x-auto custom-scrollbar">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-12 sticky top-0 bg-gray-50 z-10 hidden sm:table-cell"
                >
                  <div class="flex items-center">
                    <input
                      type="checkbox"
                      class="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 transition duration-150 ease-in-out cursor-pointer"
                      v-model="selectAll"
                      :disabled="users.length === 0"
                    />
                  </div>
                </th>
                <th
                  v-for="heading in headings"
                  :key="heading.key"
                  v-show="!hiddenColumns.includes(heading.key)"
                  scope="col"
                  class="px-6 py-4 text-left text-xs font-bold uppercase sticky top-0 bg-gray-50 z-10"
                >
                  {{ heading.value }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100">
              <tr
                v-for="user in users"
                :key="user._id"
                class="hover:bg-indigo-50/30 transition-colors duration-150"
                :class="{ 'bg-indigo-50/50': selectedRows.includes(user._id) }"
              >
                <td class="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                  <div class="flex items-center">
                    <input
                      type="checkbox"
                      class="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 transition duration-150 ease-in-out cursor-pointer"
                      :value="user._id"
                      v-model="selectedRows"
                    />
                  </div>
                </td>
                <td
                  v-for="heading in headings"
                  :key="heading.key"
                  v-show="!hiddenColumns.includes(heading.key)"
                  class="px-6 py-4 whitespace-nowrap text-sm"
                >
                  <div
                    v-if="heading.key === 'createdAt'"
                    class="text-gray-600 font-medium"
                  >
                    {{ formatDate(user.createdAt) }}
                  </div>

                  <a
                    v-else-if="heading.key === 'email'"
                    :href="`mailto:${user.email}`"
                    class="text-indigo-600 hover:text-indigo-900 font-medium transition-colors flex items-center"
                  >
                    {{ user.email }}
                  </a>

                  <div v-else-if="heading.key === 'isActive'">
                    <select
                      v-model="user.isActive"
                      :class="[
                        'block w-full pl-3 pr-8 py-1.5 text-xs font-semibold rounded-full border-0 focus:ring-2 focus:ring-offset-1 focus:outline-none transition-colors cursor-pointer appearance-none shadow-sm',
                        user.isActive
                          ? 'bg-green-100 text-green-800 focus:ring-green-500'
                          : 'bg-red-100 text-red-800 focus:ring-red-500',
                      ]"
                      @change="handleChangeStatus(user.name, user._id)"
                    >
                      <option :value="true" class="bg-white text-gray-900">
                        Active
                      </option>
                      <option :value="false" class="bg-white text-gray-900">
                        Inactive
                      </option>
                    </select>
                  </div>

                  <div
                    v-else-if="heading.value === 'Action'"
                    class="flex items-center space-x-3"
                  >
                    <button
                      @click="
                        router.push({
                          name: 'PersonDetails',
                          params: { userId: user._id },
                        })
                      "
                      class="text-black bg-cyan-500 p-2 rounded-xl hover:bg-cyan-900 text-xs"
                    >
                      View details
                    </button>
                    <button
                      @click="handleDeleteUser(user._id)"
                      class="bg-red-500 p-2 rounded-xl hover:bg-pink-500 text-xs"
                    >
                      Delete
                    </button>
                  </div>

                  <!-- Default Text -->
                  <div
                    v-else
                    :class="
                      user.role === 'admin' && heading.key === 'name'
                        ? 'text-cyan-400 font-medium'
                        : 'text-gray-900 font-medium'
                    "
                  >
                    {{ user[heading.key] }}
                    <span
                      v-show="user.role === 'admin' && heading.key === 'name'"
                      class="text-red-500"
                      >(Admin)</span
                    >
                  </div>
                </td>
              </tr>
              <tr v-if="users.length === 0 && !loading">
                <td
                  :colspan="
                    hiddenColumns.length > 0
                      ? headings.length - hiddenColumns.length + 1
                      : headings.length + 1
                  "
                  class="px-6 py-12 text-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="mx-auto h-12 w-12 text-gray-300 mb-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <h3 class="text-lg font-medium text-gray-900">
                    No users found
                  </h3>
                  <p class="mt-1 text-sm text-gray-500">
                    We couldn't find any users matching your search.
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Server Pagination -->
        <div
          class="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div class="text-sm text-gray-500 flex items-center gap-4">
            <span>
              Showing
              <span class="font-medium text-gray-900">{{ users.length }}</span>
              users
            </span>
            <span>
              Total:
              <span class="font-medium text-gray-900">{{
                pagination.total
              }}</span>
              users
            </span>
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-500">Rows per page:</span>
              <select
                v-model="pagination.limit"
                @change="changeLimit"
                class="text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 py-1 pl-2 pr-6"
              >
                <option :value="10">10</option>
                <option :value="20">20</option>
                <option :value="50">50</option>
              </select>
            </div>
          </div>

          <div class="flex items-center space-x-2">
            <button
              @click="changePage(pagination.page - 1)"
              :disabled="pagination.page <= 1"
              class="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <div class="flex items-center px-4">
              <span class="text-sm text-gray-700"
                >Page <span class="font-medium">{{ pagination.page }}</span> of
                <span class="font-medium">{{
                  pagination.totalPages > 0 ? pagination.totalPages : 1
                }}</span></span
              >
            </div>
            <button
              @click="changePage(pagination.page + 1)"
              :disabled="pagination.page >= pagination.totalPages"
              class="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import clientApi from "../configs/api/clientApi";
import { toast } from "vue3-toastify";
import { useRouter } from "vue-router";
import useAuth from "../../store/auth";
import AdminLoading from "./AdminLoading.vue";

// hàm thêm heading cho bảng
const headings = ref([
  { key: "name", value: "Name" },
  { key: "email", value: "Email" },
  { key: "createdAt", value: "Join Date" },
  { key: "cvNumbers", value: "Resume Number" },
  { key: "isActive", value: "Status" },
  { value: "Action" },
]);

const users = ref([]);
const dashboardStats = ref(null);
const pagination = ref({
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
});
const searchInput = ref("");
const currentSearch = ref("");

// Filters logic
const openFilters = ref(false);
const filterContainer = ref(undefined);
const filterForm = ref({
  startDate: "",
  endDate: "",
  minCv: "",
  maxCv: "",
});
const activeFilters = ref({ ...filterForm.value });

const hasActiveFilters = computed(() => {
  return (
    activeFilters.value.startDate !== "" ||
    activeFilters.value.endDate !== "" ||
    activeFilters.value.minCv !== "" ||
    activeFilters.value.maxCv !== ""
  );
});

const activeFilterCount = computed(() => {
  let count = 0;
  if (activeFilters.value.startDate || activeFilters.value.endDate) count++;
  if (activeFilters.value.minCv !== "" || activeFilters.value.maxCv !== "")
    count++;
  return count;
});

const router = useRouter();
const selectedRows = ref([]);
const hiddenColumns = ref([]);
const open = ref(false);
const dropdownContainer = ref(undefined);
const multiStatus = ref("");

const selectAll = computed({
  get: () =>
    users.value.length > 0 && selectedRows.value.length === users.value.length,
  set: (value) => {
    if (value) {
      selectedRows.value = users.value.map((user) => user._id);
    } else {
      selectedRows.value = [];
    }
  },
});

const toggleColumn = (key) => {
  const index = hiddenColumns.value.indexOf(key);
  if (index > -1) {
    hiddenColumns.value.splice(index, 1);
  } else {
    hiddenColumns.value.push(key);
  }
};

const handleSearch = () => {
  currentSearch.value = searchInput.value.trim();
  pagination.value.page = 1;
  fetchUsers();
};

const applyFilters = () => {
  activeFilters.value = { ...filterForm.value };
  pagination.value.page = 1;
  openFilters.value = false;
  fetchUsers();
};

const resetFilters = () => {
  filterForm.value = { startDate: "", endDate: "", minCv: "", maxCv: "" };
  activeFilters.value = { ...filterForm.value };
  pagination.value.page = 1;
  openFilters.value = false;
  fetchUsers();
};

const changePage = (newPage) => {
  if (newPage < 1 || newPage > pagination.value.totalPages) return;
  pagination.value.page = newPage;
  fetchUsers();
};

const changeLimit = () => {
  pagination.value.page = 1;
  fetchUsers();
};
// hàm để format ngày tháng
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const handleChangeStatus = async (name, id) => {
  const isChange = window.confirm(
    "Are you sure you want to change the active status of " + name + "?",
  );
  if (!isChange) {
    const user = users.value.find((u, i) => u._id === id);
    if (user) {
      user.isActive = !user.isActive;
    }

    return;
  }
  try {
    const { data } = await clientApi.post("/api/admin/status", {
      userId: id,
      isActive: event.target.value === "true" || event.target.value === true,
    });
    toast.success(data.message);
    fetchDashboardStats();
  } catch (error) {
    toast.error(error?.response?.data?.message || "Something went wrong!");
  }
};

const handleChangeStatusMulti = async () => {
  const isChange = window.confirm(
    "Are you sure you want to change the status of multiple users?",
  );
  if (!isChange) {
    return;
  }

  try {
    const statusVal =
      multiStatus.value === "true" || multiStatus.value === true;
    const { data } = await clientApi.post("/api/admin/multiStatus", {
      userIds: selectedRows.value,
      isActive: statusVal,
    });
    toast.success(data.message);
    users.value.forEach((user, index) => {
      if (selectedRows.value.includes(user._id)) {
        users.value[index] = { ...user, isActive: statusVal };
      }
    });
    selectedRows.value = [];
    multiStatus.value = "";
    fetchDashboardStats();
  } catch (error) {
    toast.error(error?.response?.data?.message || error.message);
  }
};

const handleDeleteUser = async (userId) => {
  const isDelete = window.confirm("Are you sure you want to remove this user?");
  if (!isDelete) {
    return;
  }
  try {
    const { data } = await clientApi.delete(`/api/admin/${userId}`);
    toast.success(data.message);
    users.value = users.value.filter((user) => {
      return user._id !== userId;
    });

    selectedRows.value = selectedRows.value.filter((id) => id !== userId);
    fetchDashboardStats();
  } catch (error) {
    toast.error(error?.response?.data?.message || error.message);
  }
};

const handleDeleteMany = async () => {
  const isDelete = window.confirm(
    "Are you sure you want to remove the selected users?",
  );
  if (!isDelete) {
    return;
  }
  try {
    const { data } = await clientApi.delete("/api/admin/delete", {
      data: { userIds: selectedRows.value },
    });
    toast.success(data.message);
    selectedRows.value = [];
    fetchUsers();
    fetchDashboardStats();
  } catch (error) {
    toast.error(error?.response?.data?.message || error.message);
  }
};

const handleClickOutside = (event) => {
  if (
    dropdownContainer.value &&
    !dropdownContainer.value.contains(event.target)
  ) {
    open.value = false;
  }
  if (filterContainer.value && !filterContainer.value.contains(event.target)) {
    openFilters.value = false;
  }
};
const authStore = useAuth();
const handleLogout = () => {
  const isLogout = window.confirm("Are you sure want to logout ?");
  if (!isLogout) {
    return;
  }
  authStore.logout();
};
const loading = ref(false);

const fetchDashboardStats = async () => {
  try {
    const { data } = await clientApi.get("/api/admin/dashboard");
    dashboardStats.value = data.stats;
  } catch (error) {
    console.error("Failed to load dashboard stats", error);
  }
};

const fetchUsers = async () => {
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
    if (activeFilters.value.minCv !== "")
      params.append("minCv", activeFilters.value.minCv);
    if (activeFilters.value.maxCv !== "")
      params.append("maxCv", activeFilters.value.maxCv);

    const { data } = await clientApi.get(`/api/admin?${params.toString()}`);
    users.value = data.users;
    if (data.pagination) {
      pagination.value = data.pagination;
    }
  } catch (error) {
    toast.error("Failed to load users");
  } finally {
    loading.value = false;
  }
};

const exportDataToCSV = async () => {
  try {
    toast.info("Generating CSV file...");

    const params = new URLSearchParams({
      isExport: "true",
      search: currentSearch.value,
    });

    if (activeFilters.value.startDate)
      params.append("startDate", activeFilters.value.startDate);
    if (activeFilters.value.endDate)
      params.append("endDate", activeFilters.value.endDate);
    if (activeFilters.value.minCv !== "")
      params.append("minCv", activeFilters.value.minCv);
    if (activeFilters.value.maxCv !== "")
      params.append("maxCv", activeFilters.value.maxCv);

    const { data } = await clientApi.get(`/api/admin?${params.toString()}`);

    if (!data.users || data.users.length === 0) {
      toast.warning("No data to export.");
      return;
    }

    const csvHeaders = [
      "Name",
      "Email",
      "Role",
      "Join Date",
      "Resume Number",
      "Active Status",
      "Is Deleted",
    ];

    let csvContent = csvHeaders.join(",") + "\n";

    data.users.forEach((user) => {
      const row = [
        `"${(user.name || "").replace(/"/g, '""')}"`,
        `"${(user.email || "").replace(/"/g, '""')}"`,
        `"${user.role || "user"}"`,
        `"${user.createdAt ? new Date(user.createdAt).toISOString().split("T")[0] : "N/A"}"`,
        user.cvNumbers || 0,
        user.isActive ? "Active" : "Inactive",
        user.isDeleted ? "Yes" : "No",
      ];
      csvContent += row.join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `Users_list_at_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("CSV Export successful!");
  } catch (error) {
    toast.error("Failed to export data.");
    console.error(error);
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  fetchDashboardStats();
  fetchUsers();
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

select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%234b5563' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1em;
}
</style>
