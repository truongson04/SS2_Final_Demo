<template>
  <div class="antialiased sans-serif bg-gray-200 h-screen">
    <div class="container mx-auto py-6 px-4">
      <h1 class="text-3xl py-4 border-b mb-10">User Management</h1>

      <div
        v-show="selectedRows.length"
        class="bg-teal-200 fixed top-0 left-0 right-0 z-40 w-full shadow"
      >
        <div class="container mx-auto px-4 py-4">
          <div class="flex md:items-center">
            <div class="mr-4 flex-shrink-0">
              <svg
                class="h-8 w-8 text-teal-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="text-teal-800 text-lg">
              {{ selectedRows.length }} users are selected
            </div>
          </div>
        </div>
      </div>

      <div class="mb-4 flex justify-between items-center">
        <div class="flex-1 pr-4">
          <div class="relative md:w-1/3">
            <input
              type="search"
              class="w-full pl-10 pr-4 py-2 rounded-lg shadow focus:outline-none focus:shadow-outline text-gray-600 font-medium"
              placeholder="Search..."
            />
            <div class="absolute top-0 left-0 inline-flex items-center p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-6 h-6 text-gray-400"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="0" y="0" width="24" height="24" stroke="none"></rect>
                <circle cx="10" cy="10" r="7" />
                <line x1="21" y1="21" x2="15" y2="15" />
              </svg>
            </div>
          </div>
        </div>

        <div class="flex gap-2">
          <div class="shadow rounded-lg flex relative" ref="dropdownContainer">
            <button
              @click.prevent="open = !open"
              class="rounded-lg inline-flex items-center bg-white hover:text-blue-500 focus:outline-none focus:shadow-outline text-gray-500 font-semibold py-2 px-2 md:px-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-6 h-6 md:hidden"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="0" y="0" width="24" height="24" stroke="none"></rect>
                <path
                  d="M5.5 5h13a1 1 0 0 1 0.5 1.5L14 12L14 19L10 16L10 12L5 6.5a1 1 0 0 1 0.5 -1.5"
                />
              </svg>
              <span class="hidden md:block">Display</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 ml-1"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="0" y="0" width="24" height="24" stroke="none"></rect>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            <div
              v-show="open"
              class="z-40 absolute top-0 right-0 w-40 bg-white rounded-lg shadow-lg mt-12 block py-1 overflow-hidden"
            >
              <label
                v-for="heading in headings"
                :key="heading.key"
                class="flex justify-start items-center text-truncate hover:bg-gray-100 px-4 py-2 cursor-pointer"
              >
                <div class="text-teal-600 mr-3">
                  <input
                    type="checkbox"
                    class="form-checkbox focus:outline-none focus:shadow-outline"
                    :checked="!hiddenColumns.includes(heading.key)"
                    @change="toggleColumn(heading.key)"
                  />
                </div>
                <div class="select-none text-gray-700">{{ heading.value }}</div>
              </label>
            </div>
          </div>
          <div class="shadow rounded-lg flex relative w-50">
            <select
              v-model="multiStatus"
              :disabled="selectedRows.length === 0"
              placeholder="Select status"
              :class="
                selectedRows.length === 0
                  ? 'rounded-lg inline-flex items-center bg-gray-100 text-gray-400 cursor-not-allowed focus:outline-none py-2 px-2 md:px-4 w-[100%]'
                  : 'rounded-lg inline-flex items-center bg-white hover:text-blue-500 focus:outline-none focus:shadow-outline text-gray-500 font-semibold py-2 px-2 md:px-4 w-[100%]'
              "
            >
              <option value="" disabled hidden>Select status</option>
              <option :value="true" class="bg-green-500">Active</option>
              <option :value="false" class="bg-red-500">Inactive</option>
            </select>
          </div>
        </div>
        <div class="shadow rounded-lg w-50">
          <button
            v-if="selectedRows.length > 0 && multiStatus !== ''"
            @click="handleChangeStatusMulti"
            class="rounded-lg inline-flex items-center bg-white hover:text-blue-500 focus:outline-none focus:shadow-outline text-gray-500 font-semibold py-2 px-2 md:px-4 w-[100%]"
          >
            Apply
          </button>
        </div>

        <div class="shadow rounded-lg w-50">
          <button
            v-if="selectedRows.length > 0"
            @click="handleDeleteMany"
            class="rounded-lg inline-flex items-center bg-red-500 hover:text-blue-500 focus:outline-none focus:shadow-outline text-white font-semibold py-2 px-2 md:px-4 w-[100%]"
          >
            Delete
          </button>
        </div>
      </div>

      <div
        class="overflow-x-auto bg-white rounded-lg shadow overflow-y-auto relative"
        style="height: 405px"
      >
        <table
          class="border-collapse table-auto w-full whitespace-no-wrap bg-white table-striped relative"
        >
          <thead>
            <tr class="text-left">
              <th
                class="py-2 px-3 sticky top-0 border-b border-gray-200 bg-gray-100"
              >
                <label
                  class="text-teal-500 inline-flex justify-between items-center hover:bg-gray-200 px-2 py-2 rounded-lg cursor-pointer"
                >
                  <input
                    type="checkbox"
                    class="form-checkbox focus:outline-none focus:shadow-outline"
                    v-model="selectAll"
                  />
                </label>
              </th>
              <th
                v-for="heading in headings"
                :key="heading.key"
                v-show="!hiddenColumns.includes(heading.key)"
                class="bg-gray-100 sticky top-0 border-b border-gray-200 px-6 py-2 text-gray-600 font-bold tracking-wider uppercase text-xs"
              >
                {{ heading.value }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user._id">
              <td class="border-dashed border-t border-gray-200 px-3">
                <label
                  class="text-teal-500 inline-flex justify-between items-center hover:bg-gray-200 px-2 py-2 rounded-lg cursor-pointer"
                >
                  <input
                    type="checkbox"
                    class="form-checkbox focus:outline-none focus:shadow-outline"
                    :value="user._id"
                    v-model="selectedRows"
                  />
                </label>
              </td>
              <td
                v-for="heading in headings"
                :key="heading.key"
                v-show="!hiddenColumns.includes(heading.key)"
                class="border-dashed border-t border-gray-200"
              >
                <select
                  v-model="user.isActive"
                  :class="`rounded-lg inline-flex items-center bg-${user.isActive ? 'green' : 'red'}-500 focus:outline-none focus:shadow-outline text-white  py-2 px-2 md:px-4`"
                  v-if="heading.key === 'isActive'"
                  @change="handleChangeStatus(user.name, user._id, $event)"
                >
                  <option
                    :value="true"
                    class="rounded-lg inline-flex items-center bg-green-500 hover:text-blue-500 focus:outline-none focus:shadow-outline text-gray-500 font-semibold py-2 px-2 md:px-4"
                  >
                    Active
                  </option>
                  <option
                    :value="false"
                    class="bg-red-500 font-bold text-white"
                  >
                    Inactive
                  </option>
                </select>
                <span v-else-if="heading.value === 'Action'">
                  <span class="bg-yellow-500 p-3 mr-3 cursor-pointer"
                    >View details</span
                  >
                  <span
                    class="bg-pink-500 p-3 cursor-pointer rounded-lg p-3"
                    @click="handleDeleteUser(user._id)"
                  >
                    Delete</span
                  >
                </span>
                <span class="text-gray-700 px-6 py-3 flex items-center" v-else
                  >{{ user[heading.key] }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import clientApi from "../configs/api/clientApi";
import { toast } from "vue3-toastify";

const headings = ref([
  { key: "_id", value: "User ID" },
  { key: "name", value: "Name" },
  { key: "email", value: "Email" },
  { key: "cvNumbers", value: "Resume Number" },
  { key: "isActive", value: "Status" },
  { value: "Action" },
]);

const users = ref([]);

const selectedRows = ref([]);
const hiddenColumns = ref([]);
const open = ref(false);
const dropdownContainer = ref(undefined);
const multiStatus = ref("");
const selectAll = computed({
  get: () =>
    users.value.length
      ? selectedRows.value.length === users.value.length
      : false,
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

const handleChangeStatus = async (name, id, event) => {
  const isChange = window.confirm(
    "Are you sure want to change the active status of " + name,
  );
  if (!isChange) {
    return;
  }
  const { data } = await clientApi.post("/api/admin/status", {
    userId: id,
    isActive: event.target.value,
  });
  toast.success(data.message);
};
const handleChangeStatusMulti = async () => {
  const isChange = window.confirm(
    "Are you want to change status of multiple users ? ",
  );
  if (!isChange) {
    return;
  }

  try {
    const { data } = await clientApi.post("/api/admin/multiStatus", {
      userIds: selectedRows.value,
      isActive: multiStatus.value,
    });
    toast.success(data.message);
    users.value.forEach((user, index) => {
      if (selectedRows.value.includes(user._id)) {
        users.value[index] = { ...user, isActive: multiStatus.value };
      }
    });
    selectedRows.value = [];
    multiStatus.value = "";
  } catch (error) {
    toast.error(error.message);
  }
};
const handleDeleteUser = async (userId) => {
  const isDelete = window.confirm("Are you sure want to remove this users? ");
  if (!isDelete) {
    return;
  }
  try {
    const { data } = await clientApi.delete(`/api/admin/${userId}`);
    toast.success(data.message);
    users.value = users.value.filter((user) => {
      return user._id !== userId;
    });
  } catch (error) {
    toast.error(error?.response?.data?.message || error.message);
  }
};
const handleDeleteMany = async () => {
  try {
    const { data } = await clientApi.delete("/api/admin/delete", {
      data: { userIds: selectedRows.value },
    });
    toast.success(data.message);
    selectedRows.value = [];
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
};

onMounted(async () => {
  document.addEventListener("click", handleClickOutside);
  const { data } = await clientApi.get("/api/admin");
  users.value = data.users;
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
[type="checkbox"] {
  box-sizing: border-box;
  padding: 0;
}

.form-checkbox {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  -webkit-print-color-adjust: exact;
  color-adjust: exact;
  display: inline-block;
  vertical-align: middle;
  background-origin: border-box;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  flex-shrink: 0;
  color: currentColor;
  background-color: #fff;
  border-color: #e2e8f0;
  border-width: 1px;
  border-radius: 0.25rem;
  height: 1.2em;
  width: 1.2em;
}

.form-checkbox:checked {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M5.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L7 8.586 5.707 7.293z'/%3e%3c/svg%3e");
  border-color: transparent;
  background-color: currentColor;
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
