<template>
  <div class="bg-white shadow-lg rounded-md max-w-5xl mx-auto overflow-hidden">
    <!-- Search -->
    <div class="p-4 border-b flex justify-between items-center gap-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search..."
        class="w-64 px-3 py-1.5 border rounded text-sm"
      />
    </div>
    <div class="overflow-x-auto w-full">
      <!-- Table -->
      <table class="w-full text-sm text-left text-nowrap">
        <thead class="bg-white text-black font-semibold border-b">
          <tr>
            <th
              v-for="(header, index) in headers"
              :key="index"
              class="px-3 py-2 cursor-pointer select-none"
              @click="sortBy(headerKeys[index])"
            >
              {{ header }}
              <span v-if="sortKey === headerKeys[index]">
                {{ sortOrder === "asc" ? "↑" : "↓" }}
              </span>
            </th>
            <th class="px-3 py-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(row, rowIndex) in paginatedData"
            :key="rowIndex"
            class="border-t hover:bg-gray-100"
          >
            <td
              v-for="(key, index) in headerKeys"
              :key="index"
              class="px-3 py-2"
            >
              <div class="flex flex-row gap-2" v-if="key === 'username'">
                <span
                  class="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  :style="{ backgroundColor: row.color }"
                >
                  {{ getInitials(row[key]) }}
                </span>
                <span> {{ row[key] }} </span>
              </div>

              <div class="flex flex-row gap-2" v-if="Array.isArray(row[key])">
                <!-- <span> {{ row[key].join(", ") }} </span> -->
                <span
                  v-for="(value, idx) in row[key]"
                  :key="idx"
                  class="bg-gray-100 text-gray-800 text-sm font-medium me-1 px-2.5 py-0.5 rounded"
                >
                  {{ value }}
                </span>
              </div>

              <div
                v-if="key === 'status'"
                class="font-semibold rounded-3xl px-3 py-1"
                :class="{
                  'bg-blue-100': row[key] === 'active',
                  'bg-yellow-100': row[key] === 'disabled',
                }"
              >
                {{ row[key] }}
              </div>
              <div
                v-if="key !== 'username' && key !== 'status' && key !== 'teams'"
              >
                {{ row[key] }}
              </div>
            </td>

            <td class="px-3 py-2 space-x-2">
              <button
                @click="$emit('edit', row)"
                class="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                @click="$emit('delete', row)"
                class="text-red-600 hover:underline"
              >
                Delete
              </button>
            </td>
          </tr>
          <tr v-if="paginatedData.length === 0">
            <td
              :colspan="headers.length + 2"
              class="text-center py-4 text-gray-400"
            >
              No data found
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex justify-between items-center p-4 border-t text-sm">
      <div>Page {{ currentPage }} of {{ totalPages }}</div>
      <div class="space-x-1 flex items-center">
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 py-2 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="goToPage(page)"
          :class="[
            'px-3 py-1 rounded border',
            page === currentPage
              ? 'bg-blue-600 text-white'
              : 'hover:bg-gray-100',
          ]"
        >
          {{ page }}
        </button>
        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-3 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  headers: Array,
  headerKeys: Array,
  data: Array,
  itemsPerPage: {
    type: Number,
    default: 5,
  },
});

defineEmits(["edit", "delete"]);

const currentPage = ref(1);
const searchQuery = ref("");
const selectedRows = ref([]);
const selectAll = ref(false);
const sortKey = ref(null);
const sortOrder = ref("asc");

const filteredData = computed(() => {
  if (!searchQuery.value.trim()) return props.data;
  return props.data.filter((row) =>
    props.headerKeys.some((key) =>
      String(row[key]).toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  );
});

const sortedData = computed(() => {
  if (!sortKey.value) return filteredData.value;
  return [...filteredData.value].sort((a, b) => {
    const result = a[sortKey.value] > b[sortKey.value] ? 1 : -1;
    return sortOrder.value === "asc" ? result : -result;
  });
});

const totalPages = computed(() =>
  Math.ceil(sortedData.value.length / props.itemsPerPage)
);

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * props.itemsPerPage;
  return sortedData.value.slice(start, start + props.itemsPerPage);
});

const sortBy = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortKey.value = key;
    sortOrder.value = "asc";
  }
};

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const toggleAll = () => {
  if (selectAll.value) {
    selectedRows.value = [...paginatedData.value];
  } else {
    selectedRows.value = [];
  }
};

// Handle visible pages in groups of 5
const visiblePages = computed(() => {
  const groupSize = 5;
  const start = Math.floor((currentPage.value - 1) / groupSize) * groupSize + 1;
  const end = Math.min(start + groupSize - 1, totalPages.value);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

watch([paginatedData], () => {
  selectAll.value = false;
  selectedRows.value = [];
});
// get initials
const getInitials = (fullName) => {
  const nameParts = fullName.trim().split(" ");

  const initials =
    nameParts.length === 1
      ? nameParts[0][0].toUpperCase()
      : nameParts[0][0].toUpperCase() +
        nameParts[nameParts.length - 1][0].toUpperCase();

  return initials;
};
</script>
